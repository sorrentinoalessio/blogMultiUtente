import { postStatus } from '../constants/const.js';
import MongoInternalException from '../exceptions/MongoInternalException.js';
import NotFoundException from '../exceptions/NotFoundException.js';
import postSchema from "../schemas/postSchema.js";
import userSchema from '../schemas/userSchema.js';

class PostRepository {
    async add(content) {
        const res = await postSchema.create(content).catch((err) => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        });
        return res.toObject();
    }

    async getById(id, userId) {
        const res = await postSchema.findOne({ _id: id, ownerId: userId }).catch((err) => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        });
        if (!res) {
            throw new NotFoundException(`error: post ${id} not found`)
        }
        return res.toObject();
    }

    async update(id, params, userId) {
        const res = await postSchema.findOneAndUpdate({ _id: id, ownerId: userId }, params, { new: true }).catch((err) => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        });
        return res ? res.toObject() : null;
    }

    async getManyByUserId(userId, status) {
        const query = {
            ownerId: userId
        }
        if (status) {
            query.status = status;
        }
        const res = await postSchema.find(query).catch(err => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        })
        return res.map((item) => item.toObject());
    }
    
    async getIdsStatusOpen() {
        const res = await postSchema.find({ status: postStatus.OPEN }).catch(err => {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        })
        return res.map((item) => item.toObject());
    }
    async getManyByIds(ids) {
        const query = {
            _id: { $in: ids },
            status: postStatus.OPEN
        };
        const res = await postSchema.find(query);
        return res.map(item => item.toObject());
    }


    async complete(id, userId) {
        const res = await postSchema.findOneAndUpdate({ _id: id, ownerId: userId, status: { $in: [postStatus.OPEN, postStatus.COMPLETED] } }, { status: postStatus.COMPLETED }, { new: true });
        if (!res) {
            throw new NotFoundException('post not found');
        }
        return res;
    }
    async open(id, userId) {
        const res = await postSchema.findOneAndUpdate({ _id: id, ownerId: userId, status: { $in: [postStatus.OPEN, postStatus.COMPLETED, postStatus.ARCHIVED] } }, { status: postStatus.OPEN }, { new: true });
        if (!res) {
            throw new NotFoundException('post not found');
        }
        return res;
    }
    async archived(id, userId) {
        const res = await postSchema.findOneAndUpdate({ _id: id, ownerId: userId, status: { $in: [postStatus.COMPLETED, postStatus.ARCHIVED] } }, { status: postStatus.ARCHIVED }, { new: true });
        if (!res) {
            throw new NotFoundException('post not found');
        }
        return res;
    }
}

export default new PostRepository();
