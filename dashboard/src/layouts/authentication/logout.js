import { useEffect, useState, useContext } from "react";
import SignIn from "layouts/authentication/sign-in";
import UserContext from "../../context/userContext";
import { Link, useNavigate } from "react-router-dom";

export default function LogOut() {
  const navigate = useNavigate();
  window.localStorage.clear();
  navigate("/authentication/sign-in");

  return null;
}
