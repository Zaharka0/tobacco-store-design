import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  productName: string;
  productUrl?: string;
  productImage?: string;
}

export default function ShareButton({ productName, productUrl, productImage }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const currentUrl = productUrl || window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(productName);
  const encodedImage = productImage ? encodeURIComponent(productImage) : '';

  const shareLinks = {
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    vk: `https://vk.com/share.php?url=${encodedUrl}&title=${encodedTitle}&image=${encodedImage}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    toast({
      title: 'Ссылка скопирована',
      description: 'Ссылка на товар скопирована в буфер обмена',
    });
    setIsOpen(false);
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          url: currentUrl,
        });
        setIsOpen(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Icon name="Share2" size={16} className="mr-2" />
          Поделиться
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleShare('telegram')}>
          <Icon name="Send" size={16} className="mr-2" />
          Telegram
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <Icon name="MessageCircle" size={16} className="mr-2" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('vk')}>
          <Icon name="Share" size={16} className="mr-2" />
          ВКонтакте
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare('twitter')}>
          <Icon name="Twitter" size={16} className="mr-2" />
          Twitter
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink}>
          <Icon name="Link" size={16} className="mr-2" />
          Скопировать ссылку
        </DropdownMenuItem>
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Icon name="Share2" size={16} className="mr-2" />
            Ещё...
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
