import { useEffect, useState } from "react";

const getData = async () => {
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
    alert("Token expired login again");
    window.localStorage.clear();
    window.location.href = "/";
  }

  return data.data;
};

export default function UserDetails() {
  const [userData, setUserData] = useState("");
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setUserData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData) {
      const encodedUserData = encodeURIComponent(JSON.stringify(userData));
      window.location.href = `http://127.0.0.1:3003?userData=${encodedUserData}`;
    }
  }, [userData]);

  return admin ? <AdminHome /> : null;
}
