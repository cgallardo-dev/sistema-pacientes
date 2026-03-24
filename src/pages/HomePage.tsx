
import { Link } from 'react-router-dom';

function HomePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Bienvenida, Dra.
                    </h1>
                    <p className="text-lg text-gray-600">
                        Gestiona tus pacientes de manera eficiente
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link to="/pacientes/nuevo" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-4">👤</div>
                        <h3 className="font-bold text-gray-800 mb-2">Nuevo Paciente</h3>
                        <p className="text-gray-500 text-sm">Registrar nueva ficha</p>
                    </Link>
                    <Link to="/busqueda" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="font-bold text-gray-800 mb-2">Búsqueda</h3>
                        <p className="text-gray-500 text-sm">Acceder por DNI</p>
                    </Link>
                    <Link to="/pacientes" className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="text-4xl mb-4">📋</div>
                        <h3 className="font-bold text-gray-800 mb-2">Pacientes</h3>
                        <p className="text-gray-500 text-sm">Ver todos los registros</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
export default HomePage;