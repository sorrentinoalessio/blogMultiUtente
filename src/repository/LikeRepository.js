import MongoInternalException from '../exceptions/MongoInternalException.js';
import likeSchema from "../schemas/likeSchema.js";
import mongoose from 'mongoose';



class LikeRepository {
    async add(content) {
        try {
            const userId = new mongoose.Types.ObjectId(content.userId);

            const res = await likeSchema.findOneAndUpdate(
                { postId: content.postId },
                [
                    {
                        $set: {
                            likes: {
                                $filter: {
                                    input: {
                                        $cond: [
                                            { $in: [userId, { $ifNull: ["$likes", []] }] },
                                            { $setDifference: [{ $ifNull: ["$likes", []] }, [userId]] },
                                            { $concatArrays: [{ $ifNull: ["$likes", []] }, [userId]] }
                                        ]
                                    },
                                    as: "value",
                                    cond: { $ne: ["$$value", null] } // rimuove null
                                }
                            }
                        }
                    }
                ],
                { new: true, upsert: true }
            );

            return res.toObject();

        } catch (err) {
            throw new MongoInternalException(`something went wrong: ${err.message}`, err.code);
        }
    }
}

export default new LikeRepository();






