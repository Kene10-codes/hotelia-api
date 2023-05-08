const mongoose = require ('mongoose');

const loginSchema = new mongoose.Schema ({
  phone: {
    required: true,
    type: Number,
  },
  password: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model ('LoginAdmin', loginSchema);
