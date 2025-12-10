import { useState } from "react";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

export default function App() {
  const [stage, setStage] = useState("register");
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen">
      {stage === "register" && (
        <Register setStage={setStage} setEmail={setEmail} />
      )}

      {stage === "verify" && <VerifyOTP email={email} setStage={setStage} />}

      {stage === "success" && (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-8">
              Your email{" "}
              <span className="font-semibold text-gray-900">{email}</span> has
              been successfully verified.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="animate-bounce">🎉</div>
              </div>
              <p className="text-green-800 font-medium">
                Welcome aboard! You're all set to explore our platform.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  setStage("register");
                  setEmail("");
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              >
                Register Another Account
              </button>

              <button className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200">
                Go to Dashboard
              </button>
            </div>

            <p className="mt-8 text-sm text-gray-500">
              Need help?{" "}
              <button className="text-blue-600 hover:text-blue-800">
                Contact Support
              </button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
