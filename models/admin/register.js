const mongoose = require ('mongoose');

const registerSchema = new mongoose.Schema ({
  username: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: Number,
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model ('RegisterAdmin', registerSchema);
