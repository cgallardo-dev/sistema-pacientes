import FormularioPaciente from '../components/FormularioPaciente';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import type { Paciente } from '../types/paciente';

function Registrar() {
    const navigate = useNavigate();

    async function agregarPaciente(paciente: Paciente) {
        const { error } = await supabase
            .from('pacientes')
            .insert(paciente);

        if (error) {
            console.error(error);
            alert('Error al guardar el paciente');
        } else {
            alert('Paciente registrado exitosamente');
            navigate('/pacientes');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Registrar Nuevo Paciente</h1>
                <FormularioPaciente onAgregarPaciente={agregarPaciente} />
            </div>
        </div>
    );
}
export default Registrar;
