import mongoose from "mongoose";


const Post = new mongoose.Schema({
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },

}); // we must create a schema blueprint 


const PostSchema = mongoose.model('Post', Post); // we must take the schema blueprint and publish a model... The model is the main structure or documenmt

export default PostSchema;