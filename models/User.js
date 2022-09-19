import mongoose from "mongoose";
const { Schema } = mongoose
import validator from "validator";

const UserSchema = new Schema({
    name: { type: String, required: [true, 'Please provide name'], minLength: 3, maxLength: 20, trim: true },

    email: { type: String, required: [true, 'Please provide email'], validate: { validator: validator.isEmail, message: 'Pleave provide a valid email' }, unique: true },

    password: { type: String, required: [true, 'Please provide password'], minLength: 6 },

    lastName: { type: String, trim: true, maxLength: 20, default: 'lastname' },

    location: { type: String, trim: true, maxLength: 20, default: 'my location' }
})

export default mongoose.model('User', UserSchema)