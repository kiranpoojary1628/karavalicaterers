import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Navbar = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [adminEmail, setAdminEmail] =
    useState("");

  const [deliveryEmail, setDeliveryEmail] =
    useState("");

  const [servicesOpen, setServicesOpen] =
    useState(false);

  /* LOAD USER */

  useEffect(() => {

    try {

      const stored =
        localStorage.getItem(
          "loggedInUser"
        );

      if (stored) {
        setUser(
          JSON.parse(stored)
        );
      }

    } catch {}

  }, []);

  /* LOAD CONFIG */

  useEffect(() => {

    const loadConfig =
      async () => {

        try {

          const res =
            await fetch(
              "http://localhost:5000/api/admin/config"
            );

          const data =
            await res.json();

          setAdminEmail(
            data.adminEmail
          );

          setDeliveryEmail(
            data.deliveryEmail
          );

        } catch {
          console.log(
            "Config load failed"
          );
        }

      };

    loadConfig();

  }, []);

  /* ROLE CHECK */

  const isAdmin =
    user?.email &&
    adminEmail &&
    user.email
      .toLowerCase()
      .trim() ===
    adminEmail
      .toLowerCase()
      .trim();

  const isDelivery =
    user?.email &&
    deliveryEmail &&
    user.email
      .toLowerCase()
      .trim() ===
    deliveryEmail
      .toLowerCase()
      .trim();

  /* LOGOUT */

  const handleLogout = () => {

    localStorage.removeItem(
      "loggedInUser"
    );

    setUser(null);

    navigate("/login");

  };

  const closeServices = () =>
    setServicesOpen(false);

  return (

    <nav
      style={{
        background: "#000",
        color: "#fff",
        padding: "12px 24px",
        display: "flex",
        justifyContent:
          "space-between",
        alignItems: "center"
      }}
    >

      {/* LOGO */}

      <Link
        to="/"
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          textDecoration:
            "none"
        }}
      >
        Caterers
      </Link>

      <div
        style={{
          display: "flex",
          gap: "18px",
          alignItems: "center"
        }}
      >

        {/* NOT LOGGED IN */}

        {!user && (

          <>
            <Link to="/login">
              Login
            </Link>

            <Link to="/signup">
              Register
            </Link>
          </>

        )}

        {/* ADMIN */}

        {user && isAdmin && (

          <Link to="/admin">
            🛠 Admin Panel
          </Link>

        )}

        {/* DELIVERY */}

        {user && isDelivery && (

          <Link to="/delivery-dashboard">
            🚚 Delivery Dashboard
          </Link>

        )}

        {/* NORMAL USER */}

        {user &&
          !isAdmin &&
          !isDelivery && (

          <>

            <Link to="/">
              Home
            </Link>

            {/* SERVICES DROPDOWN */}

            <div
              style={{
                position: "relative"
              }}
              onMouseEnter={() =>
                setServicesOpen(true)
              }
              onMouseLeave={() =>
                setServicesOpen(false)
              }
            >

              <span
                style={{
                  cursor: "pointer"
                }}
              >
                Services ▾
              </span>

              {servicesOpen && (

                <div
                  style={{
                    position: "absolute",
                    top: "30px",
                    background: "#000",
                    padding: "12px",
                    borderRadius: "10px",
                    display: "flex",
                    flexDirection:
                      "column",
                    gap: "8px",
                    minWidth: "200px",
                    boxShadow:
                      "0 6px 18px rgba(0,0,0,0.4)"
                  }}
                >

                  <Link
                    to="/service/wedding-catering"
                    onClick={
                      closeServices
                    }
                  >
                    Wedding Catering
                  </Link>

                  <Link
                    to="/service/birthday-parties"
                    onClick={
                      closeServices
                    }
                  >
                    Birthday Parties
                  </Link>

                  <Link
                    to="/service/corporate-events"
                    onClick={
                      closeServices
                    }
                  >
                    Corporate Events
                  </Link>

                  <Link
                    to="/service/house-warming"
                    onClick={
                      closeServices
                    }
                  >
                    House Warming
                  </Link>

                  <Link
                    to="/service/karavali-special"
                    onClick={
                      closeServices
                    }
                  >
                    Karavali Special
                  </Link>

                </div>

              )}

            </div>

            <Link to="/delivery">
              Delivery
            </Link>

            <Link to="/contact">
              Contact Us
            </Link>

            <Link to="/feedback">
              Feedback
            </Link>

            <Link to="/orders">
              My Orders
            </Link>

          </>

        )}

        {/* PROFILE */}

        {user && (

          <Link
            to="/profile"
            style={{
              fontWeight: "600",
              color: "#a78bfa"
            }}
          >
            👤 {user.name}
          </Link>

        )}

        {/* LOGOUT */}

        {user && (

          <button
            onClick={
              handleLogout
            }
            style={{
              background:
                "transparent",
              border:
                "1px solid #fff",
              color: "#fff",
              padding:
                "6px 12px",
              borderRadius:
                "6px",
              cursor:
                "pointer"
            }}
          >
            Logout
          </button>

        )}

      </div>

    </nav>

  );

};

export default Navbar;