"use client";

import { useForm, FieldError } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { IoIosArrowDropdown } from "react-icons/io";
import "react-toastify/dist/ReactToastify.css";

function Registro({
  onRegistrationComplete,
}: {
  onRegistrationComplete: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (data.password != data.confirmPassword) {
      return toast.error("Las contraseñas no coinciden");
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        nombre: data.username,
        email: data.email,
        contrasena: data.password,
        rol: data.rol,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    const resJSON = await res.json();

    if (res.ok) {
      toast.success("Usuario registrado correctamente");
      onRegistrationComplete();
    }

    console.log(res);
  });

  console.log(errors);

  return (
    <div className="relative h-screen flex justify-center items-center w-full">
      <div className="relative w-3/5 p-10">
        <form onSubmit={onSubmit}>
          {/* Título */}
          <h1 className="font-bold text-3xl text-center mb-6">Registro</h1>

          {/* Grid para dividir el formulario en dos columnas */}
          <div className="grid grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div>
              {/* Nombre de Usuario */}
              <div className="relative flex items-center text-slate-900">
                <span className="absolute left-4 text-lg">
                  <FaRegUser />
                </span>
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  {...register("username", {
                    required: {
                      value: true,
                      message: "El nombre de usuario es obligatorio",
                    },
                  })}
                  className="pl-12 pr-5 w-full h-12 border-none outline-none rounded-3xl bg-white bg-opacity-80 placeholder-slate-900"
                />
              </div>
              {errors.username && (
                <span className="text-red-500 text-sm">
                  {(errors.username as FieldError).message ||
                    "Error desconocido"}
                </span>
              )}

              {/* Correo */}
              <div className="relative flex items-center text-slate-900 mt-6">
                <span className="absolute left-4 text-xl">
                  <MdOutlineEmail />
                </span>
                <input
                  type="email"
                  placeholder="E-mail"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "El email es obligatorio",
                    },
                  })}
                  className="pl-12 pr-5 w-full h-12 border-none outline-none rounded-3xl bg-white bg-opacity-80 placeholder-slate-900"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {(errors.email as FieldError).message || "Error desconocido"}
                </span>
              )}

              {/* Rol */}
              <div className="relative flex items-center text-slate-900 mt-6">
                <span className="absolute left-4 text-xl">
                  <IoIosArrowDropdown />
                </span>
                <select
                  {...register("rol", { required: true })}
                  className="pl-12 w-full h-12 border-none outline-none rounded-3xl bg-white bg-opacity-80 appearance-none"
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="ARTISTA">Artista</option>
                </select>
              </div>
            </div>

            {/* Columna 2 */}
            <div>
              {/* Contraseña */}
              <div className="relative flex items-center text-slate-900">
                <span className="absolute left-4 text-xl">
                  <IoLockClosedOutline />
                </span>
                <input
                  type="password"
                  placeholder="Contraseña"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Escribe una contraseña",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                      message:
                        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial",
                    },
                  })}
                  className="pl-12 pr-5 w-full h-12 border-none outline-none rounded-3xl bg-white bg-opacity-80 placeholder-slate-900"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {(errors.password as FieldError).message ||
                    "Error desconocido"}
                </span>
              )}

              {/* Confirmar Contraseña */}
              <div className="relative flex items-center text-slate-900 mt-6">
                <span className="absolute left-4 text-xl">
                  <IoLockClosedOutline />
                </span>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "Confirme la contraseña",
                    },
                  })}
                  className="pl-12 pr-5 w-full h-12 border-none outline-none rounded-3xl bg-white bg-opacity-80 placeholder-slate-900"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-sm">
                  {(errors.confirmPassword as FieldError).message ||
                    "Error desconocido"}
                </span>
              )}

              {/* Botón de Registrarse */}
              <button className="w-full bg-blue-500 text-white p-3 rounded-3xl hover:bg-blue-600 mt-6">
                Registrarse
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registro;
