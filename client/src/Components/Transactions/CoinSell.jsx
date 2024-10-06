import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function CoinSell() {
  const { state } = useLocation();

  const [data, setData] = useState(null);
  const [currPrice, setCurrPrice] = useState(null);
  const [id, setId] = useState();
  const [allTransaction, setAllTransaction] = useState([]);
  const [currBalance, setCurrBalance] = useState();
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [quantityForAmount, setQuantityForAmount] = useState("");
  const [amountForAmount, setAmountForAmount] = useState("");

  const login = localStorage.getItem("authToken");

  useEffect(() => {
    if (state?.data) {
      setData(state.data);
      setCurrPrice(
        ((state.data.current_price / 100) * 70).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        })
      );
    }
  }, [state]);

  const getId = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/dashboard/dashboard",
        {
          method: "POST",
          body: JSON.stringify({ Token: localStorage.authToken }),
          mode: "cors",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const json = await response.json();
      setId(json.id);
    } catch (error) {
      console.error("Error fetching ID:", error);
    }
  };

  const getAllTransactions = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3001/wallet/getwalletTransaction",
        data: { login },
        headers: { "Content-type": "application/json" },
      });
      setAllTransaction(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getAmount = async () => {
    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3001/wallet/getwalletAmount",
        data: { login },
        headers: { "Content-type": "application/json" },
      });
      setCurrBalance(res.data[0].Amount);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  useEffect(() => {
    getAllTransactions();
    getId();
  }, []);

  useEffect(() => {
    setAmount(
      ((state?.data?.current_price / 100) * 70 * quantity).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        }
      )
    );
  }, [quantity, state]);

  useEffect(() => {
    setQuantityForAmount(
      amountForAmount / ((state?.data?.current_price / 100) * 70)
    );
  }, [amountForAmount, state]);

  const handleSellByQuantity = async () => {
    if (Number(quantity) <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    await getAmount();

    const transaction = {
      img: state.data.image,
      CoinId: state.data.id,
      CoinName: state.data.name,
      Quantity: quantity,
      Amount: (state.data.current_price / 100) * 70 * quantity,
      Date: new Date(),
      Prise: (state.data.current_price / 100) * 70,
      type: "Sell",
    };

    const updatedTransactions = [...allTransaction, transaction];

    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3001/transactions/selltransactions",
        data: {
          Quantity: quantity,
          Amount: transaction.Amount,
          login,
          CoinName: data.name,
          Transaction: updatedTransactions,
        },
        headers: { "Content-type": "application/json" },
      });

      if (res.data === "NO") {
        alert("Not enough quantity");
      } else if (res.data === "YES") {
        window.history.go(-1);
      }
    } catch (error) {
      console.error("Error selling by quantity:", error);
    }
  };

  const handleSellByAmount = async () => {
    if (Number(amountForAmount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    await getAmount();

    const quantityFromAmount =
      amountForAmount / ((state.data.current_price / 100) * 70);

    const transaction = {
      img: state.data.image,
      CoinId: state.data.id,
      CoinName: state.data.name,
      Quantity: quantityFromAmount,
      Amount: amountForAmount,
      Date: new Date(),
      Prise: (state.data.current_price / 100) * 70,
      type: "Sell",
    };

    const updatedTransactions = [...allTransaction, transaction];

    try {
      const res = await axios({
        method: "POST",
        url: "http://localhost:3001/transactions/selltransactions",
        data: {
          Quantity: quantityFromAmount,
          Amount: amountForAmount,
          login,
          CoinName: data.name,
          Transaction: updatedTransactions,
        },
        headers: { "Content-type": "application/json" },
      });

      if (res.data === "NO") {
        alert("Not enough quantity");
      } else if (res.data === "YES") {
        window.history.go(-1);
      }
    } catch (error) {
      console.error("Error selling by amount:", error);
    }
  };

  return (
    <div className="m-5 ">
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
              <img src={data?.image} alt="" />
            </div>
            <div className="font-semibold text-white text-center text-[16px] md:text-[18px] m-4">
              Current Price: {currPrice}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:space-x-3">
            <div className="p-3 mb-4 mx-auto bg-[#171b26] rounded-lg text-white pt-6">
              <div className="text-center font-medium mb-5 text-[17px]">
                Sell by Quantity
              </div>
              <div className="grid grid-cols-1 m-3">
                <label className="font-medium">Quantity</label>
                <input
                  type="text"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="text-black p-[1px] m-2 text-center"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="grid grid-cols-1 m-3">
                <div className="font-medium">Amount: </div>
                <div>{amount}</div>
              </div>
              <button
                onClick={handleSellByQuantity}
                className="bg-[#209fe4] w-[100%] p-1 mt-6 rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
              >
                Sell
              </button>
            </div>

            <div className="p-3 mb-4 mx-auto bg-[#171b26] rounded-lg text-white pt-6">
              <div className="text-center font-medium text-[17px]">
                Sell by Amount
              </div>
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
              <div className="grid grid-cols-1 m-3 md:mt-5">
                <div className="font-medium">Quantity: </div>
                <div className="text-[13px] md:text-[17px]">
                  {quantityForAmount}
                </div>
              </div>
              <button
                onClick={handleSellByAmount}
                className="bg-[#209fe4] w-[100%] p-1 mt-6 rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
