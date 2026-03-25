import type { Paciente } from '../types/paciente.ts';
import { Link } from 'react-router-dom';
function ListaPaciente({pacientes}: {pacientes: Paciente[]}) {
    return (
        <div className="max-w-2xl mx-auto p-6 bg-slate-900 rounded-xl shadow-lg border border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-white">Lista de Pacientes</h2>
            <ul className="space-y-2">
                {pacientes.map((paciente) => (
                    <li key={paciente.dni} className="bg-slate-800 p-4 rounded-lg shadow-sm border-l-4 border-slate-600 hover:bg-slate-700 transition-colors">
                    <Link to={`/pacientes/${paciente.dni}`} className="block">
                    <span className="font-bold text-white">{paciente.nombre} {paciente.apellido}</span>
                    <span className="text-slate-400 ml-2">- {paciente.edad} años - {paciente.diagnostico}</span>
                    </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default ListaPaciente;