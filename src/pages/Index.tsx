import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { UsersTab } from '@/components/tabs/UsersTab';
import { StoresTab } from '@/components/tabs/StoresTab';
import { ProductsTab } from '@/components/tabs/ProductsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Store, Package } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="glass-panel w-fit mb-6">
            <TabsTrigger 
              value="users" 
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="stores"
              className="gap-2 data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
            >
              <Store className="h-4 w-4" />
              Stores
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
          </TabsList>

          <div className="h-[calc(100vh-200px)]">
            <TabsContent value="users" className="h-full m-0">
              <UsersTab />
            </TabsContent>

            <TabsContent value="stores" className="h-full m-0">
              <StoresTab />
            </TabsContent>

            <TabsContent value="products" className="h-full m-0">
              <ProductsTab />
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
