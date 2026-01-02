import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
// import { v4 as uuid } from "uuid";




library.add(faCircleUser);

interface Transaction {
  type: string;
  from: string | null;
  to: string | undefined;
  amount: number;
  time: string;
  message?: string;
}

function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export default function SendMoney() {
  console.log("SEND MONEY API HIT");

  const to = useParams().to;
  const from = sessionStorage.getItem("loggedInUser");

  const [amount, setAmount] = useState<number>(0);
  const [txType, setTxType] = useState<string>("");
  const [senderMessage, setSenderMessage] = useState<string>("");
  const [totalTransactions, setTotalTransactions] = useState<Transaction[]>([]);
  const [transactionFlag, setTransactionFlag] = useState(false);

  const [isPaying, setIsPaying] = useState(false);

  const toUser = to ? capitalize(to) : "";

  const isSender = from === sessionStorage.getItem("loggedInUser");

  const handlePay = async () => {
    if (isPaying) return; // ⛔ block double calls
    setIsPaying(true);

    try {
      // const txId = uuid();
      const res = await fetch(
        `https://secure-pay-vlg7.onrender.com/api/v1/send-money-to/${to}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from,
            to,
            amount: amount,
            txType: txType
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTransactionFlag(data.flag);
        const newTransaction: Transaction = {
          type: txType,
          from: from,
          to: toUser,
          amount,
          time: data.time,
          message: senderMessage,
        };
        setTotalTransactions((prev) => [...prev, newTransaction]);
      } else {
        const errMessage = data.message || "Transaction Failed";
        toast.error(errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          //   transition: Bounce,
        });
      }
    } catch (err) {
      console.log("Error occurred in transaction ", err);
    } finally {
      setIsPaying(false); // ✅ release lock
    }
  };

  return (
    <div>
      <div className="fixed top-16 left-0 right-0 h-16 bg-blue-500 flex items-center px-4 sm:px-6 shadow-md z-40">
        <FontAwesomeIcon
          icon={faCircleUser}
          size="2xl"
          className="mr-3 text-white"
        />
        <h2 className="text-lg font-medium text-white">{toUser}</h2>
      </div>

      <div
        className="
        pt-32 pb-24 px-4 sm:px-6
        overflow-y-auto
      "
        style={{ height: "calc(100vh - 128px)" }}
      >
        {transactionFlag &&
          totalTransactions.map((tx, index) => (
            <div
              key={index}
              className={`flex w-full my-4 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl shadow-md ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-300 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-xs opacity-90 text-left">{tx.type}</p>
                <div className="flex justify-center">
                  <h1 className="text-lg font-semibold m-2">₹ {tx.amount}</h1>
                  <h1 className="text-lg font-semibold mt-2">
                    {isSender ? "Paid" : "Received"}
                  </h1>
                </div>
                <p className="text-sm font-md text-left">{tx.message}</p>
                <p className="text-xs opacity-70 text-right">{tx.time}</p>
              </div>
            </div>
          ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t p-2 sm:p-3 flex gap-2 items-center z-50">
        <select
          className="hidden sm:block rounded-xl border px-3 py-2 text-gray-700"
          value={txType}
          onChange={(e) => setTxType(e.target.value)}
        >
          <option value="">Category</option>
          <option>Shopping</option>
          <option>Stationary</option>
          <option>Food</option>
          <option>Clothes</option>
          <option>Travel</option>
          <option>Others</option>
        </select>

        <input
          className="flex-1 border rounded-xl px-4 py-2"
          placeholder="Write your message..."
          value={senderMessage}
          onChange={(e) => setSenderMessage(e.target.value)}
        />

        <input
          className="w-24 sm:w-32 border rounded-xl px-3 py-2"
          placeholder="₹ Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        <button
          type="button"
          onClick={handlePay}
          disabled={isPaying}
          className={`px-5 py-2 rounded-xl text-white ${
            isPaying
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isPaying ? "Processing..." : "Pay"}
        </button>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition={Bounce}
      />
    </div>
  );
}
