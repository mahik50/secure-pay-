import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Transaction {
  sender: string;
  receiver: string;
  amount: number;
  createdAt: string;
}

export default function UserHistory() {
  const loggedInUser = sessionStorage.getItem("loggedInUser");
  const [tx, setTx] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!loggedInUser) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "https://secure-pay-vlg7.onrender.com/api/v1/show-history",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ loggedInUser }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || "Error occurred while fetching history"
          );
        }

        setTx(data.userHistory);
      } catch (err: any) {
        toast.error(err.message || "Fetch history failed");
      }
    };

    fetchHistory();
  }, [loggedInUser]);

  return (
    <main className="pt-20 px-4 sm:px-8 max-w-4xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-semibold mb-6">
        Transaction History
      </h2>

      {tx.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="space-y-4">
          {tx.map((eachtx, index) => {
            const date = new Date(eachtx.createdAt).toLocaleDateString();
            const time = new Date(eachtx.createdAt).toLocaleTimeString();

            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {eachtx.sender === loggedInUser
                      ? `To ${eachtx.receiver}`
                      : `From ${eachtx.sender}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    {date} at {time}
                  </p>
                </div>

                <p
                  className={`font-semibold ${
                    eachtx.sender === loggedInUser
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  ₹{eachtx.amount}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <ToastContainer />
    </main>
  );
}
