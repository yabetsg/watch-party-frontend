import { FormEvent, useState } from "react";
import { Login } from "../types";

const Login = () => {
  const [body, setBody] = useState<Login>({
    username: "",
    password: "",
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    if(response.ok){
      const data = await response.json()
      localStorage.setItem("token",data.token)
    }else{
      console.log("Error:"+ response.status + " "+ response.statusText)
    }
  };
  return (
    <main className="bg-[#272526] h-screen justify-center flex items-center">
      <div className=" w-[400px] p-10 bg-gray-400 align-center">
        <form action="" onSubmit={handleLogin} className="flex flex-col gap-5">
          <label htmlFor="username">Enter username</label>
          <input
            type="text"
            name="username"
            id="username"
            className="border"
            onChange={(e) => {
              setBody((prevBody) => ({
                ...prevBody,
                username: e.target.value,
              }));
            }}
          />
          <label htmlFor="password">Enter password</label>
          <input
            type="text"
            name="password"
            id="password"
            className="border"
            onChange={(e) => {
              setBody((prevBody) => ({
                ...prevBody,
                password: e.target.value,
              }));
            }}
          />
          <button type="submit">Log in</button>
        </form>
        <div className="text-center">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-800">
            Sign up
          </a>
        </div>
      </div>
    </main>
  );
};

export default Login;
