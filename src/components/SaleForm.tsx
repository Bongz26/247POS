import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

const SaleForm: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await supabase.from('products').select('*');
      return data || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (items: CartItem[]) => {
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const { data: sale } = await supabase
        .from('sales')
        .insert({ total, user_id: (await supabase.auth.getUser()).data.user?.id })
        .select()
        .single();

      for (const item of items) {
        const { data: product } = await supabase
          .from('products')
          .select('quantity')
          .eq('id', item.productId)
          .single();
        if (product.quantity < item.quantity) throw new Error(`Insufficient stock for ${item.name}`);

        await supabase.from('sale_items').insert({
          sale_id: sale.id,
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
        });
        await supabase
          .from('products')
          .update({ quantity: product.quantity - item.quantity })
          .eq('id', item.productId);
      }
    },
    onSuccess: () => {
      setCart([]);
      queryClient.invalidateQueries({ queryKey: ['products', 'sales'] });
    },
    onError: (error: any) => alert(error.message),
  });

  const addToCart = (product: Product, quantity: number) => {
    setCart([...cart, { productId: product.id, name: product.name, price: product.price, quantity }]);
  };

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (!products || products.length === 0) return <div className="p-4">No products available.</div>;

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Process Sale</h2>
      <select
        onChange={(e) => {
          const product = products.find((p) => p.id === e.target.value);
          if (product) {
            addToCart(product, 1);
          }
        }}
        className="p-2 border rounded w-full mb-2"
      >
        <option value="">Select Product</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - R{product.price.toFixed(2)} (Qty: {product.quantity})
          </option>
        ))}
      </select>
      <div className="mt-4">
        {cart.map((item, index) => (
          <div key={index} className="flex justify-between p-2 border-b">
            <span>
              {item.name} - R{item.price.toFixed(2)} x {item.quantity}
            </span>
            <button
              onClick={() => setCart(cart.filter((_, i) => i !== index))}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => mutation.mutate(cart)}
        className="bg-green-500 text-white p-2 rounded w-full mt-4"
        disabled={cart.length === 0 || mutation.isPending}
      >
        {mutation.isPending ? 'Processing...' : 'Complete Sale'}
      </button>
    </div>
  );
};

export default SaleForm;