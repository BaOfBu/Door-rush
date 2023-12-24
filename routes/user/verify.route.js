// routes/verify.js
import express from 'express';
import Account from '../../models/accountModel.js';

const router = express.Router();

router.get('/:userId/:verificationToken', async (req, res) => {
  const userId = req.params.userId;
  const verificationToken = req.params.verificationToken;

  try {
    const user = await Account.findById(userId);

    if (!user || user.isVerified || user.emailVerificationToken !== verificationToken || user.emailVerificationExpires < Date.now()) {
      return res.status(400).send('Invalid verification link');
    }

    // Update user verification status
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.send('Email verified successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;
