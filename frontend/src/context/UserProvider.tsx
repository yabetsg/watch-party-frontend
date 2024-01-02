import { ReactNode, createContext } from "react";
interface User {
  getUser: () => Promise<string>;
}
export const UserContext = createContext<User>({ getUser: () => Promise.resolve("") });

const UserProvider = ({ children }: { children: ReactNode }) => {
  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (token !== "undefined" && token !== null) {
      const response = await fetch("http://localhost:3000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { user } = await response.json();
        
        return user.username;
      } else {
        return response.statusText;
      }
    }
  };

  const userState = {
    getUser,
  };
  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
