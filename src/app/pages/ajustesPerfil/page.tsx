"use client";

import { useSession, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import SessionWrapper from "../sessionWrapper/page";
import Navbar from "@/app/components/Navbar";
import NavbarCliente from "@/app/components/NavbarCliente";
import Loading from "@/app/components/Loading";

interface FormData {
  name?: string;
  email?: string;
  password?: string;
  newPassword?: string;
}

const AjustesPerfil = () => {
  const { data: session } = useSession();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const role = session?.user.role;

  const handleSignOut = async () => {
    setTimeout(() => {
      signOut({ callbackUrl: "/auth/login" });
    }, 3000);
  };
  const onSubmit = async (data: FormData) => {
    if (!data.name && !data.password && !data.newPassword) {
      toast.error("Por favor, ingresa algún cambio para actualizar.");
      return;
    }

    if (!session || !session.user) {
      toast.error("No hay una sesión activa. Por favor, inicia sesión.");
      return;
    }

    try {
      const response = await axios.put("/api/usuario", {
        ...data,
        email: session.user?.email,
      });
      toast.success(response.data.message || "Perfil actualizado");
      setTimeout(() => {
        toast.info("Por favor, inicia sesión nuevamente para continuar.");
        handleSignOut();
      }, 1000);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Error al actualizar perfil");
    }
  };

  if (!session) {
    return <Loading />;
  }
  return (
    <div className="ml-60 min-h-screen bg-gray-100 flex items-center justify-center">
      <div>{role === "CLIENTE" ? <NavbarCliente /> : <Navbar />}</div>
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-12">
          <h1 className="text-2xl font-bold text-center text-gray-700 mb-6">
            Ajustes de Perfil
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Sección de Nombre */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Cambiar Nombre de Usuario
              </h2>
              <label className="block text-gray-600 mb-1">Nombre</label>
              <input
                {...register("name")}
                defaultValue={session.user?.name || ""}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700"
              />
            </div>

            {/* Sección de Correo Electrónico */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Información de Contacto
              </h2>
              <label className="block text-gray-600 mb-1">
                Correo Electrónico
              </label>
              <p className="w-full border border-gray-200 rounded-lg px-4 py-2 bg-gray-100 text-gray-500">
                {session.user?.email || "Correo no disponible"}
              </p>
            </div>

            <hr className="my-6" />

            {/* Sección de Contraseña */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-2">
                Cambiar Contraseña
              </h2>
              <label className="block text-gray-600 mb-1">
                Contraseña Actual
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700  mb-4"
              />
              <label className="block text-gray-600 mb-1">
                Nueva Contraseña
              </label>
              <input
                {...register("newPassword")}
                type="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-2  text-gray-700"
              />
            </div>

            {/* Botón de Guardar */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default function AjustesPerfilWithSession() {
  return (
    <SessionWrapper>
      <AjustesPerfil />
    </SessionWrapper>
  );
}
