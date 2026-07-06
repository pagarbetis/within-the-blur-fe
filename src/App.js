import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import CekDiri from "@/pages/CekDiri";
import Kuis from "@/pages/Kuis";
import Maskot from "@/pages/Maskot";
import Polling from "@/pages/Polling";
import Curhat from "@/pages/Curhat";
import Jurnal from "@/pages/Jurnal";
import Profil from "@/pages/Profil";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/maskot" element={<Maskot />} />
              <Route path="/polling" element={<Polling />} />
              <Route path="/curhat" element={<Curhat />} />
              <Route path="/cek-diri" element={<CekDiri />} />
              <Route path="/check-in" element={<CekDiri />} />
              <Route path="/kuis" element={<Kuis />} />
              <Route path="/quiz" element={<Kuis />} />
              <Route path="/jurnal" element={<Jurnal />} />
              <Route path="/journal" element={<Jurnal />} />
              <Route path="/profil" element={<Profil />} />
              <Route path="/profile" element={<Profil />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
