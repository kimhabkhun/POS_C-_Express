import mongoose, { Schema } from "mongoose";

export interface userType {
  _id?: string;
  email?: string;
  sub?: string;
  name?: string;
  birthdate?: Date;
  profile?: string;
}

const UserSchema = new Schema<userType>(
  {
    email: { type: String, required: true },
    sub: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    birthdate: {
      type: Date,
      validate: {
        validator: (value: Date) => value < new Date(),
        message: "Birthdate must be in the past.",
      },
    },
    profile: { type: String },
  },
  { versionKey: false }
);

export const UserModel = mongoose.model<userType>("Users", UserSchema);

export default UserModel;
