"use client";

function DashboardCliente() {
  return (
    <div className="p-6 bg-slate-400">
      <h1 className="text-3xl font-bold mb-6">Dashboard Cliente</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Carrito</h2>
        {/* Aquí puedes mostrar las camisetas en el carrito */}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Historial de Compras</h2>
        {/* Mostrar una lista de compras previas */}
      </div>

      <div>
        <h2 className="text-xl font-semibold">Estadísticas Personales</h2>
        {/* Mostrar estadísticas personales */}
      </div>
    </div>
  );
}

export default DashboardCliente;
