import Hero from "@/components/sections/Hero";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useShop } from "@/context/ShopContext";
import ProductCard from "@/components/catalog/ProductCard";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { products, addToCart, loading } = useShop();
  return (
    <main>
      <Helmet>
        <title>NovaShop – Modern marketplace</title>
        <meta name="description" content="NovaShop product marketplace. Shop premium products from trusted sellers with secure checkout." />
        <link rel="canonical" href={window.location.origin + "/"} />
      </Helmet>
      <Hero />
      <section className="container mx-auto py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <Button asChild variant="link"><Link to="/catalog">View all</Link></Button>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No products available yet.</p>
            </div>
          ) : (
            products.slice(0,3).map((p) => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default Index;
