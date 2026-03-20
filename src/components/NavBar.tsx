import {Link} from 'react-router-dom';

function NavBar() {
    return (
        <nav className="bg-gray-800 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="text-white font-bold text-lg">Gestión de Pacientes</div>
                <div>
                    <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 rounded">Inicio</Link>
                    <Link to="/pacientes" className="text-gray-300 hover:text-white px-3 py-2 rounded">Pacientes</Link>
                </div>
            </div>
        </nav>
    );
}
export default NavBar;
