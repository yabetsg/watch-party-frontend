import { ReactNode, createContext, useEffect, useState } from "react";

export const UserContext = createContext("");
const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState("");
  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (token !== "undefined" && token !== null) {
      const response = await fetch("http://localhost:3000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const { data } = await response.json();
        setUser(data.user.username);
      } else {
        console.log("ERROR: " + response.statusText);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider value={ user }>{children}</UserContext.Provider>
  );
};

export default UserProvider;
