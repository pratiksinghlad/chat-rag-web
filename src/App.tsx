/**
 * Main Application Component
 *
 * Sets up routing and authentication context for the application.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import "@/styles/index.css";

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            {/* Landing page (login) */}
            <Route path="/" element={<Landing />} />

            {/* Home page (authenticated) */}
            <Route path="/home" element={<Home />} />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
