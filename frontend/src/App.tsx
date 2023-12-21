import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Party from "./components/Party";
import TestSocket from "./components/TestSocket";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProvider from "./contexts/UserProvider";
function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/party/:partyID" element={<Party />}></Route>
          <Route path="/test" element={<TestSocket />}></Route>
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
