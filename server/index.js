import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import config from "./config.js";
import fs from "fs";
import path from "path";
import multer from "multer";

const app = express();
const PORT = 5000;

/* ===============================
   FILE DB
================================ */
const DATA_FILE = "./data/services.json";

function loadServices() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data || "[]");
}

function saveServices(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ===============================
   UPLOAD SETUP
================================ */

// ensure uploads folder exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // ✅ 5MB limit (fix crash)
});

/* ===============================
   TEMP DB
================================ */
let bookings = [];
let feedbacks = [];

/* ===============================
   DELIVERY DB
================================ */

let deliveryOrders = [];

/* ===============================
   MIDDLEWARE
================================ */
app.use(cors());

// 🔥 IMPORTANT FIX (prevents PayloadTooLargeError)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// serve images
app.use("/uploads", express.static("uploads"));

/* ===============================
   HELPERS
================================ */
function calculateAmount(service) {
  if (service?.includes("Wedding")) return 50000;
  if (service?.includes("Corporate")) return 40000;
  if (service?.includes("Birthday")) return 15000;
  if (service?.includes("House")) return 20000;
  if (service?.includes("Karavali")) return 35000;
  return 10000;
}

/* ===============================
   MAIL SETUP
================================ */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
});

/* ===============================
   SERVICES API
================================ */

// GET services
app.get("/api/services", (req, res) => {
  try {
    const services = loadServices();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Failed to load services" });
  }
});

// ADD menu item
app.post("/api/admin/menu/:slug", upload.single("image"), (req, res) => {
  try {
    const { slug } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const services = loadServices();
    const service = services.find(s => s.slug === slug);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    service.menu.push({ name, image: imagePath });

    saveServices(services);

    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Add failed" });
  }
});

// DELETE
app.delete("/api/admin/menu/:slug/:index", (req, res) => {
  try {
    const { slug, index } = req.params;

    const services = loadServices();
    const service = services.find(s => s.slug === slug);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.menu.splice(index, 1);

    saveServices(services);

    res.json(service);
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

// EDIT (name + image)
app.put("/api/admin/menu/:slug/:index", upload.single("image"), (req, res) => {
  try {
    const { slug, index } = req.params;
    const { name } = req.body;

    const services = loadServices();
    const service = services.find(s => s.slug === slug);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const oldItem = service.menu[index];

    service.menu[index] = {
      name: name || oldItem.name,
      image: req.file ? `/uploads/${req.file.filename}` : oldItem.image
    };

    saveServices(services);

    res.json(service);
  } catch {
    res.status(500).json({ message: "Edit failed" });
  }
});

/* ===============================
   BOOKING API
================================ */
app.post("/api/book", async (req, res) => {
  try {
    const { service, items, customer } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.email) {
      return res.status(400).json({ message: "Invalid booking data" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items selected" });
    }

    const newBooking = {
      id: Date.now(),
      service,
      items,
      customer,
      status: "pending",
      createdAt: new Date().toISOString(),
      amount: calculateAmount(service),
      paymentStatus: "pending",
    };

    bookings.push(newBooking);

    /* ===============================
       🔥 SEND EMAIL TO USER
    =============================== */

    try {
      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: customer.email,
        subject: "🎉 Booking Confirmed - Caterers",
        html: `
          <h2>Hi ${customer.name},</h2>
          <p>Your booking has been successfully received.</p>

          <h3>📋 Booking Details:</h3>
          <p><b>Service:</b> ${service}</p>
          <p><b>Items:</b> ${items.join(", ")}</p>
          <p><b>Date:</b> ${customer.date || "Not specified"}</p>

          <br/>
          <p>We will contact you soon.</p>
          <p>Thank you for choosing <b>Caterers</b> ❤️</p>
        `
      });
    } catch (err) {
      console.error("USER EMAIL FAILED:", err.message);
    }

    /* ===============================
       🔥 SEND EMAIL TO ADMIN
    =============================== */

    try {
      await transporter.sendMail({
        from: config.EMAIL_USER,
        to: config.ADMIN_EMAIL,
        subject: "🚀 New Booking Received",
        html: `
          <h2>New Booking Alert</h2>
          <p><b>Name:</b> ${customer.name}</p>
          <p><b>Email:</b> ${customer.email}</p>
          <p><b>Phone:</b> ${customer.phone}</p>
          <p><b>Service:</b> ${service}</p>
          <p><b>Items:</b> ${items.join(", ")}</p>
        `
      });
    } catch (err) {
      console.error("ADMIN EMAIL FAILED:", err.message);
    }

    res.json({
      message: "Booking created",
      bookingId: newBooking.id,
    });

  } catch (err) {
    console.error("BOOK ERROR:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});




/* ===============================
   GET BOOKING
================================ */
app.get("/api/booking/:id", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  res.json(booking);
});

/* ===============================
   DELIVERY ORDER API
================================ */

app.post("/api/delivery/order", async (req, res) => {

  try {

    const { items, customer } = req.body;

    if (
      !customer?.name ||
      !customer?.phone ||
      !customer?.email ||
      !customer?.address
    ) {

      return res.status(400).json({
        message: "Invalid delivery data"
      });

    }

    const newOrder = {

      id: Date.now(),

      items,

      customer: {
  name: customer.name,
  phone: customer.phone,
  email: customer.email
    ?.toLowerCase()
    .trim(),
  address: customer.address
},

      status: "pending",

      assignedTo: null,

      createdAt:
        new Date().toISOString()

    };

    deliveryOrders.push(newOrder);

    /* EMAIL TO ADMIN */

    try {

      await transporter.sendMail({

        from: config.EMAIL_USER,

        to: config.ADMIN_EMAIL,

        subject: "🚚 New Delivery Order",

        html: `
          <h2>New Delivery Order</h2>

          <p>
          Name: ${customer.name}
          </p>

          <p>
          Phone: ${customer.phone}
          </p>

          <p>
          Address: ${customer.address}
          </p>

          <p>
          Items: ${items.join(", ")}
          </p>
        `

      });

    } catch (err) {

      console.log(
        "EMAIL ERROR:",
        err.message
      );

    }

    res.json({

      message:
        "Delivery order placed",

      orderId: newOrder.id

    });

  } catch {

    res.status(500).json({

      message:
        "Delivery failed"

    });

  }

});

app.get("/api/delivery/orders", (req, res) => {

  const email = req.query.email;

  if (!email) {
    return res.status(400).json({
      message: "Email required"
    });
  }

  /* check delivery login */

  if (
    email
      .toLowerCase()
      .trim() !==
    config.DELIVERY_EMAIL
      .toLowerCase()
      .trim()
  ) {
    return res.status(403).json({
      message: "Access denied"
    });
  }

  res.json(deliveryOrders);

});

app.get("/api/admin/deliveries", (req, res) => {

  res.json(deliveryOrders);

});


app.patch("/api/delivery/status/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const order = deliveryOrders.find(
      o => o.id == id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    order.status = status;

    console.log(
      "Status updated:",
      status
    );

    /* AUTO FLOW */

    if (status === "accepted") {

      setTimeout(() => {

        order.status = "packed";

        console.log(
          "Auto → packed"
        );

        setTimeout(() => {

          order.status =
            "out_for_delivery";

          console.log(
            "Auto → out_for_delivery"
          );

          setTimeout(() => {

            order.status =
              "delivered";

            console.log(
              "Auto → delivered"
            );

          }, 20000);

        }, 20000);

      }, 20000);

    }

    res.json({
      message: "Status updated"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Update failed"
    });

  }

});


app.patch("/api/delivery/deliver/:id", async (req, res) => {

  const order = deliveryOrders.find(
    o => o.id == req.params.id
  );

  if (!order) {
    return res.status(404).json({
      message: "Order not found"
    });
  }

  order.status = "delivered";

  try {
    await transporter.sendMail({
      from: config.EMAIL_USER,
      to: order.customer.email,
      subject: "📦 Order Delivered",
      html: `
        <h2>Your order has been delivered</h2>
        <p>Thank you for ordering with us.</p>
      `
    });
  } catch (err) {
    console.log(err.message);
  }

  res.json({
    message: "Order delivered"
  });

});

app.patch("/api/delivery/status/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const allowed = [
      "accepted",
      "packed",
      "out_for_delivery",
      "delivered"
    ];

    if (!allowed.includes(status)) {

      return res.status(400).json({
        message: "Invalid status"
      });

    }

    const order = deliveryOrders.find(
      o => o.id == id
    );

    if (!order) {

      return res.status(404).json({
        message: "Order not found"
      });

    }

    order.status = status;

    /* EMAIL TO USER */

    try {

      await transporter.sendMail({

        from: config.EMAIL_USER,

        to: order.customer.email,

        subject: "🚚 Delivery Update",

        html: `
          <h2>Your order status updated</h2>

          <p>
          Status: <b>${status.replace("_"," ")}</b>
          </p>

          <p>
          Thank you for choosing Caterers
          </p>
        `

      });

    } catch (err) {

      console.log(
        "STATUS EMAIL ERROR:",
        err.message
      );

    }

    res.json({
      message: "Status updated"
    });

  } catch {

    res.status(500).json({
      message: "Update failed"
    });

  }

});




app.get("/api/admin/all-data", (req, res) => {

  res.json({

    bookings,

    deliveryOrders,

    feedbacks

  });

});

app.get("/api/delivery/order/:id", (req, res) => {

  const order = deliveryOrders.find(
    o => o.id == req.params.id
  );

  if (!order) {

    return res.status(404).json({
      message: "Order not found"
    });

  }

  res.json(order);

});

/* ===============================
   USER ORDERS API
================================ */

/* ===============================
   USER ORDERS API
================================ */

/* ===============================
   USER ORDERS API
================================ */

app.get("/api/user/orders", (req, res) => {

  try {

    const email =
      req.query.email
        ?.toLowerCase()
        .trim();

    if (!email) {

      return res.status(400).json({
        message: "Email required"
      });

    }



    const userBookings = bookings.filter(
      b =>
        b.customer?.email
          ?.toLowerCase()
          .trim() === email
    );

    const userDeliveries = deliveryOrders.filter(
      d =>
        d.customer?.email
          ?.toLowerCase()
          .trim() === email
    );

    const allOrders = [
      ...userBookings,
      ...userDeliveries
    ];

    /* newest first */

    allOrders.sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );

    

    res.json(allOrders);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed to load orders"
    });

  }

});
/* ===============================
   PAYMENT
================================ */
app.post("/api/pay", (req, res) => {
  try {
    const { bookingId, upiId } = req.body;

    const booking = bookings.find(b => b.id == bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.paymentStatus = "paid";
    booking.upiId = upiId;
    booking.txnId = "TXN" + Date.now();

    res.json({ message: "Payment success" });

  } catch {
    res.status(500).json({ message: "Payment failed" });
  }
});

/* ===============================
   FEEDBACK
================================ */
app.post("/api/feedback", (req, res) => {
  const { name, message, rating } = req.body;

  if (!name || !message) {
    return res.status(400).json({ message: "Invalid feedback" });
  }

  feedbacks.push({
    id: Date.now(),
    name,
    message,
    rating: rating || 5,
    createdAt: new Date().toISOString(),
  });

  res.json({ message: "Feedback received" });
});

app.get("/api/admin/feedbacks", (req, res) => {
  res.json(feedbacks);
});

/* ===============================
   ADMIN
================================ */
app.get("/api/admin/bookings", (req, res) => {
  res.json(bookings);
});

app.delete("/api/admin/bookings/:id", (req, res) => {
  bookings = bookings.filter(b => b.id != req.params.id);
  res.json({ message: "Deleted" });
});

app.patch("/api/admin/bookings/:id", (req, res) => {
  const booking = bookings.find(b => b.id == req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Not found" });
  }

  booking.status = "confirmed";
  res.json({ message: "Confirmed" });
});

/* ADMIN CONFIG */
app.get("/api/admin/config", (req, res) => {
  res.json({
    adminEmail: config.ADMIN_EMAIL,
    deliveryEmail: config.DELIVERY_EMAIL
  });
});

/* ===============================
   START
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});