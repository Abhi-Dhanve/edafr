import Razorpay from "razorpay";

interface IProps {
  amount: number;
}

async function payNow(props: IProps) {
  const { amount } = props;

  const response = await fetch("/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: "receipt#1",
      notes: {},
    }),
  });

  const order = await response.json();

}
