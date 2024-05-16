import jwt from 'jsonwebtoken'
import User from '../../DB/models/user.model.js'


export const auth = (require = true) =>
{
    return async (req, res, next) => 
    {
        const { accesstoken } = req.headers
        try 
        {

            if (!require && !accesstoken)
                return next ()
                
            if (!accesstoken) throw (new Error('please login first', { cause: 400 }))

            if (!accesstoken.startsWith(process.env.TOKEN_PREFIX)) throw (new Error('invalid token prefix', { cause: 400 }))

            const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]

            const decodedData = jwt.verify(token, process.env.JWT_SECRET_LOGIN)

            if (!decodedData || !decodedData.id) throw (new Error('invalid token payload', { cause: 400 }))

            // user check 
            const foundUser = await User.findById(decodedData.id, 'username email role') // loggdInUser Role
            if (!foundUser) 
                throw (new Error('please signUp first', { cause: 404 }))

            
            req.authUser = foundUser
            next()
        } 
        catch (error) 
        {
            if (error != "TokenExpiredError: jwt expired")
                return next(error)
                
            const token = accesstoken.split(process.env.TOKEN_PREFIX)[1]
            const user = await User.findOne({token})
            if (!user) return next(new Error('please login', { cause: 401 }))
            const newToken = jwt.sign({ email: user.email, id: user._id,
                loggedIn: true }, 
                process.env.JWT_SECRET_LOGIN, { expiresIn: '1d' })
            user.token = newToken
            const userSaved = await user.save()
            if (!userSaved) return next(new Error('an Error occured', { cause: 500 }))
            res.status(201).json({message: 'token refreshed please resend your request',
                data: { token: process.env.TOKEN_PREFIX + newToken }})
        }
    }
}

