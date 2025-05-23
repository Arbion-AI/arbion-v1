import React from 'react';
import { ExternalLink } from 'lucide-react';

const RecentTransactions: React.FC = () => {
  return (
    <div className="glass-card">
      <h2 className="text-lg font-medium mb-4">Recent Transactions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-text-secondary font-medium">Type</th>
              <th className="text-left py-2 text-text-secondary font-medium">Asset</th>
              <th className="text-right py-2 text-text-secondary font-medium">Amount</th>
              <th className="text-right py-2 text-text-secondary font-medium">Price</th>
              <th className="text-right py-2 text-text-secondary font-medium">Value</th>
              <th className="text-left py-2 text-text-secondary font-medium">Time</th>
              <th className="text-left py-2 text-text-secondary font-medium">Status</th>
              <th className="text-right py-2 text-text-secondary font-medium">TX</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} className="text-center py-8 text-text-secondary">
                No transactions available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-text-secondary">Showing 0 transactions</span>
        <button className="btn btn-outline text-xs">View All</button>
      </div>
    </div>
  );
};

export default RecentTransactions;