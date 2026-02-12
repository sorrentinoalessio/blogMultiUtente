import MongoInternalException from '../exceptions/MongoInternalException.js';
import commentSchema from "../schemas/commentSchema.js";


class CommentRepository {
    async add(content) {
        try {
            const res = await commentSchema.create(content);
            console.log(res)
            return res.toObject();

        } catch (err) {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        }
    }
}

export default new CommentRepository();






