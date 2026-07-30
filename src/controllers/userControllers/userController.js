import { add, verifyRegistrationToken, loginUser, loginUserPending, userPasswordReset, userProfileList, userProfileUpdate, addUserNewPassword, verifyToken } from '../../services/userService.js';
import UserNormalaizer from '../../normalizer/userNormalizer.js';
import { userStatus } from '../../constants/const.js';
import userNormalizer from '../../normalizer/userNormalizer.js';
import { hostname } from 'os';
import mailService from '../../services/mailService.js';

export const addUser = async (req, res) => {
    const content = req.body;
    try {
        const user = await add(content);
        const userNormalizer = UserNormalaizer.get(user)
        res.status(201).json(userNormalizer);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

import mongoose from 'mongoose';

export const confirmRegistration = async (req, res) => {
    const userId = req.params.id;
    const token = req.params.token;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        await verifyRegistrationToken(userId, token);
        res.redirect(`${process.env.FRONTEND_URL}/login?confirmed=true`);
    } catch (err) {
        res.redirect(`${process.env.FRONTEND_URL}/login?confirmed=false`);
    }
}

export const cofirmUserResetPassword = async (req, res) => {
    const token = req.params.token;
    try {
        const user = await verifyToken(token);
        res.status(200).json({ message: 'Token valido' });
    } catch (err) {
        res.status(err.status || 400).json({ message: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await loginUser(email, password);
        res.status(200).json(user);
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}
export const loginPending = async (req, res) => {
    const { email, password } = req.body;
    try {
        await loginUserPending(email, password);
        res.status(200).send('Email inviata correttamente');
    } catch (err) {
        res.status(err.status).json({ message: err.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        await userPasswordReset(email);
        res.status(200).json({ message: 'Email di reset password inviata correttamente' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export const userProfile = async (req, res) => {
    try {
        const profile = await userProfileList(req.userId, userStatus.ACTIVE);
        res.status(200).json(userNormalizer.getUser(profile));

    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const profileUpdate = await userProfileUpdate(req.userId, req.body);
        res.status(200).json(userNormalizer.get(profileUpdate));
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}

export const newPassword = async (req, res) => {
    const token = req.params.token
    const { passwordNew } = req.body;
    try {
        await addUserNewPassword(passwordNew, token)
        res.status(200).json({ message: 'password modificata' });
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message });
    }
}


