import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

import User from '../models/user.js';
import { facultyRegisterSchema, studentRegisterSchema, loginSchema, emailSchema } from '../helpers/inputValidation/requestValidation.js';
import generateRes from '../helpers/generateJSON.js';
import { retrieveOrCacheMajors, retrieveOrCacheUsers } from '../helpers/schemaCaching.js';


/*  This function handles the login funciton, should only be used with a POST request
    This function takes the login credentials and returns an accesstoken and refresh token
    
    The request body requires the following fields : 
    email (String, the email of the account) - password (String, the password of the account)
*/
const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) { //validates the request body, and responds with error if there is an error
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details,
                original: error._original
            }));
            return;
        } else {
            const user = await retrieveOrCacheUsers(req, req.body.email);

            //check that there exists a user with that email, otherwise sends an error response
            if (user) {
                //Check if the password is correct against the hashed password in the db, otherwise sends error response
                const validatePassword = await bcrypt.compare(req.body.password, user.password);

                if (validatePassword) {
                    //Generate Access and refresh tokens
                    const accessToken = generateAccessToken(user.id, user.email, user.name);
                    const refreshToken = generateRefreshToken(user.id, user.email, user.name);

                    if (await addRefreshToken(user, refreshToken)) { //adds refreshtoken to db
                        res.status(200).json(generateRes(true, 200, "LOGIN_SUCCESS", {
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            accountType: user.userType.Type,
                        }));
                        return;
                    } else {
                        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
                        return;
                    }
                } else {
                    res.status(403).json(generateRes(false, 403, "INVALID_PASSWORD", {}));
                    return;
                }
            } else {
                res.status(403).json(generateRes(false, 403, "INVALID_EMAIL", {}));
                return;
            }
        }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

/*  This function handles the account creation, should only be used with a POST request
    This function takes the information required to create an account and creates an account in the database. This function should return an access & 
    refresh token and account information upon success 
    
    The request body requires the following fields : 
    email (String, email of account) - name (String, name of user) - password (String, password for the account) - accountType (The identifier for the account type) 
    Majors (Optional String array for the student's major(s)) - universityLocation (Optinal string for the account's location) - GPA (Optional number, the gpa of the student)
*/
const register = async (req, res) => {
    try {
        let error = {}; //These lines check the accountType provided, and validates it against schemas for the valid account types (student, faculty, industry)
        if (req.body.accountType == process.env.STUDENT) { error = studentRegisterSchema.validate(req.body, { abortEarly: false }); }
        else if (req.body.accountType == process.env.FACULTY) { error = facultyRegisterSchema.validate(req.body, { abortEarly: false }); }
        else if (req.body.accountType == process.env.INDUSTRY) { error = facultyRegisterSchema.validate(req.body, { abortEarly: false }); }
        else if (req.body.accountType == process.env.ADMIN) { error.error = true; } //Admin accounts should only be set up by people with database / developer access
        else { error.error = true; } //otherwise if none of these cases occurred, throw an error
        if (error.error) { //Validates the request body against the registration schema, otherwise sends an error response
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                errors: error.details, original: error._original
            }));
            return;
        } else {
            //hash the user's password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            let userInfo = {
                Type: req.body.accountType,
                Confirmed: false,
            };
            //if the usertype is student, then grab the gpa & majors from the request and store it in the account, needs == because account type is number and env is string
            if (req.body.accountType == process.env.STUDENT) { userInfo["GPA"] = req.body.GPA; userInfo["Major"] = req.body.Major; }

            //create new user instance
            const user = new User({
                email: req.body.email,
                password: hashedPassword,
                name: req.body.name,
                emailConfirmed: false,
                emailToken: uuidv4(),
                universityLocation: req.body.universityLocation,
                security: {
                    tokens: [],
                    passwordReset: {
                        token: null,
                        provisionalPassword: null,
                        expiry: null
                    }
                },
                userType: userInfo,
            });

            //attempt save user
            await user.save();

            //create JWT token
            const access_token = generateAccessToken(user.id, user.email, user.name);

            //create refresh token
            const refreshToken = generateRefreshToken(user.id, user.email, user.name);

            await User.updateOne({ email: user.email }, {
                $push: {
                    'security.tokens': {
                        refreshToken: refreshToken,
                        createdAt: new Date(),
                    },
                },
            });
            //send the confirmation to the user
            await sendEmailConfirmation(user);
            //indicate registeration was successful
            res.status(200).header().json(
                generateRes(true, 200, "REGISTER_SUCCESS", {
                    accessToken: access_token,
                    refreshToken: refreshToken,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        accountType: user.userType.Type,
                    }
                }));
            return;
        }
    } catch (error) {
        let errMessage;

        if (error.keyPattern.email === 1) {
            errMessage = 'EMAIL_EXISTS'
        } else {
            errMessage = err;
        }

        res.status(400).json(generateRes(false, 400, errMessage, {}));
        return;
    }
}

/*  This function handles the access token regeneration, should only be used with a POST request
    This function takes a refreshtoken and should respond with an accesstoken when the refresh token is valid
    
    The request body requires the following fields : 
    refreshtoken (String, the refreshtoken that will be used to validate the request/generate new access token)
*/
const token = async (req, res) => {
    try {
        const refreshToken = req.body.refreshToken;

        try { // Gets the email from the refresh token and validates the refreshtoken against the database
            const decodeRefreshToken = jwt.verify(refreshToken, process.env.SECRET_REFRESH_TOKEN);
            const user = await retrieveOrCacheUsers(req, decodeRefreshToken.email);
            const existingTokens = user.security.tokens;

            //checking if refresh token is in record
            if (existingTokens.some(token => token.refreshToken === refreshToken)) {
                //generate new access token
                const access_token = generateAccessToken(user.id, user.email, user.name);

                res.status(200).header().json(generateRes(true, 200, "ACCESS_TOKEN_GENERATED", {
                    accessToken: access_token
                }));
                return;
            } else {
                res.status(401).json(generateRes(false, 401, "EXPIRED_REFRESH_TOKEN", {}));
                return;
            }
        } catch (error) {
            if (error.expiredAt) {
                res.status(401).json(generateRes(false, 401, "EXPIRED_REFRESH_TOKEN", {}));
                return;
            }
            res.status(401).json(generateRes(false, 401, "INVALID_REFRESH_TOKEN", {}));
            return;
        }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

/*  This function handles the email confirmation, should only be used with a POST request, and requires an accesstoken
    This function takes an email token in the request body and if then attempt to confirm the user's email if the token 
    matches the email token in the database
    
    The request body requires the following fields : 
    emailToken (String, the token that will be used to attempt to validate the email of the account)
*/ 
const confirmEmailToken = async (req, res) => {
    try {
        const emailToken = req.body.emailToken;

        if (emailToken !== null) { //if there is no email token then do nothing
            const accessToken = req.header('Authorization').split(' ')[1];
            const decodeAccessToken = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

            //check if user exists
            const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

            //check if email is already confirmed
            if (!user.emailConfirmed) {
                //check if provided email token matches
                if (emailToken === user.emailToken) {
                    await User.updateOne({ email: decodeAccessToken.email }, { $set: { emailConfirmed: true, emailToken: null } })
                    res.status(200).json(generateRes(true, 200, "EMAIL_CONFIRMED", {}));
                    return;
                } else {
                    res.status(401).json(generateRes(false, 401, "INVALID_EMAIL_TOKEN", {}));
                    return;
                }
            } else {
                res.status(401).json(generateRes(false, 401, "EMAIL_ALREADY_CONFIRMED", {}));
                return;
            }
        } else {
            res.status(400).json(generateRes(false, 400, "BAD_REQUEST", {}));
            return;
        }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

/*  This function gets the list of available majors from the university given as a 
    query parameter. It has no other requirements and can be used by any account type, 
    including student, faculty, and industry. It takes one field in the body: 
    university (String, the name of the university's majors that is being queried)
*/
const getAvailableMajors = async (req, res) => {
    try {
        //Get the location query parameter
        const location = req.query.university;
        if (!location) {
            return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", { details: 'location query parameter not given' }));
        }
        //grab majors record
        majorsRecord = await retrieveOrCacheMajors(req, location);

        if (!majorsRecord || majorsRecord.majors.length === 0) { return res.status(404).json(generateRes(true, 404, "MAJOR_LIST_NOT_FOUND")); }

        return res.status(200).json(generateRes(true, 200, "MAJORS_FOUND", { "majors": majorsRecord.majors }));
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

//Helper methods

//This helper method send the email confirmation link through the email
const sendEmailConfirmation = async (user) => {
    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Confirmation Email',
        text: `Click link to confirm your email: http://${process.env.FRONT_END_IP}/confirm-email/${user.emailToken}`
    };

    await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
}
//This function generates a valid access token
const generateAccessToken = (id, email, uName) => {
    let items = {
        _id: id,
        email: email,
        name: uName,
    }
    return jwt.sign(items, process.env.SECRET_ACCESS_TOKEN, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}
//This function generates an expired access token for unit tests
const generateExpiredToken = (id, email, uName) => {
    let items = {
        _id: id,
        email: email,
        name: uName,
    }
    return jwt.sign(items, process.env.SECRET_ACCESS_TOKEN, { expiresIn: "2s" })
}
//This function generates a refresh token 
const generateRefreshToken = (id, email, uName) => {
    let items = {
        _id: id,
        email: email,
        name: uName,
    }
    return jwt.sign(items, process.env.SECRET_REFRESH_TOKEN, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}
//This function generates an expired refresh token for unit tests
const generateExpiredRefreshToken = (id, email, uName) => {
    let items = {
        _id: id,
        email: email,
        name: uName,
    }
    return jwt.sign(items, process.env.SECRET_REFRESH_TOKEN, { expiresIn: "2s" });
}

/*  This function handles the refresh token addition to the database. This function takes a user record and a refreshtoken and adds the refreshtoken to the 
    user's record in the database. 

    Currently, the database only supports having 5 refreshtokens active at a time, so if there is less than 5 in the database the refresh token is added to 
    the existingRefreshTokens array otherwise a token is removed from the array and replaced with the refreshtoken in this function's parameter
*/
const addRefreshToken = async (user, refreshToken) => {
    try {
        const existingRefreshTokens = user.security.tokens;

        //check if there is less than X refresh tokens
        if (existingRefreshTokens.length < 5) {
            await User.updateOne({ email: user.email }, {
                $push: {
                    'security.tokens': {
                        refreshToken: refreshToken,
                        createdAt: new Date()
                    },
                },
            });
        } else {
            //Otherwise remove the last token 
            await User.updateOne({ email: user.email }, {
                $pull: {
                    'security.tokens': {
                        _id: existingRefreshTokens[0]._id,
                    },
                },
            });

            //push the new token
            await User.updateOne({ email: user.email }, {
                $push: {
                    'security.tokens': {
                        refreshToken: refreshToken,
                        createdAt: new Date(),
                    },
                },
            });
        }
        return true;
    } catch (error) {
        return false;
    }
}

const unitTestVerify = async (accessToken, token) => {
    const decodeAccessToken = jwt.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

    //check if user exists
    const user = await User.findOne({email: decodeAccessToken.email})

    if (!user.emailConfirmed) {
        //check if provided email token matches
        if (token === user.emailToken) {
            await User.updateOne({ email: decodeAccessToken.email }, { $set: { emailConfirmed: true, emailToken: null } })
        }
    }
}


export {
    register,
    token,
    confirmEmailToken,
    login,
    getAvailableMajors,
    generateExpiredToken,
    generateExpiredRefreshToken,
    addRefreshToken,
    unitTestVerify,
};