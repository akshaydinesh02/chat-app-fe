import { Routes, Route, BrowserRouter } from "react-router-dom";
import Cards from "./components/home/Cards";
// import RoomsPage from "./components/rooms";
import ChatRoom from "./components/ChatRoom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Cards />} />
        <Route path="rooms">
          <Route path=":roomId" element={<ChatRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
