import { useEffect, useState } from 'react';
import type { Paciente } from './types/paciente';
import ListaPaciente from './components/ListaPaciente';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import NotFound from './pages/NotFound';
import DetallePaciente from './pages/DetallePaciente';
import Busqueda from './pages/Busqueda';
import Registrar from './pages/Registrar';
import Ozonoterapia from './pages/Ozonoterapia';
import Laser from './pages/Laser';
import { supabase } from './supabase';

function App() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);

    useEffect(() => {
        async function cargarPacientes() {
            const { data, error } = await supabase
                .from('pacientes')
                .select('*');

            if (error) console.error(error);
            if (data) setPacientes(data);
        }
        cargarPacientes();
    }, []);

    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pacientes" element={
                    <div className="py-12">
                        <ListaPaciente pacientes={pacientes} />
                    </div>
                } />
                <Route path="/pacientes/nuevo" element={<Registrar />} />
                <Route path="/pacientes/:id" element={<DetallePaciente pacientes={pacientes} />} />
                <Route path="/ozonoterapia/:id" element={<Ozonoterapia />} />
                <Route path="/laser/:id" element={<Laser />} />
                <Route path="/busqueda" element={<Busqueda />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}
export default App;
