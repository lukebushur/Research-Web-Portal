import { expect, use } from 'chai';
import { default as chaiHttp, request } from 'chai-http';
import Chance from 'chance';
import 'dotenv/config';

import server from '../server.js';
import User from '../models/user.js';
import IndustryData from '../models/industryData.js';
import { unitTestVerify } from '../controllers/authenticate.js';

use(chaiHttp);
const chance = new Chance();

//variables for unit testing, to ensure future requests succeed
let industry_access_token; //access token for industry account
let industryRecordID; //id of the industry account
let industryDataRecordID; // id of the industry data associated with the user
let industryDataActiveJobRecordID; // id of the created job

//randomly generated password, name, email, and job details
const randomPass = Math.random().toString(36).substring(0).repeat(2);
const randomName = chance.name();
const randomEmail = chance.email();
const randomJobDetails = {
    employer: chance.company(),
    title: chance.profession(),
    isInternship: chance.bool(),
    isFullTime: chance.bool(),
    description: chance.paragraph(),
    location: chance.address(),
    reqYearsExp: chance.integer({ min: 0, max: 20 }),
    tags: [
        chance.word(),
        chance.word(),
        chance.word(),
    ],
    timeCommitment: chance.integer({ min: 0, max: 80 }) + 'hrs/week',
    pay: chance.dollar() + '/hr',
    deadline: chance.date({ year: 2024, month: 1 }),
    startDate: chance.date({ year: 2024, month: 2 }),
    endDate: chance.date({ year: 2025 }),
};

//Basic register request for the industry user, should return a success response
describe('POST /api/register', () => {
    after(async () => {
        const Promises = [
            User.findOne({ email: randomEmail }),
        ]
        let emailtokens = [];
        const values = await Promise.all(Promises);
        values.forEach(user => {
            emailtokens.push(user.emailToken);
        });

        const verifyPromises = [
            unitTestVerify(industry_access_token, emailtokens[0]),
        ]
        await Promise.all(verifyPromises);
    });

    
    it('should return a registration success response', (done) => {
        request.execute(server)
            .post('/api/register')
            .send({
                email: randomEmail,
                name: randomName,
                password: randomPass,
                accountType: process.env.INDUSTRY,
                universityLocation: "Purdue University Fort Wayne"
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
                //Store access token and the id of the industry user
                industry_access_token = res.body.success.accessToken;
                industryRecordID = res.body.success.user.id;
                done();
            });
    });
});

describe('GET /api/industry/getJobs with no jobs', () => {
    it('should return an INDUSTRY_DATA_NOT_FOUND error response', (done) => {
        request.execute(server)
            .get('/api/industry/getJobs')
            .set({ "Authorization": `Bearer ${industry_access_token}` })
            .end((err, res) => {
                expect(res).to.have.status(404);
                expect(res.body).to.have.property('error');
                expect(res.body.error).to.have.property('status').to.equal(404);
                expect(res.body.error).to.have.property('message')
                    .to.equal('INDUSTRY_DATA_NOT_FOUND');
                done();
            });
    });
});

describe('POST /api/industry/createJob', () => {
    it('should return a job successfully created response', (done) => {
        request.execute(server)
            .post('/api/industry/createJob')
            .set({ "Authorization": `Bearer ${industry_access_token}` })
            .send({
                jobType: 'active',
                jobDetails: randomJobDetails,
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(201);
                expect(res.body.success).to.have.property('message')
                    .to.equal('JOB_CREATED');
                done();
            });
    });

    after(async () => {
        // store the id of the newly-created industryData record
        const industryUser = await User.findById(industryRecordID);
        industryDataRecordID = industryUser.userType.industryData;
    });
});

describe('GET /api/industry/getJobs with jobs', () => {
    it('should return a jobs successfully found response', (done) => {
        request.execute(server)
            .get('/api/industry/getJobs')
            .set({ "Authorization": `Bearer ${industry_access_token}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message')
                    .to.equal('JOBS_FOUND');
                expect(res.body.success).to.have.property('jobs');
                expect(res.body.success.jobs).to.have.property('active');
                expect(res.body.success.jobs.active).to.be.an('array').of.length(1);
                expect(res.body.success.jobs.active[0]).to.have.property('title')
                    .to.equal(randomJobDetails.title);
                expect(res.body.success.jobs.active[0]).to.have.property('isInternship')
                    .to.equal(randomJobDetails.isInternship);
                expect(res.body.success.jobs.active[0]).to.have.property('reqYearsExp')
                    .to.equal(randomJobDetails.reqYearsExp);
                expect(res.body.success.jobs.active[0]).to.have.property('tags')
                    .to.be.an('array').of.length(3);
                expect(res.body.success.jobs.active[0]).to.have.property('deadline')
                    .to.equal(randomJobDetails.deadline.toISOString());
                industryDataActiveJobRecordID = res.body.success.jobs.active[0]._id;
                expect(res.body.success.jobs).to.have.property('draft');
                expect(res.body.success.jobs.draft).to.be.an('array').of.length(0);
                expect(res.body.success.jobs).to.have.property('archived');
                expect(res.body.success.jobs.archived).to.be.an('array').of.length(0);
                done();
            });
    });
});

describe('DELETE /api/industry/deleteJob', () => {
    it('should return a job successfully deleted response', (done) => {
        request.execute(server)
            .delete(`/api/industry/deleteJob/${industryDataActiveJobRecordID}`)
            .set({ "Authorization": `Bearer ${industry_access_token}` })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('success');
                expect(res.body.success).to.have.property('status').to.equal(200);
                expect(res.body.success).to.have.property('message')
                    .to.equal('JOB_DELETED');
                done();
            });
    });
});

// TODO: unit tests for getJob, editJob, getAssessments, getAssessment,
// createAssessment, editAssessment, and deleteAssessment

//Ensure that the records created are deleted 
after(async () => {
    try {
        const promises = [
            User.deleteOne({ _id: industryRecordID }),
            IndustryData.deleteOne({ _id: industryDataRecordID }),
        ];

        await Promise.all(promises);
    } catch (err) {
        console.error(err);
    }
});
