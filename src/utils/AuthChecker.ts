const jwt = require("jsonwebtoken");

function AuthChecker (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({
            status: 401,
            message: "Authentication token missing"
        });
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
            if(err) {
                let resp = { message: "Authentication could not be completed."}
                switch(err.message) {
                    case 'invalid signature':
                        resp = { message: "Authentication not valid." }
                        break;
                    case 'jwt expired':
                        resp = { message: "Authentication token expired." }
                        break;
                }
                res.status(401).send(resp);
            }

            const { userId } = decoded;
            // const globalAny:any = global;
            // global.userId = userId;

            res.locals.userId = userId;
            next();
        });
               
    } catch (err) {
        res.status(500).json({
            message: "Authentication could not be completed."
        });
    }
}

module.exports = AuthChecker;