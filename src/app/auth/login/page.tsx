"use client";

import { useForm, FieldError } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { MdOutlineEmail } from "react-icons/md";
import { IoLockClosedOutline } from "react-icons/io5";
import "react-toastify/dist/ReactToastify.css";
import Carousel from "@/app/components/Carousel";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      router.push(`/pages/dashboard`);
    }
  });

  return (
    <div className="w-full flex justify-center">
      <div className="relative h-screen items-center grid grid-cols-2 w-2/3">
        {/* Left Column */}
        <div>
          <h1 className="text-5xl font-bold my-6">
            ¡Bienvenido a{" "}
            <p className="pl-4">
              <span className="text-blue-500">CreArte</span>!
            </p>
          </h1>
          <Carousel></Carousel>
        </div>
        {/* Right Column */}
        <div className="flex justify-end">
          <div className="relative w-2/3">
            <form onSubmit={onSubmit}>
              <h1 className="font-bold text-3xl text-center mb-6">
                Iniciar sesión
              </h1>
              <div className="flex items-center text-slate-900">
                <span className="absolute z-10 left-4 text-xl">
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
                  className="pl-12 pr-5 w-full h-12 border-none outline-none rounded-3xl block bg-white opacity-80 placeholder-slate-900"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {(errors.email as FieldError).message || "Error desconocido"}
                </span>
              )}

              <div className="flex items-center text-slate-900 mt-6">
                <span className="absolute z-10 left-4 text-xl">
                  <IoLockClosedOutline />
                </span>
                <input
                  type="password"
                  placeholder="Contraseña"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "La contraseña es obligatoria",
                    },
                  })}
                  className="pl-12 pr-5 w-full h-12 border-none outline-none rounded-3xl block bg-white opacity-80 placeholder-slate-900"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {(errors.password as FieldError).message ||
                    "Error desconocido"}
                </span>
              )}
              <button className="w-full bg-blue-500 text-white p-3 rounded-3xl hover:bg-blue-600 mt-6">
                Iniciar sesión
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
