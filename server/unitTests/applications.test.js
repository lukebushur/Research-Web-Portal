const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../server.js');
const User = require('../models/user');
const Project = require('../models/project.js');
const Application = require('../models/application.js');
require('dotenv').config();

server.unitTest = true;

const expect = chai.expect;
chai.use(chaiHTTP);
//variables for unit testing, to ensure future requests succeed
let projectID, //id of the active project
    faculty_access_token, //access token for faculty account
    student_access_token, //access token for student account
    student_access_token2, //access token of the second student account
    studentRecordID, //id of the student account
    studentRecordID2, //id of the second student account
    facultyRecordID, //id of the faculty account
    projectRecordID, //id of the record of the active projects
    projectApplicationID, //id of the application in the projects array
    applicationRecordID, //id the application record,
    applicationRecordID2, //id the second application record
    applicationID, //id the application in the application record
    applicationID2; //if of the second student's application in the application record

//randomly generated password, name, and email
const randomPass = Math.random().toString(36).substring(0).repeat(2);
const randomName = Math.random().toString(36).substring(2);
const randomEmail = Math.random().toString(36).substring(8) + "@gmail.com";


//This waits for the connection to the DB to be set up before running the tests
before(function (done) {
    this.timeout(4000);
    setTimeout(done, 3000);
});

//Basic register request for the faculty, should return a success response
describe('POST /api/register', () => {
    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName, "password": randomPass,
                "accountType": process.env.FACULTY, "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('REGISTER_SUCCESS');

                expect(res.body.success).to.have.property('accessToken');
                expect(res.body.success).to.have.property('refreshToken');
                expect(res.body.success).to.have.property('user');
                expect(res.body.success.user).to.have.property('id');
                //Store access token and the id of the faculty
                faculty_access_token = res.body.success.accessToken;
                facultyRecordID = res.body.success.user.id;
                done();
            });
    });
});

//Student register request, should return a success response
describe('POST /api/register', () => {
    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": "a" + randomEmail, "name": "a" + randomName, "password": randomPass, "accountType": process.env.STUDENT,
                "GPA": 3.5, "Major": ["Computer Science"], "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('REGISTER_SUCCESS');

                expect(res.body.success).to.have.property('accessToken');
                expect(res.body.success).to.have.property('refreshToken');
                expect(res.body.success).to.have.property('user');
                expect(res.body.success.user).to.have.property('id');
                //Store access token and the id of the user
                student_access_token = res.body.success.accessToken;
                studentRecordID = res.body.success.user.id;
                done();
            });
    });
});

//Student register request, should return a success response. This second student will be used to test the fetchApplicants routes
describe('POST /api/register', () => {
    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": "z" + randomEmail, "name": "z" + randomName, "password": randomPass, "accountType": process.env.STUDENT,
                "GPA": 3.5, "Major": ["Computer Science"], "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('REGISTER_SUCCESS');

                expect(res.body.success).to.have.property('accessToken');
                expect(res.body.success).to.have.property('refreshToken');
                expect(res.body.success).to.have.property('user');
                expect(res.body.success.user).to.have.property('id');
                //Store access token and the id of the user
                student_access_token2 = res.body.success.accessToken;
                studentRecordID2 = res.body.success.user.id;
                done();
            });
    });
});

//Project active creation request, this should result in a success which will create a new active project record
describe('POST /api/projects/createProject', () => {
    it('should return a successful active project creation response', (done) => {
        chai.request(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science", "Mathematics", "Biology"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "description": "We will be eating frogs!",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true,
                        }, {
                            "question": "Frogs?",
                            "requirementType": "check box",
                            "required": true,
                            "choices": ["Frogs", "frogs"],
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_CREATED');
                done();
            });
    });
});
//Get projects unit test, expects a successful get projects response with all the previously created projects
describe('GET /api/projects/getProjects', () => {
    it('should return a successful project retrieval response', (done) => {
        chai.request(server)
            .get('/api/projects/getProjects')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("PROJECTS_FOUND");
                expect(res.body.success).to.have.property('projects');
                expect(res.body.success.projects[0].number).to.equal(1);
                expect(res.body.success.projects[0].projectType).to.equal("active");
                //store ids of the projects from the retrived projecst
                projectID = res.body.success.projects[0].id;
                done();
            });
    });
});


//2nd Project active creation request for usage with the search feature
describe('POST /api/projects/createProject', () => {
    it('should return a successful active project creation response', (done) => {
        chai.request(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Banana Boy Project",
                        "GPA": 3.5,
                        "majors": ["Computer Science"],
                        "categories": ["Virtual Reality"],
                        "deadline": "01/29/2024",
                        "description": "Create fruit, such as bananas, in virtual reality. Also eat the fruit in virtual reality",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true,
                        }, {
                            "question": "Frogs?",
                            "requirementType": "check box",
                            "required": true,
                            "choices": ["Frogs", "frogs"],
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_CREATED');
                done();
            });
    });
});
//search projects by faculty member name
describe('GET /api/search/searchProjects', () => {
    it('should search for projects by professor name and return 2 with scores greater than 0', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=' + randomName).set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(2);
            expect(res.body.success.results[0]).to.have.property('score').to.be.gt(0);
            expect(res.body.success.results[1]).to.have.property('score').to.be.gt(0);
            done();
        });
    });
});
//Search for projects by description
describe('GET /api/search/searchProjects', () => {
    it('should search for projects by description, and have the first project with a score greater than 0 and second with a score of 0', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=virtual reality').set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(2);
            expect(res.body.success.results[0]).to.have.property('score').to.be.gt(0);
            expect(res.body.success.results[1]).to.have.property('score').to.equal(0);
            done();
        });
    });
});

//Search for projects with page specifications for one result per page
describe('GET /api/search/searchProjects', () => {
    it('should search for projects with number per page field, and return only one project', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=virtual reality&npp=1').set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(1);
            expect(res.body.success.results[0]).to.have.property('score').to.be.gt(0);
            done();
        });
    });
});

//Search for projects with page specifications
describe('GET /api/search/searchProjects', () => {
    it('should search for projects with number per page field and page number field, and return the least similar project', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=virtual reality&npp=1&pageNum=2').set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(1);
            expect(res.body.success.results[0]).to.have.property('score').to.equal(0);
            done();
        });
    });
});

describe('GET /api/search/searchProjects', () => {
    it('should search for projects and retrieve two searching by major', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=Computer Science').set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(2);
            expect(res.body.success.results[0]).to.have.property('score').to.be.gt(0);
            expect(res.body.success.results[1]).to.have.property('score').to.be.gt(0);
            expect(res.body.success.results[0]).to.have.property('projectName');
            expect(res.body.success.results[0]).to.have.property('GPA');
            expect(res.body.success.results[0]).to.have.property('categories');
            expect(res.body.success.results[0]).to.have.property('posted');
            expect(res.body.success.results[0]).to.have.property('deadline');
            expect(res.body.success.results[0]).to.have.property('description');
            expect(res.body.success.results[0]).to.have.property('questions');
            expect(res.body.success.results[0]).to.have.property('professorName');
            expect(res.body.success.results[0]).to.have.property('professorEmail');
            done();
        });
    });
});

//Test the searchProjects route to see if it returns nothing when the search should not return anything
describe('GET /api/search/searchProjects', () => {
    it('should search for projects with criteria that will return no projects for majors, GPA, posted date, and deadline fields', (done) => {
        chai.request(server).get('/api/search/searchProjects?posted=2124-01-16T16:41:59.968325&query=test').set({ "Authorization": `Bearer ${student_access_token}` })
            .send({}).end((err, res) => {
                //search with invalid posted date 
                expect(res).to.have.status(200); //test cases that return nothing
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success.results).to.have.length(0);

                //GPA too high to get responses
                chai.request(server).get('/api/search/searchProjects?GPA=3.6&query=Matthew Im Test').set({ "Authorization": `Bearer ${student_access_token}` })
                    .send({}).end((err, res) => {
                        expect(res.body.success.results).to.have.length(0);
                        //deadline to high to get responses
                        chai.request(server).get('/api/search/searchProjects?deadline=2124-01-16T16:41:59.968325&query=test').set({ "Authorization": `Bearer ${student_access_token}` })
                            .send({}).end((err, res) => {
                                expect(res.body.success.results).to.have.length(0);
                                //majors that don't exist
                                chai.request(server).get('/api/search/searchProjects?majors=Art History,Bingus&query=test').set({ "Authorization": `Bearer ${student_access_token}` })
                                    .send({}).end((err, res) => {
                                        expect(res.body.success.results).to.have.length(0);
                                        done();
                                    });
                            });
                    });
            });
    });
});

//Unit test for the student get project route 
describe('POST /api/applications/getProjectInfo', () => {
    it('should return a successful project retrieval response', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectID": projectID,
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("PROJECT_FOUND");
                expect(res.body.success).to.have.property('project');
                expect(res.body.success.project).to.have.property("projectName").to.equal("Bioinformatics Project");
                expect(res.body.success.project).to.have.property("GPA").to.equal(3.0);
                expect(res.body.success.project).to.have.property("majors").to.have.length(3);
                expect(res.body.success.project).to.have.property("categories").to.have.length(3);
                expect(res.body.success.project).to.have.property("questions").to.have.length(3);
                expect(res.body.success.project).to.have.property("description").to.equal("We will be eating frogs!");
                expect(res.body.success.project).to.have.property("deadline").to.equal("Thu Jan 18 2024");
                done();
            });
    });
})

//Unit test for creating an application with the first student
describe('POST /api/applications/createApplication', () => {
    after(async () => { //grabs the project record ID and application id
        let user = await User.findOne({ email: randomEmail });
        let faculty, student;
        let promises = [
            User.findOne({ email: randomEmail }),
            User.findOne({ email: "a" + randomEmail })
        ];

        await Promise.all(promises).then(results => {
            faculty = results[0];
            student = results[1];
        });

        let proj, apps;

        promises = [
            Project.findOne({ _id: faculty.userType.FacultyProjects.Active }),
            Application.findOne({ _id: student.userType.studentApplications })
        ];

        await Promise.all(promises).then(results => {
            proj = results[0];
            apps = results[1];
        });

        projectRecordID = user.userType.FacultyProjects.Active;
        projectApplicationID = proj.projects[0].applications[0].application;
        applicationRecordID = apps.id;
        applicationID = apps.applications[0].id;
    });
    it('Should return a first application creation response', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectID": projectID,
                "questions": [{
                    "question": "Can you eat frogs?",
                    "requirementType": "radio button",
                    "required": true,
                    "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                    "answers": ["Yes, I can eat frogs!"]
                }, {
                    "question": "Write a 3-page paper on why baby shark is the best song ever.",
                    "requirementType": "text",
                    "required": true,
                    "answers": ["This is 3 pages if the font is size 900."]
                }, {
                    "question": "Frogs?",
                    "requirementType": "check box",
                    "required": true,
                    "choices": ["Frogs", "frogs"],
                    "answers": ["Frogs", "frogs"]
                },]
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_CREATED');
                done();
            })
    })
});

//Unit test for getting a singular applicatiom's information
describe('POST /api/applications/getApplication', () => {
    it('Should return the data from a singular application', (done) => {
        chai.request(server)
            .post('/api/applications/getApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({ "applicationID": applicationID })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_FOUND');
                expect(res.body.success.application).to.have.property('questions').to.have.length(3);
                expect(res.body.success.application).to.have.property('opportunityRecordId');
                expect(res.body.success.application).to.have.property('opportunityId');
                expect(res.body.success.application).to.have.property('status');
                expect(res.body.success.application).to.have.property('appliedDate');
                expect(res.body.success.application).to.have.property('lastModified');
                expect(res.body.success.application).to.have.property('lastUpdated');
                expect(res.body.success.application).to.have.property('_id');
                done();
            })
    })
});

//Unit test for creating an application with the second student
describe('POST /api/applications/createApplication', () => {
    after(async () => { //grabs the project record ID and application id
        let student = await User.findOne({ email: "z" + randomEmail })

        let apps = await Application.findOne({ _id: student.userType.studentApplications })

        applicationRecordID2 = apps.id;
        applicationID2 = apps.applications[0].id;
    });
    it('Should return a second application creation response', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token2}` })
            .send({
                "professorEmail": randomEmail,
                "projectID": projectID,
                "questions": [{
                    "question": "Can you eat frogs?",
                    "requirementType": "radio button",
                    "required": true,
                    "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                    "answers": ["Yes, I can eat frogs!"]
                }, {
                    "question": "Write a 3-page paper on why baby shark is the best song ever.",
                    "requirementType": "text",
                    "required": true,
                    "answers": ["This is 3 pages if the font is size 900."]
                }, {
                    "question": "Frogs?",
                    "requirementType": "check box",
                    "required": true,
                    "choices": ["Frogs", "frogs"],
                    "answers": ["Frogs", "frogs"]
                },]
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_CREATED');
                done();
            })
    })
});
//This unit test modifies the student's account information the changes should be reflected in their applications 
describe('POST /api/accountManagement/updateAccount', () => {
    it("Should return a successful account update response", (done) => {
        chai.request(server)
            .post('/api/accountManagement/updateAccount')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "name": "Jeremy Jengas Junior",
                "GPA": 4,
                "Major": ["Frogs", "Computer Science"]
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('ACCOUNT_UPDATED');
                done();
            })
    })
});
//Unit test for fetching the general information of applicants
describe('POST /api/projects/getApplicants', () => {
    it("Should return a successful applicants retrieval response", (done) => {
        chai.request(server)
            .post('/api/projects/getApplicants')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({ "projectID": projectID })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICANTS_FOUND');
                expect(res.body.success).to.have.property('applicants').to.have.length(2);
                expect(res.body.success.applicants[0]).to.have.property('name').to.equal('Jeremy Jengas Junior');
                expect(res.body.success.applicants[0]).to.have.property('applicationRecordID');
                expect(res.body.success.applicants[0]).to.have.property('application');
                expect(res.body.success.applicants[0]).to.have.property('status');
                expect(res.body.success.applicants[0]).to.have.property('GPA').to.equal(4);
                expect(res.body.success.applicants[0].major[0]).to.equal("Frogs");
                expect(res.body.success.applicants[0]).to.have.property('email');
                expect(res.body.success.applicants[0]).to.have.property('appliedDate');
                done();
            })
    })
});

//Unit test for fetching the detailed information of applicants
describe('POST /api/projects/getDetailedApplicants', () => {
    it("Should return a successful applicants retrieval response", (done) => {
        chai.request(server)
            .post('/api/projects/getDetailedApplicants')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({ "projectID": projectID })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICANTS_FOUND');
                expect(res.body.success).to.have.property('applicants').to.have.length(2);
                expect(res.body.success.applicants[0].name).to.equal("Jeremy Jengas Junior");
                expect(res.body.success.applicants[1].name).to.equal("z" + randomName);
                expect(res.body.success.applicants[0]).to.have.property('questions');
                expect(res.body.success.applicants[0]).to.have.property('name');
                expect(res.body.success.applicants[0]).to.have.property('status');
                expect(res.body.success.applicants[0]).to.have.property('GPA');
                expect(res.body.success.applicants[0]).to.have.property('majors');
                expect(res.body.success.applicants[0]).to.have.property('email');
                expect(res.body.success.applicants[0]).to.have.property('appliedDate');
                done();
            })
    })
});

//Unit test for updating the application from the student's side, i.e. changing an answer
describe('PUT /api/applications/updateApplication', () => {
    it("Should return a successful application update response", (done) => {
        chai.request(server)
            .put('/api/applications/updateApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "applicationID": applicationID,
                "questions": [{
                    "question": "Can you eat frogs?",
                    "requirementType": "radio button",
                    "required": true,
                    "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                    "answers": ["No, I cannot eat frogs!"]
                }, {
                    "question": "Write a 3-page paper on why baby shark is the best song ever.",
                    "requirementType": "text",
                    "required": true,
                    "answers": ["This is 3 pages if the font is size 900."]
                }, {
                    "question": "Frogs?",
                    "requirementType": "check box",
                    "required": true,
                    "choices": ["Frogs", "frogs"],
                    "answers": ["Frogs", "frogs"]
                },]
            }).end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_UPDATED');
                done();
            })
    })
});

//Unit test for updating application decision to hold status
describe('PUT /api/projects/application', () => {
    it("Should return a successful project status update response", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "applicationID": projectApplicationID,
                "decision": "Hold"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_STATUS_UPDATED');
                done();
            })
    })
});
//Unit test for get applications, additionally tests for functionality of the update application route by ensuring that
//the answer of the first question for the first application has been updated to "No, I cannot eat frogs!"
describe('GET /api/applications/getApplications', () => {
    it("Should return a successful applications retrieval response", (done) => {
        chai.request(server)
            .get('/api/applications/getApplications')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATIONS_FOUND');
                expect(res.body.success).to.have.property('applications');
                expect(res.body.success.applications[0]).to.have.property('status').to.equal("Hold");
                expect(res.body.success.applications[0]).to.have.property('description');
                expect(res.body.success.applications[0]).to.have.property('posted');
                expect(res.body.success.applications[0]).to.have.property('opportunityId');
                expect(res.body.success.applications[0]).to.have.property('opportunityRecordId');
                expect(res.body.success.applications[0].questions).to.have.length(3);
                expect(res.body.success.applications[0].questions[0].answers[0]).to.equal("No, I cannot eat frogs!");
                expect(res.body.success.applications[0]).to.have.property('projectName').to.equal("Bioinformatics Project");
                done();
            })
    })
});

//Unit test for updating application decision to accept status
describe('PUT /api/projects/application', () => {
    it("Should return a successful project status update response", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "applicationID": projectApplicationID,
                "decision": "Accept"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_STATUS_UPDATED');
                done();
            })
    })
});
//Unit test for get applications 
describe('GET /api/applications/getApplications', () => {
    it("Should return a successful applications retrieval response", (done) => {
        chai.request(server)
            .get('/api/applications/getApplications')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATIONS_FOUND');
                expect(res.body.success).to.have.property('applications');
                expect(res.body.success.applications[0]).to.have.property('status').to.equal("Accept");
                expect(res.body.success.applications[0]).to.have.property('description');
                expect(res.body.success.applications[0]).to.have.property('posted');
                expect(res.body.success.applications[0]).to.have.property('opportunityId');
                expect(res.body.success.applications[0]).to.have.property('opportunityRecordId');
                expect(res.body.success.applications[0].questions).to.have.length(3);
                expect(res.body.success.applications[0]).to.have.property('projectName').to.equal("Bioinformatics Project");
                done();
            })
    })
});

//Delete request for the application
describe('DELETE /api/applications/deleteApplication', () => {
    it('should return a successful project deletion response', (done) => {
        chai.request(server)
            .delete('/api/applications/deleteApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "applicationID": applicationID
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATION_DELETED');
                done();
            });
    });
});

describe('GET /api/applications/getApplications', () => {
    it("Should return a successful applications retrieval response", (done) => {
        chai.request(server)
            .get('/api/applications/getApplications')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICATIONS_FOUND');
                expect(res.body.success).to.have.property('applications');
                expect(res.body.success.applications).to.have.length(0);
                done();
            })
    })
});

//Ensure that the records created are deleted 
after(async () => {
    try {
        const promises = [
            User.deleteOne({ _id: studentRecordID }),
            User.deleteOne({ _id: studentRecordID2 }),
            User.deleteOne({ _id: facultyRecordID }),
            Project.deleteOne({ _id: projectRecordID }),
            Application.deleteOne({ _id: applicationRecordID }),
            Application.deleteOne({ _id: applicationRecordID2 })
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});
