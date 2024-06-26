const roles = {
    admin: (req, res, next) => {
        if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
        next();
    },
    salesRep: (req, res, next) => {
        if (req.user.role !== 'sales_rep' && req.user.role !== 'admin') return res.status(403).send('Access denied.');
        next();
    },
};

module.exports = roles;
