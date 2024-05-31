const UserMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleDropdown = () => setIsOpen(!isOpen);
  
    return (
      <div className="relative">
        <button onClick={toggleDropdown} className="flex items-center space-x-1 text-gray-900 hover:text-gray-900">
          <span>{user.nombre}</span>
          <FaCaretDown />
        </button>
        {isOpen && (
          <div className="absolute right-0 bg-white shadow-lg mt-2 py-1 w-48">
            <Link to="/frontend-repo/mi-cuenta" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi Cuenta</Link>
            <button onClick={onLogout} className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 w-full text-left">Cerrar Sesión</button>
          </div>
        )}
      </div>
    );
  };
  export default UserMenu;