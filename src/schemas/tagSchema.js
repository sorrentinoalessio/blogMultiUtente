import mongoose from "mongoose";

const tagSchema = new mongoose.Schema({
  nameTag: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true

  }
});

export default mongoose.model('Tag', tagSchema);

        
