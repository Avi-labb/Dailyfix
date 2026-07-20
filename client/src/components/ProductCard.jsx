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
    <Link to={`/product/${product.slug || product.id}`} className="group block">
      <div className="bg-white rounded-3xl shadow-soft overflow-hidden hover:shadow-hard transition-all duration-500 border border-stone-100 hover:border-emerald-100">
        {/* Image container */}
        <div className="p-8 bg-gradient-to-br from-emerald-50 via-white to-stone-50 border-b border-stone-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-72 object-contain group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        
        {/* Content container */}
        <div className="p-8 space-y-4">
          <h3 className="text-2xl font-bold text-stone-900 group-hover:text-emerald-600 transition-colors duration-300">
            {product.name}
          </h3>
          
          {product.desc && (
            <p className="text-stone-500 text-sm leading-relaxed">
              {product.desc}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-3xl font-bold text-emerald-600">
                ₹{product.price}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-soft hover:shadow-emerald-500/30 flex items-center justify-center gap-3"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
