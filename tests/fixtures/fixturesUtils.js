
import mongoose from 'mongoose';
import CryptoUtils from '../../src/utils/CryptoUtils.js';
import userSchema from '../../src/schemas/userSchema.js';
import { postStatus, userStatus } from '../../src/constants/const.js';
import postSchema from '../../src/schemas/postSchema.js';
import TagUtils from '../../src/utils/TagUtils.js';
import crypto from 'crypto';
import likeSchema from '../../src/schemas/likeSchema.js';

const objectId = mongoose.Types.ObjectId;

class FixturesUtils {
    async createUser(data, save) {
        const { password, salt } = CryptoUtils.hashPassword(data.password || 'password');

        const user = {
            name: data.name || 'test user',
            _id: data.id || new objectId(),
            email: data.email || 'test@gmail.com',
            status: data.status || userStatus.ACTIVE,
            password: password,
            salt: salt,
            registrationToken: crypto.randomBytes(16).toString('hex')

        }
        if (save) {
            const res = await userSchema.create(user);
            return res.toObject();
        }
        return user;
    }
    async createPost(data = {}, save = true) {
        const post = {
            title: data.title || 'test post',
            description: data.description || 'test description',
            ownerId: data.ownerId ?? null,
            status: data.status,
            tag: data.tag || [{ tag: "cinema", _id: new objectId() }],
            img: data.img
        };
        
        if (save) {
            const res = await postSchema.create(post);
            return res.toObject();
        }

        return post;
    }

     async createLikes(data = {}, save = true) {
        const likes = {
            postId: data.postId,
            likes: data.likes || []
        };

        if (save) {
            
           const res = await likeSchema.create(likes);
           return res.toObject();
        }
        return likes;
    }

    async clearDb() {
        await postSchema.deleteMany();
        await userSchema.deleteMany();
    }


    async getUserFromId(id) {
        const user = await userSchema.findOne({ id });
        return user ? user.toObject() : null;

    }

}


export default new FixturesUtils();