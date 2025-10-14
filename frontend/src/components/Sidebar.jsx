import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaCog, FaChartBar, FaClipboardList, FaTools, FaFileAlt, FaTachometerAlt, FaBars, FaTimes, FaClock } from 'react-icons/fa'
import { useAuth } from '../contexts/AuthContext'

const Sidebar = ({ isOpen, onToggle, onClose, isMobile }) => {
  const [menuRecolhido, setMenuRecolhido] = useState(false)
  const { user } = useAuth()

  const allMenuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt />, roles: ['admin', 'supervisor', 'operador'] },
    { path: '/pedidos', name: 'Pedidos e Produtos', icon: <FaFileAlt />, roles: ['admin', 'supervisor', 'operador'] },
    { path: '/apontamentos-usinagem', name: 'Apontamentos de Usinagem', icon: <FaClipboardList />, roles: ['admin', 'supervisor', 'operador'] },
    { path: '/apontamentos-paradas', name: 'Apontamentos de Paradas', icon: <FaTools />, roles: ['admin', 'supervisor', 'operador'] },
    { path: '/relatorios', name: 'Relatórios', icon: <FaChartBar />, roles: ['admin', 'supervisor', 'operador'] },
    { path: '/previsao-trabalho', name: 'Previsão Trab.', icon: <FaClock />, roles: ['admin', 'supervisor', 'operador'] },
    { path: '/configuracoes', name: 'Configurações', icon: <FaCog />, roles: ['admin'] }, // ✅ Apenas admin
  ]

  // Filtrar itens do menu baseado no role do usuário
  const menuItems = allMenuItems.filter(item => {
    if (!user || !user.role) return false
    return item.roles.includes(user.role)
  })

  const toggleMenu = () => {
    if (isMobile) {
      onToggle()
    } else {
      setMenuRecolhido(!menuRecolhido)
    }
  }

  const handleLinkClick = () => {
    if (isMobile) {
      onClose()
    }
  }

  return (
    <div 
      className={`bg-blue-800 text-white space-y-6 py-7 px-2 
        ${isMobile ? (
          `fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out shadow-lg ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`
        ) : (
          `relative ${menuRecolhido ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`
        )}`}
    >
      <div className="flex items-center justify-between px-2">
        {(!menuRecolhido || isMobile) && (
          <span className="text-xl font-extrabold truncate">
            {isMobile ? 'Menu' : 'Usinagem App'}
          </span>
        )}
        <button 
          onClick={toggleMenu} 
          className="p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-colors"
          aria-label={isMobile ? 'Fechar menu' : (menuRecolhido ? 'Expandir menu' : 'Recolher menu')}
        >
          {isMobile ? <FaTimes /> : (menuRecolhido ? <FaBars /> : <FaBars />)}
        </button>
      </div>
      
      <nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex items-center ${(menuRecolhido && !isMobile) ? 'justify-center' : 'space-x-3'} py-3 px-4 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-700 text-white shadow-md' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white'
              }`
            }
            title={item.name}
          >
            <div className="text-lg">{item.icon}</div>
            {((!menuRecolhido) || isMobile) && (
              <span className="font-medium truncate">{item.name}</span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar
