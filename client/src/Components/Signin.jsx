import React, { useState } from "react";

export default function Signin({ closemod }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loggedin, setLoggedin] = useState(false);

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const eventHandler = async () => {
    const body = {
      email: credentials.email,
      password: credentials.password,
    };

    try {
      const response = await fetch("http://localhost:3001/register/Signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.text();

      if (data === "No such user found") {
        alert("No such user found");
      } else {
        closemod[1](false);
        const userData = JSON.parse(data);
        localStorage.setItem("authToken", userData.authToken);
        console.log("Token stored:", localStorage.getItem("authToken"));
        setLoggedin(true);
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("An error occurred during sign-in. Please try again.");
    }
  };

  return (
    <div className="fixed top-0 h-full w-full z-50 bg-[#131722c3]">
      <div className="text-black bg-white rounded-md border-2 border-white w-[70%] md:w-[50%] mx-auto mt-[150px] md:mt-[200px]">
        <button
          onClick={() => closemod[1](false)}
          className="font-bold ml-5 mt-3"
        >
          X
        </button>
        <h1 className="text-center p-1 font-bold text-[18px] sm:text-[25px] z-50">
          Welcome to our BlockEx!
        </h1>
        <form className="grid grid-cols-1 md:grid-cols-2 p-3">
          <div className="flex p-2 justify-between m-1 flex-wrap z-50">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
          <div className="flex p-2 justify-between m-1 flex-wrap z-50">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password" 
              id="password"
              name="password"
              value={credentials.password}
              onChange={onChange}
              className="text-black bg-[#cfcfcf]"
            />
          </div>
        </form>
        <div className="text-center mx-auto font-semibold">
          <button
            onClick={() => {
              closemod[0](true);
              closemod[1](false);
            }}
          >
            Already a user...?
          </button>
        </div>
        <div className="text-center mx-auto font-semibold m-3 bg-[#131722] rounded-md text-white w-[100px] p-1 hover:bg-[#414141]">
          <button onClick={eventHandler}>Sign In</button>
        </div>
      </div>
    </div>
  );
}
