const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');
const sendPasswordResetEmail = require('../services/emailService');

class AuthService {
    async registerUser(userData) {
        const { username, email, password } = userData;
        let user = await User.findOne({ email });
        if (user) {
            throw new Error('User already exists');
        }
        user = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        return this.generateAuthToken(user);
    }

    async loginUser(email, password) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }
        return this.generateAuthToken(user);
    }

    generateAuthToken(user) {
        const payload = { user: { id: user.id, role: user.role } };
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    }

    async requestPasswordReset(email) {
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('User not found');
        }
        const resetToken = user.getResetPasswordToken();
        await user.save();
        await sendPasswordResetEmail(email, resetToken);
        return { message: 'Password reset email sent' };
    }

    async resetPassword(token, newPassword) {
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            throw new Error('Invalid or expired token');
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return { message: 'Password has been reset' };
    }
}

module.exports = new AuthService();
