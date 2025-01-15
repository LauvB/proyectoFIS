"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import SessionWrapper from "../sessionWrapper/page";
import Image from "next/image";
import { formatPrice } from "@/app/config/product-prices";

interface Camiseta {
  id: number;
  modelo: string;
  color: string;
  talla: string;
  material: string;
  precio: number;
  estado: string;
  camisetaImagen: string;
}

const Carrito = () => {
  const { data: session } = useSession();
  const [camisetas, setCamisetas] = useState<Camiseta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const clienteId = session.user.clienteId;
      fetch(`/api/camiseta?clienteId=${clienteId}`)
        .then((res) => res.json())
        .then((data) => {
          setCamisetas(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching camisetas:", error);
          setLoading(false);
        });
    }
  }, [session]);

  if (!session) {
    return <p>Por favor, inicia sesión para ver tu carrito.</p>;
  }

  if (loading) {
    return <p>Cargando tu carrito...</p>;
  }

  if (camisetas.length === 0) {
    return <p>No tienes camisetas en tu carrito.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tu Carrito</h1>
      <div className="bg-white rounded p-10">
        <div className="px-4 pb-4 font-semibold flex items-center">
          <div className="w-32 mr-4">Producto</div>
          <div className="w-2/5"></div>

          <div className="w-1/12">Precio</div>
        </div>
        {camisetas.map((camiseta) => (
          <div key={camiseta.id} className="flex items-center border-t-2 p-4">
            {/* Imagen con dimensiones fijas */}
            <Image
              src={camiseta.camisetaImagen}
              alt={`Camiseta ${camiseta.modelo}`}
              width={200}
              height={200}
              className="object-cover w-32 h-36 rounded mr-4"
            />
            {/* Detalles de la camiseta */}
            <div className="w-2/5 pr-5">
              <p>
                {camiseta.modelo}, color {camiseta.color.toLowerCase()} de{" "}
                {camiseta.material.toLowerCase()}
              </p>
              <p className="text-slate-500 text-sm">Talla: {camiseta.talla}</p>
            </div>
            <div className="w-1/12">
              <p>{formatPrice(camiseta.precio)}</p>
            </div>
            <div className="w-1/12">Eliminar</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CarritoWithSession() {
  return (
    <SessionWrapper>
      <Carrito />
    </SessionWrapper>
  );
}
