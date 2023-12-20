import { FormEvent, useState } from "react";
import { SignUp } from "../types";

const Signup = () => {
  const [body, setBody] = useState<SignUp>({
    confirm: "",
    password: "",
    username: "",
  });
  const handleSignUp = (e:FormEvent) => {
    e.preventDefault()
    fetch("http://localhost:3000/users/signup",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(body)
    }).then(res=>res.json()).then(data=>console.log(data)).catch(err=>console.log(err))
  };
  return (
    <main className="bg-[#272526] h-screen justify-center flex items-center">
      <div className=" w-[400px] p-10 bg-gray-400 align-center rounded-md">
        <form onSubmit={handleSignUp} action="" className="flex flex-col gap-5">
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

          <label htmlFor="confirm">Confirm password</label>
          <input
            type="text"
            name="confirm"
            id="confirm"
            className="border"
            onChange={(e) => {
              setBody((prevBody) => ({
                ...prevBody,
                confirm: e.target.value,
              }));
            }}
          />
          <button type="submit">Sign up</button>
        </form>
        <div className="text-center">
          Already have an account?
          <a href="/login" className="text-blue-800">
            Log in
          </a>
        </div>
      </div>
    </main>
  );
};

export default Signup;
