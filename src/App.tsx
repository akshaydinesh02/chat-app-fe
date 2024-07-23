import { Routes, Route, BrowserRouter } from "react-router-dom";
import Cards from "./components/home/Cards";
// import RoomsPage from "./components/rooms";
import ChatRoom from "./components/ChatRoom";
import { AuthProvider } from "./hooks/Auth";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="rooms">
            <Route path=":roomId" element={<ChatRoom />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
