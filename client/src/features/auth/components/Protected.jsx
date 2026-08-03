import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

const Protected = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
