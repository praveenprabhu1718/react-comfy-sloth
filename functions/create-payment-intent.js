require("dotenv").config();

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  console.log(event);
  if (event.body) {
    const { cart, totalAmount, shippingFee } = JSON.parse(event.body);

    const calculateOrderAmount = () => {
      return totalAmount + shippingFee;
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(),
        currency: "inr",
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: e.message }),
      };
    }
  }
  return {
    statusCode: 200,
    body: "Create payment intent",
  };
};
