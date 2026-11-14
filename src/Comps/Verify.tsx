import React, { useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { VerifyCode } from "./Slices/UserSlice";
import { RootState, AppDispatch } from "./Store/Store";

const Verify: React.FC = () => {
  const navtoDesktop = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, ResponseModel } = useSelector(
    (state: RootState) => state.VerifyCode
  );

  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Function to handle input change and move cursor
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/, ""); // Allow only digits
    e.target.value = value;

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus(); // Move to next input
    }
  };

  // Handle backspace and move focus back
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1].focus(); // Move to previous input
    }
  };

  // Function to handle OTP verification
  const gotoDesktop = () => {
    let code = inputRefs.current.map((input) => input.value).join("");
    dispatch(VerifyCode(code))
      .unwrap()
      .then((response) => {
        if (response?.status === "200") {
          navtoDesktop("/Home");
        } else {
          alert("Verification has failed");
          navtoDesktop("/");
        }
      })
      .catch(() => {
        alert("Invalid Verification code");
        navtoDesktop("/");
      });
  };

  return (
    <div className="container" style={{ marginTop: "1%" }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <img
          src={require("../images/aarblogo.jpg")}
          style={{ height: "24px", width: "32px", marginLeft: "1%" }}
          alt="Logo"
        />
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#" style={{ color: "#5e5e92" }}>
                Verify User
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div
        className="col-sm-4"
        style={{
          marginTop: "10%",
          marginLeft: "25%",
          border: "1px solid black",
          backgroundColor: "#59afd5",
        }}
      >
        <div
          className="row"
          style={{ marginTop: "15%", marginLeft: "2%", marginRight: "2%" }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="col-sm-2" key={index}>
              <input
                    type="text"
                    className="form-control"
                    maxLength={1}
                    ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                    }}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    style={{ textAlign: "center", fontSize: "14px" }}
                    />
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-sm-10" style={{ marginLeft: "45%", marginTop: "5%" }}>
            <button className="btn btn-primary" style={{ marginBottom: "4%" }} onClick={gotoDesktop}>
              Verify
            </button>
          </div>
        </div>
      </div>
      <footer className="footer fixed-bottom bg-light">
        <div className="container text-left">
          <span className="text-black">© All rights reserved by ARB Opticals</span>
        </div>
      </footer>
    </div>
  );
};

export default Verify;
