import { useState } from 'react';
import FormularioPaciente from './components/FormularioPaciente';
import type { Paciente } from './types/paciente';
import ListaPaciente from './components/ListaPaciente';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import NotFound from './pages/NotFound';
import DetallePaciente from './pages/DetallePaciente';
import Busqueda from './pages/Busqueda';
function App() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    function agregarPaciente(paciente: Paciente) {
        setPacientes([...pacientes, paciente]);
    }

    return (
        <div>
            <NavBar/>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pacientes" element={
                    <div>
                        <FormularioPaciente onAgregarPaciente={agregarPaciente} />
                        <ListaPaciente pacientes={pacientes} />
                    </div>
                } />
                <Route path="*" element={<NotFound />} />
                <Route path="/pacientes/:id" element={<DetallePaciente pacientes={pacientes} />} />
                <Route path="/busqueda" element={<Busqueda />} />
            </Routes>
        </div>
    );
}
export default App;