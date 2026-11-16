import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
       name:{
        type:String,
        required: [true,"Name is required"],
        trim:true,
       },
       email:{
        type:String,
        required:[true, "email is required"],
        unique:true,
        lowercase:true,
        trim:true,
       },

       password:{
        type:String,
        required:[true, "Password is required"],
        minlength:6,
        select:false,
       },
       role:{
         type:String,
         enum:['admin', 'user'],
         default: 'user',
       },
       profile:{
        age:{type:Number,min:0, max:120},
        state:{type:String, trim:true},
        annualIncome:{type:Number, min:0},
        category:{
            type:String,
            enum:['SC','ST','OBC','General','EWS',''],
            default:'',
        },
        occupation:{type:String ,trim:true},
       },

    },
    {timestamps:true}

);

// runs before every save: hashes the password automatically
userSchema.pre("save",async function () {
    if(!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password,10);
});

//used during login : compares plain password with the stored hash
userSchema.methods.matchedPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

// used whenever the user is sent in a response: removes the password
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};


const User = mongoose.model('User',userSchema);

export default User;