import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DeskTop: React.FC = () => {
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const logOut = () => {
    setLogoutDialogOpen(true);
  };

  const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const confirmLogout = () => {
    setLogoutDialogOpen(false);
    navigate("/");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="form-inline mx-2 my-2 my-lg-0">
          <img
            src={require("../images/aarblogo.jpg")}
            title="ARB Opticals"
            alt="ARB Opticals logo"
            style={{ height: "64px", width: "64px" }}
          />
        </div>

        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/Home" aria-label="Home" />

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-label="Home"
                  to="/Home"
                >
                  <FaHome />
                </NavLink>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#customerMenu"
                  id="customerMenuToggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Customer
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="customerMenuToggle"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/NewCustomer">
                      Add New Customer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/Customer">
                      View Customer
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/OrderHistory">
                      Customer History
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#articleMenu"
                  id="articleMenuToggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Article
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="articleMenuToggle"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/Box">
                      Box
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/Frame">
                      Frame
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/SunGlass">
                      Sun Glass
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/Stock">
                      Stock Check
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#transactionMenu"
                  id="transactionMenuToggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Transaction Menu
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="transactionMenuToggle"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/Orderbook">
                      Book Order
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/OrderList">
                      View Order
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/OrderDetails">
                      Order Details
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/DailyLedger">
                      Daily Ledger
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <NavLink className="dropdown-item" to="/Invoice">
                      View Invoice
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#reportsMenu"
                  id="reportsMenuToggle"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Reports
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="reportsMenuToggle"
                >
                  <li>
                    <NavLink className="dropdown-item" to="/Profit">
                      Profit Per Order
                    </NavLink>
                  </li>
                </ul>
              </li>
            </ul>

            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="button"
              onClick={logOut}
              title="Log Out"
              aria-label="Log out"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </nav>

      <div style={{ float: "right", marginRight: "1%" }}>
        <span style={{ fontWeight: "bold", fontSize: "11px" }}>
          Welcome: {userName}
        </span>
      </div>

      <footer className="footer fixed-bottom bg-light">
        <div className="container text-left">
          <span className="text-black">
            &#169; All rights reserved by ARB Opticals
          </span>
        </div>
      </footer>

      <Dialog
        open={logoutDialogOpen}
        onClose={cancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">
          Confirm Logout
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={cancelLogout}>Cancel</Button>
          <Button onClick={confirmLogout} color="error" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeskTop;