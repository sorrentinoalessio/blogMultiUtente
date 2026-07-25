import MongoInternalException from '../exceptions/MongoInternalException.js';
import commentSchema from "../schemas/commentSchema.js";
import postSchema from '../schemas/postSchema.js';
import userSchema from '../schemas/userSchema.js';
import mailService from '../services/mailService.js';

class CommentRepository {
    async add(content) {
        try {
            const post = await postSchema.findOne({ _id: content.postId }, { ownerId: 1 , title: 1});
            if (!post) {
                throw new MongoInternalException(`Impossibile commentare: PostId ${content.postId} non trovato`, 404);
            }
            const postUser = await userSchema.findOne({_id: post.ownerId},{email: 1});
            if (!postUser) {
                throw new MongoInternalException(`Utente non trovato`, 404);
            }
            const res = await commentSchema.create(content);
            await mailService.sendMailCommentNotification(postUser, post);
            return res ? res.toObject() : null;
        } catch (err) {
            if (err instanceof MongoInternalException) throw err;
            throw new MongoInternalException(`Errore creazione commento: ${err.message}`, err.code || 500);
        }
    }

    async list(userId) {
        try {
            const res = await commentSchema.find({ ownerId: userId });
            return res
        } catch (err) {
            if (err instanceof MongoInternalException) throw err;
            throw new MongoInternalException(`Errore creazione commento: ${err.message}`, err.code || 500);
        }
    }


    async deleteCommentbyData(userId, data) {
        try {
            const res = await commentSchema.findOneAndDelete({ ownerId: userId, _id: data }, { new: true });
            return res;
        } catch (err) {
            if (err instanceof MongoInternalException) throw err;
            throw new MongoInternalException(`Errore creazione commento: ${err.message}`, err.code || 500);
        }
    }
}

export default new CommentRepository();

