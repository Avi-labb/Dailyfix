import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Plus, Edit, Trash2 } from 'lucide-react'

function AdminCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories')
      setCategories(res.data)
    } catch (error) {
      console.error('Failed to fetch categories')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-accent">
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-4xl mb-2">🏥</div>
                <div>
                  <button className="text-gray-400 hover:text-gray-600 mr-2">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-400 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="text-gray-500 text-sm">
                {category.subcategories?.length || 0} subcategories
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminCategories