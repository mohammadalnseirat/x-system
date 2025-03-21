const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const authUserSchema = new Schema({
  profileImage: String,
  userName: String,
  email: String,
  password: String,
  customerInfo: [
    {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
      age: Number,
      country: String,
      gender: String,
      createdAt: Date,
      updatedAt: { type: Date, default: Date.now },
    },
  ],
});

authUserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();

  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//create a model based on schema
const AuthUser = mongoose.model("User", authUserSchema);

// export the model
module.exports = AuthUser;
