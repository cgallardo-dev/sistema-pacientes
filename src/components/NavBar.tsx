import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <nav className="bg-blue-700 p-4 shadow-md text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold text-xl tracking-tight">Clínica Podología</Link>
                <div className="flex gap-4">
                    <Link to="/" className="hover:text-blue-100 px-3 py-2 rounded">Inicio</Link>
                    <Link to="/pacientes/nuevo" className="hover:text-blue-100 px-3 py-2 rounded">Registrar</Link>
                    <Link to="/busqueda" className="hover:text-blue-100 px-3 py-2 rounded">Buscar</Link>
                    <Link to="/pacientes" className="hover:text-blue-100 px-3 py-2 rounded">Pacientes</Link>
                </div>
            </div>
        </nav>
    );
}
export default NavBar;
