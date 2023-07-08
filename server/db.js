import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: './.env' })

// Database Setup
// const connection = mongoose.createConnection(process.env.DB_STRING);
mongoose.connect(process.env.DB_STRING).then(() => console.log('Connected to MongoDB')).catch(e => console.error(e));

const UserSchema = new mongoose.Schema({
  username: String,
  displayname: String,
  hash: String,
  salt: String,
  user: Object,
  githubId: String,
  googleId: String,
});

export const User = mongoose.model("User", UserSchema)
