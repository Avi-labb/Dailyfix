import { useEffect, useMemo, useState } from "react";
import api, { orderAPI } from "../../services/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock3,
  IndianRupee,
} from "lucide-react";

export default function Orders() {

  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [loadingShipment, setLoadingShipment] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [search, status, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data || []);
      setFilteredOrders(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);

    }
  };

  const filterOrders = () => {

    let data = [...orders];

    if (search) {

      data = data.filter((o) =>
        o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
        o.shippingAddress?.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        o.shippingAddress?.phone?.includes(search)
      );

    }

    if (status !== "All") {

      data = data.filter((o) => o.status === status);

    }

    setFilteredOrders(data);

  };

  const totalRevenue = useMemo(() => {

    return orders.reduce(
      (sum, o) => sum + Number(o.total || 0),
      0
    );

  }, [orders]);

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const shippedOrders = orders.filter(
    (o) => o.status === "Shipped"
  ).length;

  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, {
        status: newStatus,
      });
      toast.success("Status Updated");
      fetchOrders();
    } catch {
      toast.error("Failed");

    }

  };

  const createShipment = async (order) => {
    try {
      setLoadingShipment(order._id);
      const result =
        await orderAPI.createDelhiveryShipment(
          order.orderId
        );
      if (result.ok) {
        toast.success("Shipment Created");
        fetchOrders();
      } else {
        toast.error(result.data.message);
      }
    } finally {
      setLoadingShipment("");
    }
  };
  const trackShipment = async (orderId) => {
    try {
      const result =
        await orderAPI.trackOrder(orderId);
      if (result.ok) {
        toast.success("Tracking Updated");
        fetchOrders();
      }
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Orders
          </h1>
          <p className="text-slate-500">
            Manage customer orders
          </p>
        </div>
      </div>
      {/* Cards */}

      <div className="grid md:grid-cols-4 gap-5">
        <motion.div whileHover={{ y:-4 }}
          className="bg-white rounded-2xl p-6 border shadow-sm">
          <ShoppingBag className="text-blue-600"/>
          <h2 className="text-3xl font-bold mt-3">
            {orders.length}
          </h2>
          <p className="text-slate-500">
            Total Orders
          </p>
        </motion.div>
        <motion.div whileHover={{ y:-4 }}
          className="bg-white rounded-2xl p-6 border shadow-sm">
          <IndianRupee className="text-green-600"/>
          <h2 className="text-3xl font-bold mt-3">
            ₹{totalRevenue.toLocaleString()}
          </h2>
          <p className="text-slate-500">
            Revenue
          </p>

        </motion.div>
        <motion.div whileHover={{ y:-4 }}
          className="bg-white rounded-2xl p-6 border shadow-sm">
          <Truck className="text-purple-600"/>
          <h2 className="text-3xl font-bold mt-3">
            {shippedOrders}
          </h2>

          <p className="text-slate-500">

            Shipped

          </p>

        </motion.div>

        <motion.div whileHover={{ y:-4 }}
          className="bg-white rounded-2xl p-6 border shadow-sm">

          <CheckCircle2 className="text-emerald-600"/>

          <h2 className="text-3xl font-bold mt-3">

            {deliveredOrders}

          </h2>

          <p className="text-slate-500">

            Delivered

          </p>

        </motion.div>

      </div>

      {/* Filters */}

      <div className="bg-white rounded-2xl border p-5 shadow-sm">

        <div className="grid md:grid-cols-2 gap-4">

          <div className="relative">

            <Search
              className="absolute left-4 top-4 text-slate-400"
              size={18}
            />

            <input
              value={search}
              onChange={(e)=>setSearch(e.target.value)}
              placeholder="Search Order ID / Customer"
              className="w-full pl-11 py-3 border rounded-xl outline-none focus:border-emerald-500"
            />

          </div>

          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="border rounded-xl px-4"
          >

            <option>All</option>

            <option>Pending</option>

            <option>Processing</option>

            <option>Shipped</option>

            <option>Delivered</option>

            <option>Cancelled</option>

          </select>

        </div>

      </div>
            {/* Orders Table */}

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-slate-50">

              <tr>

                <th className="px-6 py-4 text-left text-xs uppercase">
                  Order
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase">
                  Total
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase">
                  Payment
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs uppercase">
                  Waybill
                </th>

                <th className="px-6 py-4 text-right text-xs uppercase">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                [...Array(8)].map((_, index) => (

                  <tr key={index}>

                    <td colSpan={7} className="p-5">

                      <div className="h-14 bg-slate-100 rounded-xl animate-pulse"/>

                    </td>

                  </tr>

                ))

              ) : filteredOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan={7}
                    className="text-center py-20 text-slate-500"
                  >

                    No Orders Found

                  </td>

                </tr>

              ) : (

                filteredOrders.map((order) => (

                  <motion.tr
                    key={order._id}
                    whileHover={{ backgroundColor:"#f8fafc" }}
                    className="border-b"
                  >

                    {/* Order */}

                    <td className="px-6 py-4">

                      <div>

                        <h3 className="font-semibold">

                          {order.orderId}

                        </h3>

                        <p className="text-xs text-slate-500">

                          {new Date(order.createdAt).toLocaleDateString()}

                        </p>

                      </div>

                    </td>

                    {/* Customer */}

                    <td className="px-6 py-4">

                      <div>

                        <p className="font-medium">

                          {order.shippingAddress?.name}

                        </p>

                        <p className="text-xs text-slate-500">

                          {order.shippingAddress?.phone}

                        </p>

                      </div>

                    </td>

                    {/* Amount */}

                    <td className="px-6 py-4 font-semibold">

                      ₹{order.total}

                    </td>

                    {/* Payment */}

                    <td className="px-6 py-4">

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          order.paymentMethod === "COD"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >

                        {order.paymentMethod}

                      </span>

                    </td>

                    {/* Status */}

                    <td className="px-6 py-4">

                      <select
                        value={order.status}
                        onChange={(e)=>
                          updateStatus(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-2 py-2"
                      >

                        <option>Pending</option>
                        <option>Confirmed</option>
                        <option>Processing</option>
                        <option>Shipped</option>
                        <option>Delivered</option>
                        <option>Cancelled</option>

                      </select>

                    </td>

                    {/* Waybill */}

                    <td className="px-6 py-4">

                      {order.delhiveryWaybill ? (

                        <span className="font-medium text-emerald-600">

                          {order.delhiveryWaybill}

                        </span>

                      ) : (

                        "-"

                      )}

                    </td>

                    {/* Actions */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end gap-2 flex-wrap">

                        {!order.delhiveryWaybill && (

                          <button
                            onClick={() =>
                              createShipment(order)
                            }
                            disabled={
                              loadingShipment === order._id
                            }
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                          >

                            {loadingShipment === order._id
                              ? "Creating..."
                              : "Shipment"}

                          </button>

                        )}

                        {order.delhiveryWaybill && (

                          <button
                            onClick={() =>
                              trackShipment(order.orderId)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                          >

                            Track

                          </button>

                        )}

                        <button
                          className="bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg"
                        >

                          View

                        </button>

                      </div>

                    </td>

                  </motion.tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Footer */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4">

        <p className="text-sm text-slate-500">

          Showing {filteredOrders.length} of {orders.length} orders

        </p>

        <div className="flex gap-2">

          <button className="px-4 py-2 border rounded-lg hover:bg-slate-100">

            Previous

          </button>

          <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white">

            1

          </button>

          <button className="px-4 py-2 border rounded-lg hover:bg-slate-100">

            Next

          </button>

        </div>

      </div>

    </div>

  );

}