import { createContext, useContext, useState, useEffect } from 'react'
import { normalizeProduct } from '../utils/productImages'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      const parsed = saved ? JSON.parse(saved) : []
      // Clean up invalid items (items without productId or product)
      const validItems = parsed
        .filter(item => item && item.productId && item.product)
        .map(item => ({ ...item, product: normalizeProduct(item.product) }))
      if (validItems.length !== parsed.length) {
        localStorage.setItem('cart', JSON.stringify(validItems))
      }
      return validItems
    } catch (error) {
      console.error('Failed to parse cart from localStorage:', error)
      return []
    }
  })
  const [lastAddedProduct, setLastAddedProduct] = useState(null)

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product)
    setCart(prev => {
      const existing = prev.find(item => item.productId === normalizedProduct.id)
      if (existing) {
        return prev.map(item =>
          item.productId === normalizedProduct.id
            ? { ...item, quantity: item.quantity + quantity, product: normalizedProduct }
            : item
        )
      }
      return [...prev, { productId: normalizedProduct.id, product: normalizedProduct, quantity }]
    })
    setLastAddedProduct({ product: normalizedProduct, quantity })
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        getItemCount,
        lastAddedProduct,
        setLastAddedProduct
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)