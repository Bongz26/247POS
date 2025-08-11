import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const CashUp: React.FC = () => {
  const [actualCash, setActualCash] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const { data: sales } = await supabase
        .from('sales')
        .select('total')
        .gte('created_at', startOfDay.toISOString());
      const expectedCash = sales?.reduce((sum, sale) => sum + sale.total, 0) || 0;

      await supabase.from('cash_ups').insert({
        actual_cash: parseFloat(actualCash),
        expected_cash: expectedCash,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash_ups'] });
      setActualCash('');
      alert('Cash-up submitted successfully');
    },
    onError: (error: any) => alert(error.message),
  });

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Cash Up</h2>
      <input
        type="number"
        value={actualCash}
        onChange={(e) => setActualCash(e.target.value)}
        placeholder="Actual Cash in Drawer (R)"
        step="0.01"
        className="p-2 border rounded w-full mb-2"
      />
      <button
        onClick={() => mutation.mutate()}
        className="bg-blue-500 text-white p-2 rounded w-full"
        disabled={mutation.isPending || !actualCash}
      >
        {mutation.isPending ? 'Submitting...' : 'Submit Cash Up'}
      </button>
    </div>
  );
};

export default CashUp;
