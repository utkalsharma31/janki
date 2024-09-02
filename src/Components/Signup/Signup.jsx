import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [inputs, setInputs] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); 


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (inputs.password !== inputs.confirmPassword) {
        setErrorMessage("Passwords do not match.");
        return;
      }

      const userData = {
        first_name: inputs.firstName,
        last_name: inputs.lastName,
        username: inputs.username,
        password: inputs.password,
        confirm_password: inputs.confirmPassword,
        mobile_no: inputs.mobileNumber,
        whatsapp_no: inputs.whatsappNumber,
        email: inputs.email,
      };

      const response = await axios.post(
        "http://192.168.1.34:8000/api/signup/",
        userData
      );

      console.log("Signup successful:", response.data);
      // Clear form fields after submission
      setInputs({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
      });

      setErrorMessage("");
      navigate("/callingList");
      
    } catch (error) {
      console.error("Error signing up:", error);
      setErrorMessage("Failed to signup. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h1 className="text-3xl font-semibold text-center text-gray-700">
          Sign Up
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="flex">
            <div className="w-1/2 pr-2">
              <label className="label p-2">
                <span className="text-base label-text">First Name</span>
              </label>
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={inputs.firstName}
                onChange={(e) =>
                  setInputs({ ...inputs, firstName: e.target.value })
                }
              />
            </div>

            <div className="w-1/2">
              <label className="label p-2">
                <span className="text-base label-text">Last Name</span>
              </label>
              <input
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={inputs.lastName}
                onChange={(e) =>
                  setInputs({ ...inputs, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="label p-2 ">
              <span className="text-base label-text">Username</span>
            </label>
            <input
              type="text"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Password</span>
            </label>
            <input
              type="password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={inputs.confirmPassword}
              onChange={(e) =>
                setInputs({ ...inputs, confirmPassword: e.target.value })
              }
            />
          </div>

          <div className="flex">
            <div className="w-1/2 pr-2">
              <label className="label p-2">
                <span className="text-base label-text">Mobile Number</span>
              </label>
              <input
                type="number"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={inputs.mobileNumber}
                onChange={(e) =>
                  setInputs({ ...inputs, mobileNumber: e.target.value })
                }
              />
            </div>

            <div className="w-1/2">
              <label className="label p-2">
                <span className="text-base label-text">Whatsapp Number</span>
              </label>
              <input
                type="number"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={inputs.whatsappNumber}
                onChange={(e) =>
                  setInputs({ ...inputs, whatsappNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="label p-2">
              <span className="text-base label-text">Email ID</span>
            </label>
            <input
              type="email"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
          </div>

          {/* <div>
            <Link
              to="/positionPage"
              className="group relative w-full flex justify-center mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M4 8V7a5 5 0 1110 0v1h2a1 1 0 011 1v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7a1 1 0 011-1h2zm8 2h-4V7a3 3 0 016 0v3z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Next
            </Link>
          </div> */}

          <div>
            <button className="group relative w-full flex justify-center text-md mt-4 py-2 px-4 border border-transparent font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <span className="">Sign Up</span>
            </button>
          </div>

          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default Signup;
