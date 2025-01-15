import React, { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FaUserCircle, FaListAlt, FaFileUpload } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

const Navbar = () => {
  const { data: session } = useSession();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/home" });
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 h-screen w-60 bg-blue-700 text-white flex flex-col">
        <div className="py-6 px-5">
          <h1 className="text-2xl font-bold tracking-wide">Artista CreArte</h1>
        </div>
        <ul className="flex-1 space-y-1">
          <li className="hover:bg-blue-800 cursor-pointer">
            <Link
              href="/pages/subirEstampa"
              className="w-full flex items-center space-x-5 py-3 px-5"
            >
              <FaFileUpload />
              <span>Subir Estampa</span>
            </Link>
          </li>
          <li className="hover:bg-blue-800 cursor-pointer">
            <Link
              href="/pages/misEstampas"
              className="w-full flex items-center space-x-5 py-3 px-5"
            >
              <FaListAlt />
              <span>Mis Estampas</span>
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
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-10"
          onClick={() => setIsModalOpen(false)} // Cierra el modal al hacer clic en cualquier parte
        >
          <div
            className="absolute left-14 bottom-5 bg-white py-2 rounded shadow"
            onClick={(e) => e.stopPropagation()} // Previene que el clic dentro del modal cierre el modal
          >
            <ul>
              {/* Opción de Ajustes de perfil */}
              <li>
                <Link
                  href="/pages/ajustesPerfil"
                  className="flex items-center space-x-2 hover:bg-slate-100 p-2 rounded transition-all duration-300 px-5"
                  onClick={() => setIsModalOpen(false)}
                >
                  <IoSettingsOutline className="text-xl" />
                  <span>Ajustes de Perfil</span>
                </Link>
              </li>
              {/* Opción de Cerrar sesión */}
              <li>
                <button
                  className="flex items-center space-x-2 hover:bg-slate-100 p-2 rounded transition-all duration-300 w-full px-5"
                  onClick={handleSignOut}
                >
                  <IoIosLogOut className="text-xl" />
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
