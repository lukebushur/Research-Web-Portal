const User = require('../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../helpers/generateJSON');
const { updateApplicationRecords } = require('../helpers/dataConsistency');
const { studentAccountModification, facultyAccountModification, emailSchema } = require('../helpers/inputValidation/requestValidation');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const moment = require('moment');


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

        const user = await User.findOne({ email: decodeAccessToken.email });

        if (user.userType.Type === parseInt(process.env.STUDENT)) {
            //Validate the http request body for a student request
            const { error } = studentAccountModification.validate(req.body);
            if (error) {
                return res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {
                    errors: error.details,
                    original: error._original
                }));
            }

            originalData = {
                GPA: user.userType.GPA,
                major: user.userType.Major,
                universityLocation: user.universityLocation,
                name: user.name,
            }

            if (req.body.name) {
                user.name = req.body.name;
            }
            if (req.body.GPA) {
                user.GPA = req.body.GPA;
            }
            if (req.body.major) {
                user.Major = req.body.Major;
            }
            if (req.body.universityLocation) {
                user.universityLocation = req.body.universityLocation;
            }

            await user.save();
            const success = await updateApplicationRecords(user, req.body, originalData);
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

        const user = await User.findOne({ email: decodeAccessToken.email });
        let accountData = {};
        accountData.email = user.email;
        accountData.name = user.name;
        accountData.universityLocation = user.universityLocation;
        accountData.emailConfirmed = user.emailConfirmed;

        if (user.userType.Type === parseInt(process.env.STUDENT)) {
            accountData.GPA = user.userType.GPA;
            accountData.GPA = user.userType.Major;
        } else if (user.userType.Type === parseInt(process.env.FACULTY)) {
            //Currently empty as there is no faculty only fields that should be returned by this function as of now, however this else if 
            //statement is still included for future modification the the user record at which point this case will include the new data
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
        if (req.body.provisionalPassword.length >= 6 && req.body.provisionalPassword.length <= 255) {
            //Hash Password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.provisionalPassword, salt);

            //Generate Password Reset Token and expiresIn - 10 minutes
            const passwordResetToken = uuidv4();
            const expiresIn = moment().add(10, 'm').toISOString();

            //Update user with password token, expiry, and provisional password
            await User.findOneAndUpdate({ email: req.body.email }, {
                $set: {
                    'security.passwordReset': {
                        token: passwordResetToken,
                        provisionalPassword: hashedPassword,
                        expiry: expiresIn
                    },
                },
            });
            //sends email to the users notifying them
            await sendPasswordResetConfirmation({ email: req.body.email, passwordResetToken: passwordResetToken })
            res.status(200).json(generateRes(true, 200, "PWD_RESET_EMAIL_SENT", {}));
            return;
        } else {
            res.status(400).json(generateRes(false, 400, "INPUT_ERROR", {}));
            return;
        }
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

            //check if password reset token expired
            if (new Date().getTime() <= new Date(user.security.passwordReset.expiry).getTime()) {
                await User.updateOne({ email: req.body.email }, {
                    $set: { //resets the password reset fields, and sets the password to the new password
                        'password': user.security.passwordReset.provisionalPassword,
                        'security.passwordReset.token': null,
                        'security.passwordReset.provisionalPassword': null,
                        'security.passwordReset.expiry': null,
                    },
                });

                res.status(200).json(generateRes(true, 200, "PWD_RESET_SUCCESS", {}));
                return;
            } else {
                //Removing password reset token because expiry  
                await User.updateOne({ email: req.body.email }, {
                    $set: {
                        'security.passwordReset.token': null,
                        'security.passwordReset.provisionalPassword': null,
                        'security.passwordReset.expiry': null,
                    },
                });
                res.status(401).json(generateRes(false, 401, "PWD_TOKEN_EXPIRED", {}));
                return;
            }
        } else {
            res.status(401).json(generateRes(false, 401, "INVALID_PWD_TOKEN", {}));
            return;
        }
    } catch (error) {
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
        const user = await User.findOne({ email: decodeAccessToken.email });

        //check if email exists 
        const existingEmail = await User.findOne({ email: user.security.changeEmail.provisionalEmail });

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
                    await User.updateOne({ email: decodeAccessToken.email }, {
                        $set: {
                            'security.changeEmail.token': null,
                            'security.changeEmail.provisionalEmail': null,
                            'security.changeEmail.expiry': null,
                        },
                    });
                    res.status(401).json(generateRes(false, 401, "EMAIL_TOKEN_EXPIRED", {}));
                    return;
                }
            } else {
                res.status(401).json(generateRes(false, 401, "INVALID_EMAIL_TOKEN", {}));
                return;
            }
        } else { //if the email already exists remove the emailreset fields
            await User.updateOne({ email: decodeAccessToken.email }, {
                $set: {
                    'security.changeEmail.token': null,
                    'security.changeEmail.expiry': null,
                    'security.changeEmail.provisionalEmail': null,
                }
            });
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
        text: `Click link to reset your password: http://localhost:9000/reset-password/${user.passwordResetToken}`
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

module.exports = {
    modifyAccount, changeEmail,
    changeEmailConfirm, resetPassword,
    resetPasswordConfirm, getAccountInfo,
};