import { motion } from "framer-motion";
import {
  Clock3,
  CheckCircle2,
  PackageCheck,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

const statusConfig = [
  {
    key: "pending",
    title: "Pending",
    icon: Clock3,
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconColor: "text-amber-600",
    progress: "bg-amber-500",
  },
  {
    key: "confirmed",
    title: "Confirmed",
    icon: CheckCircle2,
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconColor: "text-blue-600",
    progress: "bg-blue-500",
  },
  {
    key: "processing",
    title: "Processing",
    icon: PackageCheck,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    iconColor: "text-indigo-600",
    progress: "bg-indigo-500",
  },
  {
    key: "shipped",
    title: "Shipped",
    icon: Truck,
    bg: "bg-purple-50",
    border: "border-purple-100",
    iconColor: "text-purple-600",
    progress: "bg-purple-500",
  },
  {
    key: "delivered",
    title: "Delivered",
    icon: CheckCircle,
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconColor: "text-emerald-600",
    progress: "bg-emerald-500",
  },
  {
    key: "cancelled",
    title: "Cancelled",
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-100",
    iconColor: "text-red-600",
    progress: "bg-red-500",
  },
];

export default function StatusCards({
  pending = 0,
  confirmed = 0,
  processing = 0,
  shipped = 0,
  delivered = 0,
  cancelled = 0,
  total = 1,
}) {
  const values = {
    pending,
    confirmed,
    processing,
    shipped,
    delivered,
    cancelled,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {statusConfig.map((item, index) => {
        const Icon = item.icon;
        const value = values[item.key];
        const percentage = Math.round((value / total) * 100);

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -4 }}
            className={`bg-white rounded-2xl border ${item.border} shadow-sm hover:shadow-lg transition-all p-5`}
          >
            <div className="flex justify-between items-center">

              <div>

                <p className="text-sm text-slate-500">
                  {item.title}
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  {value}
                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${item.bg}`}
              >
                <Icon
                  className={item.iconColor}
                  size={28}
                />
              </div>

            </div>

            <div className="mt-6">

              <div className="flex justify-between text-xs mb-2">

                <span className="text-slate-500">
                  Share
                </span>

                <span className="font-semibold">
                  {percentage}%
                </span>

              </div>

              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${percentage}%`,
                  }}
                  transition={{
                    duration: 1,
                  }}
                  className={`h-full rounded-full ${item.progress}`}
                />

              </div>

            </div>

          </motion.div>
        );
      })}
    </div>
  );
}