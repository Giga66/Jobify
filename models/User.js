import mongoose from "mongoose";
const { Schema } = mongoose
import validator from "validator";
import bcrypt from 'bcryptjs'

const UserSchema = new Schema({
    name: { type: String, required: [true, 'Please provide name'], minLength: 3, maxLength: 20, trim: true },

    email: { type: String, required: [true, 'Please provide email'], validate: { validator: validator.isEmail, message: 'Pleave provide a valid email' }, unique: true },

    password: { type: String, required: [true, 'Please provide password'], minLength: 6 },

    lastName: { type: String, trim: true, maxLength: 20, default: 'lastname' },

    location: { type: String, trim: true, maxLength: 20, default: 'my location' }
})

UserSchema.pre("save", async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    console.log(this)
}

export default mongoose.model('User', UserSchema)