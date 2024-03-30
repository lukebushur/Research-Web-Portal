const Joi = require('joi');
/*  This file contains simple validation for HTTP requests made to the server. It uses the Joi library to ensure that the fields in the 
    request body contain and conform to the requirements. This only validates that the http body has the field and that the fields are 
    within the bounds, i.e. not too long or short. These validators do not ensure that the content is valid, which is performed in the 
    other JS files in the inputValidation directory, such as projectValidation.js. These validators are used in the controllers of their 
    respective routes.
*/

//This schema is used to validate register http bodies
const facultyRegisterSchema = Joi.object({
    "email": Joi.string().min(6).max(254).email().required(),
    "name": Joi.string().min(2).max(25).required(),
    "password": Joi.string().min(10).max(255).required(),
    "accountType": Joi.number().required(),
    "universityLocation": Joi.string().min(2).max(86).required(),
    "GPA": Joi.number().max(4).min(0),
    "Major": Joi.array().items(Joi.string()),
});

const studentRegisterSchema = Joi.object({
    "email": Joi.string().min(6).max(254).email().required(),
    "name": Joi.string().min(2).max(25).required(),
    "password": Joi.string().min(10).max(255).required(),
    "accountType": Joi.number().required(),
    "GPA": Joi.number().max(4).min(0).required(),
    "Major": Joi.array().items(Joi.string()).required(),
    "universityLocation": Joi.string().min(2).max(86).required(),
});

//schema for validating new password for password reseting 
const resetPasswordSchema = Joi.string().min(10).max(255).required();
//This schema is used to validate login http bodies
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
//This schema validates that the http request to create a active project is valid. It should contain a projectName, array of applicable majors 
//and research category, deadline date, questions object, and description. Optional fields are GPA requirement and position responsbilities
const activeProjectSchema = Joi.object({
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
    "_id": Joi.object(),
    "applications": Joi.array(),
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
    "location": Joi.string().min(2).max(86),
});
//This schema validates the request body for the application decision route, ensures that their exists an applicationID, projectID, and decision string
const appDecision = Joi.object({
    "projectID": Joi.string().required().min(24).max(24),
    "applicationID": Joi.string().required().min(24).max(24),
    "decision": Joi.string().required()
});
//This validates a http request to modfy a student's account information. 
const studentAccountModification = Joi.object({
    "name": Joi.string().min(2).max(25),
    "GPA": Joi.number().max(4).min(0),
    "Major": Joi.array().items(Joi.string()),
    "universityLocation": Joi.string().min(2).max(86),
});
//This validates a http request to modify a faculty's account information. Will likely be updated to include more fields as necessary
const facultyAccountModification = Joi.object({
    "name": Joi.string().min(2).max(25),
    "universityLocation": Joi.string().min(2).max(86),
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
    deadline: Joi.date().allow(null),
    startDate: Joi.date().allow(null),
    endDate: Joi.date().allow(null),
    questions: Joi.array().items(
        Joi.object({
            question: Joi.string().required(),
            requirementType: Joi.string().required(),
            required: Joi.boolean().required(),
            choices: Joi.array().items(Joi.string()),
        })
    ),
});

// TODO: Industry assessments schema

module.exports = {
    studentRegisterSchema, facultyRegisterSchema, loginSchema,
    emailSchema, activeProjectSchema,
    deleteProjectSchema, appDecision,
    applicationSchema, adminMajors,
    studentAccountModification, facultyAccountModification,
    jobSchema, resetPasswordSchema
}