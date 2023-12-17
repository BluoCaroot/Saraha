import Message from "../../../DB/models/message.model.js"
import User from "../../../DB/models/user.model.js"
import * as validate from "../../utils/validate.js"


export const SendMessage = async (req, res, next) =>
{
    const { content, sentTo } = req.body

    if (!(content && sentTo))
        return res.status(400).json({message: "missing data"})


    if (!validate.ID(sentTo) || !(await User.findById(sentTo)))
        return res.status(404).json({message: "invalid user id"})

    const message = await Message.create({content, sentTo})
    if (!message)
        return res.status(500).json({message: "failed to send message"})
    
    res.status(201).json({message: "sent message"})

}

export const ViewMessages = async (req, res, next) =>
{
    const {_id, loggedinID} = req.body
    const {unread} = req.query

    if (unread && _id)
        return res.status(403).json({message: "not allowed to apply a filter when getting a specific message"})
    if (_id && !validate.ID(_id))
        return res.status(404).json({message: "invalid message id"})
    
    const message = parseInt(unread) ? await Message.find({isViewed: false}) :
    _id ? await Message.findOneAndUpdate({_id, sentTo: loggedinID}, {isViewed: true, $inc: {__v : 1}}) :
    await Message.find({sentTo: loggedinID})



    if (!message || !message.length)
        return res.status(_id ? 401 : 200).json({message: "no messages or missing permission"})
    

    res.status(200).json({message: "messages", message})
}

export const DeleteMessage = async (req, res, next) =>
{
    const {_id, loggedinID} = req.body

    if (!validate.ID(_id))
        return res.status(404).json({message: "invalid message id"})
    
    const message = await Message.findByIdAndDelete(_id, {sentTo: loggedinID})

    if (!message)
        return res.status(404).json({message: "invalid message id or missing permission"})
    
    res.status(200).json({message: "message deleted successfully"})

}