const authMiddleware = async (req, res, next) => {
    const token = req.params.token;
    console.log('token', token)
    if(!token) {
        res.json({message: 'token is required'})
        return;
    }
    try {
        const response = await fetch (`http://localhost:3000/users/getUserByToken/${token}`)
        const data = await response.json();
        const userId = await data.user._id;
        req.userId = userId;
        console.log('userId', data.user._id)
        next();
    }catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = authMiddleware;