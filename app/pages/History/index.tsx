import { useState } from "react";

export default function Transactions() {
  const [details, setDetails] = useState(false);

  const handleExpand = () => {
    setDetails(!details);
  };
  const dummyData = [
    {
      method: "Credit Card",
      time: "2025-03-17 10:00 AM",
      amount: 300,
      sessions: [
        { type: "A", price: 50, quantity: 2 },
        { type: "B", price: 100, quantity: 1 },
        { type: "B", price: 100, quantity: 1 },
      ],
    },
    {
      method: "Paypal",
      time: "2025-01-17 10:00 AM",
      amount: 350,
      sessions: [
        { type: "A", price: 50, quantity: 1 },
        { type: "B", price: 100, quantity: 1 },
        { type: "C", price: 200, quantity: 1 },
      ],
    },
  ];

  return (
    <section className="p-page pt-5 flex flex-col items-center">
      {dummyData.map((transaction, index) => (
        <article
          key={index}
          className="px-4 py-2 border rounded-2xl flex flex-col justify-between w-full mb-4"
        >
          <header className="flex justify-between items-center mb-2">
            <h2 className="font-medium text-xl">{transaction.method}</h2>
            <span className="font-medium text-xl">${transaction.amount}</span>
          </header>

          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <time>{transaction.time}</time>
            <span>{transaction.sessions.length} items</span>
          </div>

          <button
            className="text-sm cursor-pointer text-left"
            onClick={handleExpand}
            aria-expanded={details}
          >
            {details ? (
              <div className="flex flex-col pt-2">
                <div className="border-b pb-2 uppercase">Tap to Collapse</div>

                {transaction.sessions.map((session, i) => (
                  <div
                    key={i}
                    className="flex justify-between pt-3 items-center border-b pb-2"
                  >
                    <div className="flex flex-col">
                      <div className="capitalize text-lg">Session {session.type}</div>
                      <div className="text-sm text-gray-500">
                        {session.quantity} x ${session.price}
                      </div>
                    </div>
                    <div className="font-medium text-xl">
                      ${session.quantity * session.price}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between py-3 items-center">
                  <div className="capitalize text-lg">Total</div>
                  <div className="font-medium text-xl">${transaction.amount}</div>
                </div>
              </div>
            ) : (
              <p className="uppercase">Tap to Expand Details</p>
            )}
          </button>
        </article>
      ))}
    </section>
  );
}
