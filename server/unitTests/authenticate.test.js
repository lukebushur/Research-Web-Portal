/*  This testing file addresses success and failure cases for account authentication and authorization, including creating accounts,
    reseting passwords, confirming accounts, changing emails, and loging in.
    Information regarding what each test should achieve can be found in the RTM (Requirement Traceability Matrix) spreadsheet
*/

import { expect, use } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import 'dotenv/config';

import server from '../server.js';
import User from '../models/user.js';
import { generateExpiredToken, generateExpiredRefreshToken, addRefreshToken } from '../controllers/authenticate.js';
import { generateExpiredPasswordToken, generateExpiredEmailToken } from '../controllers/accountManagment.js';

use(chaiHttp);

//These variables are used to store information needed to make successful requests to the server
let email_reset_token, PWD_reset_token, access_token, refresh_token, removeID, emailToken, facultyRemoveID, facultyAccessToken,
    expiredToken, expiredRefreshToken;
//Generate random information for account registration
const randomPass = Math.random().toString(36).substring(0).repeat(2);
const randomName = Math.random().toString(36).substring(2);
const randomEmail = Math.random().toString(36).substring(8) + "@gmail.com";
const changeRandomEmail = Math.random().toString(36).substring(8) + "@gmail.com";
const newPassword = randomPass.substring(2, 9).repeat(2);

//BE-REG-1 : Register unit test to test for student registeration without univeristy location 
describe('BE-REG-1 : POST /api/register', () => {
    it('should return a registration failure response due to lack of university location', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT, "GPA": 2.5,
                "Major": ["Computer Science"],
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal('Invalid university location.');
                done();
            });
    });
});

//BE-REG-2 : Register unit test to test for student registeration with an invalid univeristy location 
describe('BE-REG-2 : POST /api/register', () => {
    it('should return a registration failure response due to an invalid university location', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT, "GPA": 2.5,
                "Major": ["Computer Science"], "universityLocation": "Purdue IS REALLY COOL",
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal('Invalid university location.');
                done();
            });
    });
});

//BE-REG-3 : Register unit test to test for student registeration with a missing GPA field  
describe('BE-REG-3 : POST /api/register', () => {
    it('should return a registration failure response due to a missing GPA field', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT,
                "Major": ["Computer Science"], "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal('Missing student fields.');
                done();
            });
    });
});

//BE-REG-3 : Register unit test to test for student registeration with a missing Major field  
describe('BE-REG-3 : POST /api/register', () => {
    it('should return a registration failure response due to a missing Major field', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName, "GPA": 2.5,
                "password": randomPass, "accountType": process.env.STUDENT,
                "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal('Missing student fields.');
                done();
            });
    });
});

//BE-REG-4 : Register unit test to test for student registeration with GPA that is below 0 
describe('BE-REG-4 : POST /api/register', () => {
    it('should return a registration failure response due to GPA < 0, invalid input', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT, "GPA": -2.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal('GPA out of bounds.');
                done();
            });
    });
});

//BE-REG-4 : Register unit test to test for student registeration with GPA that is above 4 
describe('BE-REG-4 : POST /api/register', () => {
    it('should return a registration failure response due to GPA > 0, invalid input', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT, "GPA": 16.0,
                "Major": ["Computer Science"], "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                expect(res.body.error).to.have.property('details').to.equal('GPA out of bounds.');
                done();
            });
    });
});


//BE-REG-5 : Register unit test to test for student registeration where the majors does not match the majors in the university 
describe('BE-REG-5 : POST /api/register', () => {
    it('should return a registration failure response due to GPA > 0, invalid input', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass, "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Frog Science"], "universityLocation": "Test University"
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

//BE-REG-6 : Register unit test to test for student registeration where the password is too short (less than 10 characters)
describe('BE-REG-6 : POST /api/register', () => {
    it('should return a registration failure response due to password being too short (less than 10).', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": "short", "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
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

//BE-REG-6 : Register unit test to test for student registeration where the password is too long (greater than 255 characters)
describe('BE-REG-6 : POST /api/register', () => {
    it('should return a registration failure response due to password being too long (greater than 255 chars).', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
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


//BE-REG-7 : Register unit test to test for student registeration where the email is invalid, greater than 255 characters
describe('BE-REG-7 : POST /api/register', () => {
    it('should return a registration failure response due to email being too long (greater than 255 chars).', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA@gmail.com", "name": randomName,
                "password": randomPass,
                "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
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

//BE-REG-7 : Register unit test to test for student registeration where the email is invalid (no @ symbol)
describe('BE-REG-7 : POST /api/register', () => {
    it('should return a registration failure response due to email scheme being invalid.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "testgmail.com", "name": randomName,
                "password": randomPass,
                "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
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

//BE-REG-7 : Register unit test to test for student registeration where the email is invalid, less than 6 characters
describe('BE-REG-7 : POST /api/register', () => {
    it('should return a registration failure response due to email being too short (less than 6 chars).', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "a@a.c", "name": randomName,
                "password": randomPass,
                "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
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


//BE-REG-8 : Basic register unit test for students, expects the response to output successful register response
describe('BE-REG-8 : POST /api/register', () => {
    after(async () => {
        expiredRefreshToken = generateExpiredRefreshToken(removeID, randomEmail, randomName);
        const user = await User.findOne({ email: randomEmail });
        emailToken = user.emailToken; //store email token for email confirmation
        expiredToken = generateExpiredToken(removeID, randomEmail, randomName);
        addRefreshToken(user, expiredRefreshToken)
    });

    it('should return a registration success response', (done) => {
        request.execute(server)
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

//BE-REG-09 : Register unit test to test for student registeration where the email already used
describe('BE-REG-9 : POST /api/register', () => {
    it('should return a registration failure response due to email is already in use.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName,
                "password": randomPass,
                "accountType": process.env.STUDENT, "GPA": 3.5,
                "Major": ["Computer Science"], "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('EMAIL_EXISTS');
                done();
            });
    });
});

//BE-REG-10 : Basic register unit test for faculty, expects the response to output successful register response
describe('BE-REG-10 : POST /api/register', () => {
    it('should return a registration success response for the faculty account.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "frog" + randomEmail, "name": randomName, "password": randomPass,
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

                facultyRemoveID = res.body.success.user.id;
                facultyAccessToken = res.body.success.accessToken;
                done();
            });
    });
});

//BE-REG-11 : Unit test for registering with an invalid account type (admin)
describe('BE-REG-11 : POST /api/register', () => {
    it('should return a registration failure response for the admin account (not allowed via http requests).', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "AAxAAA" + randomEmail, "name": randomName, "password": randomPass,
                "accountType": process.env.ADMIN, "universityLocation": "Test University"
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

//BE-REG-12 : Unit test for registering with an email that already exists
describe('BE-REG-12 : POST /api/register', () => {
    it('should return a registration failure for a incorrect account type.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": randomEmail, "name": randomName, "password": randomPass,
                "accountType": process.env.FACULTY, "universityLocation": "Test University"
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('EMAIL_EXISTS');
                done();
            });
    });
});

//BE-REG-12 : Unit test for registering with an invalid account type random number
describe('BE-REG-12 : POST /api/register', () => {
    it('should return a registration failure for a incorrect account type.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "aaaaa" + randomEmail, "name": randomName, "password": randomPass,
                "accountType": -1234567890, "universityLocation": "Test University"
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

//BE-REG-13 : Unit test for registering with a too short name
describe('BE-REG-13 : POST /api/register', () => {
    it('should return a registration failure due to a name being too short.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "aaaaa" +  randomEmail, "name": "a", "password": randomPass,
                "accountType": process.env.FACULTY, "universityLocation": "Test University"
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

//BE-REG-13 : Unit test for registering with a too long name
describe('BE-REG-13 : POST /api/register', () => {
    it('should return a registration failure due to a name being too long.', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                "email": "aaaaa" + randomEmail, "name": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", 
                "password": randomPass, "accountType": process.env.FACULTY, "universityLocation": "Test University"
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

//BE-LOG-1 : Login unit test where the password is not used 
describe('BE-LOG-1 : POST /api/login', () => {
    it('should return an unsuccessful login response when no password is provided.', (done) => {
        request.execute(server)
            .post('/api/login')
            .send({ "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-LOG-2 : Login unit test where the email is not provided
describe('BE-LOG-2 : POST /api/login', () => {
    it('should return an unsuccessful login response when no email is provided.', (done) => {
        request.execute(server)
            .post('/api/login')
            .send({ "password": randomPass })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-LOG-3 : Login unit test where the email is invalid
describe('BE-LOG-3 : POST /api/login', () => {
    it('should return an unsuccessful login response with an invalid email.', (done) => {
        request.execute(server)
            .post('/api/login')
            .send({ "email": "XXX" + randomEmail, "password": randomPass })
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(403);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_EMAIL');
                done();
            });
    });
});

//BE-LOG-4 : Login unit test where the password
describe('BE-LOG-4 : POST /api/login', () => {
    it('should return an unsuccessful login response with an invalid password.', (done) => {
        request.execute(server)
            .post('/api/login')
            .send({ "email": randomEmail, "password": "XXX" + randomPass })
            .end((err, res) => {
                expect(res).to.have.status(403);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(403);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_PASSWORD');
                done();
            });
    });
});


//BE-LOG-5 : Basic login unit test, expects a successful login response
describe('BE-LOG-5 : POST /api/login', () => {
    it('should return a login success response', (done) => {
        request.execute(server)
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

//BE-CE-1 : Unit test for confirming user email with invalid email token
describe('BE-CE-1 : POST /api/confirmEmail', () => {
    it('should return an unsuccessful response due to an invalid email token.', (done) => {
        request.execute(server)
            .post('/api/confirmEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "emailToken": emailToken + "XXX" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_EMAIL_TOKEN');
                done();
            });
    });
});

//BE-CE-2 : Unit test for confirming user email with a different access token then is assigned to the email token
describe('BE-CE-2 : POST /api/confirmEmail', () => {
    it('should return an unsuccessful response due to an invalid email token.', (done) => {
        request.execute(server)
            .post('/api/confirmEmail')
            .set({ "Authorization": `Bearer ${facultyAccessToken}` })
            .send({ "emailToken": emailToken })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_EMAIL_TOKEN');
                done();
            });
    });
});

//BE-CE-3 : Unit test for confirming user email without an access token
describe('BE-CE-3 : POST /api/confirmEmail', () => {
    it('should return an unsuccessful response due to having no access token.', (done) => {
        request.execute(server)
            .post('/api/confirmEmail')
            .send({ "emailToken": emailToken })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('ACCESS_DENIED');
                done();
            });
    });
});


//BE-CE-4 : Unit test for confirming user email, expects a successful email confirm response
describe('BE-CE-4 : POST /api/confirmEmail', () => {
    it('should return a confirmed email response', (done) => {
        request.execute(server)
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

//BE-CE-5 : Unit test for confirming user email that has already been confirmed
describe('BE-CE-5 : POST /api/confirmEmail', () => {
    it('should return an unsuccessful response due to already having confirmed the email.', (done) => {
        request.execute(server)
            .post('/api/confirmEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "emailToken": emailToken })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('EMAIL_ALREADY_CONFIRMED');
                done();
            });
    });
});


//BE-GAI-1 : This unit test gets the account information and also tests for the email confirmation by checking if the emailConfirmed is changed to true
describe('BE-GAI-1 : GET /api/accountManagement/getAccountInfo', () => {
    it('should return a the account information of the new account', (done) => {
        request.execute(server)
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
});

//BE-GAT-1 Unit test for regenerating access token with expired access token, expects a failure response
describe('BE-GAI-1 : POST /api/token', () => {
    it('should return a failure response due to the expired access token', function (done) {
        this.timeout(1000);
        request.execute(server)
            .post('/api/token')
            .set({ "Authorization": `Bearer ${expiredToken}` })
            .send({ "refreshToken": refresh_token })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_ACCESS_TOKEN');
                done();
            });
    });
});

//BE-GAT-2 Unit test for regenerating access token with an invalid refresh token, expects a failure response
describe('BE-GAI-2 : POST /api/token', () => {
    it('should return a failure response due to the invalid refresh token', (done) => {
        request.execute(server)
            .post('/api/token')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "refreshToken": refresh_token + "XXX" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_REFRESH_TOKEN');
                done();
            });
    });
});

//BE-GAT-3 Unit test for regenerating access token with an expired refresh token, expects a failure response
describe('BE-GAI-3 : POST /api/token', () => {
    it('should return a failure response due to the expired refresh token.', (done) => {
        request.execute(server)
            .post('/api/token')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "refreshToken": expiredRefreshToken })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('EXPIRED_REFRESH_TOKEN');
                done();
            });
    });
});

//BE-GAT-4 Unit test for regenerating access token, expects a successful response with new access token
describe('BE-GAI-4 : POST /api/token', () => {
    it('should return a success response and provide new access token', (done) => {
        request.execute(server)
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

//BE-PR-1 : unit test for initiating password reset process but without providing email
describe('BE-PR-1 : POST /api/accountManagement/resetPassword', () => {
    it('should return a failed password reset response due to the lack of email provided', (done) => {
        request.execute(server)
            .post('/api/accountManagement/resetPassword')
            .send()
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('BAD_REQUEST');
                done();
            });
    });
});

//BE-PR-2 : unit test for initiating password reset process but with an invalid email
describe('BE-PR-2 : POST /api/accountManagement/resetPassword', () => {
    it('should return a failed password reset response because of the invalid email', (done) => {
        request.execute(server)
            .post('/api/accountManagement/resetPassword')
            .send({ "email": "bepisgmail.com" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('BAD_REQUEST');
                done();
            });
    });
});

//BE-PR-2 : unit test for initiating password reset process but with an email that is too short
describe('BE-PR-2 : POST /api/accountManagement/resetPassword', () => {
    it('should return a failed password reset response because the email was too short', (done) => {
        request.execute(server)
            .post('/api/accountManagement/resetPassword')
            .send({ "email": "a@a.c" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('BAD_REQUEST');
                done();
            });
    });
});

//BE-PR-2 : unit test for initiating password reset process but with an email that is too long
describe('BE-PR-2 : POST /api/accountManagement/resetPassword', () => {
    it('should return a failed password reset response because the email was too long', (done) => {
        request.execute(server)
            .post('/api/accountManagement/resetPassword')
            .send({ "email": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('BAD_REQUEST');
                done();
            });
    });
});


//BE-PR-3 : unit test for initiating password reset process, should return a successful response 
describe('BE-PR-3 : POST /api/accountManagement/resetPassword', () => {
    after(async () => {
        const user = await User.findOne({ email: randomEmail });
        PWD_reset_token = user.security.passwordReset.token; //store password reset token from database
    });

    it('should return a success response', (done) => {
        request.execute(server)
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

//BE-CPR-1 : Unit test for reseting user password where the token is not provided, it should fail
describe('BE-CPR-1 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        await getNewResetToken();
    });

    it('should return a failed password reset response due to no reset token being provided.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "provisionalPassword": newPassword, "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_PWD_TOKEN');
                done();
            });
    });
});

//BE-CPR-2 : Unit test for reseting user password where the password is not provided, it should fail
describe('BE-CPR-2 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        await getNewResetToken();
    });

    it('should return a failed password reset response due to no new reset password being provided.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "passwordResetToken": PWD_reset_token, "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CPR-3 : Unit test for reseting user password where the email is not provided, it should fail
describe('BE-CPR-3 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        await getNewResetToken();
    });

    it('should return a failed password reset response due to no email being provided.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "passwordResetToken": PWD_reset_token, "provisionalPassword": newPassword })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(500);
                expect(res.body.error).to.have.property('message').to.equal('SERVER_ERROR');
                done();
            });
    });
});

//BE-CPR-4 : Unit test for reseting user password where the password is too short, it should fail
describe('BE-CPR-4 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        await getNewResetToken();
    });

    it('should return a failed password reset response due to the password being too short.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "passwordResetToken": PWD_reset_token, "provisionalPassword": "short", "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CPR-4 : Unit test for reseting user password where the password is too long, it should fail
describe('BE-CPR-4 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        PWD_reset_token = await generateExpiredPasswordToken(randomEmail);
    });

    it('should return a failed password reset response due to the password being too long.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({
                "passwordResetToken": PWD_reset_token, "provisionalPassword": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
                "email": randomEmail
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-CPR-5 : Unit test for reseting user password where the reset token is expired
describe('BE-CPR-5 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        await getNewResetToken();
    });

    it('should return a failed password reset response due to the reset token being expired.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({
                "passwordResetToken": PWD_reset_token, "provisionalPassword": newPassword,
                "email": randomEmail
            })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('PWD_TOKEN_EXPIRED');
                done();
            });
    });
});

//BE-CPR-6 : Unit test for reseting user password where the reset token is invalid
describe('BE-CPR-6 : POST /api/accountManagement/confirmResetPassword', () => {
    it('should return a failed password reset response due to the reset token being invalid.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "passwordResetToken": PWD_reset_token + "test", "provisionalPassword": newPassword, "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_PWD_TOKEN');
                done();
            });
    });
});

//BE-CPR-7 : Unit test for reseting user password where the reset token has been set to null in the previous request
describe('BE-CPR-7 : POST /api/accountManagement/confirmResetPassword', () => {
    after(async () => {
        await getNewResetToken();
    });

    it('should return a failed password reset response due to the reset token being reset in the previous request.', (done) => {
        request.execute(server)
            .post('/api/accountManagement/confirmResetPassword')
            .send({ "passwordResetToken": PWD_reset_token, "provisionalPassword": newPassword, "email": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_PWD_TOKEN');
                done();
            });
    });
});

//BE-CPR-8 : Unit test for reseting user password, uses the previous password reset token. Expects a successfully reset password
describe('BE-CPR-8 : POST /api/accountManagement/confirmResetPassword', () => {
    it('should return a successful reset password response', (done) => {
        request.execute(server)
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

//BE-CPR-9 : login unit test to ensure that the password was successfully reset
describe('BE-CPR-9 : POST /api/login', () => {
    it('should return a login success response', (done) => {
        request.execute(server)
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

//BE-RE-1 : Unit test for initiating the email change process without an access token, expects a failure response
describe('BE-RE-1 : POST /api/accountManagement/changeEmail', () => {
    it('should return a failure response due to no access token', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmail')
            .send({ "provisionalEmail": changeRandomEmail })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('ACCESS_DENIED');
                done();
            });
    });
});

//BE-RE-2 : Unit test for initiating the email change process without an email, expects a failure response
describe('BE-RE-2 : POST /api/accountManagement/changeEmail', () => {
    it('should cause a failure response due to no provided email', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-RE-3 : Unit test for initiating the email change process with an too short email, expects a failure response
describe('BE-RE-3 : POST /api/accountManagement/changeEmail', () => {
    it('should return a failure response due to email being too short', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "provisionalEmail": "a@a.c" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-RE-3 : Unit test for initiating the email change process with an too long email, expects a failure response
describe('BE-RE-3 : POST /api/accountManagement/changeEmail', () => {
    it('should return a failure change email response due to email being too long', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "provisionalEmail": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-RE-3 : Unit test for initiating the email change process with an invalid email
describe('BE-RE-3 : POST /api/accountManagement/changeEmail', () => {
    it('should return a failure change email response due to and invalid email', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "provisionalEmail": "bingusgmail.com" })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('INPUT_ERROR');
                done();
            });
    });
});

//BE-RE-4 : Unit test for initiating the email change process, expects a successful response
describe('BE-RE-4 : POST /api/accountManagement/changeEmail', () => {
    after(async () => {
        const user = await User.findOne({ email: randomEmail });
        email_reset_token = user.security.changeEmail.token; //stores the email reset token
    });

    it('should return a successful changeEmail response', (done) => {
        request.execute(server)
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

//BE-RE-5 : Unit test for initiating the email change process with an email that already exists
describe('BE-RE-5 : POST /api/accountManagement/changeEmail', () => {
    it('should return a failure change email response due to email already existing', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmail')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "provisionalEmail": randomEmail })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(400);
                expect(res.body.error).to.have.property('message').to.equal('EMAIL_EXISTS');
                done();
            });
    });
});

//BE-CEC-1 : Unit test for confirming the email change without email token, should fail
describe('BE-CEC-1 : POST /api/accountManagement/changeEmailConfirm', () => {
    after(async () => {
        email_reset_token = await generateExpiredEmailToken(randomEmail, changeRandomEmail);
    });

    it('should return a failed confirmed change email response due to no email token', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmailConfirm')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({})
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_EMAIL_TOKEN');
                done();
            });
    });
});

//BE-CEC-2 : Unit test for confirming the email change with an expired email token
describe('BE-CEC-2 : POST /api/accountManagement/changeEmailConfirm', () => {
    after(async () => {
        await getNewEmailToken();
    });

    it('should return a failed confirmed change email response due to expired email token', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmailConfirm')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "changeEmailToken": email_reset_token })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('EMAIL_TOKEN_EXPIRED');
                done();
            });
    });
});

//BE-CEC-3 : Unit test for confirming the email change with an invalid email token
describe('BE-CEC-3 : POST /api/accountManagement/changeEmailConfirm', () => {
    it('should return a failed confirmed change email response due to an invalid email token', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmailConfirm')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "changeEmailToken": email_reset_token + "XXX" })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_EMAIL_TOKEN');
                done();
            });
    });
});

//BE-CEC-4 : Unit test for confirming the email change where the email token is not reset
describe('BE-CEC-4 : POST /api/accountManagement/changeEmailConfirm', () => {
    after(async () => {
        await getNewEmailToken();
    });

    it('should return a failed confirmed change email response due to email token not being reset', (done) => {
        request.execute(server)
            .post('/api/accountManagement/changeEmailConfirm')
            .set({ "Authorization": `Bearer ${access_token}` })
            .send({ "changeEmailToken": email_reset_token })
            .end((err, res) => {
                expect(res).to.have.status(401);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(401);
                expect(res.body.error).to.have.property('message').to.equal('INVALID_EMAIL_TOKEN');
                done();
            });
    });
});

//BE-CEC-5 : Unit test for confirming the email change, uses the email reset token and should return a success response
describe('BE-CEC-5 : POST /api/accountManagement/changeEmailConfirm', () => {
    it('should return a successful confirmed change email response', (done) => {
        request.execute(server)
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
        const promises = [
            User.deleteOne({ _id: removeID }),
            User.deleteOne({ _id: facultyRemoveID })
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});

//method to generate a new reset token because the reset token should be set to null after each failed attempt at reseting
const getNewResetToken = async () => {
    await request.execute(server)
        .post('/api/accountManagement/resetPassword')
        .send({ "email": randomEmail })

    const user = await User.findOne({ email: randomEmail });
    PWD_reset_token = user.security.passwordReset.token; //store password reset token from database
}

//method to generate a new reset token because the reset token should be set to null after each failed attempt at reseting
const getNewEmailToken = async () => {
    await request.execute(server)
        .post('/api/accountManagement/changeEmail')
        .set({ "Authorization": `Bearer ${access_token}` })
        .send({ "provisionalEmail": changeRandomEmail })

    const user = await User.findOne({ email: randomEmail });
    email_reset_token = user.security.changeEmail.token; //stores the email reset token
}