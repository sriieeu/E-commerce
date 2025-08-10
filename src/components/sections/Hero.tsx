import hero from "@/assets/hero-market.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      <img
        src={hero}
        alt="NovaShop marketplace hero with stylish products"
        loading="lazy"
        className="h-[52vh] w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/10" />
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Discover products you’ll love
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-6">
            Shop from trusted sellers. Premium quality, secure checkout, and fast delivery.
          </p>
          <Button asChild variant="hero" size="lg">
            <Link to="/catalog">Shop Now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
