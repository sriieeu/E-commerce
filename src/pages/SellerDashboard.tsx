import { Helmet } from "react-helmet-async";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import p1 from "@/assets/products/product-1.jpg";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/catalog/ProductCard";
import type { Product } from "@/context/ShopContext";
const SellerDashboard = () => {
  const { addProduct } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    const guard = async () => {
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }
      const { data, error } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'seller' });
      if (error) {
        toast({ title: "Access error", description: error.message });
        navigate("/auth", { replace: true });
        return;
      }
      if (!data) {
        toast({ title: "Seller access required", description: "Register as a seller to access this page." });
        navigate("/auth", { replace: true });
      }
    };
    guard();
  }, [user, navigate, toast]);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [count, setCount] = useState("1");
  const previewPrice = Math.round(parseFloat(price || "0") * 100) || 0;
  const previewProduct: Product = {
    id: "preview",
    title: title || "Preview product",
    description: description || "Your description will appear here.",
    price: previewPrice,
    image: image || p1,
    seller: "You",
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Math.round(parseFloat(price || "0") * 100);
    const n = Math.max(1, parseInt(count || "1", 10));
    if (!title || !parsed) return;
    for (let i = 0; i < n; i++) {
      addProduct({ title, price: parsed, description, image: image || p1, seller: "You" });
    }
    toast({ title: "Product added", description: n > 1 ? `${n} items added to catalog.` : `${title} added to catalog.` });
    setTitle(""); setPrice(""); setDescription(""); setImage(""); setCount("1");
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Seller Dashboard – NovaShop</title>
        <meta name="description" content="Add and manage your products as a seller on NovaShop." />
        <link rel="canonical" href={window.location.origin + "/seller"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>
      <form onSubmit={onSubmit} className="grid gap-6 max-w-2xl">
        <div className="grid gap-2">
          <Label htmlFor="title">Product title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Aurora Lamp" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 49.99" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="count">Quantity to add</Label>
          <Input id="count" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} placeholder="1" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="image">Image URL (optional)</Label>
          <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desc">Description</Label>
          <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your product" />
        </div>
        <Button type="submit" variant="hero" className="w-fit">Add product</Button>
        <p className="text-sm text-muted-foreground">Note: Real seller authentication and database will be enabled after connecting Supabase.</p>
      </form>
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Preview as customer</h2>
        <div className="max-w-sm">
          <ProductCard product={previewProduct} onAdd={() => {}} showActions={false} />
        </div>
        <p className="text-sm text-muted-foreground mt-2">This is how your product will appear to customers.</p>
      </section>
    </main>
  );
};

export default SellerDashboard;
