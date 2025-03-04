/*  This testing file addresses success and failure cases for creating, accessing, modifying, and deleting projects.
    Information regarding what each test should achieve can be found in the RTM (Requirement Traceability Matrix) spreadsheet
*/

import { expect, use } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import 'dotenv/config';

import server from '../server.js';
import User from '../models/user.js';
import Project from '../models/project.js';
import Majors from '../models/majors.js';
import { unitTestVerify } from '../controllers/authenticate.js';

use(chaiHttp);

//variables for unit testing, to ensure future requests succeed
let projectID, //id of the first active project
    projectID2, //id of the second active project
    access_token, //access token to authorize requests
    removeID, //user id, so that it can be removed after the tests
    draftID, //id of the first draft project
    draftID2, //id of the second draft project
    projectRecordID, //id of the record of the active projects
    draftRecordID, //id of the record of the draft projects
    archiveRecordID, //id of the record of the archived projects
    archiveID,
    student_removeID, //id of the student user to be removed
    student_access_token; //access token of the token to be used to ensure the routes cannot be used by a student user

//randomly generated password, name, and email
const randomPass = Math.random().toString(36).substring(0).repeat(2);
const randomName = Math.random().toString(36).substring(2);
const randomEmail = Math.random().toString(36).substring(8) + "@gmail.com";

//BE-REG-10 : Basic register request, should return a success response
describe('BE-REG-10 :  POST /api/register', () => {
    it('should return a registration success response', (done) => {
        request.execute(server)
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
                //Store access token and the id of the user
                access_token = res.body.success.accessToken;
                removeID = res.body.success.user.id;
                done();
            });
    });
});

//BE-REG-8 : Basic register unit test for students, expects the response to output successful register response
describe('BE-REG-8 : POST /api/register', () => {
    after(async () => {
        const Promises = [
            User.findOne({ email: randomEmail }),
            User.findOne({ email: "AXAXXA" + randomEmail}),
        ]
        let emailtokens = [];
        const values = await Promise.all(Promises);
        values.forEach(user => {
            emailtokens.push(user.emailToken);
        });
    
        const verifyPromises = [
            unitTestVerify(access_token, emailtokens[0]),
            unitTestVerify(student_access_token, emailtokens[1]),
        ]
        await Promise.all(verifyPromises);
    });

    it('should return a registration success response', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "AXAXXA" + randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT, "GPA": 2.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
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

                student_access_token = res.body.success.accessToken;
                student_removeID = res.body.success.user.id;
                done();
            });
    });
});

//BE-CAP-1.1 : Project active creation request, this should result in a failure due to no project title
describe('BE-CAP-1.1 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no project title', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
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
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-1.2 : Project active creation request, this should result in a failure due to no majors field
describe('BE-CAP-1.2 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no majors field', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "description": "We will be eating frogs!",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
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

//BE-CAP-1.3 : Project active creation request, this should result in a failure due to no description field
describe('BE-CAP-1.3 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no description field', (done) => {
        request.execute(server)
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
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-1.4 : Project active creation request, this should result in a failure due to no questions field
describe('BE-CAP-1.4 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no questions field', (done) => {
        request.execute(server)
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
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-1.5 : Project active creation request, this should result in a failure due to no deadline field
describe('BE-CAP-1.5 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no deadline field', (done) => {
        request.execute(server)
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
                        "description": "We will be eating frogs!",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-2 : Project active creation request, this should result in a failure due to invalid majors
describe('BE-CAP-2 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to invalid majors', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["frog consumption"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal("Provided major do not align with the univeristy's major list.");
                done();
            });
    });
});


//BE-CAP-3.1 : Project active creation request, this should result in a failure due to no question in the question field
describe('BE-CAP-3.1 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no question in the question field', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-3.2 : Project active creation request, this should result in a failure due to no required field in the question
describe('BE-CAP-3.2 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no required field in the question ', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-3.3 : Project active creation request, this should result in a failure due to no requirementType field in the question
describe('BE-CAP-3.3 : POST /api/projects/createProject', () => {
    it('BE-CAP-3.3 : should return a failed create project response due to no requirementType field in the question ', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-3.4 : Project active creation request, this should result in a failure due to invalid requirement type
describe('BE-CAP-3.4 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to an invalid requirementType field in the question', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "failure",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
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

//BE-CAP-3.5 : Project active creation request, this should result in a failure due to invalid data types in the fields
describe('BE-CAP-3.5 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to no requirementType field in the question ', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": 123456789,
                            "requirementType": 14,
                            "required": "true",
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CAP-4 : Project active creation request, this should result in a failure due to invalid project type
describe('BE-CAP-4 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to invalid project type', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "BingusBoi420",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
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

//BE-CAP-5 : Project active creation request with a student access token, this should result in a failure 
describe('BE-CAP-5 : POST /api/projects/createProject', () => {
    it('should return a failed create project response due to a student access token', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "professorEmail": randomEmail,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "Bioinformatics Project",
                        "GPA": 3.0,
                        "majors": ["Computer Science"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "description": "We will be eating frogs!",
                        "deadline": "01/18/2024",
                        "questions": [{
                            "question": "Can you eat frogs?",
                            "requirementType": "radio button",
                            "required": true,
                            "choices": ["Yes, I can eat frogs!", "No, I cannot eat frogs!"]
                        },]
                    }
                }
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

//BE-CAP-6 : Active project creation request, this should result in a success which will create a new active project record
describe('BE-CAP-6 : POST /api/projects/createProject', () => {
    it('should return a successful active project creation response', (done) => {
        request.execute(server)
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
//At this point in the code, there exists one project, which is an active project

//BE-CAP-7 : Second Active project creation request, this should result in a success which will create a new active project record
describe('BE-CAP-7 : POST /api/projects/createProject', () => {
    it('should return a second successful active project creation response', (done) => {
        request.execute(server)
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
//At this point in the code there exists 2 projects, which are active

//BE-CAP-8 : Get projects unit test, expects a successful get projects response with all the previously created projects
describe('BE-CAP-8 : GET /api/projects/getProjects', () => {
    it('should return a successful project retrieval response', (done) => {
        request.execute(server)
            .get('/api/projects/getProjects')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("PROJECTS_FOUND");
                expect(res.body.success.projects).to.have.length(2);
                expect(res.body.success.projects[0].number).to.equal(1);
                expect(res.body.success.projects[1].number).to.equal(2);
                done();
            });
    });
});

//BE-CDP-1 : Create a draft project with student acceess token : should fail
describe('BE-CDP-1 : POST /api/projects/createProject', () => {
    it('should return a failed draft project creation response due to student access token', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${student_access_token}` })
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
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            });
    });
});

//BE-CDP-2 : Draft project creation, this creates a new draft project as well as a new draft projects record
describe('BE-CDP-2 : POST /api/projects/createProject', () => {
    it('should return a successful draft project creation response', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professor": "SEAN",
                "projectType": "Draft",
                "projectDetails": {
                    "project": {
                        "projectName": "new name",
                        "GPA": 3.0,
                        "majors": ["Computer Science", "Mathematics", "Biology"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "description": "empty field",
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
//At this point there is 2 active projects and one draft project

//BE-CDP-3 : A second draft project creation, this creates a new draft project with empty fields
describe('BE-CDP-3 : POST /api/projects/createProject', () => {
    it('should return a second successful draft project creation with empty fields', (done) => {
        request.execute(server)
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
//At this point there are 2 active projects and 2 draft projects

//BE-CDP-4 : Get projects unit test, expects a successful get projects response with all the previously created projects
describe('BE-CDP-4 : GET /api/projects/getProjects', () => {
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: randomEmail });
        draftRecordID = user.userType.FacultyProjects.Draft;
    });

    it('should return a successful project retrieval response', (done) => {
        request.execute(server)
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

//BE-AAP-01 : Archive project request with student access token - should fail
describe('BE-AAP-1 : PUT /api/projects/archiveProject', () => {
    it('should return a failed response due to student access token', (done) => {
        request.execute(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID,
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

//BE-AAP-02 : Archive project request without project id - should fail
describe('BE-AAP-2 : PUT /api/projects/archiveProject', () => {
    it('should return a failed project archive response due to no project id', (done) => {
        request.execute(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            });
    });
});

//BE-AAP-03 : Archive project request invalid project id - should fail
describe('BE-AAP-3 : PUT /api/projects/archiveProject', () => {
    it('should return a failed project archive response due to invalid project id', (done) => {
        request.execute(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": projectID + "XOXO", })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_NOT_FOUND');
                done();
            });
    });
});

//BE-AAP-04 : Archive project request for draft project - should fail
describe('BE-AAP-4 : PUT /api/projects/archiveProject', () => {
    it('should return a failed project archive response due to draft project id (instead of active)', (done) => {
        request.execute(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": draftID })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_NOT_FOUND');
                done();
            });
    });
});

//BE-AAP-5 : Archive project request, this should archive the first active project and thus create a new archive project request
describe('BE-AAP-5 : PUT /api/projects/archiveProject', () => {
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: randomEmail });
        let archivedProjects = await Project.findOne({ _id: user.userType.FacultyProjects.Archived }); 
        archiveID = archivedProjects.projects[0].id;
    });

    it('should return a successful project archive response', (done) => {
        request.execute(server)
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
//At this point in the program, there should be one active project, 2 drafts, and 1 archived

//BE-AAP-06 : Archive project request for an archived project - should fail
describe('BE-AAP-6 : PUT /api/projects/archiveProject', () => {
    it('should return a failed project archive response due to draft project id (instead of active)', (done) => {
        request.execute(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": archiveID })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_NOT_FOUND');
                done();
            });
    });
});

//BE-AAP-7 : A second archive project request, this should create a second archived project in the existing archive project record
describe('BE-AAP-7 : PUT /api/projects/archiveProject', () => {
    after(async () => { //grabs the project record ID and draft record ID
        await User.updateOne({ email: randomEmail }, {$unset: {"userType.FacultyProjects.Active": ""}});
    });

    it('should return a second successful project archive response', (done) => {
        request.execute(server)
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
//At this point in the program, there are 2 draft projects and 2 archived projects, also the active project record has been removed

//BE-AAP-8 : Attempt to archive a project with no active project list
describe('BE-AAP-8 : PUT /api/projects/archiveProject', () => {
    it('should return a failed response due to no active project list', (done) => {
        request.execute(server)
            .put('/api/projects/archiveProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID2,
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_LIST_NOT_FOUND');
                done();
            });
    });
});

//BE-PDP-1 : Attempt to publish a draft with a student access token
describe('BE-PDP-1 : PUT /api/projects/publishDraft', () => {
    it('Should return a failed response due to the student access token', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({ "projectID": draftID })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal("UNAUTHORIZED");
                done();
            })
    });
});

//BE-PDP-2 : Attempt to publish a draft without an id
describe('BE-PDP-2 : PUT /api/projects/publishDraft', () => {
    it('Should return a failed response due to no id', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECT_NOT_FOUND");
                done();
            })
    });
});

//BE-PDP-3 : Attempt to publish a draft without an invalid draft id
describe('BE-PDP-3 : PUT /api/projects/publishDraft', () => {
    it('Should return a failed response due to an invalid draft id', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": draftID + "XXXX" })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECT_NOT_FOUND");
                done();
            })
    });
});

//BE-PDP-4 : Attempt to publish a draft with an archive id
describe('BE-PDP-4 : PUT /api/projects/publishDraft', () => {
    it('Should return a failed response due to an archive id', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": archiveID })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECT_NOT_FOUND");
                done();
            })
    });
});

//BE-PDP-5 : Publish a project with valid data
describe('BE-PDP-5 : PUT /api/projects/publishDraft', () => {
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: randomEmail });
        let activeProjects = await Project.findOne({ _id: user.userType.FacultyProjects.Active }); 
        projectID = activeProjects.projects[0].id;
    });

    it('Should return a successful draft publish response', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": draftID })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("DRAFT_PUBLISHED");
                done();
            })
    });
});
//At this point in the program, there are 2 archived projects, 1 draft, and 1 active

//BE-PDP-6 : Attempt to publish an active project
describe('BE-PDP-6 : PUT /api/projects/publishDraft', () => {
    it('Should return a failed draft publish response due to using an active project id', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": projectID })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECT_NOT_FOUND");
                done();
            })
    });
});

//BE-PDP-7 : Attempt to publish a second active project
describe('BE-PDP-7 : PUT /api/projects/publishDraft', () => {
    after(async () => { //grabs the project record ID and draft record ID
        await User.updateOne({ email: randomEmail }, {$unset: {"userType.FacultyProjects.Draft": ""}});
    });

    it('Should return a successful draft publish response', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": draftID2 })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal("DRAFT_PUBLISHED");
                done();
            })
    });
});
//At this point, there are 2 active projects, 2 archived, and no draft projects or records.

//BE-PDP-8 : Attempt to publish a draft project with no draft record
describe('BE-PDP-8 : PUT /api/projects/publishDraft', () => {
    it('Should return a failed draft publish response due to not have draft project record', (done) => {
        request.execute(server)
            .put('/api/projects/publishDraft')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "projectID": draftID })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal("PROJECTS_NOT_FOUND");
                done();
            })
    });
});

//BE-AAP-9 + BE-PDP-9 : Get projects unit test, expects a successful get projects response with all the previously created projects
describe('GET /api/projects/getProjects', () => {
    after(async () => {
        let user = await User.findOne({ email: randomEmail });
        projectRecordID = user.userType.FacultyProjects.Active;
    });

    it('BE-AAP-9 + BE-PDP-9 : should return a successful project retrieval response', (done) => {
        request.execute(server)
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
                done();
            });
    });
});


//BE-GSP-4 : Unit test for getting a singular project, this unit test grabs an active project
describe('BE-GSP-4 : POST /api/projects/getProject', () => {
    it('Should return a successful active project retrieval reponse', (done) => {
        request.execute(server)
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
                expect(res.body.success.project).to.have.property('projectName').to.equal('Temporary Title');
                expect(res.body.success.project).to.have.property('questions');
                done();
            })
    });
});

//BE-UP-1 : Update project with student access token - should fail
describe('BE-UP-1 : PUT /api/projects/updateProject', () => {
    it('should return a failed project update response due to student access token', (done) => {
        request.execute(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID2,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["Mathematics", "Biology"],
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
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            });
    });
});

//BE-UP-2 : Update project without project id, should fail
describe('BE-UP-2 : PUT /api/projects/updateProject', () => {
    it('should return a failed project update response due to no project id', (done) => {
        request.execute(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["Mathematics", "Biology"],
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
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_NOT_UPDATED');
                done();
            });
    });
});

//BE-UP-3 : Update project without a project type
describe('BE-UP-3 : PUT /api/projects/updateProject', () => {
    it('should return a failed project update response due to no project type', (done) => {
        request.execute(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID2,
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["Mathematics", "Biology"],
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
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            });
    });
});

//BE-UP-4 : Update project with invalid project id
describe('BE-UP-4 : PUT /api/projects/updateProject', () => {
    it('should return a failed project update response due to an invalid project id', (done) => {
        request.execute(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Active",
                "projectID": projectID2 + "AAASDAD",
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["Mathematics", "Biology"],
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
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            });
    });
});

//BE-UP-5 : Update project with no project record
describe('BE-UP-5 : PUT /api/projects/updateProject', () => {
    it('should return a failed project update response due to no project record.', (done) => {
        request.execute(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Draft",
                "projectID": "literally doesn't matter, draft record doesn't exist",
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["Mathematics", "Biology"],
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
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_LIST_NOT_FOUND');
                done();
            });
    });
});

//BE-UP-6 : Update project request, this should update the second active project to have a name of FROGS
describe('BE-UP-6 : PUT /api/projects/updateProject', () => {
    it('should return a successful project update response', (done) => {
        request.execute(server)
            .put('/api/projects/updateProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID2,
                "projectType": "Active",
                "projectDetails": {
                    "project": {
                        "projectName": "FROGS",
                        "GPA": 2.0,
                        "majors": ["Mathematics", "Biology"],
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

//BE-DP-1 : Delete request with a student access token | should fail
describe('BE-DP-1 : DELETE /api/projects/deleteProject', () => {
    it('should fail to delete a project due to student access token', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectID": projectID,
                "projectType": "Active"
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

//BE-DP-2.1 : Delete request without project type, should fail
describe('BE-DP-2.1 : DELETE /api/projects/deleteProject', () => {
    it('should return a failed response due to no project type', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID,
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-DP-2.2 : Delete request without project id
describe('BE-DP-2.2 : DELETE /api/projects/deleteProject', () => {
    it('should return a failed response due to no project id', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Active"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-DP-3.1 : Delete request with invalid project id
describe('BE-DP-3.1 : DELETE /api/projects/deleteProject', () => {
    it('should return a failed response due to the invalid project id', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID + "wrong",
                "projectType": "Active"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-DP-3.2 : Delete request with invalid project type
describe('BE-DP-3.2 : DELETE /api/projects/deleteProject', () => {
    it('should return a failed response due to the invalid project type', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID,
                "projectType": "Invalid"
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

//BE-DP-3.3 : Delete request without the project record
describe('BE-DP-3.3 : DELETE /api/projects/deleteProject', () => {
    it('should return a failed response due to no project record', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID,
                "projectType": "Draft"
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_LIST_NOT_FOUND');
                done();
            });
    });
});

//BE-DP-4 : Delete request for active project
describe('BE-DP-4 : DELETE /api/projects/deleteProject', () => {
    it('should return a successful active project deletion response', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID,
                "projectType": "Active"
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

//BE-GSP-5 : Retrieve a singular archived project
describe('BE-GSP-5 : POST /api/projects/getProject', () => {
    it('Should return a successful archived project retrieval reponse', (done) => {
        request.execute(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Archived",
                "projectID": archiveID
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PROJECT_FOUND');
                expect(res.body.success).to.have.property('project');
                expect(res.body.success.project).to.have.property('projectName').to.equal("Bioinformatics Project");
                expect(res.body.success.project).to.have.property('questions');
                expect(res.body.success.project).to.have.property('description').to.equal("We will be eating frogs!");
                expect(res.body.success.project).to.have.property('deadline').to.equal("Thu Jan 18 2024");
                done();
            })
    });
});

//BE-DP-5 : Delete request for archived project
describe('BE-DP-5 : DELETE /api/projects/deleteProject', () => {
    it('should return a successful archived project deletion response', (done) => {
        request.execute(server)
            .delete('/api/projects/deleteProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": archiveID,
                "projectType": "Archived"
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

//BE-DP-6.1 : Create draft project to be deleted later
describe('BE-DP-6.1 : POST /api/projects/createProject', () => {
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: randomEmail });
        let draftProjects = await Project.findOne({ _id: user.userType.FacultyProjects.Draft });
        draftID = draftProjects.projects[0].id;
    });

    it('should return a successful draft project creation response', (done) => {
        request.execute(server)
            .post('/api/projects/createProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "professor": "SEAN",
                "projectType": "Draft",
                "projectDetails": {
                    "project": {
                        "projectName": "new name",
                        "GPA": 3.0,
                        "majors": ["Computer Science", "Mathematics", "Biology"],
                        "categories": ["Bioinformatics", "Computer Science", "Biology"],
                        "deadline": "01/18/2024",
                        "description": "empty field",
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


//BE-GSP-6 : Unit test for getting a singular project, this unit test grabs a draft project
describe('BE-GSP-6 : POST /api/projects/getProject', () => {
    it('Should return a successful draft project retrieval reponse', (done) => {
        request.execute(server)
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
                expect(res.body.success.project).to.have.property('projectName').to.equal('new name');
                expect(res.body.success.project).to.have.property('questions');
                expect(res.body.success.project).to.have.property('description').to.equal('empty field');
                done();
            })
    });
});


//BE-DP-6.2 : Create draft project to be deleted later
describe('BE-DP-6.2 : DELETE /api/projects/deleteProject', () => {
    it('should return a successful archived project deletion response', (done) => {
        request.execute(server)
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

//BE-UP-7 + BE-DP-7 Get project request test, this also checks that the first archived project's name is FROGS, as it has been updated
describe('BE-UP-7 + BE-DP- GET /api/projects/getProjects', () => {
    after(async () => {
        let user = await User.findOne({ email: randomEmail });
        archiveRecordID = user.userType.FacultyProjects.Archived;
    });

    it('should return a successful project retrieval response with two archived projects and no draft', (done) => {
        request.execute(server)
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

                archiveID = res.body.success.projects[1].id;

                done();
            });
    });
});

//BE-GSP-1 : Retrieve a singular archived project but with a student access token
describe('BE-GSP-5 : POST /api/projects/getProject', () => {
    it('Should return a failed project retrieval response due to a student access token', (done) => {
        request.execute(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${student_access_token}` })
            .send({
                "projectType": "Active",
                "projectID": projectID
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('UNAUTHORIZED');
                done();
            })
    });
});

//BE-GSP-2.1 : Retrieve a singular archived project but without project type
describe('BE-GSP-2.1 : POST /api/projects/getProject', () => {
    it('Should return a failed project retrieval response due no project type', (done) => {
        request.execute(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectID": projectID
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    });
});

//BE-GSP-2.2 : Retrieve a singular archived project but without project id
describe('BE-GSP-2.2 : POST /api/projects/getProject', () => {
    it('Should return a failed project retrieval response due no project id', (done) => {
        request.execute(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Active",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            })
    });
});

//BE-GSP-3.1 : Retrieve a singular archived project but with invalid projectType
describe('BE-GSP-2.1 : POST /api/projects/getProject', () => {
    it('Should return a failed project retrieval response due to a student access token', (done) => {
        request.execute(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "FROGS",
                "projectID": projectID
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            })
    });
});

//BE-GSP-3.2 : Retrieve a singular archived project but with invalid projectID
describe('BE-GSP-3.2 : POST /api/projects/getProject', () => {
    it('Should return a failed project retrieval response due to a student access token', (done) => {
        request.execute(server)
            .post('/api/projects/getProject')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({
                "projectType": "Active",
                "projectID": projectID + "oopsie"
            })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message').to.equal('PROJECT_NOT_FOUND');
                done();
            })
    });
});

//Ensure that the records created are deleted 
after(async () => {
    try {
        const promises = [
            User.deleteOne({ _id: removeID }),
            User.deleteOne({ _id: student_removeID }),
            Project.deleteOne({ _id: projectRecordID }),
            Project.deleteOne({ _id: draftRecordID }),
            Project.deleteOne({ _id: archiveRecordID }),
            Majors.deleteOne({ location: "Test University" })
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});
