import { motion } from "framer-motion";
import bgVideo from "../assets/bg-video.mp4";

const About = () => {
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
            maxWidth: "1100px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.97)",
            padding: "60px",
            borderRadius: "22px",
            lineHeight: "1.9",
          }}
        >
          <h1 style={{ color: "#111", fontSize: "2.8rem" }}>
            About Caterers
          </h1>

          <p style={{ color: "#222" }}>
            Caterers is not just a catering service — it is a culinary
            experience built on tradition, trust, and taste. We believe food is
            the heart of every celebration, and our mission is to make every
            event memorable through exceptional cuisine and professional
            service.
          </p>

          <p style={{ color: "#222" }}>
            Over the years, Caterers has grown from a humble beginning
            into a recognized name in premium catering services. Our growth has
            been organic, powered by word-of-mouth, repeat customers, and the
            satisfaction of thousands of guests who have enjoyed our food.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Our Journey
          </h2>

          <p style={{ color: "#222" }}>
            Our journey began with a simple idea — serve honest food, prepared
            with care, and delivered with respect. What started as a passion for
            cooking soon transformed into a professional catering service as
            people began recognizing the quality, flavor, and consistency of
            our work.
          </p>

          <p style={{ color: "#222" }}>
            Each event taught us something new. Each client shaped our approach.
            Each challenge strengthened our commitment to excellence. Today,
            Caterers stands as a symbol of reliability and taste.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Philosophy That Guides Us
          </h2>

          <p style={{ color: "#222" }}>
            We operate on a few core principles that guide every decision we
            make:
          </p>

          <ul style={{ color: "#222", paddingLeft: "20px" }}>
            <li>Never compromise on quality</li>
            <li>Respect traditions and cultural values</li>
            <li>Maintain strict hygiene standards</li>
            <li>Deliver what we promise</li>
            <li>Treat every client with honesty</li>
          </ul>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Our Culinary Strength
          </h2>

          <p style={{ color: "#222" }}>
            Our kitchen is driven by experienced chefs who understand flavor at
            a deep level. From slow-cooked gravies to freshly prepared starters,
            every dish is made with precision and patience.
          </p>

          <p style={{ color: "#222" }}>
            We specialize in a wide range of cuisines including traditional
            South Indian meals, North Indian classics, fusion snacks, and
            authentic karavali dishes inspired by Mangalorean and regional
            flavors.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Wedding Catering Expertise
          </h2>

          <p style={{ color: "#222" }}>
            Weddings demand perfection. We understand the emotional and cultural
            importance of wedding feasts. Our wedding catering services are
            designed to handle large gatherings while maintaining taste,
            presentation, and service quality.
          </p>

          <p style={{ color: "#222" }}>
            From welcome drinks to elaborate main courses and desserts, we
            ensure every dish complements the joy of the occasion.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Corporate & Professional Events
          </h2>

          <p style={{ color: "#222" }}>
            Corporate events require discipline, punctuality, and consistency.
            We deliver refined menus that suit professional environments,
            ensuring minimal disruption and maximum satisfaction.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Hygiene & Safety Commitment
          </h2>

          <p style={{ color: "#222" }}>
            Hygiene is not optional — it is a responsibility. From sourcing
            ingredients to preparation, packaging, and serving, we follow
            strict cleanliness protocols.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Our Team
          </h2>

          <p style={{ color: "#222" }}>
            Behind Caterers is a dedicated team of chefs, service staff,
            coordinators, and support members who work together seamlessly to
            deliver successful events.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Why Clients Trust Us
          </h2>

          <p style={{ color: "#222" }}>
            Clients trust Caterers because we are transparent,
            dependable, and consistent. Many of our customers return to us for
            multiple events — a testament to our service quality.
          </p>

          <h2 style={{ marginTop: "40px", color: "#111" }}>
            Our Vision for the Future
          </h2>

          <p style={{ color: "#222" }}>
            As we move forward, our focus remains on improving quality,
            expanding our menu offerings, and serving more people without
            compromising on our values.
          </p>

          <p
            style={{
              color: "#111",
              fontWeight: "600",
              marginTop: "40px",
            }}
          >
            Caterers is not just about food — it’s about creating
            experiences that people remember.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default About;