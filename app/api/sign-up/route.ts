import dbConnect from "@/lib/dbConnect"
import UserModel from "@/models/users"
import bcrypt from "bcryptjs"


export async function POST(request:Request){
    const userCredentials = await request.json()
    await dbConnect()
    try {
        const existingUser = await UserModel.findOne({email:userCredentials.email})
        if(existingUser){
            return Response.json({
                success:false,
                message:"User already exists with this email, use different email"
            },{status:401}) 
        }
        const hashedPassword = await bcrypt.hash(userCredentials.password, 10)
        const newUser = new UserModel({
                username:userCredentials.username,
                email:userCredentials.email,
                password:hashedPassword
        })
        await newUser.save()
        return Response.json({
            success:true,
            message:"Signed up successfully"
        },{status:200})
    } catch (error) {
        console.log(error)
        throw new Error("Error while signing up user")
    }
    
}