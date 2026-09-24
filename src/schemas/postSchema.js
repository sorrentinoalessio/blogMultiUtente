import mongoose, { Schema } from "mongoose";
import { postStatus } from '../constants/const.js';

const postSchemas = new mongoose.Schema(
    {
        ownerId: { type: Schema.Types.ObjectId, default: null },
        title: String,
        description: String,
        status: { type: String, default: postStatus.DRAFT },
        creationDate: { type: Date, default: Date.now },
        eventDate: { type: Date, default: null },
        tag: [{tag:String}],
        img: String,
        levelScore: { type: Number, default: 0 },
        locality: { type: String, default: null },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        weather: { type: Schema.Types.Mixed, default: null },
        weatherUpdatedAt: { type: Date, default: null },

    },
    {
        timestamps: true
    }
);

export default mongoose.model('post', postSchemas);