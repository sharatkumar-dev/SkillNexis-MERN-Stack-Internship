import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nexis_cart_items_inr');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem('nexis_cart_items_inr', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const addToCart = (product, qty = 1) => {
    const existingIndex = cartItems.findIndex((x) => x.product === (product._id || product.product));

    if (existingIndex > -1) {
      const existingItem = cartItems[existingIndex];
      const newQty = existingItem.qty + qty;

      if (newQty > product.countInStock) {
        showToast(`Cannot add more than ${product.countInStock} units in stock`, 'error');
        return false;
      }

      const updated = [...cartItems];
      updated[existingIndex].qty = newQty;
      setCartItems(updated);
      showToast(`Updated "${product.name}" quantity in cart (${newQty})`);
      return true;
    } else {
      if (qty > product.countInStock) {
        showToast(`Only ${product.countInStock} items available in stock`, 'error');
        return false;
      }

      const newItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        countInStock: product.countInStock,
        qty: Number(qty),
      };

      setCartItems((prev) => [...prev, newItem]);
      showToast(`Added "${product.name}" to cart!`);
      return true;
    }
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return;

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          if (qty > item.countInStock) {
            showToast(`Max stock limit of ${item.countInStock} reached`, 'error');
            return item;
          }
          return { ...item, qty: Number(qty) };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('nexis_cart_items_inr');
  };

  // Calculations
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const itemsPrice = Number(
    cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)
  );

  const shippingPrice = itemsPrice > 999 || itemsPrice === 0 ? 0 : 99.0;
  const taxPrice = Number((0.18 * itemsPrice).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        toast,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
