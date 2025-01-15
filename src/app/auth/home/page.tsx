"use client";

import Login from "@/app/auth/login/page";
import Registro from "@/app/auth/register/page";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Landing() {
  const [toggle, setToggle] = useState(false);

  const handleRegistrationComplete = () => {
    setToggle(false);
  };

  return (
    <div className="relative h-screen bg-black text-white">
      <div className="absolute inset-0 bg-[url(/bg.jpg)] bg-cover bg-center bg-fixed opacity-20"></div>
      {/*Navbar*/}
      <div className="relative z-50">
        <nav className="fixed flex justify-around w-full h-24 mt-5">
          <div className="text-2xl font-bold text-slate-100">
            <p>CreArte</p>
          </div>
          <div className="space-x-5">
            <button
              className={`py-3 px-5 rounded-3xl hover:bg-blue-500 ${
                toggle
                  ? "bg-white text-slate-900 hover:text-white"
                  : "bg-blue-700 text-white"
              }`}
              onClick={() => setToggle(false)}
            >
              Iniciar sesión
            </button>
            <button
              className={`py-3 px-5 rounded-3xl hover:bg-blue-500 ${
                toggle
                  ? "bg-blue-700 text-white"
                  : "bg-white text-slate-900 hover:text-white"
              }`}
              onClick={() => setToggle(true)}
            >
              Registrarse
            </button>
          </div>
        </nav>
      </div>
      <div className="relative">
        {!toggle && <Login />}
        {toggle && (
          <Registro onRegistrationComplete={handleRegistrationComplete} />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default Landing;
