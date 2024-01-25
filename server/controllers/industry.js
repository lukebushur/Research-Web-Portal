const User = require('../models/user');
const JWT = require('jsonwebtoken');
const generateRes = require('../helpers/generateJSON');

const getName = async (req, res) => {
    try {
        const accessToken = req.header('Authorization').split(' ')[1];
        const decodeAccessToken = JWT.verify(accessToken, process.env.SECRET_ACCESS_TOKEN);

        //check if user exists
        const user = await User.findOne({ email: decodeAccessToken.email });

        //check if user type is industry
        if (user.userType.Type == process.env.INDUSTRY) {
            return res.status(200).json(generateRes(true, 200, "INDUSTRY_USER_NAME", {
                name: user.name,
            }));
        }
        return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", {}));
    } catch (error) {
        return res.status(400).json(generateRes(false, 400, "BAD_REQUEST", { error }));
    }
}

module.exports = {
    getName,
}