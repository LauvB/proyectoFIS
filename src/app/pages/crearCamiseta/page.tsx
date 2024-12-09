"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import SessionWrapper from "../sessionWrapper/page";
import Navbar from "@/app/components/NavbarCliente";

const CrearCamiseta = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("white");
  const [selectedMaterial, setSelectedMaterial] = useState("Algodón");
  const [price, setPrice] = useState(30000); // Precio base de la estampa
  const [formattedPrice, setFormattedPrice] = useState("");
  const [selectedEstampa, setSelectedEstampa] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  // Formateador para el precio
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  // Función para calcular el precio
  const calculatePrice = () => {
    let newPrice = 30000; // Precio base de la estampa
    newPrice += selectedMaterial === "Algodón" ? 30000 : 20000;
    newPrice += ["white", "blue", "red"].includes(selectedColor)
      ? 15000
      : 20000;
    return newPrice;
  };

  // Actualizar precio al cambiar material o color
  useEffect(() => {
    const newPrice = calculatePrice();
    setPrice(newPrice);
    setFormattedPrice(formatPrice(newPrice));
  }, [selectedMaterial, selectedColor]);

  const fetchStamp = async (stampId: number) => {
    try {
      const response = await fetch(`/api/estampas/${stampId}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la estampa");
      }
      const data = await response.json();
      if (data.imagenes && data.imagenes[0]?.url) {
        setSelectedEstampa(data.imagenes[0].url);
      }
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar la estampa");
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const idFromQuery = query.get("id");
    if (idFromQuery) {
      fetchStamp(Number(idFromQuery));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const newX = e.clientX - rect.left - 25; // Centrar la estampa
    const newY = e.clientY - rect.top - 25;

    setPosition({
      x: Math.max(0, Math.min(newX, rect.width - 50)), // Limitar dentro del contenedor
      y: Math.max(0, Math.min(newY, rect.height - 50)),
    });
  };

  /**const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedEstampa) {
      toast.error("Debes seleccionar una estampa antes de agregar al carrito");
      return;
    }
  
    const camisetaData = {
      modelo: "Camiseta personalizada", // Puedes personalizar este valor
      color: selectedColor,
      talla: selectedSize,
      material: selectedMaterial,
      precio: price,
      estampaId: parseInt(new URLSearchParams(window.location.search).get("id") || "0", 10),
      clienteId: session?.user?.clienteId, // Asegúrate de que `session` tenga el id del cliente
      posicionEstampaX: position.x, // Incluye la posición de la estampa
      posicionEstampaY: position.y,
    };
  
    try {
      const response = await fetch("/api/camiseta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(camisetaData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }
  
      const data = await response.json();
      toast.success("Camiseta agregada al carrito con éxito!");
      console.log("Camiseta creada:", data);

       // Redirigir a la página del carrito
       router.push("/pages/carrito");

    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Ocurrió un error al agregar la camiseta");
    }
  };**/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEstampa) {
      toast.error("Debes seleccionar una estampa antes de agregar al carrito");
      return;
    }

    const camisetaData = {
      modelo: "Camiseta personalizada",
      color: selectedColor,
      talla: selectedSize,
      material: selectedMaterial,
      precio: price,
      estampaId: parseInt(
        new URLSearchParams(window.location.search).get("id") || "0",
        10
      ),
      clienteId: session?.user, // ID del cliente desde la sesión
      posicionEstampaX: position.x,
      posicionEstampaY: position.y,
    };

    console.log("Datos enviados para crear camiseta:", camisetaData);

    try {
      // Crear la camiseta
      const camisetaResponse = await fetch("/api/camiseta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(camisetaData),
      });

      if (!camisetaResponse.ok) {
        const errorData = await camisetaResponse.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }

      const camiseta = await camisetaResponse.json();
      console.log("Camiseta creada:", camiseta);

      const compraData = {
        clienteId: session?.user, // ID del cliente desde la sesión
        camisetas: [camiseta.id], // Agregar el ID de la camiseta creada
        estado: "pendiente",
        fecha: new Date(),
        total: camiseta.precio, // Precio de la camiseta
      };

      console.log("Datos enviados para actualizar/crear compra:", compraData);

      const compraResponse = await fetch("/api/carrito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(compraData),
      });

      if (!compraResponse.ok) {
        const errorData = await compraResponse.json();
        toast.error(`Error: ${errorData.message}`);
        return;
      }

      const compra = await compraResponse.json();
      console.log("Compra actualizada/creada:", compra);

      toast.success("Camiseta agregada al carrito con éxito!");

      // Redirigir a la página del carrito
      router.push("/pages/carrito");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Ocurrió un error al agregar la camiseta");
    }
  };

  const sizes = ["S", "M", "L"];
  const materials = ["Algodón", "Licra"];
  const colors = [
    "white",
    "black",
    "brown",
    "gray",
    "blue",
    "darkgreen",
    "red",
  ];

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Navbar />
      <div className="bg-white p-8 shadow rounded-lg w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Crear Nueva Camiseta
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vista previa de la camiseta */}
          <div
            className="relative rounded-lg flex items-center justify-center p-6"
            style={{ width: "100%", height: "400px" }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              src="/camiseta.png" // Reemplaza con la URL de tu imagen de camiseta
              alt="Camiseta"
              className="absolute w-full h-full object-contain"
            />
            {selectedEstampa && (
              <img
                src={selectedEstampa}
                alt="Estampa seleccionada"
                className="absolute w-12 h-12 object-contain cursor-move"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                }}
                onMouseDown={handleMouseDown}
              />
            )}
          </div>

          {/* Opciones */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Opciones</h2>

            {/* Tallas */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Talla</label>
              <div className="flex space-x-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Material */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Material</label>
              <div className="flex space-x-2">
                {materials.map((material) => (
                  <button
                    key={material}
                    className={`px-4 py-2 border rounded ${
                      selectedMaterial === material
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => setSelectedMaterial(material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>

            {/* Barra de colores */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex space-x-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  ></button>
                ))}
              </div>
            </div>

            {/* Precio */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Precio</label>
              <p className="text-lg font-bold">{formattedPrice}</p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SubirEstampaPageWithSession() {
  return (
    <SessionWrapper>
      <CrearCamiseta />
    </SessionWrapper>
  );
}
