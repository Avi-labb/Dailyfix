import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  Star,
  ShoppingBag,
} from "lucide-react";
import { getProductImageSrc } from "../../../utils/productImages";

export default function TopProducts({
  products = [],
  loading = false,
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          {[1,2,3,4,5].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200"
    >

      {/* Header */}

      <div className="flex justify-between items-center p-6 border-b">

        <div>

          <h2 className="text-lg font-bold text-slate-900">
            Top Selling Products
          </h2>

          <p className="text-sm text-slate-500">
            Best performing products this month
          </p>

        </div>

        <button className="text-emerald-600 text-sm font-semibold hover:underline">
          View All
        </button>

      </div>

      <div className="divide-y">

        {products.map((product, index) => {

          const sold = product.sold || 0;
          const stock = product.stock || 0;
          const total = sold + stock || 1;

          const percentage = Math.round(
            (sold / total) * 100
          );

          return (

            <motion.div
              key={product._id || index}
              whileHover={{ backgroundColor: "#F8FAFC" }}
              className="p-5 flex items-center justify-between"
            >

              {/* Left */}

              <div className="flex items-center gap-4">

                <img
                  src={getProductImageSrc(product)}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover border"
                />

                <div>

                  <h3 className="font-semibold text-slate-900">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-4 mt-2">

                    <span className="flex items-center gap-1 text-xs text-slate-500">

                      <Package size={14} />

                      {stock} Stock

                    </span>

                    <span className="flex items-center gap-1 text-xs text-slate-500">

                      <ShoppingBag size={14} />

                      {sold} Sold

                    </span>

                    <span className="flex items-center gap-1 text-xs text-amber-500">

                      <Star size={14} fill="currentColor" />

                      {product.rating || 5.0}

                    </span>

                  </div>

                </div>

              </div>

              {/* Right */}

              <div className="text-right w-48">

                <div className="flex justify-between mb-2">

                  <span className="text-sm text-slate-500">
                    Sales
                  </span>

                  <span className="font-semibold">
                    {percentage}%
                  </span>

                </div>

                <div className="w-full h-2 rounded-full bg-slate-100">

                  <motion.div
                    initial={{ width:0 }}
                    animate={{
                      width:`${percentage}%`
                    }}
                    transition={{
                      duration:1
                    }}
                    className="bg-emerald-500 h-2 rounded-full"
                  />

                </div>

                <div className="mt-3 flex items-center justify-end gap-2 text-emerald-600">

                  <TrendingUp size={16} />

                  <span className="text-sm font-semibold">

                    ₹{(product.price || 0) * sold}

                  </span>

                </div>

              </div>

            </motion.div>

          );
        })}

      </div>

    </motion.div>
  );
}