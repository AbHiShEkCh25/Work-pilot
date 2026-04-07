import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(`${API}/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("role", res.data.role);

        window.location.href = "/dashboard";
      } else {
        // REGISTER
        await axios.post(`${API}/register`, {
          email,
          password,
          role,
        });

        alert("Account created ✅ Please login");
        setIsLogin(true);
      }
    } catch (err) {
      alert("Something went wrong ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* LOGO */}
        <h1 style={styles.logo}>🚀 WorkPilot</h1>
        <p style={styles.tagline}>Manage your team like a pro</p>

        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        {/* ROLE (ONLY SIGNUP) */}
        {!isLogin && (
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="employee">👨‍💻 Employee</option>
            <option value="boss">🧑‍💼 Boss</option>
          </select>
        )}

        {/* BUTTON */}
        <button onClick={handleSubmit} style={styles.button}>
          {isLogin ? "Login" : "Create Account"}
        </button>

        {/* SWITCH */}
        <p style={styles.switch}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Sign Up" : " Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

// ================= STYLES =================
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    width: "360px",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  logo: {
    marginBottom: "5px",
  },
  tagline: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },
  switch: {
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "5px",
  },
};

export default Auth;