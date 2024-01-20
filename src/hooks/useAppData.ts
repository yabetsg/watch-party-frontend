import { useContext } from "react";
import { AppContext } from "../context/AppProvider";

const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useUserData must be inside UserProvider");
  }
  return context;
};
export default useAppData
