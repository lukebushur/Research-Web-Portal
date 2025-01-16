import { SchemaType, Schema } from 'mongoose';

/*  This class will be used to store the question information in the database. The data type will be called 
    question, and it will have all the information necessary to record faculty questions for their projects. 

    Here is an example of the expected datatype -> question : { question: String, requirementType: String, required: Boolean, choices: Array[String], answer: Array[String]}
    In this object, the fields are as follows:
    question (String, the actual question being asked by the professor), requirementType (String, the type of question being asked. I.E short response, multiple choice, check boxes, etc.)
    required (Boolean, a boolean that determines if the question is required to be answered for the application), choices (Array[String], an array of the available choices to be chosen by a student assuming its a multipled choice or checkbox question)
    answers(Array[String], this an array of answers to the faculty's project. It should only be filled in the student's record in the DB)

    The question, requirement, and required fields are required to be put into the database while choices and answers are not. This is because the question could be a non-mutiple choice question and the object
    could be storing the question in the faculty project records, where there shouldn't be any answers.
*/

//This const array determiens what requirements are allowed and supported by the front end
const acceptableRequirementTypes = ["text", "check box", "radio button"];

class question extends SchemaType {
    constructor(key, options) {
        super(key, options, 'questions');
    }

    //The below method cast, will ensure that the provided data is validated against the below object schema.
    //question : { question: String, requirementType: String, required: Boolean, choices: Array[String], answers: Array[String]}
    cast(val) {
        let returnVal = {}; //This returnVal is built after each field gets validated, ensuring only the information that matters is stored in the db
        //This ensures that the val is an object, otherwise throws an error
        if (typeof val !== 'object') {
            throw new Error('question: ' + val + ' is not a object. It needs to be an object.');
        }
        //verify that the question object has the required string 'question' field
        if (verifyStringField(val, 'question')) {
            returnVal.question = val.question;
        } else {
            throw new Error('question type is required to have a nonempty .question field of type string. ' + val + ' does not.');
        }
        //verify that the question object has the required string 'requirementType' field
        if (verifyStringField(val, 'requirementType') && verifyRequirements(val['requirementType'])) {
            returnVal.requirementType = val.requirementType;
        } else {
            throw new Error('question type is required to have a nonempty .requirementType field of type string. ' + val + ' does not.');
        }
        //Verify that the question object has the required boolean 'required' field
        if (verifyBooleanField(val, 'required')) {
            returnVal.required = val.required;
        } else {
            throw new Error('question type is required to have a nonempty .required field of type boolean. ' + val + ' does not.');
        }

        let functionResp = verifyArrayField(val, 'choices', 'string'); //check for the choices array of strings
        if (functionResp === false) { //If the verify array function returns false there has been an error
            throw new Error('choices field for question type needs to be an array of strings. ' + val + ' does not.')
        } else if (functionResp === true) { //If it returns true, the value has been verified, otherwise it could reutrn null and should be ignored because the field doesn't exist and is optional
            returnVal.choices = val.choices;
        }

        functionResp = verifyArrayField(val, 'answers', 'string'); //Basically the same as above, check for the answers array of strings
        if (functionResp === false) { //If the verify array function returns false there has been an error
            throw new Error('choices field for question type needs to be an array of strings. ' + val + ' does not.')
        } else if (functionResp === true) { //If it returns true, the value has been verified, otherwise it could reutrn null and should be ignored because the field doesn't exist and is optional
            returnVal.answers = val.answers;
        }

        return returnVal;
    }
}

Schema.Types.question = question;


// HELPER METHODs BELOW
/*  This helper method ensures that a field in an object is a string and is nonempty
    It returns true if there exists a field that is a string and nonempty, and false otherwise
*/
function verifyStringField(value, fieldName) {
    //This checks first that the value has a question field, then that its question field is a string
    if (!Object.hasOwn(value, fieldName) || typeof value[fieldName] !== 'string') {
        return false;
    } else if (value[fieldName].trim() === '') { //Then checks if the field value is empty
        return false;
    } else {
        return true;
    }
}

//This function ensures the requirements provided match the array above
function verifyRequirements(value) {
    if (!acceptableRequirementTypes.includes(value)) { return false; }
    return true;
}

/*  This helper method ensures that a field in an object is a boolean and not null, it is necessary to have seperate method for each necessary datatype 
    as they cannot all be encapsuled into a single shared method unless that method is long and complicated
    This function returns true if there exists a non-null boolean, and false otherwise
*/
function verifyBooleanField(value, fieldName) {
    //Check if the value has a field of the fieldname and that it is a boolean type otherwise return false
    if (!Object.hasOwn(value, fieldName) || typeof value[fieldName] !== 'boolean') {
        return false;
    } else if (value[fieldName] === null) { //Then checks if the field value is null
        return false;
    } else {
        return true;
    }
}

/*  This helper method ensures that a field in an object is an array and that the values in the array all are the same type. This is a design choice 
    as it will help ensure that fields such as choices, and answers don't contain mixed types
    This method return null if there does not exist an array at the specified field in the object, true if the field is an array consisting of only 
    the specified type, and false otherwise.

    This function is more conceptually complicated than the other verify methods, this is because it will be used to ensure that the optional arrays 
    in the question object either don't exist (return null) or exist with all of the same type (return true). Otherwise it returns false.

    This method takes 3 parameters: value, the object being examined | fieldName, the name of the field being examined | arrayType, the type that should be in the array
*/
function verifyArrayField(value, fieldName, arrayType) {
    //Check that the field exists otherwise return null
    if (!Object.hasOwn(value, fieldName)) {
        return null;
    } else if (!Array.isArray(value[fieldName])) { //Check if the value is an array, otherwise return false
        return false
    } else if (Array.isArray(value[fieldName])) {
        let returnBool = true; //boolean to track if the array has a value that is not the same as the specified string arrayType parameter
        value[fieldName].forEach(element => { //For each element in the array, if any of them are not the specified array type then set returnBool to false and return from the inner function
            if (typeof element !== arrayType) {
                returnBool = false;
                return;
            }
        });
        return returnBool; //this will either return true if the values were the same as arrayType or false otherwise
    }
}

export default question;