import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Award, 
  FileCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Download,
  Eye,
  Users,
  Clock,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import DashboardLayout from '@/layouts/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';

interface MembershipApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  year_of_study: string | null;
  status: string;
  created_at: string;
  payment_proof_url?: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  is_upcoming: boolean;
  event_type?: string;
}

const ExecomDashboard: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    event_type: 'workshop',
    is_upcoming: true
  });

  useEffect(() => {
    fetchApplications();
    fetchEvents();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('membership_applications')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load applications');
      console.error(error);
    } else {
      setApplications(data || []);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      toast.error('Failed to load events');
      console.error(error);
    } else {
      setEvents(data || []);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredEvents = events.filter(event => {
    if (eventFilter === 'all') return true;
    if (eventFilter === 'upcoming') return event.is_upcoming;
    if (eventFilter === 'past') return !event.is_upcoming;
    return event.event_type === eventFilter;
  });

  const upcomingEvents = events.filter(event => event.is_upcoming).slice(0, 3);
  const pendingApplications = applications.filter(app => app.status === 'pending').length;

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
      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'}`);
      fetchApplications();
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventForm)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('Event updated successfully');
      } else {
        const { error } = await supabase
          .from('events')
          .insert({ ...eventForm, created_by: user?.id });

        if (error) throw error;
        toast.success('Event created successfully');
      }
      
      resetEventForm();
      fetchEvents();
    } catch (error) {
      toast.error('Failed to save event');
      console.error(error);
    }
  };

  const resetEventForm = () => {
    setEventForm({ 
      title: '', 
      description: '', 
      date: '', 
      location: '', 
      event_type: 'workshop',
      is_upcoming: true 
    });
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
      event_type: event.event_type,
      is_upcoming: event.is_upcoming
    });
    setShowEventForm(true);
  };

  const deleteEvent = async (id: string) => {
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

  const viewPaymentProof = async (url: string | null) => {
    if (!url) {
      toast.error('No payment proof available');
      return;
    }
    
    const { data } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(url);
    
    window.open(data.publicUrl, '_blank');
  };

  return (
    <DashboardLayout allowedRoles={["execom"]}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900/20 to-background">
        {/* Header */}
        <div className="px-6 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage ISTE operations and memberships</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                          id="title"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Date & Time *</Label>
                        <Input
                          id="date"
                          type="datetime-local"
                          value={eventForm.date}
                          onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={eventForm.location}
                          onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          placeholder="Online / GEC Idukki"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event_type">Event Type</Label>
                        <select
                          id="event_type"
                          className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white"
                          value={eventForm.event_type}
                          onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}
                        >
                          <option value="workshop">Workshop</option>
                          <option value="seminar">Seminar</option>
                          <option value="competition">Competition</option>
                          <option value="meetup">Meetup</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        rows={4}
                        placeholder="Brief description of the event..."
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="is_upcoming"
                          checked={eventForm.is_upcoming}
                          onChange={(e) => setEventForm({ ...eventForm, is_upcoming: e.target.checked })}
                          className="rounded border-gray-600"
                        />
                        <Label htmlFor="is_upcoming" className="cursor-pointer">Upcoming Event</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={resetEventForm}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingEvent ? 'Update' : 'Create'} Event
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Pending Applications</p>
                    <p className="text-3xl font-bold mt-2">{pendingApplications}</p>
                  </div>
                  <div className="p-3 bg-primary/20 rounded-full">
                    <FileCheck className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Upcoming Events</p>
                    <p className="text-3xl font-bold mt-2">{upcomingEvents.length}</p>
                  </div>
                  <div className="p-3 bg-cyan-500/20 rounded-full">
                    <Calendar className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Members</p>
                    <p className="text-3xl font-bold mt-2">{applications.filter(a => a.status === 'approved').length}</p>
                  </div>
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="applications" className="space-y-6">
            <TabsList className="bg-gray-800/50 p-1">
              <TabsTrigger value="applications" className="data-[state=active]:bg-primary">
                <FileCheck className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-cyan-500">
                <Calendar className="w-4 h-4 mr-2" />
                Events
              </TabsTrigger>
              <TabsTrigger value="certificates" className="data-[state=active]:bg-purple-500">
                <Award className="w-4 h-4 mr-2" />
                Certificates
              </TabsTrigger>
            </TabsList>

            <TabsContent value="applications">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle>Membership Applications</CardTitle>
                      <CardDescription>Review and manage new membership requests</CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search applicants..."
                          className="pl-9 bg-gray-800/50 border-gray-700"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <select
                        className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-gray-800 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead>Applicant</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Applied On</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredApplications.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                              No applications found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredApplications.map((app) => (
                            <TableRow key={app.id} className="border-gray-800 hover:bg-gray-800/30">
                              <TableCell>
                                <div>
                                  <p className="font-medium">{app.full_name}</p>
                                  <p className="text-sm text-gray-400">{app.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">{app.phone || 'N/A'}</p>
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">
                                  {app.department || 'N/A'} - {app.year_of_study || 'N/A'}
                                </p>
                              </TableCell>
                              <TableCell>
                                <StatusBadge status={app.status} />
                              </TableCell>
                              <TableCell>
                                <p className="text-sm">
                                  {new Date(app.created_at).toLocaleDateString()}
                                </p>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end gap-2">
                                  {app.payment_proof_url && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => viewPaymentProof(app.payment_proof_url)}
                                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {app.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleApplicationAction(app.id, 'approved')}
                                        className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleApplicationAction(app.id, 'rejected')}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle>Event Management</CardTitle>
                      <CardDescription>Create and manage ISTE events</CardDescription>
                    </div>
                    <select
                      className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-sm text-white"
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                    >
                      <option value="all">All Events</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                      <option value="workshop">Workshops</option>
                      <option value="seminar">Seminars</option>
                      <option value="competition">Competitions</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredEvents.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No events found</p>
                      <Button 
                        onClick={() => setShowEventForm(true)}
                        className="mt-4"
                      >
                        Create Your First Event
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map((event) => (
                        <Card key={event.id} className="bg-gray-800/30 border-gray-700 hover:border-primary/30 transition-colors">
                          <CardContent className="pt-6">
                            <div className="flex justify-between items-start mb-4">
                              <Badge className={
                                event.is_upcoming 
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-gray-700 text-gray-400 border-gray-600"
                              }>
                                {event.is_upcoming ? 'Upcoming' : 'Past'}
                              </Badge>
                              <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                                {event.event_type}
                              </Badge>
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                            
                            {event.description && (
                              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>
                            )}
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-300">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </div>
                              
                              {event.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700/50">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => startEditEvent(event)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => deleteEvent(event.id)}
                                  className="text-gray-400 hover:text-red-400"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => {/* View participants */}}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Management</CardTitle>
                  <CardDescription>Generate and issue certificates for events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Award className="w-16 h-16 text-primary/50 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold mb-2">Certificate System</h3>
                    <p className="text-gray-400 max-w-md mx-auto mb-6">
                      Generate and manage certificates for event participants. 
                      This feature will be available soon.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-primary text-sm">Coming Soon</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ExecomDashboard;