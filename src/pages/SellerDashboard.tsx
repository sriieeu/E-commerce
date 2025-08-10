import { Helmet } from "react-helmet-async";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import p1 from "@/assets/products/product-1.jpg";

const SellerDashboard = () => {
  const { addProduct } = useShop();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Math.round(parseFloat(price || "0") * 100);
    if (!title || !parsed) return;
    addProduct({ title, price: parsed, description, image: image || p1, seller: "You" });
    setTitle(""); setPrice(""); setDescription(""); setImage("");
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
    </main>
  );
};

export default SellerDashboard;
