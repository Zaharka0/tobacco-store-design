import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import ImageUploader from '@/components/ImageUploader';

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

interface ProductFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingId: number | null;
  loading: boolean;
  featureKey: string;
  setFeatureKey: (key: string) => void;
  featureValue: string;
  setFeatureValue: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  addFeature: () => void;
  removeFeature: (key: string) => void;
}

export default function ProductForm({
  formData,
  setFormData,
  editingId,
  loading,
  featureKey,
  setFeatureKey,
  featureValue,
  setFeatureValue,
  onSubmit,
  onCancel,
  addFeature,
  removeFeature,
}: ProductFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingId ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
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
            <Label htmlFor="price">Price (₽)</Label>
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
                <SelectItem value="Картриджи">Картриджи</SelectItem>
                <SelectItem value="Жидкости">Жидкости</SelectItem>
                <SelectItem value="Девайсы">Девайсы</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <ImageUploader
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              label="Product Image"
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
            <Label>Features</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Key (e.g., Battery)"
                  value={featureKey}
                  onChange={(e) => setFeatureKey(e.target.value)}
                />
                <Input
                  placeholder="Value (e.g., 650mAh)"
                  value={featureValue}
                  onChange={(e) => setFeatureValue(e.target.value)}
                />
                <Button type="button" onClick={addFeature} size="icon">
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
              {Object.entries(formData.features).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">
                    <strong>{key}:</strong> {value}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(key)}
                  >
                    <Icon name="Trash2" size={16} />
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
            <Label htmlFor="is_new">Mark as New</Label>
            <Switch
              id="is_new"
              checked={formData.is_new}
              onCheckedChange={(checked) => setFormData({ ...formData, is_new: checked })}
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

          <div className="flex gap-2">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Loading...' : editingId ? 'Update Product' : 'Add Product'}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}