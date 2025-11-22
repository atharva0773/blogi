import { Schema, model } from "mongoose";
import { createHmac, hash, randomBytes } from 'crypto'
import { createTokenForUser } from "../utils/auth.js";

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
        
    },
    password: {
        type: String,
        required: true,

    },
    profileImageURL: {
        type: String,
        default: '/images/defaultImg.png',

    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },

}, { timestamps: true });

UserSchema.pre("save", function (next) {
    const user = this

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString("hex");
    const hashedPassword = createHmac('sha256', salt)
        .update(user.password)
        .digest("hex");

    this.salt = salt;
    this.password = hashedPassword
    next();
})

 UserSchema.static('matchPasswordAndGenerateToken', async function(email,password){
    const user = await this.findOne({email});
    if(!user)  throw new Error('user not found');
    const salt =user.salt;
    const hashedPassword= user.password;

    const userProvidedHash = createHmac('sha256', salt)
        .update(password)
        .digest("hex");
        if(hashedPassword!==userProvidedHash)  throw new Error('Incorrect password');

        const token = createTokenForUser(user)
        return token;


})
const User = model("user", UserSchema); 

export default User; 
