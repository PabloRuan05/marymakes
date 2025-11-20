import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4">
        <div className="flex-1" />
        
        <div className="flex items-center justify-center">
          <img src={logo} alt="Logo Glam Beauty" className="h-12 w-auto object-contain" />
        </div>

        <div className="flex flex-1 items-center justify-end">
          <Button
            variant="ghost"
            size="lg"
            className="relative hover:bg-secondary transition-smooth"
            onClick={onCartClick}
          >
            <ShoppingCart className="h-6 w-6" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-primary p-0 text-xs">
                {cartItemsCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
