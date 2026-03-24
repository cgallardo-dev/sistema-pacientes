import type { Paciente } from '../types/paciente.ts';
import { Link } from 'react-router-dom';
function ListaPaciente({pacientes}: {pacientes: Paciente[]}) {
    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Lista de Pacientes</h2>
            <ul className="space-y-2">
                {pacientes.map((paciente) => (
                    <li key={paciente.dni} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
                    <Link to={`/pacientes/${paciente.dni}`} className="block">
                    <span className="font-bold">{paciente.nombre} {paciente.apellido}</span>
                    <span className="text-gray-500 ml-2">- {paciente.edad} años - {paciente.diagnostico}</span>
                    </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ListaPaciente;