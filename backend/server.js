import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool, initDb } from "./db.js";
import auth from "./middleware/auth.js";

dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "SocialPulse API" }));

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: "Enter name, valid email and password (6+ characters)." });
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING id,name,email",
      [name.trim(), email.toLowerCase().trim(), hash]
    );
    const user = result.rows[0];
    await seedAnalytics(user.id);
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user });
  } catch (e) {
    res.status(e.code === "23505" ? 409 : 500).json({ message: e.code === "23505" ? "Email already registered." : "Registration failed." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [(email || "").toLowerCase().trim()]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password || "", user.password_hash)))
      return res.status(401).json({ message: "Incorrect email or password." });
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch { res.status(500).json({ message: "Login failed." }); }
});

async function seedAnalytics(userId) {
  const count = await pool.query("SELECT COUNT(*) FROM analytics WHERE user_id=$1", [userId]);
  if (Number(count.rows[0].count) > 0) return;
  const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
  const ig = [[820,4200,4.2],[890,4700,4.5],[970,5100,4.7],[1040,5900,4.9],[1130,6500,5.1],[1260,7200,5.4]];
  const x = [[410,2100,2.1],[435,2300,2.3],[470,2500,2.4],[510,2800,2.6],[560,3100,2.8],[620,3500,3.0]];
  for (let i=0;i<months.length;i++) {
    await pool.query("INSERT INTO analytics(user_id,platform,month,followers,reach,engagement) VALUES($1,$2,$3,$4,$5,$6)",
      [userId,"Instagram",months[i],...ig[i]]);
    await pool.query("INSERT INTO analytics(user_id,platform,month,followers,reach,engagement) VALUES($1,$2,$3,$4,$5,$6)",
      [userId,"X",months[i],...x[i]]);
  }
}

app.get("/api/profile", auth, async (req,res) => {
  const r = await pool.query("SELECT id,name,email,created_at FROM users WHERE id=$1",[req.user.id]);
  res.json(r.rows[0]);
});

app.get("/api/analytics", auth, async (req,res) => {
  try {
    await seedAnalytics(req.user.id);
    const r = await pool.query("SELECT platform,month,followers,reach,engagement FROM analytics WHERE user_id=$1 ORDER BY id",[req.user.id]);
    res.json(r.rows);
  } catch { res.status(500).json({message:"Could not load analytics."}); }
});

app.get("/api/posts", auth, async (req,res) => {
  const r = await pool.query("SELECT * FROM posts WHERE user_id=$1 ORDER BY scheduled_at DESC",[req.user.id]);
  res.json(r.rows);
});

app.post("/api/posts", auth, async (req,res) => {
  const { platform, content, scheduled_at } = req.body;
  if (!["Instagram","X"].includes(platform) || !content?.trim() || !scheduled_at)
    return res.status(400).json({message:"Platform, content and schedule date are required."});
  const r = await pool.query(
    "INSERT INTO posts(user_id,platform,content,scheduled_at) VALUES($1,$2,$3,$4) RETURNING *",
    [req.user.id,platform,content.trim(),scheduled_at]
  );
  res.status(201).json(r.rows[0]);
});

app.delete("/api/posts/:id", auth, async (req,res) => {
  const r = await pool.query("DELETE FROM posts WHERE id=$1 AND user_id=$2 RETURNING id",[req.params.id,req.user.id]);
  if (!r.rowCount) return res.status(404).json({message:"Post not found."});
  res.json({message:"Post deleted."});
});

const port = process.env.PORT || 5000;
initDb().then(() => app.listen(port, () => console.log(`SocialPulse API running on http://localhost:${port}`)))
  .catch(err => { console.error("Database initialization failed:", err.message); process.exit(1); });
