import { Helmet } from "react-helmet-async";
import { useShop } from "@/context/ShopContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
  const { cart, removeFromCart, total, clearCart } = useShop();
  const { toast } = useToast();

  const handleCheckout = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { cartItems: cart }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Cart – NovaShop</title>
        <meta name="description" content="Your shopping cart on NovaShop." />
        <link rel="canonical" href={window.location.origin + "/cart"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          <ul className="space-y-4">
            {cart.map(({ product, quantity }) => (
              <li key={product.id} className="flex items-center gap-4">
                <img src={product.image} alt={product.title} className="h-16 w-16 rounded object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{product.title}</p>
                  <p className="text-sm text-muted-foreground">Qty {quantity}</p>
                </div>
                <p className="font-semibold">${((product.price * quantity) / 100).toFixed(2)}</p>
                <Button variant="ghost" onClick={() => removeFromCart(product.id)}>Remove</Button>
              </li>
            ))}
          </ul>
          <div className="space-y-4">
            <div className="text-right space-y-2">
              <p className="text-sm text-muted-foreground">
                Subtotal: ${(total / 100).toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Platform Fee (1%): ${((total * 0.01) / 100).toFixed(2)}
              </p>
              <p className="text-lg font-semibold">
                Total: ${((total + (total * 0.01)) / 100).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
              <Button onClick={handleCheckout} variant="hero">Checkout with Stripe</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;
