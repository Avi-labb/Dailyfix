import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('cart')
      const parsed = saved ? JSON.parse(saved) : []
      // Clean up invalid items (items without productId or product)
      const validItems = parsed.filter(item => item && item.productId && item.product)
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
    console.log('Adding to cart:', product, 'Quantity:', quantity)
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      const newItem = { productId: product.id, product, quantity }
      console.log('New cart item:', newItem)
      return [...prev, newItem]
    })
    setLastAddedProduct({ product, quantity })
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
    console.log('Removing item with productId:', productId)
    console.log('Current cart:', cart)
    setCart(prev => {
      const filtered = prev.filter(item => item.productId !== productId)
      console.log('New cart after filter:', filtered)
      return filtered
    })
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