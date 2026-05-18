import { createContext, useContext, useState, useEffect } from 'react'

const KicksContext = createContext(null)

const initialKicks = [
  { 
    id: 1, 
    name: 'Nike - Air Max', 
    description: 'Stylish and Comfortable', 
    origin: 'Italy', 
    price: '3.50',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
  },
  { 
    id: 2, 
    name: 'Nike - Air Jordan', 
    description: 'Iconic basketball shoe', 
    origin: 'USA', 
    price: '4.25',
    image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=400&h=400&fit=crop'
  },
  { 
    id: 3, 
    name: 'Adidas - Samba', 
    description: 'Classic leather sneaker', 
    origin: 'Colombia', 
    price: '4.75',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop'
  },
  { 
    id: 4, 
    name: 'Adidas - Ultraboost', 
    description: 'High-performance running shoe', 
    origin: 'Brazil', 
    price: '5.00',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop'
  }
]

export function KicksProvider({ children }) {
  const [kicks, setKicks] = useState([])
  const [cart, setCart] = useState([])

  // FIX 1: Added useEffect to imports (top), and replaced undefined API with initialKicks
  useEffect(() => {
    setKicks(initialKicks)
  }, [])

  // FIX 2: Added the missing closing brace for addKick
  function addKick(newKick) {
    const kickWithImage = {
      ...newKick,
      id: Date.now(),
      image: newKick.image || 'https://via.placeholder.com/400x400?text=New+Kick'
    }
    setKicks(prev => [...prev, kickWithImage])
  } // ← was missing

  function addToCart(kick) {
    setCart(prev => {
      const existing = prev.find(item => item.id === kick.id)
      if (existing) {
        return prev.map(item =>
          item.id === kick.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...kick, quantity: 1 }]
    })
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  function updateQuantity(id, quantity) {
    if (quantity < 1) return removeFromCart(id)
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
  }

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <KicksContext.Provider value={{ 
      kicks, 
      addKick, 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      cartTotal, 
      cartCount 
    }}>
      {children}
    </KicksContext.Provider>
  )
} // ← KicksProvider closes here

// FIX 3: Removed the extra stray } that was closing KicksProvider early,
//         which trapped useKicksContext inside it and caused the build error
export function useKicksContext() {
  const context = useContext(KicksContext)
  if (!context) {
    throw new Error('useKicksContext must be used inside KicksProvider')
  }
  return context
}