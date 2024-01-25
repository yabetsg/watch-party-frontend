import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

interface App {
  getUser: () => Promise<string>;
  setHost: Dispatch<SetStateAction<string>>;
  host: string;
}
export const AppContext = createContext<App>({
  getUser: () => Promise.resolve(""),
  setHost: () => "",
  host: "",
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [host, setHost] = useState("");
  const location = useLocation();

  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (token !== "undefined" && token !== null) {
      const response = await fetch(`${import.meta.env.VITE_API}/auth`, {
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

  const initializeHost = useCallback(async () => {
    const token = localStorage.getItem("token");
    const partyID = location.pathname.split("/party/")[1];

    const response = await fetch(
      `${import.meta.env.VITE_API}/party/${partyID}/users`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const data = await response.json();
      setHost(data.party.host);
      localStorage.setItem("host", data.party.host);
    }
  }, [location.pathname]);

  useEffect(() => {
    getUser();
    initializeHost();
  }, [initializeHost]);
  const appState = {
    getUser,
    setHost,
    host,
  };
  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};

export default AppProvider;
