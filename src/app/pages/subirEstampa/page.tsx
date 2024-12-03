"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import SessionWrapper from "../sessionWrapper/page";
import Navbar from "@/app/components/Navbar";
import Loading from "@/app/components/Loading";

const SubirEstampa = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tema: "",
    disponible: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [estampas, setEstampas] = useState<any[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      setFormData({ ...formData, [name]: e.target.checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion)
      newErrors.descripcion = "La descripción es obligatoria.";
    if (!formData.tema) newErrors.tema = "El tema es obligatorio.";

    if (!file) {
      newErrors.file = "Debes seleccionar una imagen.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (!session?.user?.artistaId) {
      setErrors({
        general: "No se pudo identificar al artista. Por favor, inicia sesión.",
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("tema", formData.tema);
    formDataToSend.append("disponible", formData.disponible.toString());
    formDataToSend.append("artistaId", session.user.artistaId.toString());

    if (file) {
      formDataToSend.append("imagen", file); // Solo se agrega si no es null
    }

    try {
      const response = await fetch("/api/estampas", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        const newEstampa = await response.json();
        setEstampas([...estampas, newEstampa]);
        setFormData({
          nombre: "",
          descripcion: "",
          tema: "",
          disponible: true,
        });
        setFile(null);
        setImagePreview(null);
        toast.success("Estampa subida correctamente.");
      } else {
        setErrors({ general: "Error al crear la estampa." });
        toast.error("Error al crear la estampa.");
      }
    } catch (error) {
      setErrors({
        general: "Error al crear la estampa. Por favor, inténtalo de nuevo.",
      });
      toast.error("Error al crear la estampa. Por favor, inténtalo de nuevo.");
    }
  };

  if (!session) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Navbar />
      <div className="ml-60 max-w-4xl">
        {/* Contenido del dashboard */}
        <section
          id="subir-estampa"
          className="bg-white p-8 shadow rounded flex flex-col items-center"
        >
          <h2 className="text-xl font-bold mb-10">Subir Nueva Estampa</h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full"
          >
            {/* Columna izquierda: Imagen */}
            <div>
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-dashed border-2 border-gray-400 p-10 rounded flex flex-col items-center justify-center h-80 max-w-full md:w-96 sm:w-96"
              >
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="object-cover max-h-72 rounded"
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded"
                      onClick={() => {
                        setFile(null);
                        setImagePreview(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <p>
                    Arrastra aquí una imagen o{" "}
                    <label
                      htmlFor="file-upload"
                      className="text-blue-600 underline cursor-pointer"
                    >
                      selecciónala de tus archivos
                    </label>
                  </p>
                )}
              </div>
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              {errors.file && <p className="text-red-600">{errors.file}</p>}
            </div>

            {/* Columna derecha: Campos del formulario */}
            <div className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block font-medium">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.nombre && (
                  <p className="text-red-600">{errors.nombre}</p>
                )}
              </div>
              <div>
                <label htmlFor="descripcion" className="block font-medium">
                  Descripción:
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                ></textarea>
                {errors.descripcion && (
                  <p className="text-red-600">{errors.descripcion}</p>
                )}
              </div>
              <div>
                <label htmlFor="tema" className="block font-medium">
                  Tema:
                </label>
                <input
                  type="text"
                  id="tema"
                  name="tema"
                  value={formData.tema}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
                {errors.tema && <p className="text-red-600">{errors.tema}</p>}
              </div>

              <div>
                <label className="flex items-center space-x-2 py-2">
                  <input
                    type="checkbox"
                    name="disponible"
                    checked={formData.disponible}
                    onChange={handleInputChange}
                    className="appearance-none w-5 h-5 border border-gray-400 rounded-full checked:bg-blue-500 checked:border-blue-500 cursor-pointer relative"
                  />
                  <span>Disponible para venta</span>
                </label>
              </div>

              <style jsx>{`
                input[type="checkbox"]:checked::before {
                  content: "✔";
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  font-size: 12px;
                  color: white;
                  font-weight: bold;
                }
              `}</style>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Subir Estampa
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default function SubirEstampaPageWithSession() {
  return (
    <SessionWrapper>
      <SubirEstampa />
    </SessionWrapper>
  );
}
