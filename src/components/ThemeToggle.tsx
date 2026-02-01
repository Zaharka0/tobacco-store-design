import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="p-2">
          <Icon name="Sun" size={18} className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icon name="Moon" size={18} className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Переключить тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Icon name="Sun" size={16} className="mr-2" />
          Светлая
          {theme === 'light' && <Icon name="Check" size={16} className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Icon name="Moon" size={16} className="mr-2" />
          Тёмная
          {theme === 'dark' && <Icon name="Check" size={16} className="ml-auto" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <Icon name="Monitor" size={16} className="mr-2" />
          Системная
          {theme === 'system' && <Icon name="Check" size={16} className="ml-auto" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
