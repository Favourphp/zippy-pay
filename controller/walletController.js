// const Wallet = require('../models/Wallet');

// const walletController = {
//   getBalance: async (req, res) => {
//     try {
//       const userId = req.user.userId;
//       const wallet = await Wallet.findOne({ userId });

//       if (!wallet) {
//         return res.status(404).json({ error: 'Wallet not found' });
//       }

//       res.json({ balances: wallet.balances });
//     } catch (error) {
//       console.error('Get Balance error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   topUp: async (req, res) => {
//     try {
//       const userId = req.user.userId;
//       const { currency, amount } = req.body;

//       if (!currency || !['dollar', 'pound', 'yuan'].includes(currency)) {
//         return res.status(400).json({ error: 'Invalid currency' });
//       }

//       if (!amount || amount <= 0) {
//         return res.status(400).json({ error: 'Invalid amount' });
//       }

//       let wallet = await Wallet.findOne({ userId });

//       if (!wallet) {
//         wallet = new Wallet({ userId, balances: { [currency]: amount } });
//         await wallet.save();
//       } else {
//         wallet.balances[currency] += amount;
//         await wallet.save();
//       }

//       res.json({ message: 'Top-up successful', balances: wallet.balances });
//     } catch (error) {
//       console.error('Top-Up error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   makePayment: async (req, res) => {
//     try {
//       const userId = req.user.userId;
//       const { currency, amount } = req.body;

//       if (!currency || !['dollar', 'pound', 'yuan'].includes(currency)) {
//         return res.status(400).json({ error: 'Invalid currency' });
//       }

//       if (!amount || amount <= 0) {
//         return res.status(400).json({ error: 'Invalid amount' });
//       }

//       const wallet = await Wallet.findOne({ userId });

//       if (!wallet || wallet.balances[currency] < amount) {
//         return res.status(400).json({ error: 'Insufficient funds' });
//       }

//       wallet.balances[currency] -= amount;
//       await wallet.save();

//       res.json({ message: 'Payment successful', balances: wallet.balances });
//     } catch (error) {
//       console.error('Make Payment error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   getExchangeRate: (req, res) => {
//     try {
//       // Implement logic to fetch real-time exchange rates
//       // You may use an external API or implement WebSocket technology
//       // Return exchange rates for Dollar, Pound, and Yuan
//       res.json({ exchangeRates: { dollar: 1, pound: 0.74, yuan: 6.45 } });
//     } catch (error) {
//       console.error('Get Exchange Rate error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },

//   checkOut: async (req, res) => {
//     try {
//       const userId = req.user.userId;
//       const { amount, currency } = req.body;

//       if (!currency || !['dollar', 'pound', 'yuan'].includes(currency)) {
//         return res.status(400).json({ error: 'Invalid currency' });
//       }

//       if (!amount || amount <= 0) {
//         return res.status(400).json({ error: 'Invalid amount' });
//       }

//       const wallet = await Wallet.findOne({ userId });

//       if (!wallet || wallet.balances[currency] < amount) {
//         return res.status(400).json({ error: 'Insufficient funds' });
//       }

//       wallet.balances[currency] -= amount;
//       await wallet.save();

//       // Implement checkout logic (e.g., order processing)

//       res.json({ message: 'Checkout successful', balances: wallet.balances });
//     } catch (error) {
//       console.error('Checkout error:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   },
// };

// module.exports = walletController;
