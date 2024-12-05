"use client";

import React, { useEffect, useState } from "react";
import SessionWrapper from "../sessionWrapper/page";
import Navbar from "@/app/components/NavbarCliente";
import BarraBusqueda from "./BarraBusqueda";

const CatalogoEstampas = () => {
  const [estampas, setEstampas] = useState<any[]>([]);

  // Cargar estampas al iniciar
  useEffect(() => {
    fetch(`/api/estampas`)
      .then((res) => res.json())
      .then((data) => {
        setEstampas(data);
      })
      .catch((err) => console.error("Error al cargar estampas:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <Navbar />
      <div className="ml-60 pt-10 pb-10 max-w-3xl w-full">
        <BarraBusqueda />
      </div>
    </div>
  );
};

export default function CatalogoEstampasPageWithSession() {
  return (
    <SessionWrapper>
      <CatalogoEstampas />
    </SessionWrapper>
  );
}
