import React from "react";

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full border-t-4 border-blue-600 w-16 h-16 mx-auto mb-4"></div>
        <h1 className="text-2xl font-semibold text-gray-700">Cargando...</h1>
        <p className="text-gray-500 mt-2">Estamos preparando todo para ti</p>
      </div>
    </div>
  );
};

export default Loading;
