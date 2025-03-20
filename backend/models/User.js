const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  score: {
    correct: {
      type: Number,
      default: 0
    },
    incorrect: {
      type: Number,
      default: 0
    }
  },
  inviteCode: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.methods.comparePassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compareSync(password, user.password);
  return isMatch;
};

userSchema.pre("save", async function (next) {
 // Check if the password is modified, if not, return to next route
  if (!this.isModified("password")) return next();

  const salt = "$2a$10$juvOZ0dxG20ugXTWn8dTD.";
  const hash = await bcrypt.hashSync(this.password, salt);
  this.password = hash;
  next();
});

module.exports = mongoose.model('User', userSchema);