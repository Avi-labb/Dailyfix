import { motion } from "framer-motion";
import {
  Plus,
  ShoppingCart,
  Users,
  FolderTree,
  Package,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    title: "Add Product",
    subtitle: "Create a new product",
    icon: Plus,
    color: "from-emerald-500 to-green-600",
    path: "/admin/products/new",
  },
  {
    title: "Orders",
    subtitle: "Manage customer orders",
    icon: ShoppingCart,
    color: "from-blue-500 to-indigo-600",
    path: "/admin/orders",
  },
  {
    title: "Customers",
    subtitle: "View all customers",
    icon: Users,
    color: "from-purple-500 to-violet-600",
    path: "/admin/customers",
  },
  {
    title: "Categories",
    subtitle: "Manage categories",
    icon: FolderTree,
    color: "from-orange-500 to-amber-600",
    path: "/admin/categories",
  },
  {
    title: "Products",
    subtitle: "Manage inventory",
    icon: Package,
    color: "from-pink-500 to-rose-600",
    path: "/admin/products",
  },
  {
    title: "Settings",
    subtitle: "Website settings",
    icon: Settings,
    color: "from-slate-600 to-slate-800",
    path: "/admin/settings",
  },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">
          Quick Actions
        </h2>

        <p className="text-sm text-slate-500">
          Frequently used shortcuts
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">

        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <motion.button
              key={action.title}
              whileHover={{
                y: -5,
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={() => navigate(action.path)}
              className="rounded-2xl border border-slate-200 hover:border-emerald-300 bg-slate-50 hover:bg-white transition-all p-5 text-left shadow-sm hover:shadow-lg"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.color} flex items-center justify-center shadow-md`}
              >
                <Icon className="text-white" size={26} />
              </div>

              <h3 className="font-semibold text-slate-900 mt-5">
                {action.title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {action.subtitle}
              </p>
            </motion.button>
          );
        })}

      </div>
    </motion.div>
  );
}