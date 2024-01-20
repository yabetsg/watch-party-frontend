import { FormEvent, useState } from "react";
import { Login } from "../types";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [body, setBody] = useState<Login>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3000/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/");
    } else {
      const { errors } = await response.json();
      setErrors(errors);
      console.log("Error:" + response.status + " " + response.statusText);
    }
  };
  return (
    <main className="bg-gradient-to-r from-[#274060] to-[#1B2845] h-screen justify-center flex items-center">
      <div className=" w-[400px] p-10 font-['Kanit'] border border-blue-500 bg-gradient-to-r from-[#274060] to-[#0d1422] align-center rounded-lg text-white shadow-2xl">
        <form action="" onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <label htmlFor="username">Enter username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="p-2 text-black  rounded-md outline-none focus:border-blue-300 border-[2px]"
              onChange={(e) => {
                setBody((prevBody) => ({
                  ...prevBody,
                  username: e.target.value,
                }));
              }}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password">Enter password</label>
            <input
              type="text"
              name="password"
              id="password"
              className="p-2 text-black  rounded-md outline-none focus:border-blue-300 border-[2px]"
              onChange={(e) => {
                setBody((prevBody) => ({
                  ...prevBody,
                  password: e.target.value,
                }));
              }}
            />
          </div>

          <button
            type="submit"
            className="p-2 font-extrabold font-['Kanit'] rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            Log in
          </button>
        </form>
        <div className="p-2 text-center">
          Dont have an account?{" "}
          <a href="/signup" className="text-blue-400">
            Sign up
          </a>
        </div>

        <div>
          {errors.map((error, i) => {
            return (
              <div className="text-center text-red-500" key={i}>
                {error}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default Login;
