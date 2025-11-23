import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { api, User } from '@/lib/api';
import { Loader2, UserPlus, Filter } from 'lucide-react';

export const UsersTab = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: 'customer' as User['role'],
  });

  const fetchUsers = async (role?: string) => {
    setLoading(true);
    try {
      const data = await api.getUsers(role === 'all' ? undefined : role);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [roleFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.createUser(formData);
      toast.success('User created successfully');
      setFormData({ name: '', phone: '', role: 'customer' });
      fetchUsers(roleFilter);
    } catch (error) {
      toast.error('Failed to create user');
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
          <UserPlus className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Create User</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter user name"
              required
              className="bg-muted/50 border-glass-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
              required
              className="bg-muted/50 border-glass-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as User['role'] })}
            >
              <SelectTrigger className="bg-muted/50 border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-glass-border">
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary hover:bg-primary/90 neon-glow-violet"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create User'
            )}
          </Button>
        </form>
      </div>

      {/* Data Table */}
      <div className="glass-panel p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Users List</h2>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[140px] bg-muted/50 border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel border-glass-border">
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="seller">Seller</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="delivery">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-4 bg-muted/30 border border-glass-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.phone}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                      {user.role}
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
