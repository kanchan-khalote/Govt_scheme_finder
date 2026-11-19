import User from '../models/userModel.js';

export const getme = async (req, res,next) => {
 try {
    const user = await User.findById(req.user.id);
    if(!user){
        return res.status(404).json({
            message:"User not found"
        });
    }
    res.json({
        id: user._id,
        name: user.name,
        email:user.email,
        role:user.role,
        profile:user.profile,
    });
 } catch (error) {
    next(error)
 }
    
};

export const updateProfile = async (req, res, next) => {
    try {
        const {age,gender, state, annualIncome, category, occupation } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { profile :{age,gender, state, annualIncome, category, occupation}},
            { new : true, runValidators: true }
        ); 
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.json({
            profile: user.profile
        });
    } catch (error) {
        next(error)
    }
};

