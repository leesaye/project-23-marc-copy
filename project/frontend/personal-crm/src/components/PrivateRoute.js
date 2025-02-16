import { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    // Redirect if not authenticated
    if (!loading && !isAuthenticated) {
      nav("/login");
    }
  }, [isAuthenticated, loading, nav]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (isAuthenticated) {
    return children;
  }

  // Return null here as the navigation will happen after render
  return null;
};

export default PrivateRoute;
