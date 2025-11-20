import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().trim().min(1, "Nome completo é obrigatório").max(100),
  phone: z.string().trim().min(10, "Telefone deve ter pelo menos 10 dígitos").max(20),
  neighborhood: z.string().trim().min(2, "Bairro é obrigatório").max(100),
  block: z.string().trim().min(1, "Quadra é obrigatória").max(50),
  street: z.string().trim().min(2, "Rua é obrigatória").max(150),
  houseNumber: z.string().trim().min(1, "Número da casa é obrigatório").max(20),
  deliveryNotes: z.string().trim().max(200).optional(),
  paymentMethod: z.enum(["card", "pix", "cash"], {
    errorMap: () => ({ message: "Por favor, selecione uma forma de pagamento" }),
  }),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const cartItemsJson = localStorage.getItem("cartItems");
  const cartItems = cartItemsJson ? JSON.parse(cartItemsJson) : [];
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    neighborhood: "",
    block: "",
    street: "",
    houseNumber: "",
    deliveryNotes: "",
    paymentMethod: "card" as "card" | "pix" | "cash",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data
    const result = checkoutSchema.safeParse(formData);
    
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          newErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(newErrors);
      toast({
        title: "Erro de Validação",
        description: "Por favor, verifique os erros no formulário",
        variant: "destructive",
      });
      return;
    }

    // Create order summary
    const orderSummary = cartItems
      .map((item: any) => `${item.quantity}x ${item.title} - R$ ${(item.price * item.quantity).toFixed(2)}`)
      .join("%0A");

    const paymentMethodText = formData.paymentMethod === "card" ? "Cartão de Crédito/Débito" : 
                              formData.paymentMethod === "pix" ? "PIX" : "Dinheiro";

    const message = encodeURIComponent(
      `*Novo Pedido*\n\n` +
      `*Dados do Cliente:*\n` +
      `Nome: ${formData.name}\n` +
      `Telefone: ${formData.phone}\n\n` +
      `*Endereço de Entrega:*\n` +
      `Bairro: ${formData.neighborhood}\n` +
      `Quadra: ${formData.block}\n` +
      `Rua: ${formData.street}\n` +
      `Número: ${formData.houseNumber}\n` +
      (formData.deliveryNotes ? `Observações: ${formData.deliveryNotes}\n\n` : '\n') +
      `*Forma de Pagamento:* ${paymentMethodText}\n\n` +
      `*Itens do Pedido:*\n${decodeURIComponent(orderSummary)}\n\n` +
      `*Total: R$ ${total.toFixed(2)}*`
    );

    const whatsappUrl = `https://api.whatsapp.com/send?phone=559891102463&text=${message}`;
    
    // Clear cart
    localStorage.removeItem("cartItems");
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    
    toast({
      title: "Pedido Realizado!",
      description: "Redirecionando para o WhatsApp para completar seu pedido...",
    });
    
    // Redirect to home after a short delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container flex min-h-screen flex-col items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="py-12">
            <h2 className="mb-4 text-2xl font-bold">Seu carrinho está vazio</h2>
            <p className="mb-6 text-muted-foreground">
              Adicione alguns produtos ao seu carrinho antes de finalizar a compra
            </p>
            <Button onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-12">
      <div className="container px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Loja
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-destructive">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Número de Telefone *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                    className={errors.neighborhood ? "border-destructive" : ""}
                  />
                  {errors.neighborhood && (
                    <p className="mt-1 text-xs text-destructive">{errors.neighborhood}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="block">Quadra *</Label>
                    <Input
                      id="block"
                      value={formData.block}
                      onChange={(e) => handleInputChange("block", e.target.value)}
                      className={errors.block ? "border-destructive" : ""}
                    />
                    {errors.block && (
                      <p className="mt-1 text-xs text-destructive">{errors.block}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="houseNumber">Número da Casa *</Label>
                    <Input
                      id="houseNumber"
                      value={formData.houseNumber}
                      onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                      className={errors.houseNumber ? "border-destructive" : ""}
                    />
                    {errors.houseNumber && (
                      <p className="mt-1 text-xs text-destructive">{errors.houseNumber}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => handleInputChange("street", e.target.value)}
                    className={errors.street ? "border-destructive" : ""}
                  />
                  {errors.street && (
                    <p className="mt-1 text-xs text-destructive">{errors.street}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="deliveryNotes">Observações de Entrega (Opcional)</Label>
                  <Input
                    id="deliveryNotes"
                    placeholder="Ex: Casa amarela, portão preto"
                    value={formData.deliveryNotes}
                    onChange={(e) => handleInputChange("deliveryNotes", e.target.value)}
                    className={errors.deliveryNotes ? "border-destructive" : ""}
                  />
                  {errors.deliveryNotes && (
                    <p className="mt-1 text-xs text-destructive">{errors.deliveryNotes}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
                  <select
                    id="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
                    }
                    className={`flex h-10 w-full rounded-md border ${
                      errors.paymentMethod ? "border-destructive" : "border-input"
                    } bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
                  >
                    <option value="card">Cartão de Crédito/Débito</option>
                    <option value="pix">PIX</option>
                    <option value="cash">Dinheiro</option>
                  </select>
                  {errors.paymentMethod && (
                    <p className="mt-1 text-xs text-destructive">
                      {errors.paymentMethod}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Finalizar Pedido via WhatsApp
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantidade: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-2xl text-primary">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
