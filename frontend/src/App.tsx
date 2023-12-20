import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Party from "./components/Party";
import TestSocket from "./components/TestSocket";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { partyID } = useParams();

  //TODO: add ui to party
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/signup" element={<Signup/>}></Route>
        <Route path="/party/:partyID" element={<Party/>}></Route>
        <Route path="/test" element={<TestSocket/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
