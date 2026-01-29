
import { type } from 'os';
import UnauthorizedException from '../exceptions/UnauthorizedException.js';
import userRepo from '../repository/UserRepository.js';
import cryptoUtils from '../utils/CryptoUtils.js';
import mailService from './mailService.js';
import e from 'express';

const users = {};

export const add = async (content) => {
    const { password, salt } = cryptoUtils.hashPassword(content.password);
    content.password = password;
    content.salt = salt;
    content.registrationToken = cryptoUtils.generateRandomCode(16);
    const user = await userRepo.add(content);
    await mailService.sendRegistrationMail(user);
    return user;
}

export const verifyRegistrationToken = async (id, token) => {
    return await userRepo.getByIdAndToken(id, token);
}

export const loginUser = async (email, password) => {

    let user = users[email];
    if (!user) {
        user = await userRepo.getActiveByEmail(email);
        users[user.email] = user;
    }

    if (user.password !== cryptoUtils.sha256(password, user.salt)) {
        throw new UnauthorizedException('Unauthorized');
    }
    const { accessToken, refreshToken } = cryptoUtils.generateTokens(user);
    console.log(`L'utente ${user.name} ha effettuato il login`);                    //messaggio di conferma login
    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        name: user.name,
        id: user.id
    };
}
export const loginUserPending = async (email, password) => {

    const user = await userRepo.findPendingbyEmail(email);
    if (!user) {
        throw new UnauthorizedException('Unauthorized');
    }
    if (user.password !== cryptoUtils.sha256(password, user.salt)) {
        throw new UnauthorizedException('Unauthorized');
    }
    await mailService.sendRegistrationMail(user);
}

export const userPasswordReset = async (email) => {
    const userTemp = await userRepo.findUserForResetPassword(email);
    const passwordTemp = cryptoUtils.generateRandomCode(10);
    userTemp.password = passwordTemp;
    if (!userTemp) {
        throw new UnauthorizedException('Unauthorized');
    }

    await mailService.sendPasswordMail(userTemp);
    const userHash = await addUserNewPassword(userTemp);
    return userHash;


}

export const addUserNewPassword = async (content) => {
    const { password, salt } = cryptoUtils.hashPassword(content.password);
    content.password = password;
    content.salt = salt;
    const user = await userRepo.addResetPassword(content);
    return user;
}


