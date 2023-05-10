import React, { useEffect } from "react";

import { Routes, Route, useLocation } from "react-router-dom";

import "aos/dist/aos.css";
import "./css/style.css";
import "bootstrap/dist/css/bootstrap.min.css";

import AOS from "aos";

import Home from "./pages/Home";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import ResetPassword from "./pages/ResetPassword";
import Dashbord from "./pages/Dashbord";

function App() {
  const location = useLocation();
  const isLoggedIn = window.localStorage.getItem("loggedIn");

  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route
          exact
          path="/home"
          element={isLoggedIn == "true" ? <Dashbord /> : <SignIn />}
        />
        <Route exact path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Dashbord" element={<Dashbord />} />

        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </>
  );
}

export default App;
