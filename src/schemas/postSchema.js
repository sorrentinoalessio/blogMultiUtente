import mongoose, { Schema } from "mongoose";
import { postStatus } from '../constants/const.js';

const postSchemas = new mongoose.Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, default: null },
        name: String,
        description: String,
        status: { type: String, default: postStatus.OPEN },
        dueDate: { type: Date, default: new Date() }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('post', postSchemas);
