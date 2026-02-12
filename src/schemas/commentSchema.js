import mongoose, { Schema } from "mongoose";


const commentSchemas = new mongoose.Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, default: null },
        comment: String,
        postId: {type: Schema.Types.ObjectId, default: null}
    },
    {
        timestamps: true
    }
);

export default mongoose.model('comment', commentSchemas);