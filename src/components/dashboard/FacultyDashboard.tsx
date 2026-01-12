import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Wallet, Calendar, Trash2, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UserWithRole {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    full_name: string | null;
    email: string | null;
  } | null;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

interface FinancialRecord {
  id: string;
  title: string;
  amount: number;
  type: string;
  date: string;
}

const FacultyDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [finances, setFinances] = useState<FinancialRecord[]>([]);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState<'public' | 'execome' | 'treasure' | 'faculty'>('public');

  useEffect(() => {
    fetchUsers();
    fetchEvents();
    fetchFinances();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('user_roles')
      .select('id, user_id, role')
      .order('role', { ascending: true });
    
    if (data) {
      // Fetch profiles separately
      const userIds = data.map(u => u.user_id);
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .in('user_id', userIds);
      
      const usersWithProfiles = data.map(u => ({
        ...u,
        profiles: profilesData?.find(p => p.user_id === u.user_id) || null
      }));
      setUsers(usersWithProfiles as UserWithRole[]);
    }
  };

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('id, title, date')
      .order('date', { ascending: false });
    
    if (data) setEvents(data);
  };

  const fetchFinances = async () => {
    const { data } = await supabase
      .from('financial_records')
      .select('id, title, amount, type, date')
      .order('date', { ascending: false })
      .limit(20);
    
    if (data) setFinances(data as FinancialRecord[]);
  };

  const handleAssignRole = async () => {
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    // Check if user already has this role
    const existingRole = users.find(u => u.user_id === selectedUserId && u.role === selectedRole);
    if (existingRole) {
      toast.error('User already has this role');
      return;
    }

    // Update or insert role
    const { error } = await supabase
      .from('user_roles')
      .upsert({
        user_id: selectedUserId,
        role: selectedRole,
        assigned_by: user?.id,
        assigned_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,role'
      });

    if (error) {
      toast.error('Failed to assign role');
    } else {
      toast.success('Role assigned successfully');
      setShowRoleForm(false);
      setSelectedUserId('');
      fetchUsers();
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete event');
    } else {
      toast.success('Event deleted');
      fetchEvents();
    }
  };

  const handleDeleteFinance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    const { error } = await supabase
      .from('financial_records')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete record');
    } else {
      toast.success('Record deleted');
      fetchFinances();
    }
  };

  const tabs = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'roles', label: 'Role Assignment', icon: Shield },
    { id: 'events', label: 'All Events', icon: Calendar },
    { id: 'finances', label: 'All Finances', icon: Wallet },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'faculty': return 'bg-purple-500/20 text-purple-400';
      case 'treasure': return 'bg-yellow-500/20 text-yellow-400';
      case 'execome': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-foreground">
            Faculty <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">Full Administrative Access</p>
        </div>
        <Button variant="outline" onClick={signOut} className="gap-2">
          <LogOut size={18} />
          Sign Out
        </Button>
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
        {activeTab === 'users' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">All Users</h2>
            {users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users found</p>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{u.profiles?.full_name || 'Unknown'}</h3>
                      <p className="text-sm text-muted-foreground">{u.profiles?.email}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(u.role)}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Assign Roles</h2>
              <Button onClick={() => setShowRoleForm(true)} className="gap-2">
                <UserPlus size={18} />
                Assign Role
              </Button>
            </div>

            {showRoleForm && (
              <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user">Select User</Label>
                    <select
                      id="user"
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    >
                      <option value="">-- Select User --</option>
                      {users.map((u) => (
                        <option key={u.user_id} value={u.user_id}>
                          {u.profiles?.full_name || u.profiles?.email || u.user_id}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="role">Select Role</Label>
                    <select
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as any)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-md"
                    >
                      <option value="public">Public</option>
                      <option value="execome">Execome</option>
                      <option value="treasure">Treasure</option>
                      <option value="faculty">Faculty</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAssignRole}>Assign Role</Button>
                  <Button variant="outline" onClick={() => setShowRoleForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {users.map((u) => (
                <div key={u.id} className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{u.profiles?.full_name || 'Unknown'}</h3>
                    <p className="text-sm text-muted-foreground">{u.profiles?.email}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleBadgeColor(u.role)}`}>
                    {u.role.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">All Events (with Delete)</h2>
            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No events found</p>
            ) : (
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'finances' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">All Financial Records (with Delete)</h2>
            {finances.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No records found</p>
            ) : (
              <div className="space-y-3">
                {finances.map((record) => (
                  <div key={record.id} className="p-4 bg-muted/50 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{record.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()} • 
                        <span className={record.type === 'income' ? 'text-green-400' : 'text-red-400'}>
                          {' '}₹{Number(record.amount).toLocaleString()}
                        </span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteFinance(record.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FacultyDashboard;
