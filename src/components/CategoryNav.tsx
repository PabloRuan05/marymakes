import { Button } from "@/components/ui/button";

const categories = ["Todos", "Batom", "Base", "Sombra", "Máscara", "Blush", "Skincare"];

interface CategoryNavProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryNav = ({ selectedCategory, onCategoryChange }: CategoryNavProps) => {
  return (
    <nav className="w-full border-b border-border bg-background">
      <div className="container px-4">
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              onClick={() => onCategoryChange(category)}
              className="whitespace-nowrap transition-smooth"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNav;
