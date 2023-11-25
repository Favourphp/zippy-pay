const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balances: {
    dollar: { type: Number, default: 0 },
    pound: { type: Number, default: 0 },
    yuan: { type: Number, default: 0 },
  },
  // Add other wallet-related fields as needed
});

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;
