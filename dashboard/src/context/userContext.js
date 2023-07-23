import { createContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Get the userData param from the query string of the URL
    if (localStorage.getItem("userData")) {
      const storedUserData = localStorage.getItem("userData");
      setUserData(storedUserData);
    }
  }, []);

  return <UserContext.Provider value={{ userData, setUserData }}>{children}</UserContext.Provider>;
};

export default UserContext;
