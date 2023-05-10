import React, { Component, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Header from "../partials/Header";
import PageIllustration from "../partials/PageIllustration";
import Banner from "../partials/Banner";
import Card from "react-bootstrap/Card";
import "../main.css";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(email, password); //);
    fetch("http://localhost:8082/api/login", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userRegister");
        if (data.status == "ok") {
          window.localStorage.setItem("token", data.data);
          window.localStorage.setItem("loggedIn", true);
          window.location.href = "/Dashbord";
        } else {
          alert(" Password or email wrong !");
        }
      });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="grow">
        <div
          className="relative max-w-6xl mx-auto h-0 pointer-events-none"
          aria-hidden="true"
        >
          <PageIllustration />
        </div>

        <section className="relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}

              {/* Form */}
              <h1></h1>

              <>
                <div
                  className="card-container"
                  style={{ justifyContent: "center" }}
                >
                  <div className="max-w-sm  mx-auto">
                    <Card border="secondary" style={{ width: "25rem" }}>
                      <Card.Header>
                        <form>
                          <div className="flex flex-wrap -mx-3">
                            <div className="w-full px-3">
                              <button className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
                                <svg
                                  className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                                </svg>
                                <span
                                  className="h-6 flex items-center border-r border-white border-opacity-25 mr-4"
                                  aria-hidden="true"
                                ></span>
                                <span className="flex-auto pl-16 pr-8 -ml-16">
                                  Sign in with Google
                                </span>
                              </button>
                            </div>
                          </div>
                        </form>
                      </Card.Header>
                      <div className="flex items-center my-6">
                        <div
                          className="border-t border-gray-700 border-dotted grow mr-3"
                          aria-hidden="true"
                        ></div>
                        <div className="text-gray-400">
                          Or, sign in with your email
                        </div>
                        <div
                          className="border-t border-gray-700 border-dotted grow ml-3"
                          aria-hidden="true"
                        ></div>
                      </div>
                      <Card.Body>
                        <form>
                          <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full px-3">
                              <label
                                className="block text-black text-sm font-medium mb-1"
                                htmlFor="email"
                              >
                                Email
                              </label>
                              <input
                                id="email"
                                type="email"
                                className="form-input w-full text-black"
                                placeholder="you@yourcompany.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full px-3">
                              <label
                                className="block text-black text-sm font-medium mb-1"
                                htmlFor="password"
                              >
                                Password
                              </label>
                              <input
                                id="password"
                                type="password"
                                className="form-input w-full text-black"
                                placeholder="Password (at least 10 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          <div className="flex flex-wrap -mx-3 mb-4">
                            <div className="w-full px-3">
                              <div className="flex justify-between">
                                <label className="flex items-center">
                                  <input
                                    type="checkbox"
                                    className="form-checkbox"
                                  />
                                  <span className="text-gray-500 ml-2">
                                    Keep me signed in
                                  </span>
                                </label>
                                <h1>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>
                                <Link
                                  to="/reset-password"
                                  className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                                >
                                  Forgot Password?
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap -mx-3 mt-6">
                            <div className="w-full px-3">
                              <button
                                className="btn text-white bg-purple-600 hover:bg-purple-700 w-full"
                                onClick={handleSubmit}
                              >
                                Sign in
                              </button>
                            </div>
                          </div>
                        </form>
                      </Card.Body>
                      <div className="text-gray-400 text-center mt-6">
                        Don’t you have an account?{" "}
                        <Link
                          to="/signup"
                          className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out"
                        >
                          Sign up
                        </Link>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            </div>
          </div>
        </section>
      </main>

      <Banner />
    </div>
  );
}

export default SignIn;
