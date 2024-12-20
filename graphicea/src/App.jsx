import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Graphics from "./components/Graphics"
import { db } from "./data/db"

function App() {

  /**
   * 
   * Guardamos todo en una nueva variable localStorageCart
   * i guardamos los elementos del localStorage con JSON,parse, si es null retornamos null []
   * 
   */
  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }

  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 20
  const MIN_ITEMS = 1

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart]) // cada vez que cart cambie, ejecuta el codigo

  function addToCart(item) {
    const itemExists = cart.findIndex((graphic) => graphic.id === item.id)
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_ITEMS) return
      const updatedCart = [...cart]
      updatedCart[itemExists].quantity++
      setCart(updatedCart)
    } else {
      item.quantity = 1
      console.log('No existe, agregando')
      setCart([...cart, item])
    }

  }

  function removeFromCart(id) {
    setCart((prevCart) => prevCart.filter(graphic => graphic.id !== id))
  }

  function increaseQuantity(id) {
    const updatedCart = cart.map( item => {
      if (item.id === id && item.quantity < MAX_ITEMS) {
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

  function decreaseQuantity(id) {
    const updatedCart = cart.map( item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity -1
        }
      }
      return item
    })
    setCart(updatedCart)
  }
  
  function clearCart(e) {
    setCart([])
  }

  return (
    <>
    <Header 
      cart={cart}
      removeFromCart={removeFromCart}
      increaseQuantity={increaseQuantity}
      decreaseQuantity={decreaseQuantity}
      clearCart={clearCart}
    />

    <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">

          {data.map((graphic) => (
              <Graphics
                key={graphic.id} 
                graphic={graphic}
                setCart={setCart}
                addToCart={addToCart}
              />
          ))}

        </div>
    </main>

    <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
            <p className="text-white text-center fs-4 mt-4 m-md-0">GraphicEA - Todos los derechos Reservados</p>
        </div>
    </footer>
    </>
  )
}

export default App
