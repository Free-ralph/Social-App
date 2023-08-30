import "./App.css";
import Home from "./pages/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useStateContext } from "./context/StateContextProvider";
import { Snackbar, Alert } from '@mui/material'
import ProfilePage from './pages/ProfilePage'
import Login from "./pages/Login";
import ChatRoom from './pages/ChatRoom'
import Register from "./pages/Register";

function App() {
  const { snackMessage, isSnackOpen, handleCloseSnack } = useStateContext()
  const location = useLocation();
  return (
    <>
      <Snackbar
        open={isSnackOpen}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleCloseSnack}
      >
        <Alert
          onClose={handleCloseSnack}
          severity={snackMessage.severity}
          sx={{ width: "100%" }}
        >
          {snackMessage.message}
        </Alert>
      </Snackbar>
      <div className="h-screen w-screen overflow-x-hidden hideScrollBar">
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Home />} />
            <Route path='/profile/:profile_id' element={<ProfilePage />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/chat/:id' element={<ChatRoom />} />
          </Routes>
        </AnimatePresence>
      </div>
    </>
  );
}

export default App;
