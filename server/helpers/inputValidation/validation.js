const Joi = require('joi');

const registerSchema = Joi.object({
    "email": Joi.string().min(6).max(254).email().required(),
    "name": Joi.string().min(2).max(25).required(),
    "password": Joi.string().min(10).max(255).required(),
    "accountType": Joi.number().required(),
    "GPA": Joi.number().max(4).min(0),
    "Major": Joi.array().items(Joi.string()),
    "universityLocation": Joi.string().min(2).max(86),
});

const loginSchema = Joi.object({
    "email": Joi.string().min(6).max(254).email().required(),
    "password": Joi.string().min(10).max(255).required(),
});

const emailSchema = Joi.object({
    "email": Joi.string().min(6).max(254).email().required(),
});

const deleteProjectSchema = Joi.object({
    "projectID": Joi.string().required().min(24).max(24),
    "projectType": Joi.string().required()
});
//This schema validates that the http request to create a project is valid. It should contain a projectName, array of applicable majors 
//and research category, deadline date, questions object, and description. Optional fields are GPA requirement and position responsbilities
const projectSchema = Joi.object({
    "projectName": Joi.string().required(),
    "GPA": Joi.number(),
    "majors": Joi.array().items(Joi.string()).required(),
    "categories": Joi.array().items(Joi.string()).required(),
    "deadline": Joi.date().required(),
    "description": Joi.string().required(),
    "responsibilities": Joi.string(),
    //The below questions array valdiates that the question object conforms to the below specification, where question, requirementType, and required are required fields
    //question : { question: String, requirementType: String, required: Boolean, choices: Array[String], answers: Array[String]}
    "questions": Joi.array().items(
        Joi.object({
            "question": Joi.string().required(),
            "requirementType": Joi.string().required(),
            "required": Joi.boolean().required(),
            "choices": Joi.array().items(Joi.string()),
            "answers": Joi.array().items(Joi.string()),
        })
    ).required(),
});
//This applicationSchema is used to validate both the update application request and create application request
const applicationSchema = Joi.object({
    "projectID": Joi.string().min(24).max(24),
    "applicationID": Joi.string().min(24).max(24),
    "professorEmail": Joi.string(),
    "questions": Joi.array().items(
        Joi.object({
            "question": Joi.string().required(),
            "requirementType": Joi.string().required(),
            "required": Joi.boolean().required(),
            "choices": Joi.array().items(Joi.string()),
            "answers": Joi.array().items(Joi.string()),
        })
    ).required(),
});

const adminMajors = Joi.object({
    "majors": Joi.array().items(Joi.string().min(4).max(86)),
});

const appDecision = Joi.object({
    "projectID": Joi.string().required().min(24).max(24),
    "applicationID": Joi.string().required().min(24).max(24),
    "decision": Joi.string().required()
});

const jobSchema = Joi.object({
    employer: Joi.string().required(),
    title: Joi.string().required(),
    isInternship: Joi.boolean().required(),
    isFullTime: Joi.boolean().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    reqYearsExp: Joi.number().min(0).required(),
    tags: Joi.array().items(Joi.string()),
    timeCommitment: Joi.string(),
    pay: Joi.string(),
    deadline: Joi.date(),
    startDate: Joi.date(),
    endDate: Joi.date(),
});

module.exports = {
    registerSchema, loginSchema,
    emailSchema, projectSchema,
    deleteProjectSchema, appDecision,
    applicationSchema, adminMajors,
    jobSchema,
};