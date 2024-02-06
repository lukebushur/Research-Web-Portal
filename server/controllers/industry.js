const jwt = require('jsonwebtoken');
const User = require('../models/user');
const IndustryData = require('../models/industryData');
const { jobSchema } = require('../helpers/inputValidation/validation');
const generateRes = require('../helpers/generateJSON');

// Get all the jobs associated with an industry user.
const getJobs = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await User.findOne({ email: decodeAccessToken.email });

        //check if user type is industry
        if (user.userType.Type != process.env.INDUSTRY) {
            return res.status(400).json(generateRes(false, 400, 'BAD_REQUEST', {}));
        }

        const industryData = await IndustryData.findById(user.userType.industryData);
        if (!industryData) {
            return res.status(404).json(generateRes(false, 404, "INDUSTRY_DATA_NOT_FOUND", {}));
        }

        const jobs = {
            active: industryData.jobs.active.map(job => {
                return {
                    employer: job.employer,
                    title: job.title,
                    isInternship: job.isInternship,
                    isFullTime: job.isFullTime,
                    description: job.description,
                    location: job.location,
                    reqYearsExp: job.reqYearsExp,
                    tags: job.tags,
                    timeCommitment: job.timeCommitment,
                    pay: job.pay,
                    deadline: job.deadline,
                    startDate: job.startDate,
                    endDate: job.endDate,
                    datePosted: job.datePosted,
                };
            }),
            draft: industryData.jobs.draft.map(job => {
                return {
                    employer: job.employer,
                    title: job.title,
                    isInternship: job.isInternship,
                    isFullTime: job.isFullTime,
                    description: job.description,
                    location: job.location,
                    reqYearsExp: job.reqYearsExp,
                    tags: job.tags,
                    timeCommitment: job.timeCommitment,
                    pay: job.pay,
                    deadline: job.deadline,
                    startDate: job.startDate,
                    endDate: job.endDate,
                    datePosted: job.datePosted,
                };
            }),
            archived: industryData.jobs.draft.map(job => {
                return {
                    employer: job.employer,
                    title: job.title,
                    isInternship: job.isInternship,
                    isFullTime: job.isFullTime,
                    description: job.description,
                    location: job.location,
                    reqYearsExp: job.reqYearsExp,
                    tags: job.tags,
                    timeCommitment: job.timeCommitment,
                    pay: job.pay,
                    deadline: job.deadline,
                    startDate: job.startDate,
                    endDate: job.endDate,
                    datePosted: job.datePosted,
                };
            }),
        };

        return res.status(200).json(generateRes(true, 200, "JOBS_FOUND", { jobs: jobs }));
    } catch (error) {
        return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", { error }));
    }

}

// Create a job with the data given in the request payload
const createJob = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        // check if user exists
        const user = await User.findOne({ email: decodeAccessToken.email });

        // check if user type is industry
        if (user.userType.Type != process.env.INDUSTRY) {
            return res.status(400).json(generateRes(false, 400, 'BAD_REQUEST', {}));
        }

        const jobType = req.body.jobType;

        // validate schema
        const { error } = jobSchema.validate(req.body.jobDetails);
        if (error) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", error));
        }
        if (!(jobType === "active" || jobType === "draft")) {
            return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                error: 'jobType is not "active" or "draft"',
            }));
        }

        const industryData = (!user.userType.industryData)
            ? new IndustryData({
                jobs: {
                    active: [],
                    draft: [],
                    archived: [],
                }
            })
            : await IndustryData.findById(user.userType.industryData);

        const newJob = {
            employer: req.body.jobDetails.employer,
            title: req.body.jobDetails.title,
            isInternship: req.body.jobDetails.isInternship,
            isFullTime: req.body.jobDetails.isFullTime,
            description: req.body.jobDetails.description,
            location: req.body.jobDetails.location,
            reqYearsExp: req.body.jobDetails.reqYearsExp,
            tags: req.body.jobDetails.tags,
            timeCommitment: req.body.jobDetails.timeCommitment,
            pay: req.body.jobDetails.pay,
            deadline: req.body.jobDetails.deadline,
            startDate: req.body.jobDetails.startDate,
            endDate: req.body.jobDetails.endDate,
            datePosted: new Date(),
        };

        if (jobType === "active") {
            industryData.jobs.active.push(newJob);
        } else if (jobType === "draft" ) {
            industryData.jobs.draft.push(newJob);
        }

        await industryData.save();

        if (!user.userType.industryData) {
            user.userType.industryData = industryData._id;
            await user.save();
        }

        return res.status(201).json(generateRes(true, 201, "JOB_CREATED", {}));
    } catch (error) {
        return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", { error }));
    }
};

module.exports = {
    getJobs,
    createJob,
};