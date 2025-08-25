import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [accountType, setAccountType] = useState<"customer" | "seller">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!user) return;
    const maybeGrantSeller = async () => {
      try {
        const pending = localStorage.getItem("pendingSellerGrant");
        if (pending === "true") {
          await supabase.rpc("grant_seller_role");
          localStorage.removeItem("pendingSellerGrant");
          toast({ title: "Seller setup complete", description: "Your account now has seller access." });
        }
      } catch (e: any) {
        toast({ title: "Seller setup failed", description: e?.message ?? "Please try again." });
      } finally {
        navigate("/", { replace: true });
      }
    };
    maybeGrantSeller();
  }, [user, navigate, toast]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message });
      } else {
        if (accountType === "seller") {
          try {
            await supabase.rpc("grant_seller_role");
          } catch (err: any) {
            // non-blocking; role grant can be attempted later
            console.error(err);
          }
        }
        toast({ title: "Welcome back!", description: `Logged in as ${accountType}.` });
        navigate("/", { replace: true });
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Signup failed", description: error.message });
      } else {
        if (accountType === "seller") {
          // Complete seller role grant after the first verified login
          localStorage.setItem("pendingSellerGrant", "true");
        }
        toast({ title: "Check your email", description: `Confirm your address to complete ${accountType} registration.` });
      }
    }
  };

  const resendVerification = async () => {
    if (!email) {
      toast({ title: "Enter email first", description: "Please enter your email address to resend verification." });
      return;
    }
    
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    setIsResending(false);
    
    if (error) {
      toast({ title: "Resend failed", description: error.message });
    } else {
      toast({ title: "Email sent!", description: "Check your inbox for a new verification link." });
    }
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Customer or Seller Login – NovaShop</title>
        <meta name="description" content="Login or register as a customer or seller on NovaShop to shop or start selling." />
        <link rel="canonical" href={window.location.origin + "/auth"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">{mode === "login" ? "Login" : "Register"} as {accountType === "seller" ? "Seller" : "Customer"}</h1>
      <section className="max-w-md grid gap-6">
        <div className="flex gap-2">
          <Button type="button" variant={accountType === "customer" ? "default" : "outline"} onClick={() => setAccountType("customer")}>
            Customer
          </Button>
          <Button type="button" variant={accountType === "seller" ? "default" : "outline"} onClick={() => setAccountType("seller")}>
            Seller
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>
            Login
          </Button>
          <Button type="button" variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>
            Sign Up
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={() => { setAccountType("customer"); setMode("signup"); }}>
            Register as Customer
          </Button>
          <Button type="button" variant="outline" onClick={() => { setAccountType("seller"); setMode("signup"); }}>
            Register as Seller
          </Button>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <Button type="submit" variant="hero">{mode === "login" ? "Login" : "Create account"}</Button>
          {accountType === "seller" ? (
            <p className="text-sm text-muted-foreground">Seller accounts can add products and manage orders. Email verification is required to finish setup.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Customers can browse and purchase products. Email signups will redirect back to this site.</p>
          )}
        </form>
        
        {mode === "signup" && (
          <div className="mt-4 p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground mb-2">
              Verification link expired or didn't receive it?
            </p>
            <Button 
              type="button" 
              variant="outline" 
              onClick={resendVerification}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export default Auth;

