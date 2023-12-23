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
      const response = await fetch("http://localhost:3000/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { user } = await response.json();
        setUser(user.username);
      } else {
        console.log("ERROR: " + response.statusText);
      }
    }
  };
  useEffect(() => {
    console.log("USER PROVIDER");

    getUser();
  }, [user]);
  const userState = useMemo(() => {
    return {
      user,
      setUser,
    };
  }, [user]);
  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
