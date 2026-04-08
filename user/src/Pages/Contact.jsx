import { motion } from "framer-motion";
import bgVideo from "../assets/bg-video.mp4";

const Contact = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* BACKGROUND VIDEO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          zIndex: -1,
        }}
      />

      {/* CONTENT */}
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.97)",
            padding: "40px",
            borderRadius: "20px",
          }}
        >
          <h1 style={{ color: "#111", marginBottom: "20px" }}>
            Contact Caterers
          </h1>

          <p style={{ color: "#333", marginBottom: "30px" }}>
            Have a question, planning an event, or need a customized menu?
            Reach out to us — we’d love to help.
          </p>

          <p style={{ color: "#222" }}>
            <strong>📞 Phone:</strong><br />
            +91 9509876543
          </p>

          <p style={{ color: "#222", marginTop: "15px" }}>
            <strong>📧 Email:</strong><br />
            karavalicateres@gmail.com
          </p>

          <p style={{ color: "#222", marginTop: "15px" }}>
            <strong>📍 Address:</strong><br />
            Caterers<br />
            Near City Center<br />
            Mangaluru, Karnataka – 575001
          </p>

          <p style={{ color: "#444", marginTop: "30px" }}>
            For bookings, enquiries, or menu discussions, feel free to contact
            us anytime. Our team will respond promptly.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;