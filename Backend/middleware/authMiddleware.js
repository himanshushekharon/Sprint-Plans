const { verifyToken } = require('@clerk/backend');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using Clerk's secret key
            const decoded = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY,
            });

            // Set req.user so that old controllers keep working (they look for req.user._id)
            req.user = { _id: decoded.sub, id: decoded.sub };

            next();
        } catch (error) {
            console.error('Clerk Auth Error:', error);
            res.status(401);
            // using return res.status(401).json() to prevent unhandled promise rejection crashes
            return res.status(401).json({ message: 'Not authorized by Clerk' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token present' });
    }
};

module.exports = { protect };
