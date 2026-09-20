import mongoose, { Schema } from "mongoose";


const enrollschema = new mongoose.Schema(
    {
        postId: {type: Schema.Types.ObjectId, default: null},
        enroll: { type: [mongoose.Schema.Types.ObjectId], default: [] }
              
    },
    {
        timestamps: true
    }
);

export default mongoose.model('enroll', enrollschema);