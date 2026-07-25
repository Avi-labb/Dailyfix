import { useState, useEffect } from "react";
import api from "../../services/api";

import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Clock3,
  CheckCircle2,
  XCircle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { motion } from "framer-motion";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function AdminDashboard() {

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const res = await api.get("/admin/dashboard");

      setStats(res.data.data || res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RefreshCw className="animate-spin w-10 h-10 text-emerald-600" />
      </div>
    );
  }

  const cards = [

    {
      title: "Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: DollarSign,
      color: "bg-emerald-500",
    },

    {
      title: "Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },

    {
      title: "Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-purple-500",
    },

    {
      title: "Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-orange-500",
    },

    {
      title: "Pending",
      value: stats.pendingOrders || 0,
      icon: Clock3,
      color: "bg-yellow-500",
    },

    {
      title: "Shipped",
      value: stats.shippedOrders || 0,
      icon: Truck,
      color: "bg-indigo-500",
    },

    {
      title: "Delivered",
      value: stats.deliveredOrders || 0,
      icon: CheckCircle2,
      color: "bg-green-600",
    },

    {
      title: "Cancelled",
      value: stats.cancelledOrders || 0,
      icon: XCircle,
      color: "bg-red-500",
    },

  ];

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome Back 👋
          </p>

        </div>

        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
        >

          <RefreshCw size={18} />

          Refresh

        </button>

      </div>

      {/* CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {

          cards.map((card, index) => {

            const Icon = card.icon;

            return (

              <motion.div

                key={card.title}

                initial={{ opacity: 0, y: 20 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: index * 0.08 }}

                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"

              >

                <div className="flex justify-between">

                  <div>

                    <p className="text-gray-500">

                      {card.title}

                    </p>

                    <h2 className="text-3xl font-bold mt-3">

                      {card.value}

                    </h2>

                  </div>

                  <div

                    className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white`}

                  >

                    <Icon size={28} />

                  </div>

                </div>

                <div className="mt-6 flex items-center gap-2 text-green-600">

                  <TrendingUp size={18} />

                  <span className="text-sm">

                    Updated Today

                  </span>

                </div>

              </motion.div>

            )

          })

        }

      </div>
      {/* Charts Section */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Revenue Chart */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6"
        >

          <div className="flex justify-between items-center mb-6">

            <div>

              <h2 className="text-xl font-bold">
                Monthly Revenue
              </h2>

              <p className="text-gray-500 text-sm">
                Revenue generated this year
              </p>

            </div>

            <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
              Live
            </div>

          </div>

          <ResponsiveContainer width="100%" height={320}>

            <AreaChart data={stats.monthlySales}>

              <defs>

                <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">

                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />

                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />

                </linearGradient>

              </defs>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#sales)"
              />

            </AreaChart>

          </ResponsiveContainer>

        </motion.div>

        {/* Order Status */}

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >

          <h2 className="text-xl font-bold mb-6">
            Order Status
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span className="text-yellow-600 font-medium">
                Pending
              </span>

              <span className="font-bold">
                {stats.pendingOrders || 0}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${(stats.pendingOrders / stats.totalOrders) * 100 || 0}%`,
                }}
              />

            </div>

            <div className="flex justify-between">

              <span className="text-blue-600 font-medium">
                Processing
              </span>

              <span className="font-bold">
                {stats.processingOrders || 0}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${(stats.processingOrders / stats.totalOrders) * 100 || 0}%`,
                }}
              />

            </div>

            <div className="flex justify-between">

              <span className="text-indigo-600 font-medium">
                Shipped
              </span>

              <span className="font-bold">
                {stats.shippedOrders || 0}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{
                  width: `${(stats.shippedOrders / stats.totalOrders) * 100 || 0}%`,
                }}
              />

            </div>

            <div className="flex justify-between">

              <span className="text-green-600 font-medium">
                Delivered
              </span>

              <span className="font-bold">
                {stats.deliveredOrders || 0}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-green-600 h-2 rounded-full"
                style={{
                  width: `${(stats.deliveredOrders / stats.totalOrders) * 100 || 0}%`,
                }}
              />

            </div>

            <div className="flex justify-between">

              <span className="text-red-600 font-medium">
                Cancelled
              </span>

              <span className="font-bold">
                {stats.cancelledOrders || 0}
              </span>

            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">

              <div
                className="bg-red-500 h-2 rounded-full"
                style={{
                  width: `${(stats.cancelledOrders / stats.totalOrders) * 100 || 0}%`,
                }}
              />

            </div>

          </div>

        </motion.div>

      </div>
      {/* Recent Orders & Top Products */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Orders */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-white rounded-2xl shadow-lg p-6"
        >

          <div className="flex justify-between items-center mb-6">

            <h2 className="text-xl font-bold">
              Recent Orders
            </h2>

            <button className="text-emerald-600 font-semibold hover:underline">
              View All
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b">

                  <th className="py-3 text-left">Order</th>
                  <th className="py-3 text-left">Customer</th>
                  <th className="py-3 text-left">Amount</th>
                  <th className="py-3 text-left">Payment</th>
                  <th className="py-3 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {(stats.recentOrders || []).map((order) => (

                  <tr
                    key={order.orderId}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="py-4 font-semibold">
                      {order.orderId}
                    </td>

                    <td>
                      {order.customer?.firstName}{" "}
                      {order.customer?.lastName}
                    </td>

                    <td>
                      ₹{order.total}
                    </td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${order.paymentMethod === "COD"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                          }`}
                      >

                        {order.paymentMethod}

                      </span>

                    </td>

                    <td>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold

                        ${order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "Processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-purple-100 text-purple-700"
                          }`}

                      >

                        {order.status}

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </motion.div>

        {/* Top Products */}

        <motion.div

          initial={{ opacity: 0, x: 20 }}

          animate={{ opacity: 1, x: 0 }}

          className="bg-white rounded-2xl shadow-lg p-6"

        >

          <h2 className="text-xl font-bold mb-6">

            Top Selling Products

          </h2>

          <div className="space-y-5">

            {(stats.topProducts || []).map((product, index) => (

              <div
                key={product._id}
                className="flex justify-between items-center"
              >

                <div className="flex items-center gap-4">

                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">

                    {index + 1}

                  </div>

                  <div>

                    <p className="font-semibold">

                      {product.name}

                    </p>

                    <p className="text-sm text-gray-500">

                      SKU : {product.sku}

                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="font-bold">

                    {product.totalSold}

                  </p>

                  <p className="text-xs text-gray-500">

                    Sold

                  </p>

                </div>

              </div>

            ))}

          </div>

        </motion.div>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >

          <h2 className="text-xl font-bold mb-6">

            Low Stock Products

          </h2>

          <div className="space-y-4">

            {(stats.lowStockProducts || []).map(product => (

              <div
                key={product._id}
                className="flex justify-between border-b pb-3"
              >

                <div>

                  <p className="font-semibold">

                    {product.name}

                  </p>

                  <p className="text-gray-500 text-sm">

                    SKU : {product.sku}

                  </p>

                </div>

                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">

                  {product.stock} Left

                </span>

              </div>

            ))}

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl shadow-xl p-6"
        >

          <h2 className="text-2xl font-bold">

            Delhivery Shipment

          </h2>

          <div className="grid grid-cols-2 gap-5 mt-8">

            <div>

              <h3 className="text-3xl font-bold">

                {stats.shippedOrders || 0}

              </h3>

              <p>

                Shipped

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold">

                {stats.pendingPickup || 0}

              </h3>

              <p>

                Pickup Pending

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold">

                {stats.deliveredOrders || 0}

              </h3>

              <p>

                Delivered

              </p>

            </div>

            <div>

              <h3 className="text-3xl font-bold">

                {stats.cancelledOrders || 0}

              </h3>

              <p>

                Cancelled

              </p>

            </div>

          </div>

        </motion.div>

      </div>
      {/* Quick Actions & System Overview */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Quick Actions */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >

          <h2 className="text-xl font-bold mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">

            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-5 transition"
            >
              <Package className="mx-auto mb-2" size={30} />
              Add Product
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-5 transition"
            >
              <ShoppingCart className="mx-auto mb-2" size={30} />
              View Orders
            </button>

            <button
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl p-5 transition"
            >
              <Truck className="mx-auto mb-2" size={30} />
              Create Pickup
            </button>

            <button
              onClick={fetchDashboard}
              className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-5 transition"
            >
              <RefreshCw className="mx-auto mb-2" size={30} />
              Refresh
            </button>

          </div>

        </motion.div>

        {/* Store Overview */}

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-xl text-white p-6"
        >

          <h2 className="text-2xl font-bold mb-6">

            Store Overview

          </h2>

          <div className="space-y-5">

            <div className="flex justify-between">

              <span>Total Revenue</span>

              <span className="font-bold">
                ₹{stats.totalRevenue}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Total Orders</span>

              <span className="font-bold">
                {stats.totalOrders}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Total Customers</span>

              <span className="font-bold">
                {stats.totalCustomers}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Total Products</span>

              <span className="font-bold">
                {stats.totalProducts}
              </span>

            </div>

            <div className="flex justify-between">

              <span>Delivered Orders</span>

              <span className="text-green-400 font-bold">

                {stats.deliveredOrders || 0}

              </span>

            </div>

            <div className="flex justify-between">

              <span>Pending Orders</span>

              <span className="text-yellow-400 font-bold">

                {stats.pendingOrders || 0}

              </span>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}

export default AdminDashboard;