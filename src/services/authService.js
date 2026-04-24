const BASE_URL = "http://localhost:5000"; // adjust if needed

export const loginUser = async (endpoint, credentials) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Login failed");
  return data; // { token, role }
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};
