import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verify2FA, clearAuthError } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const TwoFactorVerification = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading, tempToken } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());

    try {
      const result = await dispatch(
        verify2FA({
          verificationCode,
          tempToken,
        })
      ).unwrap();

      if (result.user) {
        navigate("/");
      }
    } catch (error) {
      console.error("2FA verification failed:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Two-Factor Authentication
      </h2>

      <p className="mb-4 text-gray-600">
        Please enter the verification code sent to your email.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="Enter verification code"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading || !verificationCode}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Code"}
        </button>
      </form>
    </div>
  );
};

export default TwoFactorVerification;
