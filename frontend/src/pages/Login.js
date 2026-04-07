import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER (role fixed as employee)
  const register = async () => {
    try {
      await axios.post(`${API}/register`, {
        email,
        password,
        role: "employee", // 👈 default
      });

      alert("Registered as Employee ✅");
    } catch {
      alert("Register error ❌");
    }
  };

  // LOGIN (NO ROLE HERE)
  const login = async () => {
    try {
      const res = await axios.post(`${API}/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);

      window.location.href = "/dashboard";
    } catch {
      alert("Login failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={login} style={styles.btn}>
          Login
        </button>

        <button onClick={register} style={styles.registerBtn}>
          Register as Employee
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  card: {
    width: "350px",
    padding: "25px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
  },
  btn: {
    width: "100%",
    padding: "10px",
    background: "#1877f2",
    color: "#fff",
    border: "none",
    marginBottom: "10px",
    cursor: "pointer",
  },
  registerBtn: {
    width: "100%",
    padding: "10px",
    background: "#42b72a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
};

export default Login;