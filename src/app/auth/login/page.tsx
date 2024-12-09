"use client";

import { useForm, FieldError } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/pages/dashboard");
    }
  });

  return (
    <div className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <form onSubmit={onSubmit} className="w-1/4">
        {error && (
          <p className="bg-red-500 text-lg text-white p-3 rounded mb-5">
            {error}
          </p>
        )}

        <h1 className="text-slate-200 font-bold text-4xl mb-4">
          Iniciar sesión
        </h1>
        <label htmlFor="email" className="text-slate-500 mb-2 block text-sm">
          Email:
        </label>
        <input
          type="email"
          {...register("email", {
            required: {
              value: true,
              message: "El email es obligatorio",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.email && (
          <span className="text-red-500 text-xs">
            {(errors.email as FieldError).message || "Error desconocido"}
          </span>
        )}

        <label htmlFor="password" className="text-slate-500 mb-2 block text-sm">
          Contraseña:
        </label>
        <input
          type="password"
          {...register("password", {
            required: {
              value: true,
              message: "La contraseña es obligatoria",
            },
          })}
          className="p-3 rounded block mb-2 bg-slate-900 text-slate-300 w-full"
        />
        {errors.password && (
          <span className="text-red-500 text-xs">
            {(errors.password as FieldError).message || "Error desconocido"}
          </span>
        )}

        <button className="w-full bg-blue-500 text-white p-3 rounded-lg mt-2">
          Iniciar sesión
        </button>
        <p className="text-slate-400 mt-10 text-center">
          ¿No tienes una cuenta?{" "}
          <Link href="/auth/register" className="underline">
            Regístrate ahora
          </Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
