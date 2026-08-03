import { Navigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LoaderCircle } from "lucide-react";

const Protected = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main>
        <LoaderCircle className="spin" />
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
