import React, { useState } from "react";
import Rating from "@mui/material/Rating";
import { useRouter } from "next/navigation";

interface RatingModalProps {
  onClose: () => void;
  saveRating: (rating: number) => Promise<void>; // Función para guardar la calificación
}
const RatingModal: React.FC<RatingModalProps> = ({ onClose, saveRating }) => {
  const [rating, setRating] = React.useState<number | null>(0);
  const router = useRouter();

  const handleSubmit = async () => {
    if (rating !== null) {
      try {
        await saveRating(rating);
        onClose();
        setTimeout(() => {
          router.push("/pages/carrito");
        }, 3000);
      } catch (error) {
        console.error("Error al guardar el rating:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-semibold mb-3 text-center">
          ¡Califica esta estampa!
        </h2>
        <p className="text-sm font-medium text-center text-stone-500 mb-4">
          Puedes calificar de 0 a 5
        </p>
        <div className="flex items-center justify-center mb-6">
          <Rating
            name="simple-controlled"
            value={rating}
            precision={0.5}
            size="large"
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
        </div>
        <div className="flex items-center justify-center">
          <div
            className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600"
            onClick={handleSubmit}
          >
            Enviar
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
