import React, { useEffect, useState, useContext } from "react";
import Dashboard from "layouts/dashboard";
import { Link, useNavigate } from "react-router-dom";
import SignIn from "layouts/authentication/sign-in";
import UserContext from "../../context/userContext";

const getData = async (navigate) => {
  const res = await fetch("/api/userData", {
    method: "POST",
    crossDomain: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      token: window.localStorage.getItem("token"),
    }),
  });
  const data = await res.json();

  if (data.data === "token expired") {
    alert("Token expired. Please login again.");
    window.localStorage.clear();
    navigate("/authentication/sign-in");
  }

  return data.data;
};

export default function UserDetails() {
  const { userData, setUserData } = useContext(UserContext);
  const [admin, setAdmin] = useState(false);
  const navigate = useNavigate();
  console.log(window.localStorage.getItem("token"));
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData(navigate);
      console.log(data);
      setUserData(data);
      window.localStorage.setItem("userData", data);
    };

    fetchData();
  }, []);
  const loggedIn = window.localStorage.getItem("loggedIn");
  console.log(loggedIn);

  return loggedIn ? <Dashboard /> : <SignIn />;
}
