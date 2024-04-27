/*  This testing file addresses success and failure cases for creating, modifying, deleting, and updating applications.
    Information regarding what each test should achieve can be found in the RTM (Requirement Traceability Matrix) spreadsheet
*/

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
    projectID2,
    faculty_access_token, //access token for faculty account
    student_access_token, //access token for student account
    student_access_token2, //access token of the second student account
    lowGPA_student_access_token,
    wrongMajor_student_access_token,
    studentRecordID, //id of the student account
    studentRecordID2, //id of the second student account
    lowGPAstudentRecordID,
    wrongMajorstudentRecordID,
    facultyRecordID, //id of the faculty account
    projectRecordID, //id of the record of the active projects
    projectApplicationID, //id of the application in the projects array
    projectApplicationID2,
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

//BE-REG-10 : Basic register request for the faculty, should return a success response
describe('BE-REG-10 : POST /api/register', () => {
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

//BE-REG-8 : Student register request for student with a GPA too low to apply, should return a success response
describe('BE-REG-8 : POST /api/register', () => {
    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": "ZZYYSSD" + randomEmail, "name": "a" + randomName, "password": randomPass, "accountType": process.env.STUDENT,
                "GPA": 0.5, "Major": ["Computer Science"], "universityLocation": "Test University"
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
                lowGPA_student_access_token = res.body.success.accessToken;
                lowGPAstudentRecordID = res.body.success.user.id;
                done();
            });
    });
});

//BE-REG-8 : Student register request for student with the wrong major for the project, should return a success response
describe('BE-REG-8 : POST /api/register', () => {
    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": "aXAX" + randomEmail, "name": "a" + randomName, "password": randomPass, "accountType": process.env.STUDENT,
                "GPA": 3.5, "Major": ["Business"], "universityLocation": "Test University"
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
                wrongMajor_student_access_token = res.body.success.accessToken;
                wrongMajorstudentRecordID = res.body.success.user.id;
                done();
            });
    });
});

//BE-REG-8 : Student register request, should return a success response
describe('BE-REG-8 : POST /api/register', () => {
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

//BE-REG-8 : Student register request, should return a success response. This second student will be used to test the fetchApplicants routes
describe('BE-REG-8 : POST /api/register', () => {
    it('should return a second registration success response', (done) => {
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

//BE-GPI-6 : Unit test for the student get project route without active project record
describe('BE-GPI-6 : POST /api/applications/getProjectInfo', () => {
    it('should return a failed project retrieval response due to invalid faculty access token', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": "TestIDDoesn'tMatterItDoesn'tExistAnyways",
                "professorEmail": randomEmail,
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECT_LIST_NOT_FOUND");
                done();
            });
    });
});

//Project active creation request, this should result in a success which will create a new active project record
describe('BE-CAP-6 : POST /api/projects/createProject', () => {
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
                        "deadline": "01/18/2042",
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

//2nd Project active creation request for usage with the search feature
describe('BE-CAP-7 : POST /api/projects/createProject', () => {
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
                        "deadline": "01/29/2042",
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

//Get projects unit test, expects a successful get projects response with all the previously created projects
describe('BE-CAP-8 : GET /api/projects/getProjects', () => {
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
                projectID2 = res.body.success.projects[1].id;
                done();
            });
    });
});

//BE-SP-1 : search projects by faculty member name
describe('BE-SP-1 : GET /api/search/searchProjects', () => {
    it('should search for projects by professor name and return 2 with scores greater than 0', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=' + randomName).set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(2);
            expect(res.body.success.results[0]).to.have.property('score').to.be.gt(0);
            expect(res.body.success.results[1]).to.have.property('score').to.be.gt(0);
            done();
        });
    });
});
//BE-SP-1 : Search for projects by description
describe('BE-SP-1 : GET /api/search/searchProjects', () => {
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
describe('BE-SP-2 : GET /api/search/searchProjects', () => {
    it('BE-SP-2 : should search for projects with number per page field, and return only one project', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=virtual reality&npp=1').set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(1);
            expect(res.body.success.results[0]).to.have.property('score').to.be.gt(0);
            done();
        });
    });
});

//BE-SP-2 : Search for projects with page specifications
describe('BE-SP-2 : GET /api/search/searchProjects', () => {
    it('should search for projects with number per page field and page number field, and return the least similar project', (done) => {
        chai.request(server).get('/api/search/searchProjects?query=virtual reality&npp=1&pageNum=2').set({ "Authorization": `Bearer ${student_access_token}` }).send({}).end((err, res) => {
            expect(res.body.success.results).to.have.length(1);
            expect(res.body.success.results[0]).to.have.property('score').to.equal(0);
            done();
        });
    });
});

describe('BE-SP-1 : GET /api/search/searchProjects', () => {
    it('BE-SP-1 : should search for projects and retrieve two searching by major', (done) => {
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

//BE-SP-3 : Test the searchProjects route to see if it returns nothing when the search should not return anything
describe('BE-SP-3 <-> 7 : GET /api/search/searchProjects', () => {
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

//BE-GPI-1 : Unit test for the student get project route with no project ID
describe('BE-GPI-1 : POST /api/applications/getProjectInfo', () => {
    it('should return a failed project retrieval response due to no projectID', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal("INPUT_ERROR");
                done();
            });
    });
});

//BE-GPI-2 : Unit test for the student get project route with no professorEmail
describe('BE-GPI-2 : POST /api/applications/getProjectInfo', () => {
    it('should return a failed project retrieval response due to no professorEmail', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID,
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal("INPUT_ERROR");
                done();
            });
    });
});

//BE-GPI-3 : Unit test for the student get project route with no invalid projectID
describe('BE-GPI-3 : POST /api/applications/getProjectInfo', () => {
    it('should return a failed project retrieval response due to invalid projetID', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID + "BINGUS",
                "professorEmail": randomEmail,
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECT_NOT_FOUND");
                done();
            });
    });
});

//BE-GPI-4 : Unit test for the student get project route with no invalid professorEmail
describe('BE-GPI-4 : POST /api/applications/getProjectInfo', () => {
    it('should return a failed project retrieval response due to invalid professorEmail', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID,
                "professorEmail": randomEmail  + "BINGUS",
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal("SERVER_ERROR");
                done();
            });
    });
});

//BE-GPI-5 : Unit test for the student get project route with faculty access token
describe('BE-GPI-5 : POST /api/applications/getProjectInfo', () => {
    it('should return a failed project retrieval response due to invalid faculty access token', (done) => {
        chai.request(server)
            .post('/api/applications/getProjectInfo')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "professorEmail": randomEmail  + "BINGUS",
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal("UNAUTHORIZED");
                done();
            });
    });
});

//BE-GPI-7 : Unit test for the student get project route 
describe('BE-GPI-7 : POST /api/applications/getProjectInfo', () => {
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
                expect(res.body.success.project).to.have.property("deadline").to.equal("Sat Jan 18 2042");
                done();
            });
    });
})

//BE-APP-1.1 : Unit test for applying to a project without a professor email, should fail
describe('BE-APP-1.1 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to no professor email', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
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
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-APP-1.2 : Unit test for applying to a project without a project id, should fail
describe('BE-APP-1.2 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to no project id', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
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
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-APP-1.3 : Unit test for applying to a project without answers to required questions
describe('BE-APP-1.3 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due missing answers for required questions', (done) => {
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
            })
            .end((err, res) => {

                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-APP-1.4 : Unit test for applying to a project with missing questions
describe('BE-APP-1.4 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to missing questions', (done) => {
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
                },]
            })
            .end((err, res) => {
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-APP-2 : Unit test for applying to a project with a faculty access token, should fail
describe('BE-APP-2 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to faculty access token', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
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
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            })
    })
});

//BE-APP-3.1 : Unit test for applying to a project with an invalid project id
describe('BE-APP-3.1 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to an invalid project id', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectID": projectID + "invalid",
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
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-APP-3.2 : Unit test for applying to a project with an invalid professor email
describe('BE-APP-3.2 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to an invalid professor email', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": "invalid" + randomEmail,
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
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-APP-3.3 : Unit test for applying to a project with non-matching answers
describe('BE-APP-3.3 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to non-matching answers', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": "invalid",
                "projectID": projectID,
                "questions": [{
                    "question": "Can you eat frogs?",
                    "requirementType": "radio button",
                    "required": true,
                    "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                    "answers": ["Large frogs consume humans?"]
                }, {
                    "question": "Write a 3-page paper on why baby shark is the best song ever.",
                    "requirementType": "text",
                    "required": true,
                    "answers": ["This answer will never be wrong because its a text response"]
                }, {
                    "question": "Frogs?",
                    "requirementType": "check box",
                    "required": true,
                    "choices": ["Frogs", "frogs"],
                    "answers": ["Toads", "toads"]
                },]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-APP-3.4 : Unit test for applying to a project with non-matching questions
describe('BE-APP-3.4 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to non-matching questions', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectID": projectID,
                "questions": [{
                    "question": "I have modified this question",
                    "requirementType": "radio button",
                    "required": true,
                    "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"],
                    "answers": ["Yes, I can eat frogs!"]
                }, {
                    "question": "I have modified this question",
                    "requirementType": "text",
                    "required": true,
                    "answers": ["This is 3 pages if the font is size 900."]
                }, {
                    "question": "I have modified this question",
                    "requirementType": "check box",
                    "required": true,
                    "choices": ["Frogs", "frogs"],
                    "answers": ["Frogs", "frogs"]
                },]
            })
            .end((err, res) => {
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-APP-4 : Unit test for creating an application with the first student
describe('BE-APP-4 : POST /api/applications/createApplication', () => {
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

//BE-APP-5 : Unit test for applying to a project that has already been applied to, should fail
describe('BE-APP-5 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to applying to the same project', (done) => {
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
                expect(res).to.have.status(403);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(403);
                expect(res.body.error).to.have.property('message').to.equal('APPLICATION_ALREADY_EXISTS');
                done();
            })
    })
});

//BE-APP-7 : Unit test for applying to a project that has a GPA requirement that is too high
describe('BE-APP-7 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to applying to the same project', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${lowGPA_student_access_token}` })
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
                expect(res).to.have.status(409);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(409);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_GPA');
                done();
            })
    })
});

//BE-APP-8 : Unit test for applying to a project that majors do no align
describe('BE-APP-5 : POST /api/applications/createApplication', () => {
    it('Should return a failed application due to invalid majors', (done) => {
        chai.request(server)
            .post('/api/applications/createApplication')
            .set({ "Authorization": `Bearer ${wrongMajor_student_access_token}` })
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
                expect(res).to.have.status(409);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(409);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_MAJOR');
                done();
            })
    })
});

//BE-APP-9 : Unit test for getting a singular applicatiom's information
describe('BE-APP-9 : POST /api/applications/getApplication', () => {
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

//BE-MAI-1 : This unit test is for modification of account with invalid GPA < 0
describe('BE-MAI-1 : POST /api/accountManagement/updateAccount', () => {
    it("Should return a failed response due to GPA < 0", (done) => {
        chai.request(server)
            .post('/api/accountManagement/updateAccount')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "name": "Jeremy Jengas Junior",
                "GPA": -4,
                "Major": ["Frogs", "Computer Science"]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MAI-1 : This unit test is for modification of account with invalid GPA > 0
describe('BE-MAI-1 : POST /api/accountManagement/updateAccount', () => {
    it("Should return a failed response due to GPA > 0", (done) => {
        chai.request(server)
            .post('/api/accountManagement/updateAccount')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "name": "Jeremy Jengas Junior",
                "GPA": 16470,
                "Major": ["Frogs", "Computer Science"]
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MAI-2 : This unit test is for modification of account with invalid university Location
describe('BE-MAI-2 : POST /api/accountManagement/updateAccount', () => {
    it("Should return a failed response due to invalid university location", (done) => {
        chai.request(server)
            .post('/api/accountManagement/updateAccount')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "name": "Jeremy Jengas Junior",
                "GPA": 3.6,
                "Major": ["Frogs", "Computer Science"],
                "universityLocation": "Frog City University"
            })
            .end((err, res) => {
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-MAI-3 : This unit test is for modification of account with invalid major
describe('BE-MAI-3 : POST /api/accountManagement/updateAccount', () => {
    it("Should return a failed response due to invalid major", (done) => {
        chai.request(server)
            .post('/api/accountManagement/updateAccount')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "name": "Jeremy Jengas Junior",
                "GPA": 3.6,
                "Major": ["Frog Consumption"],
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MAI-4 : This unit test is for modification of account with invalid name
describe('BE-MAI-4 : POST /api/accountManagement/updateAccount', () => {
    it("Should return a failed response due to invalid name", (done) => {
        chai.request(server)
            .post('/api/accountManagement/updateAccount')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "name": "p",
                "GPA": 3.6,
                "Major": ["Frogs", "Computer Science"],
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MAI-5 : This unit test modifies the student's account information the changes should be reflected in their applications 
describe('BE-MAI-5 : POST /api/accountManagement/updateAccount', () => {
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

//BE-MAI-6 : Unit test for fetching the general information of applicants
describe('BE-MAI-6 : POST /api/projects/getApplicants', () => {
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
                expect(res.body.success).to.have.property('applicants').to.have.length(1);
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

//BE-MAI-6 : Unit test for fetching the detailed information of applicants
describe('POST /api/projects/getDetailedApplicants', () => {
    it("BE-MAI-6 : Should return a successful applicants retrieval response", (done) => {
        chai.request(server)
            .post('/api/projects/getDetailedApplicants')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({ "projectID": projectID })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('APPLICANTS_FOUND');
                expect(res.body.success).to.have.property('applicants').to.have.length(1);
                expect(res.body.success.applicants[0].name).to.equal("Jeremy Jengas Junior");
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

//BE-UAPP-1 : Unit test for updating the application from the student's without giving application id, should fail
describe('BE-UAPP-1 : PUT /api/applications/updateApplication', () => {
    it("Should return a failed update response due to no application id", (done) => {
        chai.request(server)
            .put('/api/applications/updateApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
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
                expect(res.status).to.be.oneOf([400, 500]);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.be.oneOf([400, 500]);
                expect(res.body.error).to.have.property('message').to.be.oneOf(["INPUT_ERROR", "SERVER_ERROR"]);
                done();
            })
    })
});

//BE-UAPP-2 : Unit test for updating the application with faculty access token, should fail
describe('BE-UAPP-2 : PUT /api/applications/updateApplication', () => {
    it("Should return a failed update response due to using a faculty access token", (done) => {
        chai.request(server)
            .put('/api/applications/updateApplication')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
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
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            })
    })
});

//BE-UAPP-3 : Unit test for updating the application from the student's side, i.e. changing an answer
describe('BE-UAPP-3 : PUT /api/applications/updateApplication', () => {
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

//BE-MDS-1.1 : Unit test for updating application decision without project id
describe('BE-MDS-1.1 : PUT /api/projects/application', () => {
    it("Should return a failed response due to no project id", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "applicationID": projectApplicationID,
                "decision": "Hold"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MDS-1.2 : Unit test for updating application decision without applicationID
describe('BE-MDS-1.2 : PUT /api/projects/application', () => {
    it("Should return a failed response due to no applicationID", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "decision": "Hold"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MDS-1.3 : Unit test for updating application decision without decision field
describe('BE-MDS-1.3 : PUT /api/projects/application', () => {
    it("Should return a failed response due to no decision", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "applicationID": projectApplicationID,
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MDS-2 : Unit test for updating application decision with faculty access token
describe('BE-MDS-2 : PUT /api/projects/application', () => {
    it("Should return a failed response due to facutly access token", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID,
                "applicationID": projectApplicationID,
                "decision": "Hold"
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            })
    })
});

//BE-MDS-3.1 : Unit test for updating application decision with invalid projectID
describe('BE-MDS-3.1 : PUT /api/projects/application', () => {
    it("Should return a failed response due to invalid projectID", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID + "invalid",
                "applicationID": projectApplicationID,
                "decision": "Hold"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});


//BE-MDS-3.2 : Unit test for updating application decision with invalid applicationID
describe('BE-MDS-3.2 : PUT /api/projects/application', () => {
    it("Should return a failed response due to invalid projectID", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "applicationID": projectApplicationID + "invalid",
                "decision": "Hold"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});


//BE-MDS-3.3 : Unit test for updating application decision with invalid decision
describe('BE-MDS-3.3 : PUT /api/projects/application', () => {
    it("Should return a failed response due to invalid decision", (done) => {
        chai.request(server)
            .put('/api/projects/application')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "projectID": projectID,
                "applicationID": projectApplicationID,
                "decision": "Hold" + "invalid"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    })
});

//BE-MDS-5 : Unit test for updating application decision to hold status
describe('BE-MDS-5 : PUT /api/projects/application', () => {
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

//BE-UAPP-4 : Unit test for get applications, additionally tests for functionality of the update application route by ensuring that
//the answer of the first question for the first application has been updated to "No, I cannot eat frogs!"
describe('BE-UAPP-4 : GET /api/applications/getApplications', () => {
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

//BE-MDS-4 : Unit test for updating application decision to accept status
describe('BE-MDS-4 : PUT /api/projects/application', () => {
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

//BE-MDS-6 : Unit test for get applications 
describe('BE-MDS-6 : GET /api/applications/getApplications', () => {
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

//BE-DAPP-1 : Delete request for the application with faculty access token
describe('BE-DAPP-1 : DELETE /api/applications/deleteApplication', () => {
    it('should return a failed project deletion response due to faculty access token', (done) => {
        chai.request(server)
            .delete('/api/applications/deleteApplication')
            .set({ "Authorization": `Bearer ${faculty_access_token}` })
            .send({
                "applicationID": applicationID
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            });
    });
});

//BE-DAPP-2 : Delete request for the application with no application id
describe('BE-DAPP-2 : DELETE /api/applications/deleteApplication', () => {
    it('should return a failed project deletion response due to no application id', (done) => {
        chai.request(server)
            .delete('/api/applications/deleteApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            });
    });
});

//BE-DAPP-3 : Delete request for the application with invalid application id
describe('BE-DAPP-3 : DELETE /api/applications/deleteApplication', () => {
    it('should return a failed project deletion response due to invalid application id', (done) => {
        chai.request(server)
            .delete('/api/applications/deleteApplication')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "applicationID": applicationID + "INVALID"
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            });
    });
});

//BE-DAPP-4 : Delete request for the application
describe('BE-DAPP-4 : DELETE /api/applications/deleteApplication', () => {
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

describe('BE-DAPP-5 : GET /api/applications/getApplications', () => {
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
            User.deleteOne({ _id: lowGPAstudentRecordID }),
            User.deleteOne({ _id: wrongMajorstudentRecordID }),
            Project.deleteOne({ _id: projectRecordID }),
            Application.deleteOne({ _id: applicationRecordID }),
            Application.deleteOne({ _id: applicationRecordID2 })
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});
