import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import api from "../../services/axiosInstance";
import { logout } from "@/features/auth/authSlice";

export default function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await api.post("/auth/logout");
      } catch (err) {
        // even if backend fails, we still logout locally
        console.error("Logout error:", err);
      } finally {
        //clear frontend auth state
        dispatch(logout());

        //redirect to login
        navigate("/auth", { replace: true });
      }
    };

    doLogout();
  }, [dispatch, navigate]);

  //no UI, this is a logic-only route
  return null;
}
