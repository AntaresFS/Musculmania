import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./js/pages/landingPage";
import './styles/App.css';


// Crear el componente principal de la aplicación
const Layout = () => {
  const my_basename = ProcessingInstruction.env.MY_BASENAME || "";

  return (
    <div className="App">
      <BrowserRouter my_basename={my_basename}>
        <ScrollToTop>
          <Routes>
            <Route element={<LandingPage />} path="/" />
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </div>
  );
};

export default Layout;
