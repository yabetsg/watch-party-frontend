import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
interface User {
  user: string;
  setUser: Dispatch<SetStateAction<string>>;
}
export const UserContext = createContext<User>({ user: "", setUser: () => {} });

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
    console.log("hi");

    getUser();
  }, [user]);
  const userState = useMemo(() => {
    return {
      user,
      setUser,
    };
  }, [user]);
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
