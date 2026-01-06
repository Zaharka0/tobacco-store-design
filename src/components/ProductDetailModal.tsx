import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Product {
  id?: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  short_description: string;
  full_description: string;
  features: Record<string, string>;
  in_stock: boolean;
  is_new: boolean;
  discount: number;
}

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductDetailModal({ product, open, onOpenChange }: ProductDetailModalProps) {
  if (!product) return null;

  const finalPrice = product.discount > 0 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.is_new && (
                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                  Новинка
                </Badge>
              )}
              {product.discount > 0 && (
                <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                  -{product.discount}%
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div>
                {product.discount > 0 && (
                  <span className="text-lg text-muted-foreground line-through">
                    {product.price}₽
                  </span>
                )}
                <div className="text-3xl font-bold">{Math.round(finalPrice)}₽</div>
              </div>
              <Badge variant={product.in_stock ? 'default' : 'secondary'}>
                {product.in_stock ? 'В наличии' : 'Нет в наличии'}
              </Badge>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Описание</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.full_description || product.short_description}
              </p>
            </div>

            {Object.keys(product.features).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Характеристики</h3>
                <div className="space-y-2">
                  {Object.entries(product.features).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/50">
                      <span className="text-muted-foreground capitalize">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full" 
              size="lg"
              onClick={() => window.open('https://t.me/whiteshishka_bot', '_blank')}
            >
              <Icon name="MessageCircle" size={20} className="mr-2" />
              Заказать в боте
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
