import faker
from database import get_database
import uuid
import random
from datetime import datetime, date, time, timedelta
from bson.objectid import ObjectId

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
dbclient = get_database()
print("Got database!")

def generateUserObject():
   # Generate a random profile
   # {
   #  'username': 'ysullivan', 'name': 'Jason Green', 'sex': 'M', 'address': '9382 Taylor Court Suite 892\nCoreyland, MH 90152', 
   #  'mail': 'thomas15@yahoo.com', 'birthdate': datetime.date(1944, 10, 11)
   # }
   # is an example
      
   profile = fake.simple_profile()

   # grab the name & email
   name = profile['name']
   email = profile['mail']

   # generate a random token for email reset?
   emailToken = str(uuid.uuid4())
   password = "example_data" # hash it to a base password?
   Major = [],
   
   UserObject = {
      "name": name,
      "email": email,
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
   users = dbclient['practice']['users']
   print("Generating users!")
   if delete:
      users.delete_many({})
      print("deleting all users!")
   newUsers = []
   for i in range(students): 
      # Generate a random profile
      
      # Create the student profile object
      UserObject = generateUserObject()
      # Set a random GPA between 1.0 and 4.0
      UserObject['userType']['GPA'] = random.randint(10, 40) / 10

      newUsers.append(UserObject)
   for i in range(professors): 
      # Generate a random profile
     
      # Generate the faculty profile object
      UserObject = generateUserObject()
      UserObject['userType']['Type'] = 1
      # Ensure the type is set to 1 (Faculty) and faculty projects is defined
      UserObject['userType']['facultyProjects'] = {}
      
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
      "posted": datetime.now().isoformat(), # date now
      "deadline": (currentDateTime + timedelta(days=30)).isoformat(),
      "description": fake.paragraph(),
      "questions": [], # generate random questions
      "applications": [], # to fill in later! 
      "professorId": facultyUser['_id'],
      "_id": ObjectId(),
   }

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
         questionObject['choices'] = [
            fake.word(),
            fake.word()
         ]
      project['questions'].append(questionObject)

   return project

def generateProjects(deleteProjects, howManyProfsShouldHaveProjects, projectsPerProfessor):
   projects = dbclient['practice']['projects']
   users = dbclient['practice']['users']
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
   for profId in mappedProjects:
      for projectData in mappedProjects[profId]:
         insert = projects.insert_one(projectData)
         # Update the faculty user data 
         # to include the project link
         print("Updating project link for " + str(profId))
         users.update_one({"_id": ObjectId(profId)}, {
            "$set": {
               "userType.facultyProjects.{}".format(projectData['type']): ObjectId(insert.inserted_id)
            }
         })
         print("Updated link! " + str(profId))
         # print("userType.FacultyProjects.{}".format(projectData['type']))
         # print(insert.inserted_id)
   print("Inserted all new projects!")

def generateRandomApplications(student, projectParent, randomProject):
  
   clonedApp = {
      # RecordId is the "Active" project
      # Id is the project id itself
      "OpportunityRecordId": projectParent['_id'],
      "OpportunityId": randomProject['_id'],
      "_id": ObjectId(),
      "appliedDate": datetime.now().isoformat(),
      "lastModified": datetime.now().isoformat(),
      "status": "Pending",
      "questions": []
   }

   for question in randomProject['questions']:
      clone = {}
      for entry in question:
         clone[str(entry)] = question[entry]
      clone['answer'] = ""
      if question['requirementType'] == "text":
         # text
         clone['answer'] = fake.paragraph()
      elif question['requirementType'] == "radio button" or question['requirementType'] == "check box":
         clone['answer'] = random.choice(clone['choices'])
      clonedApp['questions'].append(clone)
   
   return clonedApp

def generateStudentApplications(destroy, howManyStudentsShouldApply, HowManyPerStudent):
   applicationcol = dbclient['practice']['applications']
   users = dbclient['practice']['users']
   projectCol = dbclient['practice']['projects']
   # If to destroy
   if destroy:
      applicationcol.delete_many({})
   userList = users.find({"$and": [{"userType.Type": 0}, {"userType.GPA": { "$exists": True }}]})
   existingUsers = []
   # Convert Cursor to just normal array
   for user in userList: 
      existingUsers.append(user)
   
   # some boundary stuff
   if len(existingUsers) < howManyStudentsShouldApply:
      howManyStudentsShouldApply = len(existingUsers)

   projects = dbclient['practice']['projects'].find({"type": "Active"})
   
   existingProjects = []
   for project in projects:
      existingProjects.append(project)

   mappedApps = {}
   print("Picking random students & projects now")
   for i in range(howManyStudentsShouldApply):
      # Get all Faculty users
      randomUser = existingUsers.pop(random.randrange(len(existingUsers)))
      randomProjectTop = random.choice(existingProjects)

      applications = []
      apps = {
         "user": randomUser['name'],
         "applications": applications
      }

      projectAppReferences = []

      print("Generating applications for student now")
      for i in range(random.randint(1, HowManyPerStudent)):
          
         randomProject = random.choice(randomProjectTop['projects'])

         print(randomProject)
         if not str(randomProject['_id']) in mappedApps:
            mappedApps[randomProject['_id']] = []

         # Get the base application now
         appForStudentList = generateRandomApplications(randomUser, randomProjectTop, randomProject)
         appForProjectList = {
            "applicationRecordId": "", # This needs to be set to the ID after the parent "apps" has been inserted
            "application": appForStudentList['_id'],
            "status": "Pending",
            "name": randomUser['name'],
            "GPA": randomUser['userType']['GPA'],
            "major": randomUser['userType']['Major'],
            "appliedDate": appForStudentList['appliedDate'],
            "location": randomUser['universityLocation']
         }
         applications.append(appForStudentList)
         projectAppReferences.append(appForProjectList)

         mappedApps[randomProject["_id"]].append({
            "studentApp": appForStudentList,
            "profApp": appForProjectList
         })

      # Create new object now and get its ID
      insertedId = applicationcol.insert_one(apps).inserted_id

      # Now we set the applicationRecordId to the created apps for the faculty project
      # This references the students Application "manager"
      for project in projectAppReferences: 
         project['applicationRecordId'] = insertedId
      
      # Now we insert the application manager to the user 
      users.update_one({"_id": randomUser['_id']}, {"$set": {"userType.studentApplications": ObjectId(insertedId)}})

      # Add to Faculty project now
      # We need to include the appForProjectList in the projects applications list
      for projectId in mappedApps:
         projectData = mappedApps[projectId]
         dataToPush = []
         # This is the studentApp and profApp
         for project in projectData:
            dataToPush.append(project['profApp'])
         # Now we want to add this to the projects data
         projectCol.update_one({
            "projects": {
               "$elemMatch": { # find the project we want in the array
                  "_id": projectId
               }
            }
         }, { # Push the applications now
            "$push": {
               # Get the project itself 
               "projects.$.applications": { 
                  "$each": dataToPush # Push each project now
               }
            }
         })

      # This goes into the project.applications folder
      # 'applicationRecordID': applicationRecord,
      # 'application': newApp._id,
      # 'status': status,
      # 'name': student.name,
      # 'GPA': student.userType.GPA,
      # 'major': student.userType.Major,
      # 'email': student.email,
      # 'appliedDate': new Date(),
      # 'location': student.universityLocation,
      
FacultyUsers = 5
StudentUsers = 20
DeleteExistingStudentUsers = True
generateUsers(FacultyUsers, StudentUsers, DeleteExistingStudentUsers)

DeleteExistingProjects = True 
HowManyProfessorsShouldHaveProjects = 5
HowManyProjectsPerProfessor = 2
generateProjects(True, HowManyProfessorsShouldHaveProjects, HowManyProjectsPerProfessor)

# NOTE: Deleting existing applications just clears applications collection, NOT fully clearing all applications from projects & users
# You would want to delete users & projects too to have a fresh start as I cannot guarantee stability at this moment
DeleteExistingApplications = True
HowManyStudentsShouldApply = 15
HowManyApplicationsPerStudent = 2
generateStudentApplications(True, HowManyStudentsShouldApply, HowManyApplicationsPerStudent)