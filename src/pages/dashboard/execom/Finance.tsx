import React, { useState, useEffect } from 'react';
import {
  Search,
  Download,
  Eye,
  FileText,
  Calendar,
  DollarSign,
  User,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

type StatusValue = 'all' | 'verified' | 'pending';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  treasurer: string;
  receiptUrl?: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  pendingTransactions: number;
}

const StatusFilter: React.FC<{
  value: StatusValue;
  onChange: (v: StatusValue) => void;
}> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const options: { label: string; value: StatusValue }[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Verified', value: 'verified' },
    { label: 'Pending', value: 'pending' },
  ];

  return (
    <div className="relative min-w-[160px]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-white hover:border-primary/40 transition"
      >
        {options.find(o => o.value === value)?.label}
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-xl bg-[#0c0c0e] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition
                ${
                  value === opt.value
                    ? 'bg-primary/20 text-primary'
                    : 'text-slate-300 hover:bg-white/5'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const FinanceView: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: '2026-01-14',
      description: 'Event Sponsorship - TechCorp',
      category: 'Sponsorship',
      amount: 5000,
      type: 'income',
      treasurer: 'Alex Johnson',
      receiptUrl: '#',
      status: 'verified'
    },
    {
      id: '2',
      date: '2026-01-13',
      description: 'Venue Booking - Conference Hall',
      category: 'Event Expenses',
      amount: 1500,
      type: 'expense',
      treasurer: 'Alex Johnson',
      receiptUrl: '#',
      status: 'verified'
    },
    {
      id: '3',
      date: '2026-01-12',
      description: 'Membership Fees Collection',
      category: 'Membership',
      amount: 1200,
      type: 'income',
      treasurer: 'Sam Wilson',
      receiptUrl: '#',
      status: 'pending'
    },
    {
      id: '4',
      date: '2026-01-11',
      description: 'Office Supplies Purchase',
      category: 'Operational',
      amount: 450,
      type: 'expense',
      treasurer: 'Alex Johnson',
      receiptUrl: '#',
      status: 'verified'
    },
    {
      id: '5',
      date: '2026-01-10',
      description: 'Workshop Registration Fees',
      category: 'Event Income',
      amount: 3200,
      type: 'income',
      treasurer: 'Maria Garcia',
      receiptUrl: '#',
      status: 'verified'
    }
  ]);

  const [summary, setSummary] = useState<FinancialSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    pendingTransactions: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterStatus, setFilterStatus] = useState<StatusValue>('all');
  const [sortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

    setSummary({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      pendingTransactions
    });
  }, [transactions]);

  const filteredTransactions = transactions
    .filter(t =>
      (t.description + t.category).toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || t.type === filterType) &&
      (filterStatus === 'all' || t.status === filterStatus)
    )
    .sort((a, b) =>
      sortOrder === 'desc'
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const getStatusBadge = (status: Transaction['status']) => (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
      ${
        status === 'verified'
          ? 'bg-emerald-500/15 text-emerald-400'
          : status === 'pending'
          ? 'bg-yellow-500/15 text-yellow-400'
          : 'bg-red-500/15 text-red-400'
      }`}
    >
      {status.toUpperCase()}
    </span>
  );

  return (
    <div className="space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Finance Overview</h1>
        <p className="text-sm text-slate-400 mt-2">
          Track income, expenses, and financial health of the organization
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Balance', value: summary.balance, icon: DollarSign, color: 'text-blue-400', format: 'currency' as const },
          { label: 'Income', value: summary.totalIncome, icon: TrendingUp, color: 'text-emerald-400', format: 'currency' as const },
          { label: 'Expenses', value: summary.totalExpenses, icon: TrendingDown, color: 'text-red-400', format: 'currency' as const },
          { label: 'Pending', value: summary.pendingTransactions, icon: FileText, color: 'text-yellow-400', format: 'number' as const }
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-white/[0.03] border border-white/5 p-6 backdrop-blur shadow-xl"
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-400">{item.label}</p>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <p className={`mt-3 text-2xl font-bold ${item.color}`}>
              {item.format === 'currency' ? formatCurrency(item.value as number) : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            className="w-full bg-black/40 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/40"
            placeholder="Search transactions"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <StatusFilter value={filterStatus} onChange={(v) => setFilterStatus(v)} />

        <button
          onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
          className="flex items-center gap-2 bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm"
        >
          Sort Date {sortOrder === 'desc' ? <ChevronDown /> : <ChevronUp />}
        </button>

        <button className="ml-auto flex items-center gap-2 bg-primary/20 text-primary rounded-lg px-4 py-2 text-sm hover:bg-primary/30">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl overflow-hidden border border-white/5 bg-white/[0.02]">
        <table className="w-full text-sm">
          <thead className="bg-black/40 text-slate-400 uppercase text-xs">
            <tr>
              {['Date', 'Description', 'Category', 'Type', 'Amount', 'Treasurer', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-4 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(t => (
              <tr
                key={t.id}
                className="border-t border-white/5 hover:bg-white/[0.03] transition"
              >
                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-medium">{t.description}</td>
                <td className="px-6 py-4">{t.category}</td>
                <td className="px-6 py-4">{t.type}</td>
                <td className={`px-6 py-4 font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(t.amount)}
                </td>
                <td className="px-6 py-4">{t.treasurer}</td>
                <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                <td className="px-6 py-4 text-right">
                  <MoreVertical className="h-4 w-4 text-slate-400 hover:text-white cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinanceView;