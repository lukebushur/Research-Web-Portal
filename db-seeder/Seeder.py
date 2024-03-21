import faker
from database import get_database
import uuid
import random
from datetime import datetime, date, time, timedelta
from bson.objectid import ObjectId

from faker.providers import DynamicProvider
from dotenv import load_dotenv
import os

import numpy
from pymongo import InsertOne, DeleteOne, ReplaceOne, UpdateMany, UpdateOne

load_dotenv() 

import bcrypt

# Define the main Faker class
fake = faker.Faker()

# Random major picker
from getMajors import random_pfw_majors
from getQuestions import randomRadioQuestions, randomTextQuestions, RandomCheckboxQuestions
# Add the custom providers
# Majors
fake.add_provider(random_pfw_majors)
# Questions for applications
fake.add_provider(randomRadioQuestions)
fake.add_provider(randomTextQuestions)
fake.add_provider(RandomCheckboxQuestions)

# Fetch the database
print("Getting database...")
dbclient = get_database()[os.getenv("DATABASE")]
print("Got database!")

def generateUserObject(pwHash):
   # Generate a random profile
   # {
   #  'username': 'ysullivan', 'name': 'Jason Green', 'sex': 'M', 'address': '9382 Taylor Court Suite 892\nCoreyland, MH 90152', 
   #  'mail': 'thomas15@yahoo.com', 'birthdate': datetime.date(1944, 10, 11)
   # }
   # is an example
      
   profile = fake.simple_profile()

   # grab the name & email
   name = profile['name']
   
   # generate a random token for email reset?
   emailToken = str(uuid.uuid4())
   password = pwHash
   Major = [],
   
   UserObject = {
      "name": name,
      "email": fake.unique.free_email(),
      "password": password,
      "universityLocation": 'Purdue University Fort Wayne',
      "emailToken": emailToken,
      "__v": 0,
      "userType": {
         "Type": 0,
         "Confirmed": True,
         "Major": [fake.random_pfw_major() for i in range(random.randint(1,2))],
      },
      "security": {
         "tokens": [],
         "passwordReset": None,
         "changeEmail": None, 
      },
   }

   return UserObject

def generateUsers(professors, students, delete):
   users = dbclient['users']
   print("Generating users!")
   if delete:
      users.delete_many({})
      print("deleting all users!")
   newUsers = []
   print("Generating all users now! This may take a while depending on how many you put in!")
   basePasswordHash = bcrypt.hashpw(bytes(os.getenv("DefaultPassword"), encoding='utf8'), bcrypt.gensalt(10)).decode('ascii')
   for i in range(students):
      # Generate a random profile
      
      # Create the student profile object
      UserObject = generateUserObject(basePasswordHash)
      # Set a random GPA between 1.0 and 4.0
      UserObject['userType']['GPA'] = random.randint(100, 400) / 100

      newUsers.append(UserObject)
   for i in range(professors): 
      # Generate a random profile
     
      # Generate the faculty profile object
      UserObject = generateUserObject(basePasswordHash)
      UserObject['userType']['Type'] = 1
      # Ensure the type is set to 1 (Faculty) and faculty projects is defined
      UserObject['userType']['FacultyProjects'] = {}
      
      newUsers.append(UserObject)
   print("Generated users! Creating in database...")
   users.insert_many(newUsers)
   print("Done!")

def generateRandomProjects(facultyUser):
   currentDateTime = datetime.now()
   project = {
      "projectName": facultyUser['name'] + " Project",
      "GPA": random.randint(10, 40) / 10,
      "majors": [fake.unique.random_pfw_major() for i in range(random.randint(1,5))],
      "posted": datetime.now(), # date now
      "deadline": (currentDateTime + timedelta(days=30)),
      "description": fake.paragraph(),
      "questions": [], # generate random questions
      "applications": [], # to fill in later! 
      "professorId": facultyUser['_id'],
      "_id": ObjectId(),
   }

   fake.unique.clear()

   for i in range(random.randint(4, 8)):
      questionType = random.randint(1, 3)
      questionObject = {
         "question": "",
         "requirementType": "",
         "required": True
      }
      if questionType == 1:
         # text type
         questionObject['requirementType'] = "text"
         questionObject['question'] = fake.randomTextQuestions()
      elif questionType == 2:
         # radio button type
         questionObject['question'] = fake.randomRadioQuestions()
         questionObject['requirementType'] = "radio button"
         questionObject['choices'] = [
            fake.sentence(),
            fake.sentence()
         ]
      elif questionType == 3:
         # checkbox type
         questionObject['question'] = fake.randomCheckboxQuestions()
         questionObject['requirementType'] = "check box"
         questionObject['choices'] = [fake.word()]
         for i in range(random.randrange(start=0, stop=4)):
             questionObject['choices'].append(fake.word())
      project['questions'].append(questionObject)

   return project

def generateProjects(deleteProjects, howManyProfsShouldHaveProjects, projectsPerProfessor):
    projects = dbclient['projects']
    users = dbclient['users']
    if deleteProjects:
        projects.delete_many({})
        print("Deleted all existing projects!")
    
    # Get all current Faculty users
    facultyUsers = users.find({"userType.Type": 1})
    existingUsers = []
    # Map them to an array we can pick from
    # Converts from Cursor back into normal array
    for user in facultyUsers:
        existingUsers.append(user)

    # Boundaries!
    if len(existingUsers) < howManyProfsShouldHaveProjects:
        howManyProfsShouldHaveProjects = len(existingUsers)
    
    mappedProjects = {}
    for i in range(howManyProfsShouldHaveProjects):
        # Get all Faculty users
        randomFaculty = existingUsers.pop(random.randrange(len(existingUsers))) 

        # now we generate the project data
        project = {
            "type": "Active",
            "professorEmail": randomFaculty['email'],
            "professorName": randomFaculty['name'],
            "projects": [generateRandomProjects(randomFaculty) for i in range(random.randint(1, projectsPerProfessor))]
        }

        # Add to Professors account
        # This is so we can go back to it
        mappedProjects[randomFaculty['_id']] = [project]

    print("Inserting projects...")
    # Define the BulkWrite for Project generation
    BulkWriteProjects = [] # This will be for when Projects are added into Projects collection
    BulkWriteUserLink = [] # This is for linking them to the project owners faculty account
    for profId in mappedProjects:
        for projectData in mappedProjects[profId]:
            insertId = ObjectId()
            # Generate the actual project, because InsertOne isn't good at letting us set our own ObjectId for whatever reason, I'm using an upserted-UpdateOne
            BulkWriteProjects.append(UpdateOne({
                "_id": insertId
            }, {
                "$set": projectData,
                
            }, upsert=True))
            # Update the faculty user data 
            # to include the project link
            print("Updating project link for " + str(profId))
          
            BulkWriteUserLink.append(UpdateOne(
                {
                    "_id": ObjectId(profId)
                }, {
                    "$set": {
                        "userType.FacultyProjects.{}".format(projectData['type']): ObjectId(insertId)
                    }
                }))
            print("Updated link! " + str(profId))
            
    # Perform the bulk_writes now
    users.bulk_write(BulkWriteUserLink)
    projects.bulk_write(BulkWriteProjects)
    print("Inserted all new projects!")

def generateRandomApplications(student, projectParent, randomProject):
  
    clonedApp = {
        # RecordId is the "Active" project
        # Id is the project id itself
        "opportunityRecordId": projectParent['_id'],
        "opportunityId": randomProject['_id'],
        "_id": ObjectId(),
        "appliedDate": datetime.now(),
        "lastModified": datetime.now(),
        "status": "Pending",
        "questions": []
    }

    for question in randomProject['questions']:
        clone = {}
        for entry in question:
            clone[str(entry)] = question[entry]
        if question['requirementType'] == "text":
            # text
            clone['answers'] = [fake.paragraph()]
        elif question['requirementType'] == "radio button":
            clone['answers'] = [random.choice(clone['choices'])]
        elif  question['requirementType'] == "check box":
            clone['answers'] = []
            while len(clone['answers']) == 0:
                for i in range(len(clone['choices'])):
                    if random.randint(1, 3) == 2:
                        # Put a choice in!
                        clone['answers'].append(clone['choices'][i])
        clonedApp['questions'].append(clone)
    
    return clonedApp

# Turns a parent Project into an array of ProjectIds of child projects
def getExistingProjectIdsFromTop(projectTop):
    arr = []
    for i in range(len(projectTop["projects"])):
      arr.append(projectTop["projects"][i]["_id"])
    return arr

# Returns the parent Project object for a given ProjectID
def getExistingProjectTopById(projects, id):
    for i in range(len(projects)):
        for k in range(len(projects[i]["projects"])):
            if projects[i]["projects"][k]["_id"] == id: 
                return projects[i]
         
# Returns the actual Project itself
def getExistingProjectById(projects, id):
    for i in range(len(projects)):
        for k in range(len(projects[i]["projects"])):
            if projects[i]["projects"][k]["_id"] == id: 
                return projects[i]["projects"][k]

def generateStudentApplications(destroy, howManyStudentsShouldApply, HowManyPerStudent):
    applicationcol = dbclient['applications']
    users = dbclient['users']
    projectCol = dbclient['projects']
    # If to destroy
    if destroy:
        applicationcol.delete_many({})
    userList = users.find({"$and": [{"userType.Type": 0}, {"userType.GPA": { "$exists": True }}]})
    existingUsers = []
    # Convert Cursor to just normal array
    for user in userList: 
        existingUsers.append(user)

    # print(existingUsers)
    
    # some boundary stuff
    if len(existingUsers) > howManyStudentsShouldApply:
        howManyStudentsShouldApply = len(existingUsers)

    # Find all active projects that can be applied to
    projects = dbclient['projects'].find({"type": "Active"})
    
    existingProjects = []
    for project in projects:
        existingProjects.append(project)

        # Multiple bulk writes
        # One for all student applications (applications collection, applications object)
        ## One Adding applications to a student account too (updateOne per student account)
        # One for all faculty projects (project applications)
        
    # Keep this for the Faker instance   
    arrProjects = []
    for projectTop in existingProjects:
        for projectId in getExistingProjectIdsFromTop(projectTop):
            arrProjects.append(projectId)    

    randomProjectId = DynamicProvider(
        provider_name="randomProjectId",
        elements=arrProjects
    )
    fake.add_provider(randomProjectId)
    # Each user application list is put here
    # UpdateOne: SetOnInsert, Generate ID beforehand
    BulkWrite_Applications = []
    # Each project update is put here
    # Use the ID generated by BulkWriteUserApplications 
    BulkWrite_ProjectApplicationsUpdate = [] 
    # Bulk write the user updates
    BulkWrite_UserAppReference = []
    print("Picking random students & projects now")
    for i in range(howManyStudentsShouldApply):
        # Get all Faculty users
        if len(existingUsers) == 0:
            break
        randomUser = existingUsers.pop(random.randrange(len(existingUsers)))

        fake.unique.clear()

        applications = []
        pendingProjectApplicationsToAdd = []
        studentApp = {
            "applications": applications,
            "user": randomUser["name"],
            "_id": ObjectId()
        }

        # Pick a new & unique user to generate apps for
        randomUser = existingUsers.pop(random.randrange(len(existingUsers)))
        
        for i in range(HowManyPerStudent):
            # Now we're going to pick a random project from the unique class 
            projectId = fake.unique.randomProjectId()

            # Get the project info from the random ID
            randomProject = getExistingProjectById(existingProjects, projectId)
            # Top is the RecordId for example
            randomTop = getExistingProjectTopById(existingProjects, projectId)

            # Student List is for the applications collection
            appForStudentList = generateRandomApplications(randomUser, randomTop, randomProject)
            # This'll go into the Project.applications array of a project in Projects
            appForProjectList = {
                "applicationRecordID": studentApp["_id"], # Take the record of the project here
                "application": appForStudentList['_id'],
                "projectId": randomProject["_id"],
                "status": "Pending",
                "name": randomUser['name'],
                "GPA": randomUser['userType']['GPA'],
                "major": randomUser['userType']['Major'],
                "appliedDate": appForStudentList['appliedDate'],
                "location": randomUser['universityLocation']
            }

            pendingProjectApplicationsToAdd.append(appForProjectList)
            applications.append(appForStudentList)

            # Ok, now we've generated this application. Let's move onto the next &/or exit to push to our BulkWrite

        # Add applications to bulk_write now (Going to application collection) 
        BulkWrite_Applications.append(UpdateOne(
            {
                "_id": studentApp["_id"]
            }, { 
                "$set": studentApp
            }, upsert=True))
        
        # Update links to user account (Going to the users collection)
        BulkWrite_UserAppReference.append(UpdateOne(
            {
                "_id": randomUser["_id"]
            }, {
                "$set": {
                    "userType.studentApplications": studentApp["_id"]
                }
            }
        , upsert=True))    

        # Add applications to Faculty project now (Going to the projects collection)
        for app in pendingProjectApplicationsToAdd:
            # we temporarily added in the ProjectId to the project Application record
            # This lets us more easily access it
            projectId = app['projectId']
            # Ok now we can delete it! Don't care anymore. :)
            del app['projectId']
            # Add it to BulkWrite array
            BulkWrite_ProjectApplicationsUpdate.append(UpdateOne(
                { 
                    "projects": {
                        "$elemMatch": {
                            "_id": projectId
                        }
                    } 
                },
                { 
                    "$push": {
                        # Get the project itself 
                        "projects.$.applications": app
                    } 
                }
            ))

    # Perform mass bulk write on all queued
    print("Bulk Writing to Users...")
    dbclient['users'].bulk_write(BulkWrite_UserAppReference)
    print("Bulk Writing to Applications...")
    dbclient['applications'].bulk_write(BulkWrite_Applications)
    print("Bulk Writing to Projects...")
    dbclient['projects'].bulk_write(BulkWrite_ProjectApplicationsUpdate)
    print("Finished BulkWrites")

FacultyUsers = int(os.getenv("FacultyUsers"))
StudentUsers = int(os.getenv("StudentUsers"))
DeleteExistingStudentUsers = os.getenv("DeleteExistingUsers") == "y"
generateUsers(FacultyUsers, StudentUsers, DeleteExistingStudentUsers)

DeleteExistingProjects = os.getenv("DeleteExistingProjectS") == "y" 
HowManyProfessorsShouldHaveProjects = int(os.getenv("NumFacultyWithProjects"))
HowManyProjectsPerProfessor = int(os.getenv("HowManyProjectsPerFaculty"))
generateProjects(DeleteExistingProjects, HowManyProfessorsShouldHaveProjects, HowManyProjectsPerProfessor)

# NOTE: Deleting existing applications just clears applications collection, NOT fully clearing all applications from projects & users
# You would want to delete users & projects too to have a fresh start as I cannot guarantee stability at this moment
DeleteExistingApplications = os.getenv("DeleteExistingApplications")
HowManyStudentsShouldApply = int(os.getenv("HowManyStudentsShouldApply"))
HowManyApplicationsPerStudent = int(os.getenv("HowManyApplicationsPerStudent"))
generateStudentApplications(DeleteExistingApplications, HowManyStudentsShouldApply, HowManyApplicationsPerStudent)