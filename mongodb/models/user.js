import mongoose from "mongoose";

const User = new mongoose.Schema({
   sub: { type: String, required: true },
   name: { type: String, required: true },
   userPhoto: { type: String, required: true },
})


const userSchema = mongoose.model('User', User);

export default userSchema;