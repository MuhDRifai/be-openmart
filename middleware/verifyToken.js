const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;

    if (authHeader) {
        jwt.verify(authHeader, process.env.JWT_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token Invalid' }); // Ubah menjadi objek JSON
            }
            req.user = user;
            next();
        });
    } else {
        return res.status(401).json({ error: 'Token not provided' }); // Ubah menjadi objek JSON
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized' }); // Ubah menjadi objek JSON dan tambahkan pesan "Unauthorized"
        }
    });
};

module.exports = { verifyToken, verifyTokenAndAuthorization }; // Pastikan Anda menambahkan export untuk verifyTokenAndAuthorization
