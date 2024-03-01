const chai = require('chai');
const chaiHTTP = require('chai-http');
const server = require('../server.js');
const User = require('../models/user');
require('dotenv').config();

server.unitTest = true;

const expect = chai.expect;
chai.use(chaiHTTP);
//These variables are used to store information needed to make successful requests to the server
let email_reset_token, PWD_reset_token, access_token, refresh_token, removeID, emailToken;
//Generate random information for account registration
const randomPass = Math.random().toString(36).substring(0).repeat(2);
const randomName = Math.random().toString(36).substring(2);
const randomEmail = Math.random().toString(36).substring(8) + "@gmail.com";
const changeRandomEmail = Math.random().toString(36).substring(8) + "@gmail.com";
const newPassword = randomPass.substring(2, 9).repeat(2);

before(function (done) { //This waits for the connection to the DB to be set up before running the tests
    setTimeout(done, 4000);
});

//Basic register unit test, expects the response to output successful register response
describe('POST /api/register', () => {
    after(async () => {
        const user = await User.findOne({ email: randomEmail });
        emailToken = user.emailToken; //store email token for email confirmation
    });

    it('should return a registration success response', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
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

                access_token = res.body.success.accessToken;
                refresh_token = res.body.success.refreshToken;
                removeID = res.body.success.user.id;
                done();
            });
    });
});
//Basic login unit test, expects a successful login response
describe('POST /api/login', () => {
    it('should return a login success response', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({ "email": randomEmail, "password": randomPass })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('LOGIN_SUCCESS');

                expect(res.body.success).to.have.property('accessToken');
                expect(res.body.success).to.have.property('refreshToken');

                access_token = res.body.success.accessToken; //Store access and refresh tokens
                refresh_token = res.body.success.refreshToken;
                done();
            });
    });
});
//Unit test for confirming user email, expects a successful email confirm response
describe('POST /api/confirmEmail', () => {
    it('should return a confirmed email response', (done) => {
        chai.request(server)
            .post('/api/confirmEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "emailToken": emailToken })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('EMAIL_CONFIRMED');
                done();
            });
    });
});
//This unit test gets the account information and also tests for the email confirmation by checking if the emailConfirmed is changed to true
describe('GET /api/accountManagement/getAccountInfo', () => {
    it('should return a the account information of the new account', (done) => {
        chai.request(server)
            .get('/api/accountManagement/getAccountInfo')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send()
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('ACCOUNT_FOUND');
                expect(res.body.success).to.have.property('accountData');
                expect(res.body.success.accountData).to.have.property('name').to.equal(randomName);
                expect(res.body.success.accountData).to.have.property('email').to.equal(randomEmail);
                expect(res.body.success.accountData).to.have.property('universityLocation').to.equal('Test University');
                expect(res.body.success.accountData).to.have.property('emailConfirmed').to.equal(true);
                expect(res.body.success.accountData.Major[0]).to.equal("Computer Science");
                expect(res.body.success.accountData).to.have.property('GPA').to.equal(2.5);
                done();
            })
    })
})
//Unit test for regenerating access token, expects a successful response with new access token
describe('POST /api/token', () => {
    it('should return a success response and provide new access token', (done) => {
        chai.request(server)
            .post('/api/token')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "refreshToken": refresh_token })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('ACCESS_TOKEN_GENERATED');

                expect(res.body.success).to.have.property('accessToken');

                access_token = res.body.success.accessToken; //store new access token
                done();
            });
    });
});

//unit test for initiating password reset process, should return a successful response 
describe('POST /api/accountManagement/resetPassword', () => {
    after(async () => {
        const user = await User.findOne({ email: randomEmail });
        PWD_reset_token = user.security.passwordReset.token; //store password reset token from database
    });

    it('should return a success response', (done) => {
        chai.request(server)
            .post('/api/accountManagement/resetPassword')
            .send({ "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PWD_RESET_EMAIL_SENT');
                done();
            });
    });
});
//Unit test for reseting user password, uses the previous password reset token. Expects a successfully reset password
describe('POST /api/accountManagement/confirmResetPassword', () => {
    it('should return a successful reset password response', (done) => {
        chai.request(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "passwordResetToken": PWD_reset_token, "provisionalPassword": newPassword, "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('PWD_RESET_SUCCESS');
                done();
            });
    });
});
//login unit test to ensure that the password was successfully reset
describe('POST /api/login', () => {
    it('should return a login success response', (done) => {
        chai.request(server)
            .post('/api/login')
            .send({ "email": randomEmail, "password": newPassword })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('LOGIN_SUCCESS');

                expect(res.body.success).to.have.property('accessToken');
                expect(res.body.success).to.have.property('refreshToken');

                access_token = res.body.success.accessToken; //Store access and refresh tokens
                refresh_token = res.body.success.refreshToken;
                done();
            });
    });
});
//Unit test for initiating the email change process, expects a successful response
describe('POST /api/accountManagement/changeEmail', () => {
    after(async () => {
        const user = await User.findOne({ email: randomEmail });
        email_reset_token = user.security.changeEmail.token; //stores the email reset token
    });

    it('should return a successful changeEmail response', (done) => {
        chai.request(server)
            .post('/api/accountManagement/changeEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "provisionalEmail": changeRandomEmail })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('CHANGE_EMAIL_SENT');
                done();
            });
    });
});
//Unit test for confirming the email change, uses the email reset token and should return a success response
describe('POST /api/accountManagement/changeEmailConfirm', () => {
    it('should return a successful confirmed change email response', (done) => {
        chai.request(server)
            .post('/api/accountManagement/changeEmailConfirm')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "changeEmailToken": email_reset_token })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message').to.equal('EMAIL_RESET_SUCCESS');
                done();
            });
    });
});

//This should delete all created records from the database
after(async () => {
    try {
        await User.deleteOne({ _id: removeID });
    } catch (err) {
        console.error(err);
    }
});
