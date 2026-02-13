import MongoInternalException from '../exceptions/MongoInternalException.js';
import likeSchema from "../schemas/likeSchema.js";


class LikeRepository {
    async add(content) {
        try {
            const res = await likeSchema.findOneAndUpdate(
                { postId: content.postId },          
                { $addToSet: { likes: content.userId} }, 
                { new: true, upsert: true }         
            );
            console.log(res)
            return res.toObject();

        } catch (err) {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        }
    }
}

export default new LikeRepository();






