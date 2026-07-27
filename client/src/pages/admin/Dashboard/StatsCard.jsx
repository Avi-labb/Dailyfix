import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatsCard({
  title,
  value,
  icon: Icon,
  color = "emerald",
  change = "",
  trend = "up",
}) {
  const colors = {
    emerald: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      icon: "text-emerald-600",
      text: "text-emerald-600",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      icon: "text-blue-600",
      text: "text-blue-600",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      icon: "text-purple-600",
      text: "text-purple-600",
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-100",
      icon: "text-orange-600",
      text: "text-orange-600",
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-100",
      icon: "text-red-600",
      text: "text-red-600",
    },
  };

  const theme = colors[color] || colors.emerald;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border ${theme.border} shadow-sm hover:shadow-lg transition-all p-6`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500 font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-slate-900 mt-2">
            {value}
          </h2>
        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${theme.bg}`}
        >
          <Icon className={theme.icon} size={28} />
        </div>
      </div>

      {change && (
        <div className="mt-5 flex items-center gap-2">

          {trend === "up" ? (
            <TrendingUp className="text-green-600" size={16} />
          ) : (
            <TrendingDown className="text-red-600" size={16} />
          )}

          <span
            className={`text-sm font-semibold ${
              trend === "up"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {change}
          </span>

          <span className="text-sm text-slate-400">
            vs last month
          </span>

        </div>
      )}
    </motion.div>
  );
}