import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register } from "../services/auth.api.js";

export const useAuth = () => {
  const { user, setUser, isLoading, setIsLoading } = useContext(AuthContext);

  //* handleLogin Function
  const handleLogin = async ({ email, password }) => {
    setIsLoading(true);

    try {
      const data = await login({ email, password });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setIsLoading(true);

    try {
      const data = await register({ username, email, password });
      setUser(data.user);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isLoading, handleLogin, handleRegister, handleLogout };
};
