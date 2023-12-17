import User from "../../../DB/models/user.model.js"
import bcrypt from 'bcrypt'
import * as validate from "../../utils/validate.js"

export const Signup = async (req, res, next) =>
{
    const { username, email, password } = req.body

    if (!(username && email && password))
        return res.status(400).json({message: "missing data"})


    if (await User.findOne({username}))
        return res.status(400).json({message: "duplicate username"})

    if (!validate.Email(email))
        return res.status(400).json({message: "invalid email"})

    if (await User.findOne({email}))
        return res.status(400).json({message: "duplicate email"})
        
    const hashed = bcrypt.hashSync(password, parseInt(process.env.SALT_ROUNDS))
    const user = await User.create({username, email, password: hashed})
    
    if (!user)
        return res.status(500).json({message: "user registration failed"})

    res.status(201).json({message: "user registered"})
}

export const Signin = async (req, res, next) =>
{
    const { username, email, password } = req.body

    if (!((username || email) && password))
        return res.status(400).json({message: "missing data"})

    if (username && email)
        return res.status(403).json({message: "logging in with both email and username is not allowed"})

    const user = await User.findOne({$or:[{username}, {email}]})

    if (!user)
        return res.status(404).json({message: "invalid login credintals"})

    const isPasswordMatch = bcrypt.compareSync(password, user.password)

    if (!isPasswordMatch)
        return res.status(404).json({message: "invalid login credintals"})

    res.status(200).json({message: "logged in successfully"})

}

export const UpdateUser = async (req, res, next) =>
{
    const { username, email } = req.body
    const { _id, loggedinID } = req.query
    let obj = {}

    if (loggedinID != _id)
        return res.status(401).json({message: "missing permission"})

    if (username)
    {
        if (await User.findOne({username, _id: {$ne:_id}}))
            return res.status(400).json({message: "duplicate username"})

        obj.username = username
    }
    if (email)
    {
        if (!validate.Email(email))
            return res.status(400).json({message: "invalid email"})

        if (await User.findOne({email, _id: {$ne:_id}}))
            return res.status(400).json({message: "duplicate email"})

        obj.email = email
    }
    if (!validate.ID(_id))
        return res.status(404).json({message: "invalid user id"})
    const user = await User.findByIdAndUpdate(_id, obj)

    if (!user)
        return res.status(404).json({message: "invalid user id"})

    res.status(200).json({message: "updated user"})

}

export const DeleteUser = async (req, res, next) =>
{
    const { _id, loggedinID } = req.query

    if (!validate.ID(_id))
        return res.status(404).json({message: "invalid user id"})

    if (loggedinID != _id)
        return res.status(403).json({message: "missing permission"})
    
    const user = await User.findByIdAndDelete(_id)

    if (!user)
        return res.status(404).json({message: "invalid user id"})
    
    res.status(200).json({message: "deleted user"})
    next()
}

export const GetUser = async (req, res, next) =>
{
    const { _id } = req.query

    if (!validate.ID(_id))
        return res.status(404).json({message: "invalid user id"})

    const user = await User.findById(_id)

    if (!user)
        return res.status(404).json({message: "invalid user id"})

    res.status(200).json({message: "user", user})
}