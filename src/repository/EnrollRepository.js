import MongoInternalException from '../exceptions/MongoInternalException.js';
import enrollschema from "../schemas/enrollSchema.js";
import mongoose from 'mongoose';
import postSchema from '../schemas/postSchema.js';



class LikeRepository {
    async add(content) {
        try {
            const postVerify = await postSchema.exists({ _id: content.postId });
            if (postVerify) {
                const res = await enrollschema.findOneAndUpdate(
                    { postId: content.postId },
                    [
                        {
                            $set: {
                                enroll: {
                                    $cond: [
                                        { $in: [new mongoose.Types.ObjectId(content.userId), { $ifNull: ["$enroll", []] }] },
                                        { $setDifference: [{ $ifNull: ["$enroll", []] }, [new mongoose.Types.ObjectId(content.userId)]] },
                                        { $setUnion: [{ $ifNull: ["$enroll", []] }, [new mongoose.Types.ObjectId(content.userId)]] }
                                    ]
                                }
                            }
                        },
                        {

                            $set: {
                                enrollsCount: { $size: "$enroll" }
                            }
                        }
                    ],
                    { new: true, upsert: true }
                );
                return res ? res.toObject() : null;
            } else {
                throw new MongoInternalException(`PostId ${content.postId} non trovato`, 404);
            }
        } catch (err) {
            throw new MongoInternalException(`Errore durante l'operazione: ${err.message}`, err.code);
        }

    }
}

export default new LikeRepository();






