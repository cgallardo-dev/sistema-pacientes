import type { Paciente } from '../types/paciente.ts';
import React, { useState } from 'react';
function FormularioPaciente({onAgregarPaciente}: {onAgregarPaciente: (paciente: Paciente) => void}) {
    const [dni, setDni] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [edad, setEdad] = useState('');
    const [diagnostico, setDiagnostico] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const nuevoPaciente: Paciente = {
            dni,
            nombre,
            apellido,
            edad : parseInt(edad),
            diagnostico,
        };
        onAgregarPaciente(nuevoPaciente)
        setDni('');
        setNombre('');
        setApellido('');
        setEdad('');
        setDiagnostico('');
    };


    return (
        
        <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-md max-w-2xl mx-auto mb-8 border border-slate-700">
            <input className="border border-slate-700 bg-slate-950 text-white rounded p-2 w-full mb-4"
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
            />
            <input className="border border-slate-700 bg-slate-950 text-white rounded p-2 w-full mb-4"
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />  
            <input className="border border-slate-700 bg-slate-950 text-white rounded p-2 w-full mb-4"
                type="text"
                placeholder="Apellido"  
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
            />
            <input className="border border-slate-700 bg-slate-950 text-white rounded p-2 w-full mb-4"
                type="number"
                placeholder="Edad"
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
            />
            <input className="border border-slate-700 bg-slate-950 text-white rounded p-2 w-full mb-4"
                type="text"
                placeholder="Diagnóstico"
                value={diagnostico}
                onChange={(e) => setDiagnostico(e.target.value)}
            />
            <button className="bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded hover:bg-cyan-300 transition-all shadow-[0_0_15px_rgba(34,211,238,0.4)] w-full" type="submit">Agregar Paciente</button>
        </form>
    );        
}
export default FormularioPaciente;

