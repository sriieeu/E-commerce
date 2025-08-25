import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import { Helmet } from "react-helmet-async";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useShop();

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Payment Successful - Your Order is Confirmed</title>
        <meta name="description" content="Your payment was successful and your order has been confirmed. Thank you for your purchase!" />
        <link rel="canonical" href="/payment-success" />
      </Helmet>
      
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Thank you for your purchase! Your order has been confirmed and you'll receive an email confirmation shortly.
            </p>
            {sessionId && (
              <p className="text-sm text-muted-foreground">
                Transaction ID: {sessionId.slice(0, 20)}...
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/catalog">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Go Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccess;