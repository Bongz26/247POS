// src/components/CashUpHistory.tsx
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface CashUp {
  id: string;
  actual_cash: number;
  expected_cash: number;
  created_at: string;
}

const CashUpHistory: React.FC = () => {
  const { data: cashUps, isLoading } = useQuery<CashUp[]>({
    queryKey: ['cash_ups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cash_ups')
        .select('id, actual_cash, expected_cash, created_at')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data || [];
    },
  });

  if (isLoading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cash-Up History</h2>
      {cashUps?.length ? (
        cashUps.map((cashUp) => (
          <div key={cashUp.id} className="p-2 border-b">
            <p className="font-medium">
              Cash-Up #{cashUp.id.slice(0, 8)} - {new Date(cashUp.created_at).toLocaleString()}
            </p>
            <p>Actual: R{cashUp.actual_cash.toFixed(2)}</p>
            <p>Expected: R{cashUp.expected_cash.toFixed(2)}</p>
            <p>Discrepancy: R{(cashUp.actual_cash - cashUp.expected_cash).toFixed(2)}</p>
          </div>
        ))
      ) : (
        <p>No cash-ups found.</p>
      )}
    </div>
  );
};

export default CashUpHistory;