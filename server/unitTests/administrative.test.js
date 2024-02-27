const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../server.js');
const User = require('../models/user');
const Majors = require('../models/majors.js');

server.unitTest = true;

const expect = chai.expect;
chai.use(chaiHTTP);
//variables for unit testing, to ensure future requests succeed
let adminRecordID, //id of the admin account
    majorsLocation, //name of the university with the associated user major
    admin_access_token; //access token of admin

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
    after(async () => { //grabs the project record ID and draft record ID
        let user = await User.findOne({ email: randomEmail });
        majorsLocation = user.universityLocation;
    });

    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName, "password": randomPass,
                "accountType": process.env.ADMIN, "universityLocation": "Test University"
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
                //Store access token and the id of the admin
                admin_access_token = res.body.success.accessToken;
                adminRecordID = res.body.success.user.id;
                done();
            });
    });
});

//Unit test for adding majors to the major record via the admin routes
describe('POST /api/admin/addMajor', () => {
    it('Should return a successful add major response', (done) => {
        chai.request(server)
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
        chai.request(server)
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
        chai.request(server)
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
        chai.request(server)
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
        chai.request(server)
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
        chai.request(server)
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
