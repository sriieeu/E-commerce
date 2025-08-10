import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/context/ShopContext";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
}

const ProductCard = ({ product, onAdd }: Props) => {
  return (
    <Card className="transition-transform duration-200 hover:-translate-y-0.5">
      <CardHeader>
        <div className="aspect-square overflow-hidden rounded-md">
          <img
            src={product.image}
            alt={`${product.title} product image`}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <span className="font-semibold">${(product.price / 100).toFixed(2)}</span>
        <Button onClick={() => onAdd(product)}>Add to cart</Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
