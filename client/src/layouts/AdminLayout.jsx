import { Outlet, Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tags, LogOut } from 'lucide-react'
import api from '../services/api'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext.jsx'

function AdminLayout() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      await api.get('/admin/dashboard')
      setLoading(false)
    } catch {
      navigate('/admin/login')
    }
  }

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout')
      logout()
      navigate('/admin/login')
      toast.success('Logged out successfully')
    } catch {
      logout()
      navigate('/admin/login')
      toast.error('Logout failed')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold text-primary">DailyFixCare Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/admin" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <Package size={20} />
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <ShoppingCart size={20} />
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center gap-3 p-3 rounded hover:bg-gray-800">
                <Tags size={20} />
                Categories
              </Link>
            </li>

          </ul>
        </nav>
        <div className="absolute bottom-4 left-4 w-56">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded hover:bg-gray-800 w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-gray-50">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout