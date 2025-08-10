import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const SiteHeader = () => {
  const { toast } = useToast();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-primary shadow-elegant" aria-hidden />
          <span className="font-semibold">NovaShop</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink to="/catalog" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>Catalog</NavLink>
          <NavLink to="/seller" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>Seller</NavLink>
          <NavLink to="/cart" className={({isActive}) => isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}>Cart</NavLink>
          <Button
            variant="outline"
            onClick={() =>
              toast({
                title: "Login & roles",
                description:
                  "Connect Supabase to enable real authentication for sellers and customers.",
              })
            }
          >
            <Link to="/login">Login</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default SiteHeader;
