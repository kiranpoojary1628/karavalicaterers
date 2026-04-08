import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import bgVideo from "../assets/bg-video.mp4";

const PaymentPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const slug = location.state?.slug;

  const [upi, setUpi] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState("");

  /* 🔥 FETCH BOOKING */
  useEffect(() => {
    const loadBooking = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/booking/${id}`);
        const data = await res.json();
        setAmount(data.amount || 0);
      } catch {
        setAmount(0);
      }
    };
    loadBooking();
  }, [id]);

  const handlePay = async () => {

    if (loading) return;

    if (!upi.includes("@")) {
      setError("Enter valid UPI ID (example@upi)");
      return;
    }

    setError("");
    setStatus("processing");
    setLoading(true);

    try {
      await new Promise(res => setTimeout(res, 2500));

      const res = await fetch("http://localhost:5000/api/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: id,
          upiId: upi,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus("success");

      setTimeout(() => {
        navigate(`/book/${slug || ""}`, {
          state: { success: true }
        });
      }, 2500);

    } catch (err) {
      setStatus("failed");
      setError(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-wrapper">

      {/* VIDEO BG */}
      <video autoPlay muted loop className="payment-bg">
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="payment-overlay" />

      <div className="payment-container">

        {/* 🔥 APP HEADER */}
        <div className="payment-header">
          <h3>UPI Payment</h3>
          <span>Fast • Secure • Trusted</span>
        </div>

        {/* 🔥 MERCHANT INFO */}
        <div className="merchant-box">
          <p>Paying to</p>
          <h4>Caterers</h4>
          <span className="merchant-id">karavalicaterers@yapl</span>
        </div>

        {/* 🔥 AMOUNT */}
        <div className="amount">₹{amount}</div>

        {/* 🔥 INPUT */}
        {status === "" && (
          <>
            <input
              className="upi-input"
              placeholder="Enter your UPI ID (yourname@upi)"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <button
              className="pay-btn"
              onClick={handlePay}
              disabled={loading}
            >
              {loading ? "Processing..." : `Pay ₹${amount}`}
            </button>

            <p className="secure-text">
              🔒 Secured by UPI • No charges
            </p>
          </>
        )}

        {/* 🔥 PROCESSING */}
        {status === "processing" && (
          <div className="processing-box">
            <div className="loader"></div>
            <p>Processing your payment...</p>
          </div>
        )}

        {/* 🔥 SUCCESS */}
        {status === "success" && (
          <div className="success">
            <div className="check">✔</div>
            <h2>Payment Successful</h2>
            <p>We will contact you soon</p>
          </div>
        )}

        {/* 🔥 FAILED */}
        {status === "failed" && (
          <div className="failed-box">
            <p>❌ Payment Failed</p>
            {error && <span>{error}</span>}
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentPage;