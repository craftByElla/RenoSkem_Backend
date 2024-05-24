const get_idSkillsWithTokenUSerMiddleware = async (req, res, next) => {
    const token = req.params.token;
    console.log('token', token)
    if(!token) {s
        res.json({message: 'token is required'})
        return;
    }
    try {
        const response = await fetch (`http://localhost:3000/users/getUserByToken/${token}`)
        const data = await response.json();
        const skillsId = await data.user.skills._id; // recuperer l'id de skills qui est populated dans /user/getUserByToken
        req.skillsId = skillsId;
        console.log('userId', data.user._id)
        next();
    }catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

module.exports = get_idSkillsWithTokenUSerMiddleware;