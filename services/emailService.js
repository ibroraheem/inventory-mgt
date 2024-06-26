const sendEmail = require('../config/emailConfig');

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `http://localhost:5000/api/password/reset/${token}`;
    const message = `You requested a password reset. Please make a PUT request to the following URL: \n\n ${resetUrl}`;

    await sendEmail(email, 'Password Reset Request', message);
};

module.exports = {
    sendPasswordResetEmail,
};
