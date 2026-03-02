import React, { useEffect } from "react";
import LoginPage from "./pages/user/LoginPage";
import { Route, Routes } from "react-router-dom";
import SignupPage from "./pages/user/SignupPage";
import { useLogin } from "./context/LoginContext";
import { StyledToastContainer } from "./components/layouts/Toast";

function App() {
  const { setIsLogin } = useLogin();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [setIsLogin]);

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
      </Routes>

      <StyledToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={true}
        closeOnClick={true}
        pauseOnHover={false}
        limit={1}
      />
    </>
  );
}

export default App;
