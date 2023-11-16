import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Party from "./components/Party";
import TestSocket from "./components/TESTSOCKET";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { partyID } = useParams();

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/party/:partyID" element={<Party/>}></Route>
        <Route path="/test" element={<TestSocket/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
