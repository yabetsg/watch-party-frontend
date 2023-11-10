import React from 'react'

const Login = () => {
  return (
    <div>
        <form action="" className="flex flex-col">
            <label htmlFor="text">Enter username</label>
            <input type="text" name="username" id="username" className="border"/>
            <label htmlFor="password">Enter password</label>
            <input type="text" name="password" id="password" className="border"/>
            <button type="submit">Log in</button>
        </form>
    </div>
  )
}

export default Login