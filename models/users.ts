import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        trim:true,
        unique:false
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"]
    }
})

  


const UserModel = (mongoose.models.User) || (mongoose.model("User", UserSchema))
export default UserModel
