import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://work-pilot-backend.onrender.com";

function Dashboard() {
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);

  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [deadline, setDeadline] = useState("");

  const [reportText, setReportText] = useState("");
  const [search, setSearch] = useState("");

  const [showTasks, setShowTasks] = useState(false);
  const [showReports, setShowReports] = useState(false);

  // ================= FETCH =================
  useEffect(() => {
    fetchTasks();
    fetchReports();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(`${API}/tasks`, {
      headers: { Authorization: token },
    });
    setTasks(res.data);
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${API}/reports`, {
        headers: { Authorization: token },
      });
      setReports(res.data);
    } catch {
      setReports([]);
    }
  };

  // ================= TASK =================
  const addTask = async () => {
    await axios.post(
      `${API}/tasks`,
      { title, assignedTo, deadline },
      { headers: { Authorization: token } }
    );

    setTitle("");
    setAssignedTo("");
    setDeadline("");
    fetchTasks();
  };

  const completeTask = async (id) => {
    await axios.put(
      `${API}/complete/${id}`,
      {},
      { headers: { Authorization: token } }
    );
    fetchTasks();
  };

  // ================= REPORT =================
  const sendReport = async () => {
    await axios.post(
      `${API}/report`,
      { text: reportText },
      { headers: { Authorization: token } }
    );
    setReportText("");
    alert("Report Sent ✅");
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // ================= FILTER =================
  const filtered = tasks.filter((t) =>
    t.assignedTo?.toLowerCase().includes(search.toLowerCase())
  );

  // ================= EMPLOYEE =================
  if (role === "employee") {
    const myTasks = tasks.filter((t) => t.assignedTo === email);

    const total = myTasks.length;
    const pending = myTasks.filter((t) => t.status === "pending").length;
    const completed = myTasks.filter((t) => t.status === "completed").length;

    return (
      <div style={layout}>
        <div style={sidebar}>
          <h2>🚀 WorkPilot</h2>
          <p>Dashboard</p>
        </div>

        <div style={main}>
          <div style={topbar}>
            <h2>Employee 👨‍💻</h2>
            <div>
              🔔 {email}
              <button onClick={logout} style={logoutBtn}>
                Logout
              </button>
            </div>
          </div>

          <div style={row}>
            <div style={card}>Total Tasks: {total}</div>
            <div style={card}>Pending: {pending}</div>
            <div style={card}>Completed: {completed}</div>
          </div>

          <div style={card}>
            <h3>Your Tasks</h3>
            {myTasks.length === 0 ? (
              <p>No tasks ❌</p>
            ) : (
              myTasks.map((t) => (
                <div key={t._id} style={innerCard}>
                  <strong>{t.title}</strong>
                  <p>Status: {t.status}</p>

                  {t.deadline && (
                    <p
                      style={{
                        color:
                          new Date(t.deadline) < new Date() &&
                          t.status !== "completed"
                            ? "red"
                            : "#38bdf8",
                      }}
                    >
                      📅 {new Date(t.deadline).toLocaleDateString()}
                    </p>
                  )}

                  {t.status === "pending" && (
                    <button onClick={() => completeTask(t._id)}>
                      Mark Done
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={card}>
            <h3>📄 Daily Report</h3>
            <textarea
              placeholder="Write your daily work..."
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              style={{ width: "100%", height: "100px" }}
            />
            <button onClick={sendReport}>Submit Report 🚀</button>
          </div>
        </div>
      </div>
    );
  }

  // ================= BOSS =================
  return (
    <div style={layout}>
      <div style={sidebar}>
        <h2>🚀 WorkPilot</h2>
        <p>Dashboard</p>
        <p onClick={logout} style={{ cursor: "pointer" }}>
          Logout
        </p>
      </div>

      <div style={main}>
        <h2>Boss Dashboard 👨‍💼</h2>

        <div style={card}>
          <h3>Assign Task</h3>
          <div style={row}>
            <input
              placeholder="Task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Employee Email"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button onClick={addTask}>Assign 🚀</button>
          </div>
        </div>

        <div style={card}>
          <h3>📊 Employee Performance</h3>
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filtered.map((t, i) => (
            <p key={i}>
              {t.assignedTo} → {t.status}
            </p>
          ))}
        </div>

        <div style={card}>
          <h3 onClick={() => setShowReports(!showReports)}>
            📄 Reports {showReports ? "▲" : "▼"}
          </h3>

          {showReports &&
            (reports.length === 0 ? (
              <p>No reports</p>
            ) : (
              reports.map((r, i) => (
                <div key={i} style={innerCard}>
                  <strong>{r.sender}</strong>
                  <p>{r.text}</p>
                </div>
              ))
            ))}
        </div>

        <div style={card}>
          <h3 onClick={() => setShowTasks(!showTasks)}>
            📋 All Tasks {showTasks ? "▲" : "▼"}
          </h3>

          {showTasks &&
            tasks.map((t) => (
              <div key={t._id} style={innerCard}>
                <strong>{t.title}</strong>
                <p>👤 {t.assignedTo}</p>
                <p>Status: {t.status}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

// ================= STYLES =================
const layout = { display: "flex", height: "100vh", background: "#0f172a", color: "white" };
const sidebar = { width: "220px", background: "#1e293b", padding: "20px" };
const main = { flex: 1, padding: "20px" };
const topbar = { display: "flex", justifyContent: "space-between", marginBottom: "20px" };
const row = { display: "flex", gap: "10px", marginBottom: "10px" };
const card = { background: "#1e293b", padding: "20px", marginTop: "20px", borderRadius: "10px" };
const innerCard = { background: "#334155", padding: "10px", marginTop: "10px", borderRadius: "6px" };
const logoutBtn = { marginLeft: "10px", background: "red", color: "white" };

export default Dashboard;