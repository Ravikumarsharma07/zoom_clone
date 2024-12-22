import mongoose from "mongoose"

type connectionObject = {
    isConnected?:Number
}

const connection: connectionObject = {}

export default async function dbConnect(){
    if(connection.isConnected){
        console.log("database already connnected")
        return
    }

    try {
        const db = await mongoose.connect(`${process.env.DATABASE_URL}/${process.env.DB_PASSWORD}`)  
        connection.isConnected = db.connections[0].readyState 
        console.log("DB connected")  
        console.log(connection)    
    } catch (error) {
        console.error("error in connecting database",error)
        process.exit(1)
    }
}