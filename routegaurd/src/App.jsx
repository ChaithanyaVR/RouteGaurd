import React from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Home from "./components/home";
import Header from "./components/header";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./contexts/authContext";

function App() {
  const location = useLocation();

  // Hide Header on login/register pages
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const routesArray = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />,
    },
  ];

  const routesElement = useRoutes(routesArray);

  return (
    <AuthProvider>
      {!isAuthPage && <Header />}
      <div className="pt-12 w-full h-screen flex flex-col">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
