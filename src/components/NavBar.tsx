import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="bg-slate-900 p-4 shadow-md text-white border-b border-zinc-700">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl tracking-tight text-white">Clínica Podología</Link>
                <div className="flex gap-4">
                    <Link to="/" className="hover:text-slate-300 px-3 py-2 rounded">Inicio</Link>
                    <Link to="/pacientes/nuevo" className="hover:text-slate-300 px-3 py-2 rounded">Registrar</Link>
                    <Link to="/busqueda" className="hover:text-slate-300 px-3 py-2 rounded">Buscar</Link>
                    <Link to="/pacientes" className="hover:text-slate-300 px-3 py-2 rounded">Pacientes</Link>
                </div>
            </div>
        </nav>
    );
}
export default NavBar;
