import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface BreadcrumbProps {
  currentPage: string;
}

export default function Breadcrumb({ currentPage }: BreadcrumbProps) {
  return (
    <div className="border-b border-border/30 bg-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Главная
          </Link>
          <Icon name="ChevronRight" size={14} />
          <span className="text-foreground font-medium">{currentPage}</span>
        </div>
      </div>
    </div>
  );
}
