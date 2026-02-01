import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import NotificationCenter from '@/components/NotificationCenter';

const API_URL = 'https://functions.poehali.dev/c081b0cd-f1c8-458a-8d98-7d416cd99718';

interface Product {
  id: number;
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

interface FormData {
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

const initialFormData: FormData = {
  name: '',
  price: 0,
  category: 'Одноразки',
  image_url: '',
  short_description: '',
  full_description: '',
  features: {},
  in_stock: true,
  is_new: false,
  discount: 0,
};

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
      toast({
        title: 'Success',
        description: 'Products loaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to load products',
        variant: 'destructive',
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingId ? `${API_URL}?id=${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'add'} product`);

      toast({
        title: 'Success',
        description: `Product ${editingId ? 'updated' : 'added'} successfully`,
      });

      setFormData(initialFormData);
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Operation failed',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image_url: product.image_url,
      short_description: product.short_description,
      full_description: product.full_description,
      features: product.features || {},
      in_stock: product.in_stock,
      is_new: product.is_new,
      discount: product.discount || 0,
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      await loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingId(null);
  };

  const addFeature = () => {
    if (featureKey && featureValue) {
      setFormData({
        ...formData,
        features: { ...formData.features, [featureKey]: featureValue },
      });
      setFeatureKey('');
      setFeatureValue('');
    }
  };

  const removeFeature = (key: string) => {
    const newFeatures = { ...formData.features };
    delete newFeatures[key];
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                WhiteShishka Admin
              </span>
            </div>
            <div className="flex gap-2 items-center">
              <NotificationCenter />
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/analytics'}>
                <Icon name="BarChart3" size={16} className="mr-2" />
                Аналитика
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/texts'}>
                <Icon name="Type" size={16} className="mr-2" />
                Тексты
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/bot'}>
                <Icon name="Bot" size={16} className="mr-2" />
                Telegram
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/admin/promotions'}>
                <Icon name="Sparkles" size={16} className="mr-2" />
                Акции
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={16} className="mr-2" />
                На сайт
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage products and inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Одноразки">Одноразки</SelectItem>
                        <SelectItem value="Жидкости">Жидкости</SelectItem>
                        <SelectItem value="Аксессуары">Аксессуары</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="short_description">Short Description</Label>
                    <Textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="full_description">Full Description</Label>
                    <Textarea
                      id="full_description"
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input
                      id="discount"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Features</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Key"
                        value={featureKey}
                        onChange={(e) => setFeatureKey(e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={featureValue}
                        onChange={(e) => setFeatureValue(e.target.value)}
                      />
                      <Button type="button" onClick={addFeature} size="sm">
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {Object.entries(formData.features).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">
                            <strong>{key}:</strong> {value}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(key)}
                          >
                            <Icon name="X" size={14} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="in_stock">In Stock</Label>
                    <Switch
                      id="in_stock"
                      checked={formData.in_stock}
                      onCheckedChange={(checked) => setFormData({ ...formData, in_stock: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="is_new">Is New</Label>
                    <Switch
                      id="is_new"
                      checked={formData.is_new}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <Icon name="Loader2" className="animate-spin" size={16} />
                      ) : editingId ? (
                        'Update Product'
                      ) : (
                        'Add Product'
                      )}
                    </Button>
                    {editingId && (
                      <Button type="button" variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Products ({products.length})</CardTitle>
                  <Button onClick={loadProducts} variant="outline" size="sm" disabled={loading}>
                    <Icon name="RefreshCw" size={16} className={loading ? 'animate-spin' : ''} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading && products.length === 0 ? (
                  <div className="flex items-center justify-center py-12">
                    <Icon name="Loader2" className="animate-spin" size={32} />
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No products found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <Card key={product.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-semibold">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground">{product.category}</p>
                                  <p className="text-sm mt-1">{product.short_description}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">{product.price} ₽</p>
                                  {product.discount > 0 && (
                                    <p className="text-xs text-green-500">-{product.discount}%</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                {product.in_stock ? (
                                  <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                                    In Stock
                                  </span>
                                ) : (
                                  <span className="text-xs bg-red-500/20 text-red-500 px-2 py-1 rounded">
                                    Out of Stock
                                  </span>
                                )}
                                {product.is_new && (
                                  <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded">
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  onClick={() => handleEdit(product)}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Icon name="Pencil" size={14} className="mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDelete(product.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <Icon name="Trash2" size={14} className="mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}