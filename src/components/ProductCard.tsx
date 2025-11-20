import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border transition-smooth hover:shadow-hover">
      <div className="aspect-square overflow-hidden bg-gradient-card">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-1 text-xs text-muted-foreground">{product.category}</div>
        <h3 className="mb-2 font-semibold text-foreground">{product.title}</h3>
        <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="text-xl font-bold text-primary">${product.price.toFixed(2)}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full transition-smooth"
          onClick={() => onAddToCart(product)}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
