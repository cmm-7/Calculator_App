import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAuth } from "firebase/auth";
import { updateUser } from "../../redux/slices/authSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TwoFactorSettings = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const auth = getAuth();

  const handleEnableTwoFactor = async () => {
    setError("");
    setLoading(true);

    try {
      // Request verification code to be sent via email
      const response = await fetch(
        `${API_BASE_URL}/auth/send-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send verification code");
      }

      setShowVerificationInput(true);
      alert("A verification code has been sent to your email.");
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      setError(
        error.message || "Failed to send verification code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setError("");
    setLoading(true);

    try {
      // Verify the code with the backend
      const verifyResponse = await fetch(
        `${API_BASE_URL}/auth/verify-2fa-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ code: verificationCode }),
        }
      );

      if (!verifyResponse.ok) {
        const data = await verifyResponse.json();
        throw new Error(data.error || "Invalid verification code");
      }

      // Update Redux store
      await dispatch(
        updateUser({
          ...user,
          two_factor_enabled: true,
        })
      ).unwrap();

      setShowVerificationInput(false);
      setVerificationCode("");
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisableTwoFactor = async () => {
    setError("");
    setLoading(true);

    try {
      await dispatch(
        updateUser({
          ...user,
          two_factor_enabled: false,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      setError(error.message || "Failed to disable 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Two-Factor Authentication</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {user?.two_factor_enabled ? (
        <div>
          <p className="mb-4 text-green-600">
            ✅ Two-factor authentication is enabled
          </p>
          <p className="mb-4">Verification method: Email ({user.email})</p>
          <button
            onClick={handleDisableTwoFactor}
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </button>
        </div>
      ) : (
        <div>
          {!showVerificationInput ? (
            <div>
              <p className="mb-4">
                Enable two-factor authentication using your email address:
              </p>
              <p className="mb-4 text-gray-600">
                We'll send a verification code to: {user.email}
              </p>
              <button
                onClick={handleEnableTwoFactor}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Sending code..." : "Enable 2FA"}
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-4">
                Enter the verification code sent to your email:
              </p>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                className="w-full p-2 mb-4 border rounded"
                maxLength={6}
              />
              <button
                onClick={handleVerifyCode}
                disabled={loading || !verificationCode}
                className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TwoFactorSettings;
