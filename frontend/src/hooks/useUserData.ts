import { useContext } from "react";
import { UserContext } from "../context/UserProvider";

const useUserData = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserData must be inside UserProvider");
  }
  return context;
};
export default useUserData
