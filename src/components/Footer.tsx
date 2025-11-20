import { Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-16">
      <div className="container px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Sobre Nós</h3>
            <p className="text-sm text-muted-foreground">
              Seu destino principal para produtos de maquiagem e beleza de alta qualidade. 
              Descubra as últimas tendências e clássicos atemporais.
            </p>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-smooth">Sobre</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Contato</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Informações de Entrega</a></li>
              <li><a href="#" className="hover:text-primary transition-smooth">Devoluções</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Siga-nos</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary hover:text-primary-foreground transition-smooth"
                asChild
              >
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary hover:text-primary-foreground transition-smooth"
                asChild
              >
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary hover:text-primary-foreground transition-smooth"
                asChild
              >
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Glam Beauty. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
