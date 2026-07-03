import { useState, useEffect } from 'react'
import api, { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loadingShipment, setLoadingShipment] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (error) {
      console.error('Failed to fetch orders')
    }
  }

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status })
      fetchOrders()
      toast.success('Status updated!')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const createShipment = async (order) => {
    setLoadingShipment(order._id)
    try {
      const result = await orderAPI.createDelhiveryShipment(order.orderId)
      if (result.ok) {
        toast.success('Shipment created successfully!')
        fetchOrders()
      } else {
        toast.error(result.data.message)
      }
    } catch (error) {
      toast.error('Failed to create shipment')
    } finally {
      setLoadingShipment(null)
    }
  }

  const trackOrder = async (orderId) => {
    try {
      const result = await orderAPI.trackOrder(orderId)
      if (result.ok) {
        toast.success('Tracking data updated!')
        fetchOrders()
      } else {
        toast.error(result.data.message)
      }
    } catch (error) {
      toast.error('Failed to track order')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waybill</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{order.orderId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">₹{order.total}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.delhiveryWaybill || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    
                    {!order.delhiveryWaybill && (
                      <button
                        onClick={() => createShipment(order)}
                        disabled={loadingShipment === order._id}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                      >
                        {loadingShipment === order._id ? 'Creating...' : 'Create Shipment'}
                      </button>
                    )}
                    
                    {order.delhiveryWaybill && (
                      <button
                        onClick={() => trackOrder(order.orderId)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Track
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminOrders