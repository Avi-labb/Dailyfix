import { Link, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

function OrderSuccessPage() {
  const { id } = useParams()

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-4">
        Thank you for your order. Your order ID is:
      </p>
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <span className="text-xl font-bold text-primary">{id}</span>
      </div>
      <p className="text-gray-600 mb-8">
        You can track your order using the order ID.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/"
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-accent"
        >
          Continue Shopping
        </Link>
        <Link
          to="/track-order"
          className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white"
        >
          Track Order
        </Link>
      </div>
    </div>
  )
}

export default OrderSuccessPage