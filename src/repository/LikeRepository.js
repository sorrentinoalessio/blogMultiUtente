import MongoInternalException from '../exceptions/MongoInternalException.js';
import likeSchema from "../schemas/likeSchema.js";
import mongoose from 'mongoose';
import postSchema from '../schemas/postSchema.js';



class LikeRepository {
    async add(content) {
        try {
            const postVerify = await postSchema.exists({ _id: content.postId });
            if (postVerify) {
                const res = await likeSchema.findOneAndUpdate(
                    { postId: content.postId },
                    [ 
                        {
                            $set: {
                                likes: {
                                    $cond: [
                                        { $in: [new mongoose.Types.ObjectId(content.userId), { $ifNull: ["$likes", []] }] },
                                        { $setDifference: [{ $ifNull: ["$likes", []] }, [new mongoose.Types.ObjectId(content.userId)]] },
                                        { $setUnion: [{ $ifNull: ["$likes", []] }, [new mongoose.Types.ObjectId(content.userId)]] }
                                    ]
                                }
                            }
                        },
                        {
                            
                            $set: {
                                likesCount: { $size: "$likes" }
                            }
                        }
                    ], 
                    { new: true, upsert: true } // Opzioni
                );
                return res ? res.toObject() : null;
            } else {
                throw new MongoInternalException(`PostId ${content.postId} non trovato`, 404);
            }
        } catch (err) {
            console.error("Errore LikeRepository:", err);
            throw new MongoInternalException(`Errore durante l'operazione: ${err.message}`, err.code);
        }

    }
}

export default new LikeRepository();






