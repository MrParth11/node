import mongoose from "mongoose";

const db = mongoose.connect("mongodb://localhost:27017/final-Project")
.then(()=> console.log("Mongo Db Connected"))
.catch((err)=> console.log(err))

export default db