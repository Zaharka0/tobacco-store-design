import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';

export default function CartDrawer() {
  const { items, total, itemCount, removeFromCart, checkoutToTelegram } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <Icon name="ShoppingCart" size={18} />
          <span className="hidden sm:inline">Корзина</span>
          {itemCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon name="ShoppingCart" size={24} />
            Корзина
          </SheetTitle>
          <SheetDescription>
            {itemCount > 0 ? `${itemCount} товаров на сумму ${total.toLocaleString()}₽` : 'Корзина пуста'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="ShoppingBag" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Добавьте товары в корзину</p>
            </div>
          ) : (
            <>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.product_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.product_price.toLocaleString()}₽ × {item.quantity}
                      </p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {item.total.toLocaleString()}₽
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Icon name="Trash2" size={16} className="text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">Итого:</span>
                  <span className="text-2xl font-bold text-primary">{total.toLocaleString()}₽</span>
                </div>

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => {
                    const url = checkoutToTelegram();
                    if (url) window.open(url, '_blank');
                  }}
                >
                  <Icon name="MessageCircle" size={20} />
                  Оплатить в Telegram
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-3">
                  Вы будете перенаправлены в Telegram-бота для оформления заказа
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
