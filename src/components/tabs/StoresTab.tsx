import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api, Store, User } from '@/lib/api';
import { Loader2, Store as StoreIcon, RefreshCw } from 'lucide-react';

export const StoresTab = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [sellers, setSellers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingSellers, setLoadingSellers] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    owner_id: '',
  });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await api.getStores();
      setStores(data);
    } catch (error) {
      toast.error('Failed to fetch stores');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSellers = async () => {
    setLoadingSellers(true);
    try {
      const data = await api.getUsers('seller');
      setSellers(data);
      toast.success(`Loaded ${data.length} sellers`);
    } catch (error) {
      toast.error('Failed to load sellers');
      console.error(error);
    } finally {
      setLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.owner_id) {
      toast.error('Please select a seller');
      return;
    }

    setSubmitting(true);
    try {
      await api.createStore(formData);
      toast.success('Store created successfully');
      setFormData({ name: '', address: '', owner_id: '' });
      fetchStores();
    } catch (error) {
      toast.error('Failed to create store');
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
          <StoreIcon className="h-5 w-5 text-secondary" />
          <h2 className="text-xl font-semibold">Create Store</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store-name">Store Name</Label>
            <Input
              id="store-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter store name"
              required
              className="bg-muted/50 border-glass-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter store address"
              required
              className="bg-muted/50 border-glass-border"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="owner">Owner (Seller)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadSellers}
                disabled={loadingSellers}
                className="h-7 text-xs gap-1 border-glass-border hover:bg-secondary/10"
              >
                {loadingSellers ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                Load Sellers
              </Button>
            </div>
            <Select
              value={formData.owner_id}
              onValueChange={(value) => setFormData({ ...formData, owner_id: value })}
              disabled={sellers.length === 0}
            >
              <SelectTrigger className="bg-muted/50 border-glass-border">
                <SelectValue placeholder="Select a seller" />
              </SelectTrigger>
              <SelectContent className="glass-panel border-glass-border">
                {sellers.map((seller) => (
                  <SelectItem key={seller.id} value={seller.id}>
                    {seller.name} ({seller.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={submitting || !formData.owner_id}
            className="w-full bg-secondary hover:bg-secondary/90 neon-glow-emerald"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Store'
            )}
          </Button>
        </form>
      </div>

      {/* Data Table */}
      <div className="glass-panel p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Stores List</h2>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-secondary" />
            </div>
          ) : stores.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No stores found
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="p-4 bg-muted/30 border border-glass-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{store.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{store.address}</p>
                      <p className="text-xs text-muted-foreground mt-2">Owner ID: {store.owner_id}</p>
                    </div>
                    {store.is_active && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary">
                        Active
                      </span>
                    )}
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
