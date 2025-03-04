import jwt from 'jsonwebtoken';

/*  This middleware handles the access token verification, it requires an access token in the header in the format "Bearer <ACCESS_TOKEN>" to
    be successful. The middleware checks that the token is both valid and not expired otherwise it sends an error response.
*/
function auth(req, res, next) {
    try {
        const token = req.header('authorization').split(' ')[1] //Grab token

        if (token) { //If no token then deny request
            try {
                req.user = jwt.verify(token, process.env.SECRET_ACCESS_TOKEN); 
                next();
            } catch (error) { //catch errors in verifing the token and send error response
                return res.status(401).json({ error: { status: 401, message: "INVALID_ACCESS_TOKEN" } });
            }

        } else {
            return res.status(401).json({ error: { status: 401, message: "NO_TOKEN" } });
        }
    } catch (error) {
        return res.status(401).json({ error: { status: 401, message: "ACCESS_DENIED" } });
    }
}

export default auth;