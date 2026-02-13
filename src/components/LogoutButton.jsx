import { logoutUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/"); // back to login
  };

  return <button onClick={handleLogout}>Logout</button>;
}
