    import { useParams } from "react-router-dom";
    import type { Paciente } from "../types/paciente";
    function DetallePaciente({ pacientes }: { pacientes: Paciente[] }) {
        const { id } = useParams();
        const paciente = pacientes.find((p) => p.dni === id);
        if (!paciente) {
            return <div className="p-4">Paciente no encontrado</div>;
        }
        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Detalle del Paciente</h1>
                <p className= "text-gray-700 mb-2">DNI del Paciente: {id}</p>
                <p className= "text-gray-700 mb-2">Nombre: {paciente.nombre} {paciente.apellido}</p>
                <p className= "text-gray-700 mb-2">Edad: {paciente.edad} años</p>
                <p className= "text-gray-700 mb-2">Enfermedad: {paciente.diagnostico}</p>
            </div>
        )

    }
    export default DetallePaciente;
