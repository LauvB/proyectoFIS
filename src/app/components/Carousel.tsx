import React, { useState, useEffect } from "react";

const Carousel = () => {
  const slides = [
    {
      src: "/subirEstampa.png",
      description: "Si eres artista, sube tus diseños y véndelos.",
    },
    {
      src: "/personalizaCamiseta.png",
      description: "Como cliente, personaliza tu camiseta con diseños únicos.",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Cambio automático cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Cambia cada 5 segundos
    return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + slides.length) % slides.length
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-black bg-opacity-50">
      <div className="w-full h-[300px]">
        <img
          src={slides[currentIndex].src}
          alt={`Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      <div className="relative flex flex-col items-center text-white p-4 rounded-b-lg space-y-4">
        <div className="flex justify-between w-full items-center h-[60px]">
          <button
            onClick={prevSlide}
            className="bg-white bg-opacity-80 hover:bg-opacity-75 text-black p-2 rounded-full transition"
          >
            &#8249; {/* Chevron izquierdo */}
          </button>
          {/* Descripción */}
          <div className="text-center">
            <p>{slides[currentIndex].description}</p>
          </div>
          <button
            onClick={nextSlide}
            className="bg-white bg-opacity-80 hover:bg-opacity-75 text-black p-2 rounded-full transition"
          >
            &#8250; {/* Chevron derecho */}
          </button>
        </div>

        {/* Indicadores */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-white" : "bg-gray-500"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
