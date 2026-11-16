import mongoose  from "mongoose";
import dotenv from "dotenv"

const connect_db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("successfully connected to db");
    } catch (error) {
        console.log("mongodb error");
        console.error(error.message);
        process.exit(1)
    }
};

export default connect_db