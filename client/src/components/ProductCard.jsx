import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link to={`/product/${product.slug || product.id}`} className="group">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-slate-300">
        <div className="p-6 bg-gradient-to-br from-emerald-50 to-white border-b border-slate-300">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-64 object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-6">
          <h3 className="font-bold text-xl text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
          {product.desc && (
            <p className="text-sm text-slate-500 mb-4">{product.desc}</p>
          )}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-emerald-600">
              ₹{product.discount_price || product.price}
            </span>
            {product.discount_price && (
              <span className="text-lg text-slate-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-emerald-800 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={20} />
            ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
