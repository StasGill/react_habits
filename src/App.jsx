import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import HabitTracker from "./pages/HabbitTracker";
import Settings from "./pages/Settings";
import BottomNav from "./BottomNav";
import AddNew from "./pages/AddNew";
import HabitPage from "./pages/HabitPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HabitTracker />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add" element={<AddNew />} />
          <Route path="/:id" element={<HabitPage />} />
        </Routes>

        <BottomNav />
      </BrowserRouter>
    </div>
  );
}

export default App;
