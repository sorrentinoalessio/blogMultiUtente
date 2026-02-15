import mongoose, { Schema } from "mongoose";


const likeSchema = new mongoose.Schema(
    {
        postId: {type: Schema.Types.ObjectId, default: null},
        likes: { type: [mongoose.Schema.Types.ObjectId], default: [] }
              
    },
    {
        timestamps: true
    }
);

export default mongoose.model('like', likeSchema);