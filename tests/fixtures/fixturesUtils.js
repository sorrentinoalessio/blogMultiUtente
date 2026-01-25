
import mongoose from 'mongoose';
import CryptoUtils from '../../src/utils/CryptoUtils.js';
import userSchema from '../../src/schemas/userSchema.js';
import { postStatus, userStatus } from '../../src/constants/const.js';
import postSchema from '../../src/schemas/postSchema.js';

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
            salt: salt
        }
        if (save) {
            const res = await userSchema.create(user);
            return res.toObject();
        }
        return user;
    }
    async createPost(data, save) {
        const post = {
            name: data.name || 'test post',
            _id: data.id || new objectId(),
            ownerId: data.ownerId || null,
            description: data.description || 'test description',
            status: data.status || postStatus.OPEN,
            dueDate: data.dueDate || new Date()
        }
        if (save) {
            const res = await postSchema.create(post);
            return res.toObject();
        }
        return post;
    }
    async clearDb() {
        await postSchema.deleteMany();
       await userSchema.deleteMany();
        //await mongoose.connection.dropDatabase();
    }

    
    async getUserFromId(id){
        const user = await userSchema.findOne({id});
        return user ? user.toObject() : null; 

    }

}


export default new FixturesUtils();