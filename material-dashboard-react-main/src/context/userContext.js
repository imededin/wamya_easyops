import { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Get the userData param from the query string of the URL
    const searchParams = new URLSearchParams(window.location.search);
    const userDataParam = searchParams.get("userData");

    // If the userData param exists, parse it as JSON and set it as the userData state
    if (userDataParam) {
      const decodedUserData = decodeURIComponent(userDataParam);
      const parsedUserData = JSON.parse(decodedUserData);
      setUserData(parsedUserData);
      localStorage.setItem("userData", JSON.stringify(parsedUserData));
    } else if (localStorage.getItem("userData")) {
      const storedUserData = JSON.parse(localStorage.getItem("userData"));
      setUserData(storedUserData);
    }
  }, []);

  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};

export default UserContext;
