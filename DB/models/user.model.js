import { Schema, model } from "mongoose"
import Message from "./message.model.js"

const UserSchema = new Schema(
{
    username:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password:
    {
        type: String,
        required: true,
    },
    isConfirmed:
    {
        type: Boolean,
        default: false
    },
    profilePicture: String

},
{
    timestamps: true
})

UserSchema.pre('remove', async function (next) {
    await Message.deleteMany({sentTo: this._id})
})

const User = model('user', UserSchema)

export default User