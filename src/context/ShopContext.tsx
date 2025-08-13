import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import p1 from "@/assets/products/product-1.jpg";
import p2 from "@/assets/products/product-2.jpg";
import p3 from "@/assets/products/product-3.jpg";

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number; // in cents
  image: string;
  seller_name?: string;
  seller_id?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

interface ShopContextValue {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "seller_id">) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  total: number; // in cents
  loading: boolean;
  fetchProducts: () => Promise<void>;
}

const ShopContext = createContext<ShopContextValue | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const mappedProducts: Product[] = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || "",
        price: item.price,
        image: item.image || p1,
        seller_name: item.seller_name || "Unknown Seller",
        seller_id: item.seller_id
      }));
      
      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id" | "seller_id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('products')
        .insert({
          title: product.title,
          description: product.description,
          price: product.price,
          image: product.image,
          seller_id: user.id,
          seller_name: product.seller_name || "You"
        });

      if (error) throw error;
      
      // Refresh products after adding
      await fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
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

  const value = { products, addProduct, cart, addToCart, removeFromCart, clearCart, total, loading, fetchProducts };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within ShopProvider");
  return ctx;
};
