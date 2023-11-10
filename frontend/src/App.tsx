import "./App.css";
import Home from "./components/Home";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Party from "./components/Party";
function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { partyID } = useParams();

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/party/:partyID" element={<Party/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
