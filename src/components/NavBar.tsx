import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    // Cerrar el menú automáticamente cuando se cambia de ruta
    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <nav className="bg-slate-900 shadow-md text-white border-b border-slate-800 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
                
                {/* Logo / Título */}
                <Link to="/" className="font-bold text-xl md:text-2xl tracking-tight text-white flex flex-col leading-tight">
                    <span>Clínica</span>
                    <span className="text-cyan-400">Podología</span>
                </Link>

                {/* Botón Hamburguesa (solo visible en móviles) */}
                <button 
                    className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-800 focus:outline-none transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Alternar menú"
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between">
                        <span className={`w-full h-0.5 bg-slate-200 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`w-full h-0.5 bg-slate-200 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`w-full h-0.5 bg-slate-200 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
                    </div>
                </button>

                {/* Links de navegación */}
                <div className={`w-full md:w-auto md:flex md:items-center mt-4 md:mt-0 transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
                    <div className="flex flex-col md:flex-row md:gap-2 gap-1 bg-slate-800/50 md:bg-transparent p-3 md:p-0 rounded-xl md:rounded-none border border-slate-700 md:border-none">
                        <Link 
                            to="/" 
                            className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${location.pathname === '/' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                        >
                            Inicio
                        </Link>
                        <Link 
                            to="/pacientes/nuevo" 
                            className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${location.pathname === '/pacientes/nuevo' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                        >
                            Registrar
                        </Link>
                        <Link 
                            to="/busqueda" 
                            className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${location.pathname === '/busqueda' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                        >
                            Buscar
                        </Link>
                        <Link 
                            to="/pacientes" 
                            className={`px-4 py-2.5 rounded-lg transition-colors font-medium ${location.pathname === '/pacientes' ? 'bg-slate-800 text-cyan-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'}`}
                        >
                            Pacientes
                        </Link>
                    </div>
                </div>

            </div>
        </nav>
    );
}

export default NavBar;
