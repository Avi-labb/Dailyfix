import { useEffect, useMemo, useState } from "react";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

import api from "../../services/api";

import StatsCard from "./Dashboard/StatsCard";
import RevenueChart from "./Dashboard/RevenueChart";
import StatusCards from "./Dashboard/StatusCards";
import RecentOrders from "./Dashboard/RecentOrders";
import TopProducts from "./Dashboard/TopProduct";
import QuickActions from "./Dashboard/QuickAction";
export default function Dashboard() {

  const [loading, setLoading] = useState(true);

  const [orders, setOrders] = useState([]);

  const [products, setProducts] = useState([]);

  const [customers, setCustomers] = useState([]);

  useEffect(() => {

    fetchDashboard();

  }, []);

  const fetchDashboard = async () => {

    try {

      setLoading(true);

      const [ordersRes, productsRes, customersRes] =
        await Promise.all([

          api.get("/orders"),

          api.get("/products"),

          api.get("/users"),

        ]);

      setOrders(ordersRes.data || []);

      setProducts(
        productsRes.data.products ||
          productsRes.data ||
          []
      );

      setCustomers(customersRes.data || []);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  const totalRevenue = useMemo(() => {

    return orders.reduce(

      (sum, item) => sum + Number(item.total || 0),

      0

    );

  }, [orders]);

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending"
  ).length;

  const processingOrders = orders.filter(
    (o) => o.status === "Processing"
  ).length;

  const shippedOrders = orders.filter(
    (o) => o.status === "Shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (o) => o.status === "Delivered"
  ).length;

  const monthlyRevenue = [

    { month: "Jan", sales: 12000 },

    { month: "Feb", sales: 18000 },

    { month: "Mar", sales: 24000 },

    { month: "Apr", sales: 28000 },

    { month: "May", sales: 33000 },

    { month: "Jun", sales: 42000 },

    { month: "Jul", sales: totalRevenue },

  ];

  return (

    <div className="space-y-6">

      {/* Heading */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">

            Dashboard

          </h1>

          <p className="text-slate-500">

            Welcome back, Admin 👋

          </p>

        </div>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <StatsCard
          title="Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="emerald"
          change="+12.5%"
        />

        <StatsCard
          title="Orders"
          value={orders.length}
          icon={ShoppingCart}
          color="blue"
          change="+8%"
        />

        <StatsCard
          title="Customers"
          value={customers.length}
          icon={Users}
          color="purple"
          change="+15%"
        />

        <StatsCard
          title="Products"
          value={products.length}
          icon={Package}
          color="orange"
          change="+5%"
        />

      </div>

      {/* Revenue + Status */}

      <div className="gap-6 space-y-6">

        <div className="xl:col-span-2">

          <RevenueChart

            data={monthlyRevenue}

          />

        </div>

        <StatusCards

          pending={pendingOrders}

          processing={processingOrders}

          shipped={shippedOrders}

          delivered={deliveredOrders}

          total={orders.length || 1}

        />

      </div>
            {/* Bottom Section */}

      <div className=" gap-6 space-y-7">

        {/* Recent Orders */}

        <div className="xl:col-span-2">

          <RecentOrders
            loading={loading}
            orders={orders.slice(0, 5)}
            onView={(order) => {
              console.log(order);
            }}
          />

        </div>

        {/* Quick Actions */}

        <QuickActions />

      </div>

      {/* Products */}

      <TopProducts
        loading={loading}
        products={products
          .sort((a, b) => (b.sold || 0) - (a.sold || 0))
          .slice(0, 5)}
      />

      {/* Loading Overlay */}

      {loading && (
        <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center">

            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-emerald-600 animate-spin"></div>

            <h2 className="font-bold text-xl mt-6">
              Loading Dashboard...
            </h2>

            <p className="text-slate-500 mt-2">
              Please wait while we fetch the latest data.
            </p>

          </div>

        </div>
      )}

      {/* Empty State */}

      {!loading &&
        orders.length === 0 &&
        products.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center">

            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto">

              <Package size={40} className="text-slate-400" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              No Data Available
            </h2>

            <p className="text-slate-500 mt-3">
              Products and orders will appear here once they are created.
            </p>

          </div>
        )}

    </div>
  );
}