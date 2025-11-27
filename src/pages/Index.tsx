import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryNav from "@/components/CategoryNav";
import ProductCard from "@/components/ProductCard";
import ShoppingCartSheet from "@/components/ShoppingCartSheet";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Product, CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    toast({
      title: "Adicionado ao carrinho",
      description: `${product.title} foi adicionado ao seu carrinho.`,
    });
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
    toast({
      title: "Removido do carrinho",
      description: "Item foi removido do seu carrinho.",
    });
  };

  const cartItemsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItemsCount={cartItemsCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      <main>
        <HeroCarousel />

        <CategoryNav
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <section className="container px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              {selectedCategory === "Todos"
                ? "Todos os Produtos"
                : selectedCategory}
            </h2>
            <p className="mt-2 text-muted-foreground">
              Descubra nossa coleção de produtos de beleza premium
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />

      <ShoppingCartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Index;
