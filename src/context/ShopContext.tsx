import React, { createContext, useContext, useMemo, useState } from "react";
import p1 from "@/assets/products/product-1.jpg";
import p2 from "@/assets/products/product-2.jpg";
import p3 from "@/assets/products/product-3.jpg";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number; // in cents
  image: string;
  seller?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

interface ShopContextValue {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number; // in cents
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

const initialProducts: Product[] = [
  {
    id: crypto.randomUUID(),
    title: "Sonic Headphones",
    description: "Immersive sound with noise cancellation.",
    price: 12999,
    image: p1,
    seller: "Acme Audio",
  },
  {
    id: crypto.randomUUID(),
    title: "Pulse Smart Watch",
    description: "Health tracking with vibrant AMOLED display.",
    price: 9999,
    image: p2,
    seller: "Pulse Co.",
  },
  {
    id: crypto.randomUUID(),
    title: "Echo Mini Speaker",
    description: "Rich sound in a compact form.",
    price: 5999,
    image: p3,
    seller: "EchoLabs",
  },
];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addProduct = (product: Omit<Product, "id">) => {
    setProducts((prev) => [{ id: crypto.randomUUID(), ...product }, ...prev]);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const value = { products, addProduct, cart, addToCart, removeFromCart, clearCart, total };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
