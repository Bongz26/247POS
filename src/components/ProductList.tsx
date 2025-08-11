import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  barcode?: string;
  created_at?: string;
}

const ProductList: React.FC = () => {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('products-channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.new.quantity < 5) {
            alert(`Low stock alert: ${payload.new.name} has ${payload.new.quantity} units left`);
          }
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Products</h2>
      {products?.length ? (
        products.map((product) => (
          <div key={product.id} className="flex justify-between p-2 border-b">
            <span>
              {product.name} - R{product.price.toFixed(2)} (Qty: {product.quantity})
            </span>
            <button className="text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default ProductList;
