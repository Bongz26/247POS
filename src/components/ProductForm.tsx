// src/components/ProductForm.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const ProductForm: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [barcode, setBarcode] = useState('');

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () => {
      await supabase.from('products').insert({
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        barcode: barcode || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setName('');
      setPrice('');
      setQuantity('');
      setBarcode('');
      navigate('/products');
    },
    onError: (error: any) => alert(error.message),
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add Product</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Product Name"
        className="p-2 border rounded w-full mb-2"
      />
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price (e.g., 29.99)"
        step="0.01"
        className="p-2 border rounded w-full mb-2"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        className="p-2 border rounded w-full mb-2"
      />
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Barcode (optional)"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={() => mutation.mutate()}
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Adding...' : 'Add Product'}
      </button>
    </div>
  );
};

export default ProductForm;