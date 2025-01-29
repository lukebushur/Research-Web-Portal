import joi from 'joi';
/*  This file contains simple validation for HTTP requests made to the server. It uses the Joi library to ensure that the fields in the 
    request body contain and conform to the requirements. This only validates that the http body has the field and that the fields are 
    within the bounds, i.e. not too long or short. These validators do not ensure that the content is valid, which is performed in the 
    other JS files in the inputValidation directory, such as projectValidation.js. These validators are used in the controllers of their 
    respective routes.
*/

//Validation for faculty registering for an account
const facultyRegisterSchema = joi.object({
    "email": joi.string().min(6).max(254).email().required(),
    "name": joi.string().min(2).max(25).required(),
    "password": joi.string().min(10).max(255).required(),
    "accountType": joi.number().required(),
    "universityLocation": joi.string().min(2).max(86).required(),
    "GPA": joi.number().max(4).min(0),
    "Major": joi.array().items(joi.string()),
});

//Validation for registering for students
const studentRegisterSchema = joi.object({
    "email": joi.string().min(6).max(254).email().required(),
    "name": joi.string().min(2).max(25).required(),
    "password": joi.string().min(10).max(255).required(),
    "accountType": joi.number().required(),
    "GPA": joi.number().max(4).min(0).required(),
    "Major": joi.array().items(joi.string()).required(),
    "universityLocation": joi.string().min(2).max(86).required(),
});

//schema for validating new password for password reseting 
const resetPasswordSchema = joi.string().min(10).max(255).required();
//This schema is used to validate login http bodies
const loginSchema = joi.object({
    "email": joi.string().min(6).max(254).email().required(),
    "password": joi.string().min(10).max(255).required(),
});
//Small schema for validating an individual email
const emailSchema = joi.object({
    "email": joi.string().min(6).max(254).email().required(),
});
//schema for delete project requests
const deleteProjectSchema = joi.object({
    "projectID": joi.string().required().min(24).max(24),
    "projectType": joi.string().required()
});
//This schema validates that the http request to create a active project is valid. It should contain a projectName, array of applicable majors 
//and research category, deadline date, questions object, and description. Optional fields are GPA requirement and position responsbilities
const activeProjectSchema = joi.object({
    "projectName": joi.string().required(),
    "GPA": joi.number(),
    "majors": joi.array().items(joi.string()).required(),
    "categories": joi.array().items(joi.string()).required(),
    "deadline": joi.date().required(),
    "description": joi.string().required(),
    "responsibilities": joi.string(),
    //The below questions array valdiates that the question object conforms to the below specification, where question, requirementType, and required are required fields
    //question : { question: String, requirementType: String, required: Boolean, choices: Array[String], answers: Array[String]}
    "questions": joi.array().items(
        joi.object({
            "question": joi.string().required(),
            "requirementType": joi.string().required(),
            "required": joi.boolean().required(),
            "choices": joi.array().items(joi.string()),
            "answers": joi.array().items(joi.string()),
        })
    ).required(),
    "_id": joi.object(),
    "applications": joi.array(),
});

//This applicationSchema is used to validate both the update application request and create application request
const applicationSchema = joi.object({
    "projectID": joi.string().min(24).max(24),
    "applicationID": joi.string().min(24).max(24),
    "professorEmail": joi.string(),
    "questions": joi.array().items(
        joi.object({
            "question": joi.string().required(),
            "requirementType": joi.string().required(),
            "required": joi.boolean().required(),
            "choices": joi.array().items(joi.string()),
            "answers": joi.array().items(joi.string()),
        })
    ).required(),
});

const adminMajors = joi.object({
    "majors": joi.array().items(joi.string().min(4).max(86)),
    "location": joi.string().min(2).max(86),
});
//This schema validates the request body for the application decision route, ensures that their exists an applicationID, projectID, and decision string
const appDecision = joi.object({
    "projectID": joi.string().required().min(24).max(24),
    "applicationID": joi.string().required().min(24).max(24),
    "decision": joi.string().required()
});
//This validates a http request to modfy a student's account information. 
const studentAccountModification = joi.object({
    "name": joi.string().min(2).max(25),
    "GPA": joi.number().max(4).min(0),
    "Major": joi.array().items(joi.string()),
    "universityLocation": joi.string().min(2).max(86),
});
//This validates a http request to modify a faculty's account information. Will likely be updated to include more fields as necessary
const facultyAccountModification = joi.object({
    "name": joi.string().min(2).max(25),
    "universityLocation": joi.string().min(2).max(86),
});

const jobSchema = joi.object({
    employer: joi.string().required(),
    title: joi.string().required(),
    isInternship: joi.boolean().required(),
    isFullTime: joi.boolean().required(),
    description: joi.string().required(),
    location: joi.string().required(),
    reqYearsExp: joi.number().min(0).required(),
    tags: joi.array().items(joi.string()),
    timeCommitment: joi.string(),
    pay: joi.string(),
    deadline: joi.date().allow(null),
    startDate: joi.date().allow(null),
    endDate: joi.date().allow(null),
    questions: joi.array().items(
        joi.object({
            question: joi.string().required(),
            requirementType: joi.string().required(),
            required: joi.boolean().required(),
            choices: joi.array().items(joi.string()),
        })
    ),
});

// TODO: Industry assessments schema

export {
    studentRegisterSchema,
    facultyRegisterSchema,
    loginSchema,
    emailSchema,
    activeProjectSchema,
    deleteProjectSchema,
    appDecision,
    applicationSchema,
    adminMajors,
    studentAccountModification,
    facultyAccountModification,
    jobSchema,
    resetPasswordSchema,
};