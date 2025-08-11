import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface SaleItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Sale {
  id: string;
  total: number;
  created_at: string;
  sale_items: SaleItem[];
}

const TransactionHistory: React.FC = () => {
  const { data: sales, isLoading } = useQuery<Sale[]>({
    queryKey: ['sales'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sales')
        .select(`
          id,
          total,
          created_at,
          sale_items (
            id,
            quantity,
            price,
            products (name)
          )
        `)
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);

      // Transform data to match Sale interface
      const transformedData = data?.map((sale) => ({
        ...sale,
        sale_items: sale.sale_items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          product: { name: item.products.name },
        })),
      }));

      return transformedData || [];
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {sales?.length ? (
        sales.map((sale) => (
          <div key={sale.id} className="p-2 border-b">
            <p className="font-medium">
              Transaction #{sale.id.slice(0, 8)} - {new Date(sale.created_at).toLocaleString()}
            </p>
            <p>Total: R{sale.total.toFixed(2)}</p>
            <ul className="ml-4 list-disc">
              {sale.sale_items.map((item) => (
                <li key={item.id}>
                  {item.product.name} - R{item.price.toFixed(2)} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionHistory;