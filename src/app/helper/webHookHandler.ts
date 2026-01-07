import Stripe from 'stripe';
import config from '../config';
import Subscription from '../modules/subscription/subscription.model';
import Payment from '../modules/payment/payment.model';
import User from '../modules/user/user.model';
import Shop from '../modules/shop/shop.model';
import Booking from '../modules/booking/booking.model';

const stripe = new Stripe(config.stripe.secretKey!);

const webHookHandler = async (req: any, res: any) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret!,
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      const payment = await Payment.findOne({
        stripeSessionId: session.id,
      });
      if (!payment) return res.json({ received: true });

      const user = await User.findById(payment.user);
      if (!user) return res.json({ received: true });

      payment.status = 'completed';
      payment.stripePaymentIntentId = session.payment_intent as string;
      await payment.save();

      const paymentType = session.metadata?.paymentType;

      if (paymentType === 'subscription') {
        const subscription = await Subscription.findById(payment.subscription);
        if (!subscription) return res.json({ received: true });

        if (!subscription.totalSubscribedUsers?.includes(user._id)) {
          subscription?.totalSubscribedUsers?.push(user._id);
          await subscription.save();
        }

        const monthAdd = subscription.type === 'yearly' ? 12 : 1;

        const expireDate = new Date();
        expireDate.setMonth(expireDate.getMonth() + monthAdd);

        user.isSubscription = true;
        user.subscription = subscription._id;
        user.subscriptionExpiry = expireDate;
        await user.save();
        await user.save();

        return res.json({ received: true });
      }
      if (paymentType === 'shop') {
        const shop = await Shop.findById(payment.shop);
        if (!shop) return res.json({ received: true });

        if (!shop.totalShopUsers?.includes(user._id)) {
          shop?.totalShopUsers?.push(user._id);
          await shop.save();
        }

        await Booking.findOneAndUpdate(payment.booking, {
          status: 'completed',
          paymentId: payment._id,
        });

        return res.json({ received: true });
      }
    }
  } catch (error: any) {
    console.error('❌ Handler Error:', error.message);
    return res.status(500).send(`Webhook Handler Error: ${error.message}`);
  }
};

export default webHookHandler;
