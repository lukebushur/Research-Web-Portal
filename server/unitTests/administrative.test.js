/*  This testing file addresses success and failure cases for administrative routes, which currently are only are for defining what 
    majors each university location allows students and faculty to choose.
    Information regarding what each test should achieve can be found in the RTM (Requirement Traceability Matrix) spreadsheet
*/

import { expect, use } from 'chai';
import { default as chaiHttp, request} from 'chai-http';

import server from '../server.js';
import User from '../models/user.js';
import Majors from '../models/majors.js';

use(chaiHttp);

//variables for unit testing, to ensure future requests succeed
let adminRecordID, //id of the admin account
    majorsLocation, //name of the university with the associated user major
    admin_access_token; //access token of admin

//Basic register request for the faculty, should return a success response
describe('POST /api/login', () => {
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: process.env.TEST_ADMIN_EMAIL });
        majorsLocation = user.universityLocation;
    });

    it('should return a login success response', (done) => {
        request.execute(server)
            .post('/api/login')
            .send({
                "email": process.env.TEST_ADMIN_EMAIL, "password": process.env.TEST_ADMIN_PASS,
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('LOGIN_SUCCESS');

                expect(res.body.success).to.have.property('accessToken');
                expect(res.body.success).to.have.property('refreshToken');
                //Store access token and the id of the admin
                admin_access_token = res.body.success.accessToken;
                done();
            });
    });
});

//Unit test for adding majors to the major record via the admin routes
describe('POST /api/admin/addMajor', () => {
    it('Should return a successful add major response', (done) => {
        request.execute(server)
            .post('/api/admin/addMajor')
            .set({ "Authorization": `Bearer ${admin_access_token}` })
            .send({
                "majors": ["Computer Science", "BioInformatics", "Music", "Mathematics", "Biology"],
                "location": "Test University"
            })
            .end((end, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('MAJOR_LIST_UPDATED');
                done();
            })
    })
});

//Unit test for getting the available majors
describe('GET /api/getMajors', () => {
    it('Should return a successful majors retrieval response', (done) => {
        request.execute(server)
            .get('/api/getMajors?university=' + majorsLocation)
            .end((end, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('MAJORS_FOUND');
                expect(res.body.success).to.have.property('majors').to.have.length(5);
                done();
            })
    })
});

//Unit test for removing majors 
describe('DELETE /api/admin/deleteMajor', () => {
    it('Should return a successful major deletion response', (done) => {
        request.execute(server)
            .delete('/api/admin/deleteMajor')
            .set({ "Authorization": `Bearer ${admin_access_token}` })
            .send({
                "majors": ["Music"],
                "location": "Test University"
            })
            .end((end, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('MAJORS_REMOVED');
                done();
            })
    })
});

//Unit test for getting the available majors
describe('GET /api/getMajors', () => {
    it('Should return a successful majors retrieval response', (done) => {
        request.execute(server)
            .get('/api/getMajors?university=' + majorsLocation)
            .end((end, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('MAJORS_FOUND');
                expect(res.body.success).to.have.property('majors').to.have.length(4);
                done();
            })
    })
});

//Unit test for replacing majors in the major record via the admin routes
describe('POST /api/admin/replaceMajors', () => {
    it('Should return a successful add major response', (done) => {
        request.execute(server)
            .post('/api/admin/replaceMajors')
            .set({ "Authorization": `Bearer ${admin_access_token}` })
            .send({
                "majors": ["Computer Science", "BioInformatics", "Music", "Mathematics", "Biology", "Frogs", "Business"],
                "location": "Test University"
            })
            .end((end, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('MAJORS_REPLACED');
                done();
            })
    })
});
//This unit test ensures that the replace majors test aboved worked and actually update the database
describe('GET /api/getMajors', () => {
    it('Should return a successful majors retrieval response', (done) => {
        request.execute(server)
            .get('/api/getMajors?university=' + majorsLocation)
            .end((end, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('MAJORS_FOUND');
                expect(res.body.success).to.have.property('majors').to.have.length(7);
                done();
            })
    })
});

//Ensure that the records created are deleted 
after(async () => {
    try {
        const promises = [
            User.deleteOne({ _id: adminRecordID }),
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});
