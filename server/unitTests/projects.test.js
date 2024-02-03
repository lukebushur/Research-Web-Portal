const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../server.js');
const User = require('../models/user');
const Project = require('../models/project.js');
require('dotenv').config();

const expect = chai.expect;
chai.use(chaiHTTP);
//variables for unit testing, to ensure future requests succeed
let projectID, //id of the first active project
    projectID2, //id of the second active project
    access_token, //access token to authorize requests
    removeID, //user id, so that it can be removed after the tests
    draftID, //id of the first draft project
    draftID2, //id of the second draft project
    projectRecordID, //id of the record of the active projects
    draftRecordID, //id of the record of the draft projects
    archiveRecordID //id of the record of the archived projects

//randomly generated password, name, and email
const randomPass = Math.random().toString(36).substring(0).repeat(2);
const randomName = Math.random().toString(36).substring(2);
const randomEmail = Math.random().toString(36).substring(8) + "@gmail.com";


//This waits for the connection to the DB to be set up before running the tests
before(function (done) {
    this.timeout(4000);
    setTimeout(done, 3000);
});

//Basic register request, should return a success response
describe('POST /api/register', () => {
    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName, "password": randomPass,
                "accountType": process.env.FACULTY, "universityLocation": "Purdue University Fort Wayne"
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
                access_token = res.body.success.accessToken;
                removeID = res.body.success.user.id;
                done();
            });
    });
});
//Project active creation request, this should result in a success which will create a new active project record
describe('POST /api/projects/createProject', () => {
    it('should return a successful active project creation response', (done) => {
        chai.request(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
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
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true
                        }, {
                            "question": "Frogs?",
                            "requirementType": "check box",
                            "required": true,
                            "choices": ["Frogs", "frogs"]
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
//A second create active project request, this should create a new active project in the existing active project record
describe('POST /api/projects/createProject', () => {
    it('should return a second successful active project creation response', (done) => {
        chai.request(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project 2",
                        "GPA": 1.0,
                        "majors": ["Computer Science", "Mathematics", "Biology"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "description": "We will be eating frogs!",
                        "questions": [{
                            "question": "Can you eat two frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true
                        }, {
                            "question": "Three tree Frogs?",
                            "requirementType": "check box",
                            "required": true,
                            "choices": ["Frogs", "frogs"]
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
//Draft project creation, this creates a new draft project as well as a new draft projects record
describe('POST /api/projects/createProject', () => {
    it('should return a successful draft project creation response', (done) => {
        chai.request(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professor": "SEAN",
                "projectType": "Draft",
                "projectDetails": {
                    "project": {
                        "projectName": "",
                        "GPA": 3.0,
                        "majors": ["Computer Science", "Mathematics", "Biology"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "description": "",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true
                        }]
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
//A second draft project creation, this creates a new draft project in the existing draft projects record
describe('POST /api/projects/createProject', () => {
    it('should return a second successful draft project creation response', (done) => {
        chai.request(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professor": "SEAN",
                "projectType": "Draft",
                "projectDetails": {
                    "project": {
                        "GPA": 3.0,
                        "majors": ["Computer Science", "Mathematics", "Biology"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true
                        }]
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
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: randomEmail });
        projectRecordID = user.userType.FacultyProjects.Active;
        draftRecordID = user.userType.FacultyProjects.Draft;
    });

    it('should return a successful project retrieval response', (done) => {
        chai.request(server)
            .get('/api/projects/getProjects')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("PROJECTS_FOUND");
                expect(res.body.success).to.have.property('projects');
                expect(res.body.success.projects[0].number).to.equal(1);
                expect(res.body.success.projects[1].number).to.equal(2);
                expect(res.body.success.projects[2].number).to.equal(3);
                expect(res.body.success.projects[3].number).to.equal(4);
                //store ids of the projects from the retrived projecst
                projectID = res.body.success.projects[0].id;
                projectID2 = res.body.success.projects[1].id;
                draftID = res.body.success.projects[2].id;
                draftID2 = res.body.success.projects[3].id;
                done();
            });
    });
});

//Unit test for getting a singular project, this unit test grabs a draft project
describe('POST /api/projects/getProject', () => {
    it('Should return a successful draft project retrieval reponse', (done) => {
        chai.request(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Draft",
                "projectID": draftID
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_FOUND');
                expect(res.body.success).to.have.property('project');
                expect(res.body.success.project).to.have.property('projectName').to.equal('Temporary Title');
                expect(res.body.success.project).to.have.property('questions');
                done();
            })
    })
});

//Unit test for getting a singular active project, this unit test grabs an active project
describe('POST /api/projects/getProject', () => {
    it('Should return a successful project retrieval reponse', (done) => {
        chai.request(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Active",
                "projectID": projectID2
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_FOUND');
                expect(res.body.success).to.have.property('project');
                expect(res.body.success.project).to.have.property('projectName').to.equal('Bioinformatics Project 2');
                expect(res.body.success.project).to.have.property('questions');
                done();
            })
    })
});

//Update project request, this should update the first active project to have a name of FROGS
describe('PUT /api/projects/updateProject', () => {
    it('should return a successful project update response', (done) => {
        chai.request(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["FROG", "Mathematics", "Biology"],
                        "categories": ["FROG", "Computer Science", "Biology"],
                        "deadline": "01/08/2024",
                        "description": "FROG",
                        "questions": [{
                            "question": "FROG",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        }, {
                            "question": "Write a 3-page paper on why baby shark is the best song ever.",
                            "requirementType": "text",
                            "required": true
                        }]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_UPDATED');
                done();
            });
    });
});
//Archive project request, this should archive the first active project and thus create a new archive project request
describe('PUT /api/projects/archiveProject', () => {
    it('should return a successful project archive response', (done) => {
        chai.request(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID,
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_ARCHIVED');
                done();
            });
    });
});
//A second archive project request, this should create a second archived project in the existing archive project record
describe('PUT /api/projects/archiveProject', () => {
    it('should return a second successful project archive response', (done) => {
        chai.request(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID2,
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_ARCHIVED');
                done();
            });
    });
});
//Delete request for the first draft project
describe('DELETE /api/projects/deleteProject', () => {
    it('should return a successful project deletion response', (done) => {
        chai.request(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": draftID,
                "projectType": "Draft"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_DELETED');
                done();
            });
    });
});
//Delete request for the second draft project
describe('DELETE /api/projects/deleteProject', () => {
    it('should return a second successful project deletion response', (done) => {
        chai.request(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": draftID2,
                "projectType": "Draft"
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_DELETED');
                done();
            });
    });
});
//Get project request test, this also checks that the first archived project's name is FROGS, as it has been updated
describe('GET /api/projects/getProjects', () => {
    after(async () => {
        let user = await User.findOne({ email: randomEmail });
        archiveRecordID = user.userType.FacultyProjects.Archived;
    });

    it('should return a successful project retrieval response with two archived projects and no draft', (done) => {
        chai.request(server)
            .get('/api/projects/getProjects')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("PROJECTS_FOUND");
                expect(res.body.success.projects[0].projectName).to.equal("FROGS");
                expect(res.body.success.projects[1].number).to.equal(2);
                done();
            });
    });
});

//Ensure that the records created are deleted 
after(async () => {
    try {
        const promises = [
            User.deleteOne({ _id: removeID }),
            Project.deleteOne({ _id: projectRecordID }),
            Project.deleteOne({ _id: draftRecordID }),
            Project.deleteOne({ _id: archiveRecordID })
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});
