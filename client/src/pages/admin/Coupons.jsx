import { useState, useEffect } from 'react'
import api from '../../services/api'
import { Plus, Edit, Trash2 } from 'lucide-react'

function AdminCoupons() {
  const [coupons, setCoupons] = useState([])

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons')
      setCoupons(res.data)
    } catch (error) {
      console.error('Failed to fetch coupons')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-accent">
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map(coupon => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 whitespace-nowrap font-mono font-bold">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {coupon.used_count}/{coupon.usage_limit || '∞'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${coupon.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {coupon.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-gray-400 hover:text-gray-500 mr-3">
                    <Edit size={16} />
                  </button>
                  <button className="text-red-400 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminCoupons