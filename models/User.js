import mongoose from "mongoose";
const { Schema } = mongoose
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
    name: { type: String, required: [true, 'Please provide name'], minLength: 3, maxLength: 20, trim: true },

    email: { type: String, required: [true, 'Please provide email'], validate: { validator: validator.isEmail, message: 'Pleave provide a valid email' }, unique: true },

    password: { type: String, required: [true, 'Please provide password'], minLength: 6, select: false },

    lastName: { type: String, trim: true, maxLength: 20, default: 'lastname' },

    location: { type: String, trim: true, maxLength: 20, default: 'my location' }
})

UserSchema.pre("save", async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })
}

export default mongoose.model('User', UserSchema)