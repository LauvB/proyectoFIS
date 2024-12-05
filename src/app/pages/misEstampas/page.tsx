"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SessionWrapper from "../sessionWrapper/page";
import Navbar from "@/app/components/Navbar";

const MisEstampas = () => {
  const { data: session } = useSession();
  const [estampas, setEstampas] = useState<any[]>([]);

  // Cargar estampas al iniciar
  useEffect(() => {
    if (session?.user?.artistaId) {
      fetch(`/api/estampas?artistaId=${session.user.artistaId}&rol=ARTISTA`)
        .then((res) => res.json())
        .then(setEstampas)
        .catch((err) => console.error("Error al cargar estampas:", err));
    }
  }, [session]);

  const toggleDisponibilidad = async (id: number, disponible: boolean) => {
    try {
      const response = await fetch(`/api/estampas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disponible: !disponible }),
      });

      if (response.ok) {
        setEstampas((prev) =>
          prev.map((estampa) =>
            estampa.id === id
              ? { ...estampa, disponible: !disponible }
              : estampa
          )
        );
      } else {
        alert("Error al actualizar la disponibilidad");
      }
    } catch (error) {
      console.error("Error al actualizar la disponibilidad:", error);
    }
  };

  const deleteEstampa = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta estampa?")) return;

    try {
      const response = await fetch(`/api/estampas/${id}`, { method: "DELETE" });

      if (response.ok) {
        setEstampas((prev) => prev.filter((estampa) => estampa.id !== id));
        toast.success("Estampa eliminada.");
      } else {
        alert("Error al eliminar la estampa");
        toast.error("Error al eliminar la estampa");
      }
    } catch (error) {
      console.error("Error al eliminar la estampa:", error);
      toast.error("Error al eliminar la estampa");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <Navbar />
      <div className="ml-60 pt-10 pb-10 max-w-5xl">
        <h2 className="text-xl font-bold mb-4 text-center">Mis Estampas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {estampas.map((estampa) => (
            <div
              key={estampa.id}
              className="bg-white shadow p-4 rounded flex flex-col items-center"
            >
              <img
                src={estampa.imagen}
                alt={estampa.nombre}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-bold">{estampa.nombre}</h3>
              <p className="text-sm">{estampa.descripcion}</p>

              {/* Etiqueta para el tema */}
              <span className="mt-2 bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                {estampa.tema}
              </span>

              {/* Botón para cambiar disponibilidad */}
              <button
                onClick={() =>
                  toggleDisponibilidad(estampa.id, estampa.disponible)
                }
                className={`mt-4 px-4 py-2 rounded text-sm font-bold ${
                  estampa.disponible
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {estampa.disponible ? "Disponible" : "No disponible"}
              </button>

              {/* Botón para eliminar */}
              <button
                onClick={() => deleteEstampa(estampa.id)}
                className="text-sm text-red-600 mt-2"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MisEstampasPageWithSession() {
  return (
    <SessionWrapper>
      <MisEstampas />
    </SessionWrapper>
  );
}
