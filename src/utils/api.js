const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Change this if needed
import { useSelector } from "react-redux";

export const fetchHistory = async (token) => {
  if (!token || token === "null") {
    console.warn("🚫 No valid token found. Skipping history fetch.");
    return;
  }

  try {
    console.log("🛠 Fetching history with token:", token);

    const response = await fetch(`${API_BASE_URL}/calculations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch history");
    }

    const data = await response.json();
    console.log("✅ History received:", data);
    return data;
  } catch (error) {
    console.error("❌ Error fetching history:", error);
  }
};

export const saveCalculation = async (token, expression, result) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ expression, result }),
    });
    console.log("✅ Backend responded:", response);
    if (!response.ok) throw new Error("Failed to save calculation");
    return await response.json();
  } catch (error) {
    console.error("❌ Error saving calculation:", error);
  }
};

export const updateCalculation = async (token, id, expression, result) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ expression, result }),
    });

    if (!response.ok) throw new Error("Failed to update calculation");
    console.log("✅ Calculation updated successfully");
    return await response.json();
  } catch (error) {
    console.error("❌ Error updating calculation:", error);
    throw error;
  }
};

export const deleteCalculation = async (token, id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/calculations/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to delete calculation");
    console.log("✅ Calculation deleted successfully");
    return true;
  } catch (error) {
    console.error("❌ Error deleting calculation:", error);
    throw error;
  }
};
