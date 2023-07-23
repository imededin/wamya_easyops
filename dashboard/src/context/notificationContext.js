import { createContext, useState } from "react";

const NotifContext = createContext(null);

export const NotifContextProvider = ({ children }) => {
  const [success, setSuccess] = useState(false);
  const [projectName, setProjectName] = useState("test");

  const toggleSuccess = () => {
    setSuccess(!success);
  };

  return (
    <NotifContext.Provider value={{ success, projectName, setProjectName, toggleSuccess }}>
      {children}
    </NotifContext.Provider>
  );
};

export default NotifContext;
