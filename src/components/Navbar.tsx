import { useEffect, useState } from 'react';
import { Activity, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api, HealthStatus } from '@/lib/api';

export const Navbar = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const status = await api.getHealth();
        setHealth(status);
      } catch (error) {
        console.error('Health check failed:', error);
        setHealth({ status: 'error' });
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return 'bg-muted';
    if (health?.status === 'healthy' || health?.status === 'ok') return 'bg-secondary neon-glow-emerald';
    return 'bg-destructive';
  };

  const openSwaggerDocs = () => {
    window.open('https://anonymousananta-town-blinkit-backend.hf.space/docs', '_blank');
  };

  return (
    <nav className="glass-panel border-b border-glass-border/50 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            GETit
          </h1>
          <span className="text-sm text-muted-foreground">Town Delivery Console</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-panel rounded-full">
            <Activity className="h-4 w-4 text-foreground" />
            <span className="text-sm font-medium">Status:</span>
            <div className={`h-2 w-2 rounded-full ${getStatusColor()} transition-colors`} />
            <span className="text-xs text-muted-foreground">
              {loading ? 'Checking...' : health?.status || 'Unknown'}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={openSwaggerDocs}
            className="gap-2 hover:bg-primary/10 hover:border-primary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            API Docs
          </Button>
        </div>
      </div>
    </nav>
  );
};
