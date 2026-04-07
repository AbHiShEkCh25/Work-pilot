const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// ================= DB =================
mongoose
  .connect("mongodb://mongo:27017/tasks")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log(err));

// ================= MODELS =================
const User = mongoose.model("User", {
  email: String,
  password: String,
  role: String,
});

const Task = mongoose.model("Task", {
  title: String,
  status: { type: String, default: "pending" },
  assignedTo: String,
  createdBy: String,
  deadline: String,
});

const Message = mongoose.model("Message", {
  sender: String,
  receiver: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

// 🔥 NEW: DAILY REPORT MODEL
const Report = mongoose.model("Report", {
  sender: String,
  text: String,
  createdAt: { type: Date, default: Date.now },
});

// ================= AUTH MIDDLEWARE =================
const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).send("Access denied");

  try {
    req.user = jwt.verify(token, "secretkey");
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
};

// ================= AUTH ROUTES =================

// REGISTER
app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).send("User already exists");

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: hashed,
      role,
    });

    await user.save();
    res.json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// LOGIN
app.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(400).send("User not found");

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign(
      { email: user.email, role: user.role },
      "secretkey"
    );

    res.json({
      token,
      role: user.role,
      email: user.email,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// ================= USERS =================
app.get("/users", auth, async (req, res) => {
  const users = await User.find({}, "email");
  res.json(users);
});

// ================= TASK ROUTES =================

// CREATE TASK (Boss only)
app.post("/tasks", auth, async (req, res) => {
  if (req.user.role !== "boss")
    return res.status(403).send("Only boss can assign tasks");

  const task = new Task({
    title: req.body.title,
    assignedTo: req.body.assignedTo,
    createdBy: req.user.email,
    deadline: req.body.deadline,
  });

  await task.save();
  res.json(task);
});

// GET TASKS (private)
app.get("/tasks", auth, async (req, res) => {
  const email = req.user.email;

  const tasks = await Task.find({
    $or: [{ assignedTo: email }, { createdBy: email }],
  });

  res.json(tasks);
});

// COMPLETE TASK
app.put("/complete/:id", auth, async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) return res.status(404).send("Task not found");

  if (task.assignedTo !== req.user.email)
    return res.status(403).send("Not allowed");

  task.status = "completed";
  await task.save();

  res.json({ message: "Task completed" });
});

// DELETE TASK (Boss only)
app.delete("/tasks/:id", auth, async (req, res) => {
  if (req.user.role !== "boss")
    return res.status(403).send("Only boss can delete");

  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// ================= CHAT =================

// SEND MESSAGE
app.post("/send", auth, async (req, res) => {
  const msg = new Message({
    sender: req.user.email,
    receiver: req.body.receiver,
    text: req.body.text,
  });

  await msg.save();
  res.json(msg);
});

// GET CHAT
app.get("/chat/:user", auth, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.email, receiver: req.params.user },
      { sender: req.params.user, receiver: req.user.email },
    ],
  }).sort({ createdAt: 1 });

  res.json(messages);
});

// ================= DAILY REPORT =================

// SEND REPORT (Employee)
app.post("/report", auth, async (req, res) => {
  const report = new Report({
    sender: req.user.email,
    text: req.body.text,
  });

  await report.save();
  res.json(report);
});

// GET REPORTS (Boss only)
app.get("/reports", auth, async (req, res) => {
  if (req.user.role !== "boss")
    return res.status(403).send("Only boss");

  const reports = await Report.find().sort({ createdAt: -1 });
  res.json(reports);
});

// ================= START =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});