import mongoose, { Schema } from "mongoose";
import { postStatus } from '../constants/const.js';

const postSchemas = new mongoose.Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, default: null },
        title: String,
        description: String,
        status: { type: String, default: postStatus.DRAFT },
        creationDate: { type: Date, default: Date.now },
        tag: [String],
        img: String
        
    },
    {
        timestamps: true
    }
);

export default mongoose.model('post', postSchemas);