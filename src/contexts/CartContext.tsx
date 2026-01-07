import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import funcUrls from '../../backend/func2url.json';

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  total: number;
}

interface CartContextType {
  cartId: number | null;
  items: CartItem[];
  total: number;
  itemCount: number;
  addToCart: (productId: number, productName: string, productPrice: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  loadCart: () => Promise<void>;
  clearCart: () => void;
  checkoutToTelegram: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<number | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [userPhone, setUserPhone] = useState('');
  
  const apiUrl = funcUrls['site-content'];

  useEffect(() => {
    const phone = localStorage.getItem('cart_phone');
    const savedCartId = localStorage.getItem('cart_id');
    
    if (phone) {
      setUserPhone(phone);
      if (savedCartId) {
        setCartId(parseInt(savedCartId));
        loadCart(parseInt(savedCartId));
      }
    }
  }, []);

  const ensureCart = async () => {
    if (cartId) return cartId;
    
    let phone = userPhone;
    if (!phone) {
      phone = prompt('Введите ваш номер телефона для корзины:') || '';
      if (!phone) throw new Error('Телефон обязателен');
      setUserPhone(phone);
      localStorage.setItem('cart_phone', phone);
    }

    const res = await fetch(`${apiUrl}?action=cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_phone: phone, session_id: Date.now().toString() })
    });
    
    const data = await res.json();
    setCartId(data.cart_id);
    localStorage.setItem('cart_id', data.cart_id.toString());
    return data.cart_id;
  };

  const loadCart = async (id?: number) => {
    const currentCartId = id || cartId;
    if (!currentCartId) return;

    try {
      const res = await fetch(`${apiUrl}?action=cart-items&cart_id=${currentCartId}`);
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (productId: number, productName: string, productPrice: number) => {
    try {
      const currentCartId = await ensureCart();
      
      await fetch(`${apiUrl}?action=cart-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_id: currentCartId,
          product_id: productId,
          product_name: productName,
          product_price: productPrice,
          quantity: 1
        })
      });
      
      await loadCart(currentCartId);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await fetch(`${apiUrl}?action=cart-item-remove&item_id=${itemId}`, {
        method: 'DELETE'
      });
      
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    setItems([]);
    setTotal(0);
    setCartId(null);
    localStorage.removeItem('cart_id');
  };

  const checkoutToTelegram = () => {
    if (!items.length) return '';
    
    const cartText = items.map(item => 
      `${item.product_name} x${item.quantity} = ${item.total}₽`
    ).join('\n');
    
    const message = encodeURIComponent(
      `🛒 Оформить заказ:\n\n${cartText}\n\n💰 Итого: ${total}₽\n\n📱 Телефон: ${userPhone}`
    );
    
    return `https://t.me/whiteshishka_bot?start=order_${cartId}&text=${message}`;
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartId,
      items,
      total,
      itemCount,
      addToCart,
      removeFromCart,
      loadCart,
      clearCart,
      checkoutToTelegram
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}