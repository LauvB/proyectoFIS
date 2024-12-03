import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  FaUserCog,
  FaSignOutAlt,
  FaUserCircle,
  FaListAlt,
  FaFileUpload,
} from "react-icons/fa";

const Navbar = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 h-screen w-60 bg-blue-700 text-white flex flex-col">
        <div className="py-6 px-5">
          <h1 className="text-2xl font-bold tracking-wide">
            Panel del Artista
          </h1>
        </div>
        <ul className="flex-1 space-y-1">
          <li className="py-3 px-5 hover:bg-blue-800 cursor-pointer flex items-center space-x-5">
            <FaFileUpload />
            <Link href="/pages/subirEstampa" className="text-sm">
              Subir Estampa
            </Link>
          </li>
          <li className="py-3 px-5 hover:bg-blue-800 cursor-pointer flex items-center space-x-5">
            <FaListAlt />
            <Link href="/pages/misEstampas" className="text-sm">
              Mis Estampas
            </Link>
          </li>
        </ul>
        <div className="py-5 px-5 border-t border-blue-600">
          <button
            className="w-full flex items-center space-x-5 text-left"
            onClick={() => setIsModalOpen(true)}
          >
            <FaUserCircle className="text-2xl" />
            <div className="flex flex-col">
              <span>Usuario</span>
              <span className="text-sm text-blue-300">
                {session?.user?.name || "..."}
              </span>
            </div>
          </button>
        </div>
      </nav>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-10 rounded shadow relative w-80">
            {/* Botón de cerrar */}
            <button
              className="absolute top-3 right-4 text-2xl font-bold text-gray-500"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center">
              Opciones de Usuario
            </h2>
            <ul className="space-y-4">
              {/* Opción de Ajustes de perfil */}
              <li>
                <Link
                  href="/pages/ajustesPerfil"
                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-100 p-2 rounded transition-all duration-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FaUserCog className="text-xl" />
                  <span>Ajustes de Perfil</span>
                </Link>
              </li>
              {/* Opción de Cerrar sesión */}
              <li>
                <button
                  className="flex items-center space-x-2 text-red-600 hover:bg-red-100 p-2 rounded transition-all duration-300 w-full"
                  onClick={handleSignOut}
                >
                  <FaSignOutAlt className="text-xl" />
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
