const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const RefreshTokenSchema = new mongoose.Schema({
  refresh_token: {
      type: String,
      required: true
  },

  user_id: {
    type: ObjectId,
    ref: 'User'
  },

  created_at: {
    type: Date,
    default: Date.now()
  }

});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
