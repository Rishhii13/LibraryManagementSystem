import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

// Library Management Pages
import Dashboard from "./pages/Dashboard";
import Books from "./pages/Books";
import Members from "./pages/Members";
import IssueBorrow from "./pages/IssueBorrow";
import Returns from "./pages/Returns";
import DueOverdue from "./pages/DueOverdue";
import Notifications from "./pages/Notifications";
import FineManagement from "./pages/FineManagement";
import Settings from "./pages/Settings";

// React Experiments
import UseStateDemo from "./pages/UseStateDemo";
import ReactHooksDemo from "./pages/ReactHooksDemo";

// WebSocket Test
import SocketTest from "./SocketTest";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Librarian Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* React Experiments */}
        <Route path="/use-state" element={<UseStateDemo />} />
        <Route path="/react-hooks" element={<ReactHooksDemo />} />

        {/* WebSocket Experiment */}
        <Route path="/socket-test" element={<SocketTest />} />

        {/* Library Management */}
        <Route path="/books" element={<Books />} />
        <Route path="/members" element={<Members />} />
        <Route path="/issue-borrow" element={<IssueBorrow />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/due-overdue" element={<DueOverdue />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/fine-management" element={<FineManagement />} />
        <Route path="/settings" element={<Settings />} />

        {/* Fallback */}
        <Route path="*" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;