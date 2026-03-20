import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Search from "./pages/Search";
import GameDetail from "./pages/GameDetail";
import SteamLibrary from "./pages/SteamLibrary";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/search" element={<Search />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/steam" element={<SteamLibrary />} />
      </Route>
    </Routes>
  );
}

export default App;