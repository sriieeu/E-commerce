import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Login failed", description: error.message });
      } else {
        toast({ title: "Welcome back!", description: "You're logged in." });
        navigate("/", { replace: true });
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        toast({ title: "Signup failed", description: error.message });
      } else {
        toast({ title: "Check your email", description: "Confirm your address to complete signup." });
      }
    }
  };

  return (
    <main className="container mx-auto py-8">
      <Helmet>
        <title>Login or Sign Up – NovaShop</title>
        <meta name="description" content="Login or sign up to NovaShop to buy products or sell as a vendor." />
        <link rel="canonical" href={window.location.origin + "/auth"} />
      </Helmet>
      <h1 className="text-3xl font-bold mb-6">Login or Sign Up</h1>
      <section className="max-w-md grid gap-6">
        <div className="flex gap-2">
          <Button type="button" variant={mode === "login" ? "default" : "outline"} onClick={() => setMode("login")}>
            Login
          </Button>
          <Button type="button" variant={mode === "signup" ? "default" : "outline"} onClick={() => setMode("signup")}>
            Sign Up
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
          <p className="text-sm text-muted-foreground">By continuing, you agree to our terms. Email signups will redirect back to this site.</p>
        </form>
      </section>
    </main>
  );
};

export default Auth;
