import { Dispatch, ReactNode, SetStateAction, createContext, useEffect, useState } from "react";
interface App {
  getUser: () => Promise<string>;
  setHost:Dispatch<SetStateAction<string>>
  host:string
}
export const UserContext = createContext<App>({ getUser: () => Promise.resolve(""),setHost:()=>"",host:""});

const UserProvider = ({ children }: { children: ReactNode }) => {
  const [host,setHost] = useState(()=>{
    const initHost = localStorage.getItem("host");
    if(initHost){
      return initHost
    }else{
      return ""
    }
  });


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

  useEffect(()=>{

  })

  const userState = {
    getUser,
    setHost,
    host
  };
  return (
    <UserContext.Provider value={userState}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
