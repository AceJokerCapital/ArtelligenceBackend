import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    sub: { type: String, required: true },
    name: { type: String, required: true },
    userPhoto: { type: String, required: true },
    apiKey: { type: String | null, required: false },
  },
  { timestamps: true, collection: "users" }
);

//by default mongo db will lower case User --> users and assign to users model in the database
//.model -> (name, schema, collection, skipInit)
const userSchema = mongoose.model("User", User, "users");

export default userSchema;
