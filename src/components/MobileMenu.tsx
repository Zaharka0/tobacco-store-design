import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useSiteTexts } from '@/hooks/useSiteTexts';

interface MobileMenuProps {
  currentPath?: string;
}

export default function MobileMenu({ currentPath = '/' }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { getText } = useSiteTexts();

  const menuItems = [
    { path: '/', label: getText('nav_home', 'Главная') },
    { path: '/catalog', label: getText('nav_catalog', 'Каталог') },
    { path: '/about', label: getText('nav_about', 'О магазине') },
    { path: '/delivery', label: getText('nav_delivery', 'Доставка') },
    { path: '/promotions', label: getText('nav_promotions', 'Акции') },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon name={isOpen ? 'X' : 'Menu'} size={20} />
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-[57px] left-0 right-0 bg-background border-b border-border/50 z-50 md:hidden shadow-lg">
            <nav className="container mx-auto px-4 py-4">
              <div className="flex flex-col gap-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-3 rounded-lg transition-colors ${
                      currentPath === item.path
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'bg-muted/50 hover:bg-muted text-foreground'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}
