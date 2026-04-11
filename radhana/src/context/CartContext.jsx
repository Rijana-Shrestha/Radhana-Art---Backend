import React, { createContext, useState, useContext, useEffect } from 'react';
import { axiosInstance } from '../utils/axios';

export const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart from backend on mount
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/cart');
      setCartItems(response.data.items || []);
      setError(null);
    } catch (error) {
      console.error('Failed to load cart from backend:', error);
      // Fall back to empty cart if not logged in or error
      setCartItems([]);
      setError(error.message);
    } finally {
      setLoading(false);
      setIsLoaded(true);
    }
  };

  const addToCart = async (product) => {
    if (!product) {
      console.error('Product is required to add to cart');
      return;
    }

    const productId = product._id || product.id;
    
    if (!productId) {
      console.error('Product must have an _id or id field');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/cart/add', {
        product: productId,
        quantity: 1,
        price: product.price || 0,
        name: product.name || 'Unknown Product'
      });
      setCartItems(response.data.items || []);
      setError(null);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      const response = await axiosInstance.delete('/cart/remove', {
        data: { productId }
      });
      setCartItems(response.data.items || []);
      setError(null);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.put('/cart/update', {
        productId,
        quantity: newQuantity
      });
      setCartItems(response.data.items || []);
      setError(null);
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError(error.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await axiosInstance.delete('/cart/clear');
      setCartItems([]);
      setError(null);
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError(error.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 1;
      return total + (itemPrice * itemQty);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  // Get cart summary for display
  const getCartSummary = () => {
    return {
      items: cartItems,
      itemCount: cartItems.length,
      totalQuantity: getCartCount(),
      totalPrice: getCartTotal(),
      isLoaded: isLoaded,
    };
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getCartSummary,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
