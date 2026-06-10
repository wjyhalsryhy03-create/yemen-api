const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE (TEMP MEMORY)
========================= */
let orders = [];
let packages = [
  { id: 1, name: "يمن موبايل 1GB", type: "yemenmobile", price: 500 },
  { id: 2, name: "سبأفون 2GB", type: "spafon", price: 1000 },
  { id: 3, name: "YOU 5GB", type: "you", price: 2000 },
  { id: 4, name: "يمن فورجي 10GB", type: "yemen4g", price: 3000 },
  { id: 5, name: "PUBG Pack", type: "games", price: 1500 }
];

/* =========================
   GET ALL PACKAGES
========================= */
app.get("/api/packages", (req, res) => {
  res.json(packages);
});

/* =========================
   FILTER BY TYPE
========================= */
app.get("/api/packages/:type", (req, res) => {
  const type = req.params.type;
  res.json(packages.filter(p => p.type === type));
});

/* =========================
   CREATE ORDER (IMPORTANT)
========================= */
app.post("/api/order", (req, res) => {
  const { phone, packageId, method } = req.body;

  const pack = packages.find(p => p.id === packageId);

  if (!pack) {
    return res.status(404).json({ message: "Package not found" });
  }

  const order = {
    id: Date.now(),
    phone,
    package: pack,
    method, // wallet / manual / agent
    status: "pending"
  };

  orders.push(order);

  res.json({
    message: "Order created successfully",
    order
  });
});

/* =========================
   GET ORDERS (ADMIN)
========================= */
app.get("/api/orders", (req, res) => {
  res.json(orders);
});

/* =========================
   UPDATE ORDER STATUS
========================= */
app.put("/api/order/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  let order = orders.find(o => o.id === id);

  if (!order) return res.status(404).json({ message: "Not found" });

  order.status = status;

  res.json({ message: "Updated", order });
});

/* =========================
   WALLET SYSTEM (SIMULATION)
========================= */
let wallets = {};

app.post("/api/wallet/add", (req, res) => {
  const { user, amount } = req.body;

  if (!wallets[user]) wallets[user] = 0;

  wallets[user] += amount;

  res.json({ user, balance: wallets[user] });
});

app.get("/api/wallet/:user", (req, res) => {
  const user = req.params.user;
  res.json({ user, balance: wallets[user] || 0 });
});

/* =========================
   START SERVER
========================= */
app.listen(3000, () => {
  console.log("🔥 Gateway API running on http://localhost:3000");
});