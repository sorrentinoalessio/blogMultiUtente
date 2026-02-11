import { userStatus } from "../constants/const.js";
import DomainException from "../exceptions/DomainException.js";
import NotFoundException from "../exceptions/NotFoundException.js";
import UnauthorizedException from "../exceptions/UnauthorizedException.js";
import userSchema from "../schemas/userSchema.js";
import MongoInternalException from '../exceptions/MongoInternalException.js';
import CryptoUtils from "../utils/CryptoUtils.js";
import { getRandomValues } from "crypto";

class UserRepository {
    async add(content) {
        const res = await userSchema.create(content).catch((err) => {
            if (err.code === 11000) {
                throw new MongoInternalException(`something went wrong`, 500);
            }
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);

        });
        return res.toObject();
    }

    async getByIdAndToken(id, token) {
        const res = await userSchema.findOneAndUpdate(
            { _id: id, registrationToken: token },
            { status: userStatus.ACTIVE, registrationToken: null },
            { new: true }                                                        //restituisco il documento aggiornato
        ).catch((err) => {
            throw new NotFoundException('Token not found');
        });
        if (!res) {
            throw new NotFoundException('Token not found');
        }
        return res.toObject();
    }

    async getByToken(token) {
        const user = await userSchema.findOne({ registrationToken: token }).catch((err) => {
            throw new NotFoundException('Token not found');
        });
        if (!user) {
            throw new NotFoundException('Token not found');
        }
        return user.toObject();
    }

    async getActiveByEmail(email) {
        const res = await userSchema.findOne({ email: email, status: userStatus.ACTIVE }).catch((err) => {
            throw new DomainException('Generic error');
        })
        if (!res) {
            throw new UnauthorizedException('Unauthorized');
        }
        return res.toObject();
    }

    async findPendingbyEmail(email) {
        try {
            const userPending = await userSchema.findOne({ email: email, status: userStatus.PENDING });
            if (!userPending) {
                throw new UnauthorizedException('Unauthorized');
            }
            return userPending.toObject();
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new DomainException('Generic error');
        }
    }

    async findUserForResetPassword(email) {
        try {

            const token = CryptoUtils.generateRandomCode(16);
            const user = await userSchema.findOneAndUpdate({ email: email }, { $set: { registrationToken: token } }, { new: true });
            if (!user) {
                throw new UnauthorizedException('Unauthorized');
            }

            return user.toObject();
        } catch (err) {
            if (err instanceof UnauthorizedException) throw err;
            throw new DomainException('Generic error');
        }
    }


    async addResetPassword(password, salt, token) {
        try {
            const res = await userSchema.findOneAndUpdate(
                { registrationToken: token },
                {
                    $set: {
                        password: password,
                        salt: salt,
                        registrationToken: null
                    }
                },
                { new: true } 
            );

            if (!res) {
                throw new UnauthorizedException('Unauthorized');
            }

            return res.toObject();
        } catch (err) {
            if (err.code === 11000) {
                throw new MongoInternalException(`Something went wrong`, 500);
            }
            throw new MongoInternalException(`Something went wrong: ${err.message}`, err.code);
        }
    }


    async getUserProfile(userId, status) {
        const res = await userSchema.find({ _id: userId, status: status }).catch(err => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        })
        return res.map((item) => item.toObject());
    }


    async updateUserProfile(userId, body) {
        const res = await userSchema.findOneAndUpdate({ _id: userId }, { $set: { name: body.name } }, { new: true }
        ).catch((err) => {
            if (err.code === 11000) {
                throw new MongoInternalException(`something went wrong`, 500);
            }
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);

        });
        return res.toObject();
    }









}

export default new UserRepository();
