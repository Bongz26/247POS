import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  quantity: number;
}

const StockTake: React.FC = () => {
  const [productId, setProductId] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('id, name, quantity');
      return data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!productId || !newQuantity) throw new Error('Select a product and enter a quantity');
      await supabase
        .from('products')
        .update({ quantity: parseInt(newQuantity) })
        .eq('id', productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setProductId('');
      setNewQuantity('');
      alert('Stock updated successfully');
    },
    onError: (error: any) => alert(error.message),
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Stock Take</h2>
      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="p-2 border rounded w-full mb-2"
      >
        <option value="">Select Product</option>
        {products?.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} (Current Qty: {product.quantity})
          </option>
        ))}
      </select>
      <input
        type="number"
        value={newQuantity}
        onChange={(e) => setNewQuantity(e.target.value)}
        placeholder="New Quantity"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={() => mutation.mutate()}
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={mutation.isPending || !productId || !newQuantity}
      >
        {mutation.isPending ? 'Updating...' : 'Update Stock'}
      </button>
    </div>
  );
};

export default StockTake;