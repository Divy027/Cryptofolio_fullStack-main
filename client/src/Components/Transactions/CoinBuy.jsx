import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CoinBuy() {
  const { state } = useLocation();
  const login = localStorage.getItem("authToken");
  const [data, setData] = useState();
  const [currPrice, setCurrPrice] = useState();
  const [id, setId] = useState();
  const [allTransactions, setAllTransactions] = useState([]);
  const [currBalance, setCurrBalance] = useState();
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [amountForAmount, setAmountForAmount] = useState("");
  const [quantityForAmount, setQuantityForAmount] = useState("");

  // Set data from route state
  useEffect(() => {
    if (state?.data) {
      setData(state.data);
    }
  }, [state]);

  // Set current price
  useEffect(() => {
    if (data) {
      const calculatedPrice = (data.current_price / 100) * 70;
      setCurrPrice(calculatedPrice.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      }));
    }
  }, [data]);

  // Fetch user ID and wallet transactions
  useEffect(() => {
    if (login) {
      getUserId();
      getAllTransactions();
    }
  }, [login]);

  const getUserId = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/dashboard/dashboard", // Updated URL for localhost
        {
          method: "POST",
          body: JSON.stringify({ Token: login }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      const json = await response.json();
      setId(json.id);
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const getAllTransactions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/wallet/getwalletTransaction", // Updated URL for localhost
        { login },
        { headers: { "Content-Type": "application/json" } }
      );
      setAllTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getCurrBalance = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/wallet/getwalletAmount", // Updated URL for localhost
        { login },
        { headers: { "Content-Type": "application/json" } }
      );
      setCurrBalance(response.data[0]?.Amount || 0);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
    }
  };

  // Handle buy by quantity
  const handleBuyByQuantity = async () => {
    if (Number(quantity) <= 0) {
      return alert("Please enter a valid quantity");
    }

    await getCurrBalance();

    const transactionAmount = (data.current_price / 100) * 70 * quantity;

    const newTransaction = {
      img: data.image,
      CoinId: data.id,
      CoinName: data.name,
      Quantity: quantity,
      Amount: transactionAmount,
      Date: new Date(),
      Price: (data.current_price / 100) * 70,
      type: "Buy",
    };

    const updatedTransactions = [...allTransactions, newTransaction];

    try {
      const response = await axios.post(
        "http://localhost:3001/transactions/transactions", // Updated URL for localhost
        {
          Quantity: quantity,
          Amount: transactionAmount,
          login,
          CoinName: data.name,
          Transaction: updatedTransactions,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data === "NO") {
        alert("Not enough balance");
      } else if (response.data === "YES") {
        window.history.back(); // Go back to the previous page
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  // Handle buy by amount
  const handleBuyByAmount = async () => {
    await getCurrBalance();

    const quantityByAmount = amountForAmount / ((data.current_price / 100) * 70);

    const newTransaction = {
      img: data.image,
      CoinId: data.id,
      CoinName: data.name,
      Quantity: quantityByAmount,
      Amount: amountForAmount,
      Date: new Date(),
      Price: (data.current_price / 100) * 70,
      type: "Buy",
    };

    const updatedTransactions = [...allTransactions, newTransaction];

    try {
      const response = await axios.post(
        "http://localhost:3001/transactions/transactions", // Updated URL for localhost
        {
          Quantity: quantityByAmount,
          Amount: amountForAmount,
          login,
          CoinName: data.name,
          Transaction: updatedTransactions,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data === "NO") {
        alert("Not enough balance");
      } else if (response.data === "YES") {
        window.history.back(); // Go back to the previous page
      }
    } catch (error) {
      console.error("Error processing transaction:", error);
    }
  };

  // Handle quantity input change
  useEffect(() => {
    if (quantity) {
      const calcAmount = (data.current_price / 100) * 70 * quantity;
      setAmount(calcAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
        style: "currency",
        currency: "INR",
      }));
    } else {
      setAmount("");
    }
  }, [quantity, data]);

  // Handle amount input change
  useEffect(() => {
    if (amountForAmount) {
      setQuantityForAmount(
        amountForAmount / ((data.current_price / 100) * 70)
      );
    } else {
      setQuantityForAmount("");
    }
  }, [amountForAmount, data]);

  return (
    <div className="m-5">
      <div className="z-30 w-[80%] mx-auto p-5 bg-[#1d2230] rounded-md">
        <div className="font-bold text-white text-center text-[20px] md:text-[22px] mb-12">
          Confirm Payment
        </div>
        <div className="m-5 grid grid-cols-1 md:grid-cols-2">
          <div className="p-3 mx-auto bg-[#171b26] rounded-lg text-white pt-6 md:mr-4 mb-4 md:w-[80%]">
            <div className="font-semibold text-white text-center text-[18px] md:text-[20px] mb-4">
              {data?.name}
            </div>
            <div className="w-[100px] h-[100px] mx-auto">
              <img src={data?.image} alt={data?.name} />
            </div>
            <div className="font-semibold text-white text-center text-[16px] md:text-[18px] m-4">
              Current Price: {currPrice}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-3">
            {/* Buy by Quantity */}
            <div className="p-3 mb-4 mx-auto bg-[#171b26] rounded-lg text-white pt-6">
              <div className="text-center font-medium mb-5 text-[17px]">
                Buy by Quantity
              </div>
              <div className="grid grid-cols-1 m-3">
                <label className="font-medium">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-black p-[1px] m-2 text-center"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="grid grid-cols-1 m-3">
                <div className="font-medium">Amount:</div>
                <div>{amount}</div>
              </div>
              <button
                onClick={handleBuyByQuantity}
                className="bg-[#209fe4] w-[100%] p-1 mt-6 rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
              >
                Buy
              </button>
            </div>

            {/* Buy by Amount */}
            <div className="p-3 mb-4 mx-auto bg-[#171b26] rounded-lg text-white pt-6">
              <div className="text-center font-medium text-[17px]">Buy by Amount</div>
              <div className="grid grid-cols-1 m-3">
                <label className="font-medium">Amount</label>
                <input
                  type="number"
                  value={amountForAmount}
                  onChange={(e) => setAmountForAmount(e.target.value)}
                  className="text-black p-[1px] m-2 text-center"
                  placeholder="Enter amount"
                />
              </div>
              <div className="grid grid-cols-1 m-3">
                <div className="font-medium">Quantity:</div>
                <div>{quantityForAmount}</div>
              </div>
              <button
                onClick={handleBuyByAmount}
                className="bg-[#209fe4] w-[100%] p-1 mt-6 rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
