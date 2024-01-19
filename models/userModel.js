import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: {
    required: true,
    type: String
  },
  lastname: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    unique: true
  },
  password: {
    required: true,
    type: String
  },
  address: {
    required: true,
    type: String
  },
  suspended: {
    type: Boolean,
    default: false
  },
  tel: {
    required: true,
    type: Number
  },
  accountNumber: {
    required: true,
    type: Number,
    unique: true
  },
  acctBalance: {
    type: Number,
    default: 0
  }
});

const UserModel = mongoose.model("user", userSchema);

export { UserModel };
