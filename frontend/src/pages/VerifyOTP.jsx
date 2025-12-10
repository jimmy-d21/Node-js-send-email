import { useState, useRef, useEffect } from "react";
import API from "../api";

export default function VerifyOTP({ email, setStage }) {
  // State for OTP - each box has its own state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTime, setResendTime] = useState(0);

  // Create refs for each input box
  const inputRefs = useRef([]);

  // Focus first box when page loads
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Handle when user types in a box
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!value.match(/^[0-9]?$/)) return;

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next box if user typed a number
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keyboard keys
  const handleKeyDown = (index, e) => {
    // Backspace: if box is empty, go to previous box
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify the OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    // Check if all boxes are filled
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setMessage("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { data } = await API.post("/auth/verify-otp", {
        email,
        otp: otpString,
      });

      setMessage(data.message);
      setTimeout(() => setStage("success"), 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (resendTime > 0) return;

    try {
      await API.post("/auth/resend-otp", { email });
      setMessage("New OTP sent to your email");
      setResendTime(30);

      // Countdown timer
      const timer = setInterval(() => {
        setResendTime((time) => {
          if (time <= 1) {
            clearInterval(timer);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } catch (err) {
      setMessage("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md max-w-md w-full p-6">
        {/* Back Button */}
        <button
          onClick={() => setStage("register")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
            <span className="text-xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Email</h1>
          <p className="text-gray-600 mt-2">Enter the 6-digit code sent to</p>
          <p className="font-medium text-gray-900 bg-blue-50 p-3 rounded-lg mt-3">
            {email}
          </p>
        </div>

        {/* OTP Boxes */}
        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <div className="flex justify-center space-x-3 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={otp[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              ))}
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`p-3 rounded-lg text-center ${
                  message.includes("Invalid") ||
                  message.includes("Please enter")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}
              >
                {message}
              </div>
            )}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOTP}
              disabled={resendTime > 0}
              className={`font-medium ${
                resendTime > 0
                  ? "text-gray-400"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {resendTime > 0 ? `Resend in ${resendTime}s` : "Resend OTP"}
            </button>
          </p>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Check your spam folder if you don't see the email.
          </p>
        </div>
      </div>
    </div>
  );
}
