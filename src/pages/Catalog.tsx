import { Helmet } from "react-helmet-async";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/catalog/ProductCard";

const Catalog = () => {
  const { products, addToCart, loading } = useShop();
  
  if (loading) {
    return (
      <main className="container mx-auto py-8">
        <Helmet>
          <title>Catalog – NovaShop</title>
          <meta name="description" content="Browse the NovaShop product catalog and find your next favorite item." />
          <link rel="canonical" href={window.location.origin + "/catalog"} />
        </Helmet>
        <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </main>
    );
  }
  
  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Catalog – NovaShop</title>
        <meta name="description" content="Browse the NovaShop product catalog and find your next favorite item." />
        <link rel="canonical" href={window.location.origin + "/catalog"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products available yet. Be the first to add one!</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Catalog;
