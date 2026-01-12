import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, Award, FileCheck, Plus, Edit, Trash2, Check, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface MembershipApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  year_of_study: string | null;
  reason: string | null;
  status: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  is_upcoming: boolean;
}

const ExecomeDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    is_upcoming: true
  });

  useEffect(() => {
    fetchApplications();
    fetchEvents();
  }, []);

  const fetchApplications = async () => {
    const { data } = await supabase
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setApplications(data);
  };

  const fetchEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (data) setEvents(data);
  };

  const handleApplicationAction = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('membership_applications')
      .update({ 
        status, 
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update application');
    } else {
      toast.success(`Application ${status}`);
      fetchApplications();
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(eventForm)
        .eq('id', editingEvent.id);

      if (error) {
        toast.error('Failed to update event');
      } else {
        toast.success('Event updated');
        resetEventForm();
        fetchEvents();
      }
    } else {
      const { error } = await supabase
        .from('events')
        .insert({ ...eventForm, created_by: user?.id });

      if (error) {
        toast.error('Failed to create event');
      } else {
        toast.success('Event created');
        resetEventForm();
        fetchEvents();
      }
    }
  };

  const resetEventForm = () => {
    setEventForm({ title: '', description: '', date: '', location: '', is_upcoming: true });
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const startEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description || '',
      date: event.date.slice(0, 16),
      location: event.location || '',
      is_upcoming: event.is_upcoming
    });
    setShowEventForm(true);
  };

  const tabs = [
    { id: 'applications', label: 'Membership Applications', icon: FileCheck },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'certificates', label: 'Issue Certificates', icon: Award },
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-foreground">
            Execome <span className="text-primary">Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">Executive Committee Panel</p>
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
        {activeTab === 'applications' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Membership Applications</h2>
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No applications yet</p>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{app.full_name}</h3>
                        <p className="text-sm text-muted-foreground">{app.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {app.department} | {app.year_of_study}
                        </p>
                        {app.reason && (
                          <p className="text-sm mt-2 text-foreground">{app.reason}</p>
                        )}
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                          app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplicationAction(app.id, 'approved')}
                            className="text-green-400 border-green-400"
                          >
                            <Check size={16} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApplicationAction(app.id, 'rejected')}
                            className="text-red-400 border-red-400"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Manage Events</h2>
              <Button onClick={() => setShowEventForm(true)} className="gap-2">
                <Plus size={18} />
                Add Event
              </Button>
            </div>

            {showEventForm && (
              <form onSubmit={handleEventSubmit} className="mb-6 p-4 bg-muted/50 rounded-lg space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Event Title *</Label>
                    <Input
                      id="title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date & Time *</Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      type="checkbox"
                      id="is_upcoming"
                      checked={eventForm.is_upcoming}
                      onChange={(e) => setEventForm({ ...eventForm, is_upcoming: e.target.checked })}
                    />
                    <Label htmlFor="is_upcoming">Upcoming Event</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{editingEvent ? 'Update' : 'Create'} Event</Button>
                  <Button type="button" variant="outline" onClick={resetEventForm}>Cancel</Button>
                </div>
              </form>
            )}

            {events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No events yet</p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="p-4 bg-muted/50 rounded-lg flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleString()}
                      </p>
                      {event.location && (
                        <p className="text-sm text-muted-foreground">{event.location}</p>
                      )}
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                        event.is_upcoming ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                      }`}>
                        {event.is_upcoming ? 'Upcoming' : 'Past'}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => startEditEvent(event)}>
                      <Edit size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Issue Certificates</h2>
            <p className="text-muted-foreground text-center py-8">
              Certificate management coming soon...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ExecomeDashboard;
