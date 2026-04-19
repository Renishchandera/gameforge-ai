
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import api from "../../services/axiosInstance";
import { logout } from "../../features/auth/authSlice";
import { Button } from "../ui/button";
import { LogOut, Loader2 } from "lucide-react";
import {
  DropdownMenuItem,
} from "../ui/dropdown-menu";

// Option 1: As a standalone button (for sidebar/navbar)
export function LogoutButton({ variant = "default", className = "" }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      navigate("/auth", { replace: true });
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {isLoggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
}

// Option 2: As a dropdown menu item (for user menu)
export function LogoutMenuItem() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      navigate("/auth", { replace: true });
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </>
      )}
    </DropdownMenuItem>
  );
}

// Option 3: Simple text logout (for mobile)
export function SimpleLogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      dispatch(logout());
      navigate("/auth", { replace: true });
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="text-red-600 hover:text-red-700 font-medium"
    >
      {isLoggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}

export default LogoutButton;