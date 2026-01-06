import { Card, CardContent } from '@/components/ui/card';

export default function SkeletonCard() {
  return (
    <Card className="border-border/50 overflow-hidden animate-pulse">
      <CardContent className="p-0">
        <div className="bg-muted/50 h-48 w-full" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-6 bg-muted rounded w-1/3 mt-4" />
        </div>
      </CardContent>
    </Card>
  );
}
