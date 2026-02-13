import mongoose, { Schema } from "mongoose";


const likeSchema = new mongoose.Schema(
    {
        postId: {type: Schema.Types.ObjectId, default: null},
        like: [Schema.Types.ObjectId]
        
        
    },
    {
        timestamps: true
    }
);

export default mongoose.model('like', likeSchema);