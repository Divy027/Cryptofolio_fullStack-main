import React, { useState } from "react";

export default function RegisterModal({ closemod }) {
  const [credentials, setCredentials] = useState({
    first_name: "",
    last_name: "",
    age: "",
    mob: "",
    email: "",
    password: "",
  });
  const [loggedin, setLoggedin] = useState(false);

  const onchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const eventHandler = async () => {
    try {
      const response = await fetch("http://localhost:3001/register/creatuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const json = await response.json();
      console.log(json);

      if (json.userexist) {
        alert("User already exists");
      } else if (!json.success) {
        alert("Enter correct credentials");
      } else {
        localStorage.setItem("authToken", json.authToken);
        console.log("Token stored:", localStorage.getItem("authToken"));
        setLoggedin(true);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again.");
    }
  };


  if (loggedin) {
    closemod[0](false);
  } else {
    return (
      <div>
        <div className="w-[100%] fixed top-0 h-full snap-none z-50  bg-[#131722c3]">

          <div className="text-black bg-white rounded-md border-2 border-white w-[70%] md:w-[50%] mx-auto mt-[40px] md:mt-[200px]">
            <button
              onClick={() => {
                closemod[0](false);
              }}
              className="font-bold ml-5 mt-3"
            >
              X
            </button>
            <div className=" ">
              <div className="">
                <h1 className=" text-center p-1 font-bold text-[18px] sm:text-[25px] z-50 ">
                  Welcome to our BlockEx!
                </h1>

                <form className=" grid grid-cols-1 md:grid-cols-2 p-3">
                  <div className=" flex p-2 justify-between m-1 flex-wrap z-50">
                    <label for="first_name" className="font-semibold">
                      First Name
                    </label>
                    <div>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={credentials.first_name}
                        onChange={onchange}
                        className="text-black bg-[#cfcfcf]"
                      />
                    </div>
                  </div>
                  <div className=" flex p-2 justify-between m-1 flex-wrap z-50">
                    <label for="last_name" className="font-semibold">
                      Last Name
                    </label>
                    <div>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={credentials.last_name}
                        onChange={onchange}
                        className="text-black bg-[#cfcfcf]"
                      />
                    </div>
                  </div>
                  <div className=" flex p-2 justify-between m-1 flex-wrap  z-50">
                    <label for="age" className="font-semibold">
                      Age
                    </label>
                    <div>
                      <input
                        type="number"
                        id="age"
                        name="age"
                        value={credentials.age}
                        onChange={onchange}
                        className="text-black bg-[#cfcfcf]"
                      />
                    </div>
                  </div>
                  <div className="  flex p-2 justify-between m-1 flex-wrap">
                    <label for="mob" className="font-semibold">
                      Mobile number
                    </label>
                    <div>
                      <input
                        type="number"
                        id="mob"
                        name="mob"
                        value={credentials.mob}
                        onChange={onchange}
                        className="text-black bg-[#cfcfcf]"
                      />
                    </div>
                  </div>
                  <div className="  flex p-2 justify-between m-1 flex-wrap">
                    <label for="email" className="font-semibold">
                      Email
                    </label>
                    <div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onchange}
                        className="text-black bg-[#cfcfcf]"
                      />
                    </div>
                  </div>
                  <div className="  flex p-2 justify-between m-1 flex-wrap">
                    <label for="password" className="font-semibold">
                      Password
                    </label>
                    <div>
                      <input
                        type="text"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onchange}
                        className="text-black bg-[#cfcfcf] "
                      />
                    </div>
                  </div>
                </form>
                <div className="text-center mx-auto font-semibold">
                  <button
                    onClick={() => {
                      closemod[1](true);
                      closemod[0](false);
                    }}
                  >
                    Don't have an account...? 
                  </button>
                </div>
                <div className="text-center mx-auto font-semibold m-3 bg-[#131722] rounded-md text-white w-[100px] p-1 hover:bg-[#414141]">
                  <button onClick={eventHandler}>Register</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
