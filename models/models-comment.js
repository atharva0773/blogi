import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog"
    },

        createdBy: {
    type: Schema.Types.ObjectId,
    ref: "user",  // Make sure your User model name is "User"
    required: true
},
}, { timestamps: true });

const Comment = model("Comment", commentSchema);

export default Comment;
