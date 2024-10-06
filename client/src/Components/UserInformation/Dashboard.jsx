import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalTransactions from "./ModalTransactions";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = localStorage.getItem("authToken");
  const userid = location.state.id;

  const [allTransaction, setAllTransaction] = useState([]);
  const [opentransaction, setOpenTransaction] = useState(false);
  const [dataTransaction, setDataTransaction] = useState({});
  const [userdata, setUserdata] = useState({});
  const [balance, setBalance] = useState();
  const [invested, setInvested] = useState();
  const [url, setUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await getAllTransactions();
      await getWalletAmount();
      await fetchUserData();
    };
    fetchData();
  }, []);

  const getAllTransactions = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/wallet/getwalletTransaction",
        { login },
        { headers: { "Content-Type": "application/json" } }
      );
      setAllTransaction(response.data.reverse());
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const getWalletAmount = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/wallet/getwalletAmount",
        { login },
        { headers: { "Content-Type": "application/json" } }
      );
      const { Amount, Invested } = response.data[0];
      setBalance(formatCurrency(Amount));
      setInvested(formatCurrency(Invested));
    } catch (error) {
      console.error("Error fetching wallet amount:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/dashboard/userdetails",
        {
          method: "POST",
          body: JSON.stringify({ UserId: userid }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const json = await response.json();
      setUserdata(json);
      setUrl(json.userProfile[0]?.url || "");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const formatCurrency = (value) => {
    return Math.ceil(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    });
  };

  const handleUpdate = () => {
    navigate("/profileUpdate", { state: { id: userid } });
  };

  return (
    <div className="bg-[#171b26] h-content">
      {opentransaction && (
        <ModalTransactions fun={{ data: dataTransaction, open: setOpenTransaction }} />
      )}

      {userdata.Data ? (
        <div className="pt-[100px] pb-[80px] bg-[#1d2230] w-[70%] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] mx-auto m-5 bg-[#272e41] p-5 rounded-lg">
            <div
              className="w-[150px] h-[150px] bg-cover m-5 mx-auto border-2"
              style={{ backgroundImage: `url(${url})` }}
            ></div>
            <div className="text-white m-5 mx-auto">
              <div className="m-2 font-semibold grid grid-cols-1 md:grid-cols-4">
                <div className="mr-3 font-bold">Name</div>
                <div className="grid grid-cols-3 mx-auto">
                  {userdata.Data.first_name} {userdata.Data.last_name}
                </div>
              </div>
              <div className="m-2 font-semibold grid grid-cols-1 md:grid-cols-4">
                <div className="mr-3 font-bold">Mobile</div>
                <div className="grid grid-cols-3 mx-auto">{userdata.Data.mob}</div>
              </div>
              <div className="m-2 font-semibold grid grid-cols-1 lg:grid-cols-4">
                <div className="mr-3 font-bold">Email</div>
                <div className="text-[12px] sm:text-[13px] md:text-[16px] grid grid-cols-3">
                  {userdata.Data.email}
                </div>
              </div>
              <button
                className="bg-[#209fe4] w-[100%] mx-auto p-1 mt-2 rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
                onClick={handleUpdate}
              >
                Update Profile
              </button>
            </div>
          </div>

          <div className="w-[90%] mx-auto bg-[#272e41] p-5 rounded-lg mb-4">
            <div className="font-bold text-white text-center md:text-left text-[20px] md:text-[22px] mb-2">
              Wallet
            </div>
            <div className="w-[80%] mx-auto grid grid-cols-1 md:grid-cols-2 pb-3">
              <div className="font-semibold text-[#dedddd] text-center text-[20px] md:text-[22px] mb-2">
                <div>Balance</div>
                <div>{balance}</div>
              </div>
              <div className="font-semibold w-[80%] mx-auto grid grid-cols-1 text-[#dedddd] text-center text-[20px] md:text-[22px]">
                <div>Invested</div>
                <div>{invested}</div>
              </div>
            </div>
          </div>

          <div className="w-[90%] mx-auto bg-[#272e41] p-5 rounded-lg">
            <div className="font-bold text-white text-center md:text-left text-[20px] md:text-[22px] mb-8">
              Transactions
            </div>
            <div className="w-[80%] mx-auto max-h-[400px] overflow-y-scroll">
              {allTransaction.map((transaction, index) => (
                <div key={index} onClick={() => {
                  setOpenTransaction(true);
                  setDataTransaction(transaction);
                }}>
                  <div className="bg-[#171b26] rounded-lg text-white m-3 p-4 md:grid md:grid-cols-3">
                    <div className="w-[100%] md:w-[100%]">
                      <div className="font-semibold text-white text-center text-[14px] md:text-[17px] mb-2">
                        {transaction.CoinName}
                      </div>
                      <div className="w-[50px] h-[50px] mx-auto">
                        <img src={transaction.img} alt="" />
                      </div>
                      <div className={`text-center text-[14px] md:text-[17px] mb-2 mt-2 ${
                        transaction.type === "Buy" ? "text-[#26a69a]" : "text-[#c12f3d]"
                      } font-semibold`}>
                        {transaction.type}
                      </div>
                    </div>
                    <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 col-span-2">
                      <div>
                        <div className="text-center font-semibold lg:text-[20px] lg:m-2">
                          Quantity
                        </div>
                        <div className="text-center font-bold lg:m-2">
                          {transaction.Quantity}
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-semibold lg:m-2 lg:text-[20px]">
                          Amount
                        </div>
                        <div className="text-center font-bold lg:m-2">
                          ₹{transaction.Amount}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
