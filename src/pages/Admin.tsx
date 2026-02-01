import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AdminNav from '@/components/admin/AdminNav';
import ProductForm from '@/components/admin/ProductForm';
import ProductList from '@/components/admin/ProductList';

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
      let allProducts: Product[] = [];
      let offset = 0;
      const limit = 10;
      
      while (true) {
        const response = await fetch(`${API_URL}?limit=${limit}&offset=${offset}`);
        if (!response.ok) throw new Error('Failed to load products');
        const data = await response.json();
        const batch = Array.isArray(data) ? data : [];
        
        if (batch.length === 0) break;
        allProducts = [...allProducts, ...batch];
        
        if (batch.length < limit) break;
        offset += limit;
      }
      
      setProducts(allProducts);
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
      <AdminNav />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage products and inventory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProductForm
              formData={formData}
              setFormData={setFormData}
              editingId={editingId}
              loading={loading}
              featureKey={featureKey}
              setFeatureKey={setFeatureKey}
              featureValue={featureValue}
              setFeatureValue={setFeatureValue}
              onSubmit={handleSubmit}
              onCancel={handleCancelEdit}
              addFeature={addFeature}
              removeFeature={removeFeature}
            />
          </div>

          <div className="lg:col-span-2">
            <ProductList
              products={products}
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
