import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import styles from "./../auth.form.module.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { isLoading, handleLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin({ email, password });
    navigate("/");
  };

  return (
    <main>
      <div className={styles["form-container"]}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles["input-group"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className={styles["input-group"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className={`button primary-button ${styles["loader"]}`}
          >
            {isLoading ? <LoaderCircle className="spin" /> : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
