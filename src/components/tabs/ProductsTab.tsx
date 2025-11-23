import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { api, Product, Store } from '@/lib/api';
import { Loader2, Package, Filter } from 'lucide-react';

export const ProductsTab = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [storeFilter, setStoreFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    store_id: '',
    name: '',
    price: '',
    unit: '',
    stock: '',
    is_active: true,
  });

  const fetchProducts = async (storeId?: string) => {
    setLoading(true);
    try {
      const data = await api.getProducts(storeId === 'all' ? undefined : storeId);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStores = async () => {
    try {
      const data = await api.getStores();
      setStores(data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts(storeFilter);
  }, [storeFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.store_id) {
      toast.error('Please select a store');
      return;
    }

    setSubmitting(true);
    try {
      await api.createProduct({
        store_id: formData.store_id,
        name: formData.name,
        price: parseFloat(formData.price),
        unit: formData.unit,
        stock: parseInt(formData.stock),
        is_active: formData.is_active,
      });
      toast.success('Product created successfully');
      setFormData({
        store_id: '',
        name: '',
        price: '',
        unit: '',
        stock: '',
        is_active: true,
      });
      fetchProducts(storeFilter);
    } catch (error) {
      toast.error('Failed to create product');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Create Form */}
      <div className="glass-panel p-6">
        <div className="flex items-center gap-2 mb-6">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Create Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-store">Store</Label>
            <Select
              value={formData.store_id}
              onValueChange={(value) => setFormData({ ...formData, store_id: value })}
            >
              <SelectTrigger className="bg-muted/50 border-glass-border">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-glass-border">
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input
              id="product-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
              required
              className="bg-muted/50 border-glass-border"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
                className="bg-muted/50 border-glass-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, pc, etc."
                required
                className="bg-muted/50 border-glass-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="0"
              required
              className="bg-muted/50 border-glass-border"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <Label htmlFor="is-active" className="cursor-pointer">Is Active</Label>
            <Switch
              id="is-active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
          </div>

          <Button
            type="submit"
            disabled={submitting || !formData.store_id}
            className="w-full bg-primary hover:bg-primary/90 neon-glow-violet"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Product'
            )}
          </Button>
        </form>
      </div>

      {/* Data Table */}
      <div className="glass-panel p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Products List</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={storeFilter} onValueChange={setStoreFilter}>
              <SelectTrigger className="w-[160px] bg-muted/50 border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-glass-border">
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No products found
            </div>
          ) : (
            <div className="space-y-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-muted/30 border border-glass-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">₹{product.price}</span>
                        <span>·</span>
                        <span>{product.unit}</span>
                        <span>·</span>
                        <span>Stock: {product.stock}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        product.is_active
                          ? 'bg-secondary/20 text-secondary'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
