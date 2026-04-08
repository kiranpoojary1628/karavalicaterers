import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import foodQuizData from "../Data/foodQuizData";
import FoodQuizCard from "../Components/FoodQuizCard";
import bgVideo from "../assets/bg-video.mp4";

const Home = () => {

  const navigate = useNavigate();

  const [adminEmail, setAdminEmail] = useState(null);
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  /* 🔁 REFRESH AFTER LOGIN (KEEP THIS) */
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem("justLoggedIn");

    if (justLoggedIn) {
      sessionStorage.removeItem("justLoggedIn");
      window.location.reload();
    }
  }, []);

  /* 🔥 FETCH ADMIN EMAIL */
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/config")
      .then(res => res.json())
      .then(data => setAdminEmail(data.adminEmail))
      .catch(() => {});
  }, []);

  /* 🔥 CHECK ADMIN */
  const isAdmin =
    user?.email?.toLowerCase() === adminEmail?.toLowerCase();

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>

      {/* 🎥 BG VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* 🌑 OVERLAY */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.55)",
          zIndex: -1,
        }}
      />

      {/* 🧱 CONTENT */}
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >

        <h1>Caterers</h1>
        <p>Premium catering for every occasion</p>

        {/* 🔥 ADMIN BUTTON (TEMP — for testing) */}
        {isAdmin && (
          <button
            onClick={() => navigate("/admin")}
            style={{
              marginBottom: 20,
              padding: "10px 18px",
              borderRadius: 8,
              border: "none",
              background: "#2563eb",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Go to Admin Panel
          </button>
        )}

        <div className="grid">
          {foodQuizData.map((item) => (
            <FoodQuizCard key={item.id} quiz={item} />
          ))}
        </div>

      </motion.div>
    </div>
  );
};

export default Home;