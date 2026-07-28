import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function StatsCard({
  title,
  value,
  subValue = "",
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

  const trendIcon =
    trend === "up" ? (
      <TrendingUp className="text-emerald-600" size={15} />
    ) : trend === "down" ? (
      <TrendingDown className="text-red-600" size={15} />
    ) : (
      <Minus className="text-slate-500" size={15} />
    );

  const trendTextColor =
    trend === "up"
      ? "text-emerald-700"
      : trend === "down"
      ? "text-red-700"
      : "text-slate-600";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border ${theme.border} shadow-sm hover:shadow-lg transition-all p-5`}
    >
      <div className="flex justify-between items-start">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {value}
          </h2>

          {subValue && (
            <p className="text-xs font-medium text-slate-500 mt-1">
              {subValue}
            </p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${theme.bg} shadow-inner flex-shrink-0`}
        >
          <Icon className={theme.icon} size={24} />
        </div>
      </div>

      {change && (
        <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center ${
              trend === "up"
                ? "bg-emerald-50"
                : trend === "down"
                ? "bg-red-50"
                : "bg-slate-100"
            }`}
          >
            {trendIcon}
          </div>

          <span
            className={`text-sm font-semibold ${trendTextColor}`}
          >
            {change}
          </span>
        </div>
      )}
    </motion.div>
  );
}