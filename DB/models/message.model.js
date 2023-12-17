import { Schema, model } from "mongoose"

const MessageSchema = new Schema(
{
    content:
    {
        type: String,
        required: true,
    },
    sentTo:
    {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    isViewed:
    {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
})

const Message = model('message', MessageSchema)

export default Message
