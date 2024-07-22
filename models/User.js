import { Schema, model } from "mongoose";
import pkgs from 'bcryptjs';
const { hash, compare } = pkgs;
import pkg from 'jsonwebtoken';
const { verify } = pkg;

const UserSchema = new Schema(
  {
    avatar: { type: String, default: "" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    admin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
    return next();
  }
  return next();
});

UserSchema.methods.generateJWT = async function () {
  console.log('JWT_SECRET:', process.env.JWT_SECRET);
  console.log('sign function:', sign);
  try {
  return await sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}; catch (error) {
    console.error('Error in generateJWT:', error);
    throw error;
}
};

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

const User = model("User", UserSchema);
export default User;
