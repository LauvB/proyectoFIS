"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import SessionWrapper from "../sessionWrapper/page";
import { FaPlus } from "react-icons/fa";
import {
  COLORS,
  SIZES,
  MATERIALS,
  getColorFilter,
} from "@/app/validators/option-validator";
import {
  STAMP_PRICE,
  BASE_PRICE,
  formatPrice,
} from "@/app/config/product-prices";
import Navbar from "@/app/components/NavbarCliente";
import RatingModal from "@/app/components/RatingModal";

const CrearCamiseta = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const camisetaRef = useRef<HTMLDivElement | null>(null);
  const stampAreaRef = useRef<HTMLDivElement | null>(null);
  const [selectedEstampa, setSelectedEstampa] = useState<{
    stampId: number;
    url: string;
    name: string | null;
  }>({ stampId: 0, url: "", name: null });
  const [position, setPosition] = useState({ x: 150, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [estampaSize, setEstampaSize] = useState(100);

  const [options, setOptions] = useState<{
    color: (typeof COLORS)[number];
    size: (typeof SIZES.options)[number];
    material: (typeof MATERIALS.options)[number];
  }>({
    color: COLORS[0],
    size: SIZES.options[0],
    material: MATERIALS.options[0],
  });

  const [open, setOpen] = useState(false);

  const fetchStamp = async (stampId: number) => {
    try {
      const response = await fetch(`/api/estampas/${stampId}`);
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la estampa");
      }
      const data = await response.json();
      if (data.imagenes && data.imagenes[0]?.url) {
        setSelectedEstampa({
          stampId,
          url: data.imagenes[0].url,
          name: data.nombre,
        });
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
    if (!isDragging || !camisetaRef.current) return;

    const camisetaRect = camisetaRef.current.getBoundingClientRect();

    const mouseX = e.clientX - camisetaRect.left;
    const mouseY = e.clientY - camisetaRect.top;

    const limitedX = Math.max(0, Math.min(mouseX, camisetaRect.width - 50));
    const limitedY = Math.max(0, Math.min(mouseY, camisetaRect.height - 50));

    setPosition({ x: limitedX, y: limitedY });
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    setEstampaSize((prevSize) => Math.max(50, prevSize + e.movementX)); // Ajusta el tamaño dinámicamente
  };

  const handleResizeMouseUp = () => {
    document.removeEventListener("mousemove", handleResizeMouseMove);
    document.removeEventListener("mouseup", handleResizeMouseUp);
  };

  const handleColorChange = (color: (typeof COLORS)[number]) => {
    setOptions((prevOptions) => ({ ...prevOptions, color }));
  };

  const handleSizeChange = (size: (typeof SIZES.options)[number]) => {
    setOptions((prevOptions) => ({ ...prevOptions, size }));
  };

  const handleMaterialChange = (
    material: (typeof MATERIALS.options)[number]
  ) => {
    setOptions((prevOptions) => ({ ...prevOptions, material }));
  };

  const saveTShirt = () => {
    if (!camisetaRef.current || !stampAreaRef.current || !selectedEstampa.url) {
      toast.error("No se puede guardar la imagen. Verifica la configuración.");
      return;
    }

    const { left: stampLeft, top: stampTop } =
      stampAreaRef.current!.getBoundingClientRect();

    const { left: tshirtLeft, top: tshirtTop } =
      camisetaRef.current!.getBoundingClientRect();

    // Crear un canvas para la camiseta
    const camisetaCanvas = document.createElement("canvas");
    const camisetaRect = camisetaRef.current.getBoundingClientRect();
    camisetaCanvas.width = camisetaRect.width;
    camisetaCanvas.height = camisetaRect.height;
    const camisetaCtx = camisetaCanvas.getContext("2d");

    if (!camisetaCtx) {
      toast.error("No se pudo inicializar el canvas de la camiseta.");
      return;
    }

    // Crear un canvas para la estampa
    const estampaCanvas = document.createElement("canvas");
    const stampAreaRect = stampAreaRef.current.getBoundingClientRect();
    estampaCanvas.width = stampAreaRect.width;
    estampaCanvas.height = stampAreaRect.height;
    const estampaCtx = estampaCanvas.getContext("2d");

    if (!estampaCtx) {
      toast.error("No se pudo inicializar el canvas de la estampa.");
      return;
    }

    // Dibujar la camiseta base en el canvas principal
    const shirtImage = new Image();
    shirtImage.crossOrigin = "anonymous";
    shirtImage.src = `/tshirt/tshirt-${options.color.name}.png`;

    shirtImage.onload = () => {
      camisetaCtx.drawImage(
        shirtImage,
        0,
        0,
        camisetaCanvas.width,
        camisetaCanvas.height
      );

      // Dibujar la estampa en el canvas de la estampa
      const estampaImg = new Image();
      estampaImg.crossOrigin = "anonymous";
      estampaImg.src = selectedEstampa.url;

      estampaImg.onload = () => {
        // Ajustar la estampa al tamaño del área de diseño
        const scaleX = estampaSize / estampaImg.width;
        const scaleY = estampaSize / estampaImg.height;
        const leftOffset = stampLeft - tshirtLeft;
        const topOffset = stampTop - tshirtTop;
        const offsetX = position.x - leftOffset;
        const offsetY = position.y - topOffset;

        estampaCtx.drawImage(
          estampaImg,
          0,
          0,
          estampaImg.width,
          estampaImg.height,
          offsetX,
          offsetY,
          estampaImg.width * scaleX,
          estampaImg.height * scaleY
        );

        // Combinar el canvas de la estampa con el canvas de la camiseta
        camisetaCtx.drawImage(
          estampaCanvas,
          stampAreaRect.x - camisetaRect.x, // Posición relativa al canvas de la camiseta
          stampAreaRect.y - camisetaRect.y
        );

        camisetaCanvas.toBlob(async (blob) => {
          if (!blob) {
            toast.error("Error al generar la imagen de la camiseta.");
            return;
          }

          const formData = new FormData();
          formData.append("imagen", blob, `camiseta-${Date.now()}.png`);
          formData.append("modelo", "Camiseta regular con estampado");
          formData.append("color", options.color.name);
          formData.append("talla", options.size.label);
          formData.append("material", options.material.label);
          formData.append(
            "precio",
            (
              BASE_PRICE +
              STAMP_PRICE +
              options.size.price +
              options.material.price
            ).toString()
          );
          formData.append("estampaId", selectedEstampa.stampId.toString());
          formData.append(
            "clienteId",
            session?.user?.clienteId?.toString() || "0"
          );
          formData.append("estado", "pendiente");

          try {
            const response = await fetch("/api/camiseta", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            } else {
              toast.success("Camiseta añadida al carrito.");
            }
          } catch (error) {
            console.error(error);
            toast.error("Ocurrió un error al guardar en el carrito.");
          }
        }, "image/png");
      };
    };
  };

  const saveRating = async (rating: number) => {
    try {
      const response = await fetch(`/api/ratings/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          estampaId: selectedEstampa.stampId,
          puntaje: rating,
          clienteId: session?.user?.clienteId,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Error al guardar la calificación: ${response.statusText}`
        );
      }

      toast.success("¡Calificación guardada exitosamente!");
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar la calificación.");
    }
  };

  const checkUserRating = async (stampId: number) => {
    try {
      const response = await fetch(
        `/api/ratings?stampId=${stampId}&clienteId=${session?.user?.clienteId}`
      );
      const data = await response.json();

      if (data.hasRated) {
        setOpen(false);
        setTimeout(() => {
          router.push("/pages/carrito");
        }, 3000);
      } else {
        setOpen(true);
      }
    } catch (error) {
      console.error("Error al verificar la calificación:", error);
    }
  };

  const handleAddToCart = async () => {
    await checkUserRating(selectedEstampa.stampId);
    saveTShirt();
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Navbar />
      <div className="bg-white p-8 shadow rounded-lg w-full max-w-4xl ml-60">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Vista previa de la camiseta */}
          <div
            className="relative overflow-hidden flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 w-full max-w-[400px] h-[450px]"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <img
              src="/tshirt/tshirt.png"
              alt="Camiseta"
              className="absolute w-full h-full object-contain"
              style={{
                filter: `${getColorFilter(options.color.value)}`,
                mixBlendMode: "multiply",
              }}
            />
            {selectedEstampa && (
              <div
                style={{
                  position: "absolute",
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  width: `${estampaSize}px`,
                  height: `${estampaSize}px`,
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              >
                <img
                  className="w-full h-full object-contain cursor-move border-[3px] border-blue-500"
                  src={selectedEstampa.url || undefined}
                  alt={selectedEstampa.name || "Estampa"}
                />
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full shadow border bg-white border-zinc-200 cursor-nwse-resize transition hover:bg-blue-500"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setIsDragging(false);
                    document.addEventListener(
                      "mousemove",
                      handleResizeMouseMove
                    );
                    document.addEventListener("mouseup", handleResizeMouseUp);
                  }}
                />
              </div>
            )}
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              ref={camisetaRef}
            >
              <div className="absolute top-0 left-0 w-full h-[calc(50%-150px)] bg-black opacity-30" />
              <div className="absolute bottom-0 left-0 w-full h-[calc(50%-150px)] bg-black opacity-30" />
              <div className="absolute top-[calc(50%-150px)] left-0 w-[calc(50%-85px)] h-[300px] bg-black opacity-30" />
              <div className="absolute top-[calc(50%-150px)] right-0 w-[calc(50%-85px)] h-[300px] bg-black opacity-30" />
              <div
                className="absolute top-[calc(50%-150px)] left-[calc(50%-85px)] w-[170px] h-[300px] bg-transparent border-2 border-dashed border-blue-500"
                ref={stampAreaRef}
              />
            </div>
          </div>

          {/* Opciones*/}
          <div className="m-5">
            <h1 className="text-2xl font-bold text-gray-700 mb-6">
              Personaliza tu camiseta
            </h1>
            {/* Estampa */}
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Estampa: {selectedEstampa.name || "Estampa seleccionada"}
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {selectedEstampa.url ? (
                    <img
                      src={selectedEstampa.url}
                      alt={selectedEstampa.name || "Estampa seleccionada"}
                      className="w-14 h-14 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500 w-1/2">
                      No se ha seleccionado ninguna estampa
                    </span>
                  )}

                  {/* Botón para cambiar la estampa */}
                  <button
                    onClick={() =>
                      (window.location.href = "/pages/catalogoEstampas")
                    }
                    title="Elegir otra estampa"
                    className="bg-blue-500 text-white px-4 py-4 rounded-lg hover:bg-blue-600 text-sm"
                  >
                    <FaPlus />
                  </button>
                </div>
                {selectedEstampa.url ? (
                  <span className="font-medium text-sm text-gray-700">
                    + {formatPrice(STAMP_PRICE)}
                  </span>
                ) : (
                  <span className="font-medium text-sm text-gray-700 whitespace-nowrap">
                    <label>+ $ 0</label>
                  </span>
                )}
              </div>
            </div>

            {/* Tallas*/}
            <div className="mb-4">
              <label className="block font-medium mb-1">Talla</label>
              <div className="flex items-center justify-between text-sm">
                <div className="flex space-x-2">
                  {SIZES.options.map((size) => (
                    <button
                      key={size.label}
                      className={`w-10 h-10 border rounded ${
                        options.size.value === size.value
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
                <span className="font-medium text-sm text-gray-700">
                  + {formatPrice(options.size.price)}
                </span>
              </div>
            </div>

            {/* Material */}
            <div className="mb-4">
              <label className="block font-medium mb-1">Material</label>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2 items-center text-sm">
                  {MATERIALS.options.map((material) => (
                    <button
                      key={material.label}
                      className={`px-4 py-2 border rounded ${
                        options.material.value === material.value
                          ? "bg-blue-500 text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => handleMaterialChange(material)}
                    >
                      {material.label}
                    </button>
                  ))}
                </div>
                <span className="font-medium text-sm text-gray-700">
                  + {formatPrice(options.material.price)}
                </span>
              </div>
            </div>

            {/* Color */}
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Color: {options.color.name}
              </label>
              <div className="flex space-x-2">
                {COLORS.map((color) => (
                  <div
                    key={color.value}
                    className={`w-8 h-8 rounded-full cursor-pointer`}
                    style={{
                      backgroundColor: color.value,
                      border:
                        color.value === "white" ? "2px solid #b0b3bf" : "none",
                      outline:
                        options.color.value === color.value
                          ? "3px solid #3b82f6"
                          : "none",
                      outlineOffset: "2px",
                    }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>

            <div className="w-full flex items-center gap-6 mt-8 pt-4 border-t-2">
              <p className="font-medium whitespace-nowrap">
                {formatPrice(
                  BASE_PRICE +
                    STAMP_PRICE +
                    options.size.price +
                    options.material.price
                )}
              </p>
              <button
                onClick={handleAddToCart}
                className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600"
              >
                Agregar al carrito
              </button>
              {open && (
                <RatingModal
                  onClose={() => setOpen(false)}
                  saveRating={saveRating}
                />
              )}
            </div>
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
