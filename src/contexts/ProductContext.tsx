import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: 'pods' | 'liquids' | 'accessories';
  flavor?: string;
  image: string;
  badge?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'JUUL Pod System', price: 3500, category: 'pods', image: '/placeholder.svg', badge: 'ХИТ' },
  { id: 2, name: 'SMOK Nord 4', price: 2800, category: 'pods', image: '/placeholder.svg' },
  { id: 3, name: 'Vaporesso XROS 3', price: 2200, category: 'pods', image: '/placeholder.svg', badge: 'НОВИНКА' },
  { id: 4, name: 'Жидкость Ягодный Микс', price: 450, category: 'liquids', flavor: 'berry', image: '/placeholder.svg' },
  { id: 5, name: 'Жидкость Тропик', price: 500, category: 'liquids', flavor: 'tropical', image: '/placeholder.svg', badge: 'ТОП' },
  { id: 6, name: 'Жидкость Мята', price: 420, category: 'liquids', flavor: 'mint', image: '/placeholder.svg' },
  { id: 7, name: 'USB-C Кабель', price: 350, category: 'accessories', image: '/placeholder.svg' },
  { id: 8, name: 'Сменные картриджи', price: 800, category: 'accessories', image: '/placeholder.svg' },
];

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('vape-products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  useEffect(() => {
    localStorage.setItem('vape-products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1,
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts(products.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
}
