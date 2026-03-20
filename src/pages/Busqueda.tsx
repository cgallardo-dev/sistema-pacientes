import { useState } from 'react';
import {useNavigate } from 'react-router-dom';

function Busqueda() {
    const [dni, setDni] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (dni) {
            navigate(`/pacientes/${dni}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Búsqueda de Pacientes
                    </h1>
                    <p className="text-xl text-gray-500 mb-8">
                        Ingresa el DNI del paciente para acceder a su detalle
                    </p>
                    <input
                        type="text"
                        placeholder="DNI del paciente"
                        className="w-full md:w-1/2 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Buscar
                    </button>   
                </div>
            </div>
        </div>
    );
}
export default Busqueda;