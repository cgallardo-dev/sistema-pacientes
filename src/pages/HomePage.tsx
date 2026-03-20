
import { Link} from 'react-router-dom';

function HomePage() {

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Sistema de Gestión de Pacientes
                    </h1>
                    <p className="text-xl text-gray-500 mb-8">
                        Administra tus pacientes de forma rápida y sencilla
                    </p>
                    <Link
                        to="/pacientes"
                        className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Ver Pacientes
                    </Link>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <div className="text-4xl mb-3">👤</div>
                        <h3 className="font-bold text-gray-800 mb-2">Registro</h3>
                        <p className="text-gray-500 text-sm">Registra pacientes con su DNI, datos personales y diagnóstico</p>
                    </div>
                    <Link to="/busqueda" className="bg-white p-6 rounded-lg shadow-sm text-center hover:bg-gray-100 transition-colors">
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <div className="text-4xl mb-3">🔍</div>
                        <h3 className="font-bold text-gray-800 mb-2">Búsqueda</h3>
                        <p className="text-gray-500 text-sm">Accede al detalle de cada paciente por su DNI rápidamente</p>
                    </div>
                    </Link>
                    <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                        <div className="text-4xl mb-3">📋</div>
                        <h3 className="font-bold text-gray-800 mb-2">Historial</h3>
                        <p className="text-gray-500 text-sm">Consulta todos los pacientes registrados en el sistema</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default HomePage;