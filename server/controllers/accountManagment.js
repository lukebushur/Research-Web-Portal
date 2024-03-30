const User = require('../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../helpers/generateJSON');
const { updateApplicationRecords } = require('../helpers/dataConsistency');
const { studentAccountModification, facultyAccountModification, emailSchema, resetPasswordSchema } = require('../helpers/inputValidation/requestValidation');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { retrieveOrCacheMajors, retrieveOrCacheUsers } = require('../helpers/schemaCaching');


/*  This controller handles the modification of accounts and is currently incomplete as it will be modified as the faculty account schema is 
    updated in the future. It should only be used with a POST request and requires either a student or faculty access token. It can take up to 
    four fields depending on which access token is used. 

    If the account type is a student account, the fields are as follows : name (String, the name associated with the account) - GPA (Number, the gpa
    of the student) - major (String array, an array of strings that are the majors of the student) - universityLocation (String, the university that 
    student attends)
*/
const modifyAccount = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);
        //grab account info
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        if (user.userType.Type === parseInt(process.env.STUDENT)) { //check if account is student
            //Validate the http request body for a student request
            const { error } = studentAccountModification.validate(req.body);
            if (error) {
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }
            //store the original data of the student's account
            originalData = {
                GPA: user.userType.GPA,
                major: user.userType.Major,
                universityLocation: user.universityLocation,
                name: user.name,
            }
            //Assign each new piece of data to the student's account
            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.GPA) {
                user.userType.GPA = req.body.GPA;
            }
            if (req.body.Major) {
                user.userType.Major = req.body.Major;
            }
            if (req.body.universityLocation) {
                user.universityLocation = req.body.universityLocation;
            }

            await user.save(); //Save the student account
            //Check if the updating of applicationRecords was successful, if it was not, the original data was used to reset the account information
            const success = await updateApplicationRecords(req, user, req.body, originalData);
            if (!success) {
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
            }
        } else if (user.userType.Type === parseInt(process.env.FACULTY)) {
            const { error } = facultyAccountModification.validate(req.body);
            if (error) {
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }

            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.universityLocation) {
                user.universityLocation = req.body.universityLocation;
            }
            await user.save();

        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", { "details": "Invalid account type for this route." }));
        }

        return res.status(200).json(generateRes(true, 200, "ACCOUNT_UPDATED", {}));
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}

const getAccountInfo = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);
        let accountData = {};
        accountData.email = user.email;
        accountData.name = user.name;
        accountData.universityLocation = user.universityLocation;
        accountData.emailConfirmed = user.emailConfirmed;
        accountData.userType = user.userType.Type;

        if (user.userType.Type === parseInt(process.env.STUDENT)) {
            accountData.GPA = user.userType.GPA;
            accountData.Major = user.userType.Major;
        } else if (user.userType.Type === parseInt(process.env.FACULTY)) {
            //Currently empty as there is no faculty only fields that should be returned by this function as of now, however this else if 
            //statement is still included for future modification the the user record at which point this case will include the new data
        } else if (user.userType.Type === parseInt(process.env.INDUSTRY)) {

        } else {
            return res.status(401).json(generateRes(false, 401, "UNAUTHORIZED", { "details": "Invalid account type for this route." }));
        }

        return res.status(200).json(generateRes(true, 200, "ACCOUNT_FOUND", { accountData: accountData }));
    } catch (error) {
        return res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
    }
}


/*  This function handles the reset password requests, should only be used with a POST request
    This function takes the email of the account and password that will replace the user's password. This function doesn't replace the user's password,
    but instead sets up the database with information required to allow a password to be reset, such as password reset token and reset token expiry
    
    The request body requires the following fields : 
    email (String, the email of the account) - provisionalPassword (String, the new password)
*/
const resetPassword = async (req, res) => {
    try {
        //Generate Password Reset Token and expiresIn - 10 minutes
        const passwordResetToken = uuidv4();
        const expiresIn = moment().add(10, 'm').toISOString();

        //Update user with password token, expiry, and provisional password
        const user = await User.findOneAndUpdate({ email: req.body.email }, {
            $set: {
                'security.passwordReset': {
                    token: passwordResetToken,
                    expiry: expiresIn
                },
            },
        });

        //User could not be found -> return error response
        if (!user) {
            return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", {}));
        }

        //sends email to the users notifying them
        await sendPasswordResetConfirmation({ email: req.body.email, passwordResetToken: passwordResetToken })
        res.status(200).json(generateRes(true, 200, "PWD_RESET_EMAIL_SENT", {}));
        return;
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

/*  This function handles the reset password functionality, should only be used with a POST request
    This function takes the password reset token and user email. If these are validated, then the password is reset to the provisional password
    set in the passwordReset function.
    
    The request body requires the following fields : 
    email (String, the email of the account) - passwordResetToken (String, token needed to reset the password)
*/
const resetPasswordConfirm = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        //check if passwordResetToken matches the token in the DB
        if (user.security.passwordReset.token === req.body.passwordResetToken) {
            const { error } = resetPasswordSchema.validate(req.body.provisionalPassword);
            if (error) {
                await resetResetPasswordToken(req.body.email);
                return res.status(401).json(generateRes(false, 401, "INPUT_ERROR", { details: "Invalid provisional password." }));
            }

            //Hash Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.provisionalPassword, salt);
            //check if password reset token expired
            if (new Date().getTime() <= new Date(user.security.passwordReset.expiry).getTime()) {
                await User.updateOne({ email: req.body.email }, {
                    $set: { //resets the password reset fields, and sets the password to the new password
                        'password': hashedPassword,
                        'security.passwordReset.token': null,
                        'security.passwordReset.provisionalPassword': null,
                        'security.passwordReset.expiry': null,
                    },
                });

                res.status(200).json(generateRes(true, 200, "PWD_RESET_SUCCESS", {}));
                return;
            } else {
                //Removing password reset token because expiry  
                await resetResetPasswordToken(req.body.email);
                res.status(401).json(generateRes(false, 401, "PWD_TOKEN_EXPIRED", {}));
                return;
            }
        } else {
            await resetResetPasswordToken(req.body.email);
            res.status(401).json(generateRes(false, 401, "INVALID_PWD_TOKEN", {}));
            return;
        }
    } catch (error) {
        await resetResetPasswordToken(req.body.email);
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

/*  This function handles the emailChange functionality, should only be used with a POST request, and requires a valid access token
    This function takes an emailresetToken and validates it against the database. If it is validated then the email is reset to the provisional email

    The request body requires the following fields : 
    emailResetToken (String, the email reset token of the account) 
*/
const changeEmailConfirm = async (req, res) => {
    try {
        //Decode Access Token
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //get user from email in the access token
        const user = await retrieveOrCacheUsers(req, decodeAccessToken.email);

        //check if email exists 
        const existingEmail = await retrieveOrCacheUsers(req, user.security.changeEmail.provisionalEmail);

        if (!existingEmail) {//if the email doesn't already exist sends error response 
            if (user.security.changeEmail.token === req.body.changeEmailToken) { //check that changeEmailToken is correct

                //check that email token isn't expired
                if (new Date().getTime() <= new Date(user.security.changeEmail.expiry).getTime()) {
                    await User.updateOne({ email: decodeAccessToken.email }, {
                        $set: {
                            'email': user.security.changeEmail.provisionalEmail,
                            'security.changeEmail.token': null,
                            'security.changeEmail.provisionalEmail': null,
                            'security.changeEmail.expiry': null,
                        },
                    });
                    res.status(200).json(generateRes(true, 200, "EMAIL_RESET_SUCCESS", {}));
                    return;
                } else { //Otherwise the email token is expired and the reset token fields should be reset
                    await resetEmailToken(decodeAccessToken.email);
                    res.status(401).json(generateRes(false, 401, "EMAIL_TOKEN_EXPIRED", {}));
                    return;
                }
            } else {
                await resetEmailToken(decodeAccessToken.email);
                res.status(401).json(generateRes(false, 401, "INVALID_EMAIL_TOKEN", {}));
                return;
            }
        } else { //if the email already exists remove the emailreset fields
            await resetEmailToken(decodeAccessToken.email);
            res.status(401).json(generateRes(false, 401, "INPUT_ERROR", { details: "Email already exists." }));
            return;
        }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
};

/*  This function handles the emailChange requests, should only be used with a POST request, and requires a valid access token
    This function takes an provisionalEmail sets up the database to accept a changeEmailConfirm request. This function does not change the email of the user,
    but instead prepares the database/backend to securely change the email of a user account.

    The request body requires the following fields : 
    provisionalEmail (String, the new email for the account)
*/
const changeEmail = async (req, res) => {
    try {
        const { error } = emailSchema.validate({ email: req.body.provisionalEmail });
        if (!error) {
            //Decode Access Token
            const accessToken = req.header('Authorization').split(' ')[1];
            const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

            //check if new Email Exists
            const emailExists = await User.findOne({ email: req.body.provisionalEmail });

            if (!emailExists) {
                //Generate an email confirmation token
                const changeEmailToken = uuidv4();
                const expiresIn = moment().add(10, 'm').toISOString();

                //update user with email token
                const user = await User.findOneAndUpdate({ email: decodeAccessToken.email }, {
                    $set: {
                        'security.changeEmail': {
                            token: changeEmailToken,
                            provisionalEmail: req.body.provisionalEmail,
                            expiry: expiresIn,
                        },
                    },
                });

                await changeEmailConfirmation({ email: user.email, emailToken: changeEmailToken });
                res.status(200).json(generateRes(true, 200, "CHANGE_EMAIL_SENT", {}));
                return;
            } else {
                res.status(400).json(generateRes(false, 400, "EMAIL_EXISTS", {}));
                return;
            }
        } else {
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
            return;
        }
    } catch (error) {
        res.status(500).json(generateRes(false, 500, "SERVER_ERROR", {}));
        return;
    }
}

/*  These functions send an email to the user which allow them to confirm their email, reset their password, or change their email assuming that their 
    account is set up to properly handle such a request (and maybe they have a valid access token)
*/

const sendPasswordResetConfirmation = async (user) => {
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
        subject: 'Reset your password',
        html: `
<p>Click the link below to reset your password:</p>
<a href="http://${process.env.FRONT_END_IP}/confirm-reset-password/${encodeURIComponent(user.email)}/${user.passwordResetToken}">
    Reset Password</a>`
    };

    await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
};

const changeEmailConfirmation = async (user) => {
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
        subject: 'Reset your password',
        text: `Click link to confirm your new email change: http://${process.env.FRONT_END_IP}/confirm-email-change/:${user.emailToken}`
    };

    await transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
    });
};

const resetResetPasswordToken = async (targetEmail) => {
    await User.updateOne({ email: targetEmail }, {
        $set: {
            'security.passwordReset.token': null,
            'security.passwordReset.provisionalPassword': null,
            'security.passwordReset.expiry': null,
        },
    });
}

const resetEmailToken = async (targetEmail) => {
    await User.updateOne({ email: targetEmail }, {
        $set: {
            'security.changeEmail.token': null,
            'security.changeEmail.expiry': null,
            'security.changeEmail.provisionalEmail': null,
        }
    });
}
//Method used for unit testing expired tokens
const generateExpiredPasswordToken = async (targetEmail) => {
    const passwordResetToken = uuidv4();
    const expiresIn = moment().subtract(1, 'seconds').toISOString();

    //Update user with password token, expiry, and provisional password
    await User.findOneAndUpdate({ email: targetEmail }, {
        $set: {
            'security.passwordReset': {
                token: passwordResetToken,
                expiry: expiresIn
            },
        },
    });

    return passwordResetToken;
}
//Method used for unit testing expired tokens
const generateExpiredEmailToken = async (targetEmail, newEmail) => {
    const changeEmailToken = uuidv4();
    const expiresIn = moment().subtract(1, 'seconds').toISOString();

    //update user with email token
    await User.findOneAndUpdate({ email: targetEmail }, {
        $set: {
            'security.changeEmail': {
                token: changeEmailToken,
                provisionalEmail: newEmail,
                expiry: expiresIn,
            },
        },
    });

    return changeEmailToken;
}

module.exports = {
    modifyAccount, changeEmail,
    changeEmailConfirm, resetPassword,
    resetPasswordConfirm, getAccountInfo,
    generateExpiredEmailToken, generateExpiredPasswordToken
};