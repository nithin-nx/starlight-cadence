import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, TrendingDown, Plus, Calendar, FileCheck, Award, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface FinancialRecord {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  description: string | null;
  date: string;
  created_at: string;
}

const TreasureDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('finances');
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'income' as 'income' | 'expense',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const { data } = await supabase
      .from('financial_records')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setRecords(data as FinancialRecord[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('financial_records')
      .insert({
        title: formData.title,
        amount: parseFloat(formData.amount),
        type: formData.type,
        description: formData.description || null,
        date: formData.date,
        created_by: user?.id
      });

    if (error) {
      toast.error('Failed to add record');
    } else {
      toast.success('Record added');
      setFormData({
        title: '',
        amount: '',
        type: 'income',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      fetchRecords();
    }
  };

  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + Number(r.amount), 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + Number(r.amount), 0);
  const balance = totalIncome - totalExpense;

  const tabs = [
    { id: 'finances', label: 'Financial Records', icon: Wallet },
    { id: 'applications', label: 'Applications', icon: FileCheck },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-foreground">
            Treasurer <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">Financial Management Panel</p>
        </div>
        <Button variant="outline" onClick={signOut} className="gap-2">
          <LogOut size={18} />
          Sign Out
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl font-bold text-green-400">₹{totalIncome.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-xl font-bold text-red-400">₹{totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Wallet className="text-primary" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? 'text-primary' : 'text-red-400'}`}>
                ₹{balance.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'finances' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Financial Records</h2>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus size={18} />
                Add Record
              </Button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount (₹) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Type *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Add Record</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            )}

            {records.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No financial records yet</p>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div key={record.id} className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        record.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}>
                        {record.type === 'income' ? (
                          <TrendingUp className="text-green-400" size={18} />
                        ) : (
                          <TrendingDown className="text-red-400" size={18} />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{record.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${
                      record.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {record.type === 'income' ? '+' : '-'}₹{Number(record.amount).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Membership Applications</h2>
            <p className="text-muted-foreground text-center py-8">
              Access Execome dashboard features here...
            </p>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Manage Events</h2>
            <p className="text-muted-foreground text-center py-8">
              Access Execome dashboard features here...
            </p>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Issue Certificates</h2>
            <p className="text-muted-foreground text-center py-8">
              Access Execome dashboard features here...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TreasureDashboard;
