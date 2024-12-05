import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiEmotionSadLine } from "react-icons/ri";

function BusquedaEstampas() {
  const [busqueda, setBusqueda] = useState("");
  const [estampas, setEstampas] = useState<any[]>([]);
  const [artistas, setArtistas] = useState<any[]>([]);
  const [temas, setTemas] = useState([]);
  const [artistaSeleccionado, setArtistaSeleccionado] = useState("");
  const [temaSeleccionado, setTemaSeleccionado] = useState("");
  const router = useRouter();

  // Fetch inicial para cargar estampas, artistas y temas
  useEffect(() => {
    fetch("/api/estampas")
      .then((res) => res.json())
      .then((data) => setEstampas(data));

    fetch("/api/artistas")
      .then((res) => res.json())
      .then((data) => setArtistas(data));

    fetch("/api/temasEstampas")
      .then((res) => res.json())
      .then((data) => setTemas(data));
  }, []);

  const handleElegir = (id: number) => {
    router.push(`/pages/crearCamiseta?id=${id}`);
  };

  // Actualiza estampas según búsqueda, artista o tema
  useEffect(() => {
    const params = new URLSearchParams();
    if (busqueda) params.append("busqueda", busqueda);
    if (artistaSeleccionado) params.append("artistaId", artistaSeleccionado);
    if (temaSeleccionado) params.append("tema", temaSeleccionado);

    fetch(`/api/estampas?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setEstampas(data));
  }, [busqueda, artistaSeleccionado, temaSeleccionado]);

  // Manejar búsqueda con Enter
  const handleBusqueda = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setBusqueda((e.target as HTMLInputElement).value);
      setTemaSeleccionado("");
      setArtistaSeleccionado("");
    }
  };

  // Cambiar filtro por artista
  const handleArtistaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArtistaSeleccionado(e.target.value);
    setTemaSeleccionado("");
    setBusqueda("");
  };

  // Cambiar filtro por tema
  const handleTemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTemaSeleccionado(e.target.value);
    setArtistaSeleccionado("");
    setBusqueda("");
  };

  return (
    <div className="mx-auto p-4">
      {/* Barra de Búsqueda */}
      <div className="relative mb-4">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre del artista, tema o estampa"
          className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          onKeyDown={handleBusqueda}
        />
        <span className="absolute left-3 top-3 text-gray-400">
          <FaSearch />
        </span>
        <button
          className="absolute top-2 right-4 text-2xl text-gray-400"
          onClick={() => setBusqueda("")}
        >
          <IoClose />
        </button>
      </div>

      {/* Botones y Selects */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            !busqueda && !artistaSeleccionado && !temaSeleccionado
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => {
            setBusqueda("");
            setArtistaSeleccionado("");
            setTemaSeleccionado("");
          }}
        >
          Todas
        </button>

        <select
          className="px-4 py-2 border rounded-lg shadow-sm"
          value={artistaSeleccionado}
          onChange={handleArtistaChange}
        >
          <option value="">Artista</option>
          {artistas.map((artista) => (
            <option key={artista.id} value={artista.id}>
              {artista.nombre}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 border rounded-lg shadow-sm"
          value={temaSeleccionado}
          onChange={handleTemaChange}
        >
          <option value="">Tema</option>
          {temas.map((tema) => (
            <option key={tema} value={tema}>
              {tema}
            </option>
          ))}
        </select>
      </div>

      {/* Listado de Estampas */}
      {estampas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span className="text-[12rem] text-gray-600 mb-10">
            <RiEmotionSadLine />
          </span>
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">
            Parece que no tenemos lo que buscas...
          </h3>
          <p className="text-base text-gray-500">
            Intenta buscar con un término diferente o explora los filtros
            disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {estampas.map((estampa) => (
            <div
              key={estampa.id}
              className="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg flex flex-col"
            >
              <img
                src={estampa.imagen}
                alt={estampa.nombre}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3
                className="text-lg font-bold h-7
              mb-2 overflow-hidden"
              >
                {estampa.nombre}
              </h3>
              <p className="text-sm h-10 overflow-hidden ">
                {estampa.descripcion}
              </p>
              <div className="flex justify-around">
                <span className="mt-2 bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                  {estampa.tema}
                </span>
                <span className="mt-2 bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {estampa.artistaNombre}
                </span>
              </div>
              <button
                onClick={() => handleElegir(estampa.id)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded text-sm font-bold"
              >
                Elegir
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BusquedaEstampas;
