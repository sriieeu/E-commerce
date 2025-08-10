import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const { toast } = useToast();

  const handleClick = (role: "seller" | "customer") => {
    toast({
      title: `Login as ${role}`,
      description: "Connect Supabase to enable real email/password authentication and role-based access.",
    });
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Login – NovaShop</title>
        <meta name="description" content="Login to NovaShop as a customer or seller." />
        <link rel="canonical" href={window.location.origin + "/login"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="grid gap-4 max-w-md">
        <Button onClick={() => handleClick("customer")} variant="outline">Continue as Customer</Button>
        <Button onClick={() => handleClick("seller")} variant="hero">Continue as Seller</Button>
        <p className="text-sm text-muted-foreground">Authentication will be activated once Supabase is connected.</p>
      </div>
    </main>
  );
};

export default Login;
