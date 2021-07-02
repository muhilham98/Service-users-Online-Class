const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email:{
    type: String,
    required: true,
    unique: true
  },

  password:{
    type: String,
    required: true,
  },

  image_profile: {
    type: String
  },

  skill: {
    type: String
  },

  // experience: {
  //   type: String,
  //   default: null
  // },

  role: {
    type: String,
    enum : ['student','admin', 'teacher'],
    default: 'student'
  },

  created_at: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model("User", userSchema);
