import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  Plus,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Clock,
  Tag,
  Download,
  Share2,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Upload,
  Link,
  QrCode,
  Bell,
  Mail,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface Event {
  id: string;
  title: string;
  description: string;
  category: 'Workshop' | 'Seminar' | 'Competition' | 'Conference' | 'Social' | 'Training';
  date: string;
  time: string;
  duration: string;
  venue: string;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  capacity: number;
  registered: number;
  waitlist: number;
  price: number;
  tags: string[];
  image?: string;
  registrationDeadline: string;
  isFeatured: boolean;
  requiresApproval: boolean;
  hasCertificate: boolean;
}

const EventsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'calendar'>('grid');
  const [dateRange, setDateRange] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'registered' | 'capacity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const eventsPerPage = 9;

  // Mock data - In real app, fetch from API
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Web Development Bootcamp',
      description: 'Intensive 3-day bootcamp covering modern web technologies',
      category: 'Workshop',
      date: '2024-01-20',
      time: '10:00 AM',
      duration: '3 days',
      venue: 'CS Lab, Block A',
      organizer: 'Arjun Sharma',
      status: 'upcoming',
      capacity: 50,
      registered: 42,
      waitlist: 8,
      price: 0,
      tags: ['web', 'react', 'nodejs', 'beginner'],
      registrationDeadline: '2024-01-18',
      isFeatured: true,
      requiresApproval: false,
      hasCertificate: true,
    },
    {
      id: '2',
      title: 'Annual Tech Conference',
      description: 'Largest tech gathering of the year with industry experts',
      category: 'Conference',
      date: '2024-01-25',
      time: '9:00 AM',
      duration: '1 day',
      venue: 'Main Auditorium',
      organizer: 'ISTE Executive Team',
      status: 'upcoming',
      capacity: 300,
      registered: 278,
      waitlist: 25,
      price: 100,
      tags: ['conference', 'networking', 'keynote'],
      registrationDeadline: '2024-01-22',
      isFeatured: true,
      requiresApproval: true,
      hasCertificate: true,
    },
    {
      id: '3',
      title: 'AI & ML Workshop',
      description: 'Hands-on workshop on machine learning fundamentals',
      category: 'Workshop',
      date: '2024-01-15',
      time: '2:00 PM',
      duration: '2 days',
      venue: 'AI Lab, Block B',
      organizer: 'Dr. Vikram Singh',
      status: 'ongoing',
      capacity: 40,
      registered: 40,
      waitlist: 12,
      price: 50,
      tags: ['ai', 'ml', 'python', 'intermediate'],
      registrationDeadline: '2024-01-13',
      isFeatured: true,
      requiresApproval: true,
      hasCertificate: true,
    },
    {
      id: '4',
      title: 'Hackathon 2024',
      description: '24-hour coding competition with exciting prizes',
      category: 'Competition',
      date: '2024-02-10',
      time: '9:00 AM',
      duration: '24 hours',
      venue: 'Innovation Center',
      organizer: 'Rohan Desai',
      status: 'upcoming',
      capacity: 100,
      registered: 85,
      waitlist: 15,
      price: 0,
      tags: ['hackathon', 'coding', 'competition'],
      registrationDeadline: '2024-02-05',
      isFeatured: false,
      requiresApproval: true,
      hasCertificate: true,
    },
    {
      id: '5',
      title: 'Career Guidance Seminar',
      description: 'Expert insights on career paths in tech industry',
      category: 'Seminar',
      date: '2024-01-12',
      time: '3:00 PM',
      duration: '3 hours',
      venue: 'Seminar Hall',
      organizer: 'Priya Patel',
      status: 'completed',
      capacity: 150,
      registered: 150,
      waitlist: 0,
      price: 0,
      tags: ['career', 'guidance', 'seminar'],
      registrationDeadline: '2024-01-10',
      isFeatured: false,
      requiresApproval: false,
      hasCertificate: false,
    },
    {
      id: '6',
      title: 'Cybersecurity Workshop',
      description: 'Learn about security best practices and tools',
      category: 'Workshop',
      date: '2024-01-30',
      time: '11:00 AM',
      duration: '1 day',
      venue: 'Security Lab',
      organizer: 'Karthik Menon',
      status: 'upcoming',
      capacity: 35,
      registered: 22,
      waitlist: 0,
      price: 25,
      tags: ['security', 'cyber', 'workshop'],
      registrationDeadline: '2024-01-28',
      isFeatured: false,
      requiresApproval: false,
      hasCertificate: true,
    },
    {
      id: '7',
      title: 'ISTE Annual Meet',
      description: 'Year-end celebration and award ceremony',
      category: 'Social',
      date: '2023-12-20',
      time: '6:00 PM',
      duration: '4 hours',
      venue: 'College Grounds',
      organizer: 'Meera Iyer',
      status: 'completed',
      capacity: 200,
      registered: 180,
      waitlist: 0,
      price: 0,
      tags: ['social', 'celebration', 'annual'],
      registrationDeadline: '2023-12-18',
      isFeatured: true,
      requiresApproval: false,
      hasCertificate: false,
    },
    {
      id: '8',
      title: 'Open Source Contribution',
      description: 'Learn how to contribute to open source projects',
      category: 'Training',
      date: '2024-02-05',
      time: '10:00 AM',
      duration: '2 days',
      venue: 'CS Lab, Block A',
      organizer: 'Arjun Sharma',
      status: 'upcoming',
      capacity: 45,
      registered: 31,
      waitlist: 5,
      price: 0,
      tags: ['opensource', 'git', 'github'],
      registrationDeadline: '2024-02-02',
      isFeatured: false,
      requiresApproval: false,
      hasCertificate: true,
    },
    {
      id: '9',
      title: 'IoT Workshop',
      description: 'Build your first IoT project with Arduino',
      category: 'Workshop',
      date: '2024-01-18',
      time: '2:00 PM',
      duration: '2 days',
      venue: 'Electronics Lab',
      organizer: 'Sneha Nair',
      status: 'cancelled',
      capacity: 30,
      registered: 18,
      waitlist: 0,
      price: 30,
      tags: ['iot', 'arduino', 'hardware'],
      registrationDeadline: '2024-01-16',
      isFeatured: false,
      requiresApproval: true,
      hasCertificate: true,
    },
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'workshop', label: 'Workshops' },
    { value: 'seminar', label: 'Seminars' },
    { value: 'competition', label: 'Competitions' },
    { value: 'conference', label: 'Conferences' },
    { value: 'social', label: 'Social Events' },
    { value: 'training', label: 'Training' },
  ];

  const filters = [
    { value: 'all', label: 'All Events', count: events.length },
    { value: 'upcoming', label: 'Upcoming', count: events.filter(e => e.status === 'upcoming').length },
    { value: 'ongoing', label: 'Ongoing', count: events.filter(e => e.status === 'ongoing').length },
    { value: 'completed', label: 'Completed', count: events.filter(e => e.status === 'completed').length },
    { value: 'cancelled', label: 'Cancelled', count: events.filter(e => e.status === 'cancelled').length },
    { value: 'featured', label: 'Featured', count: events.filter(e => e.isFeatured).length },
    { value: 'free', label: 'Free Events', count: events.filter(e => e.price === 0).length },
  ];

  // Calculate statistics
  const stats = {
    total: events.length,
    upcoming: events.filter(e => e.status === 'upcoming').length,
    ongoing: events.filter(e => e.status === 'ongoing').length,
    completed: events.filter(e => e.status === 'completed').length,
    totalCapacity: events.reduce((sum, e) => sum + e.capacity, 0),
    totalRegistered: events.reduce((sum, e) => sum + e.registered, 0),
    totalRevenue: events.filter(e => e.status === 'completed').reduce((sum, e) => sum + (e.price * e.registered), 0),
    attendanceRate: Math.round((events.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.registered, 0) / 
      events.filter(e => e.status === 'completed').reduce((sum, e) => sum + e.capacity, 0)) * 100) || 0,
  };

  // Filter and sort events
  const filteredEvents = events
    .filter(event => {
      const matchesSearch = searchQuery === '' || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'upcoming' && event.status === 'upcoming') ||
        (selectedFilter === 'ongoing' && event.status === 'ongoing') ||
        (selectedFilter === 'completed' && event.status === 'completed') ||
        (selectedFilter === 'cancelled' && event.status === 'cancelled') ||
        (selectedFilter === 'featured' && event.isFeatured) ||
        (selectedFilter === 'free' && event.price === 0);
      
      const matchesCategory = selectedCategory === 'all' || 
        event.category.toLowerCase() === selectedCategory.toLowerCase();
      
      // Date range filtering
      const eventDate = new Date(event.date);
      const now = new Date();
      let matchesDateRange = true;
      
      if (dateRange === 'week') {
        const weekFromNow = new Date(now);
        weekFromNow.setDate(now.getDate() + 7);
        matchesDateRange = eventDate >= now && eventDate <= weekFromNow;
      } else if (dateRange === 'month') {
        const monthFromNow = new Date(now);
        monthFromNow.setMonth(now.getMonth() + 1);
        matchesDateRange = eventDate >= now && eventDate <= monthFromNow;
      } else if (dateRange === 'quarter') {
        const quarterFromNow = new Date(now);
        quarterFromNow.setMonth(now.getMonth() + 3);
        matchesDateRange = eventDate >= now && eventDate <= quarterFromNow;
      }
      
      return matchesSearch && matchesFilter && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'date': 
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'registered':
          aValue = a.registered;
          bValue = b.registered;
          break;
        case 'capacity':
          aValue = a.capacity;
          bValue = b.capacity;
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'upcoming': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'ongoing': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'completed': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      case 'cancelled': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Workshop': return 'bg-purple-500/15 text-purple-400';
      case 'Seminar': return 'bg-blue-500/15 text-blue-400';
      case 'Competition': return 'bg-amber-500/15 text-amber-400';
      case 'Conference': return 'bg-emerald-500/15 text-emerald-400';
      case 'Social': return 'bg-pink-500/15 text-pink-400';
      case 'Training': return 'bg-indigo-500/15 text-indigo-400';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRegistrationProgress = (registered: number, capacity: number) => {
    return Math.round((registered / capacity) * 100);
  };

  const handleSelectEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(id => id !== eventId)
        : [...prev, eventId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === currentEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(currentEvents.map(e => e.id));
    }
  };

  const handleBulkAction = (action: string) => {
    setIsLoading(true);
    console.log(`Bulk ${action} for events:`, selectedEvents);
    
    // Simulate API call
    setTimeout(() => {
      if (action === 'publish') {
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: 'upcoming' as const }
            : event
        ));
      } else if (action === 'cancel') {
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, status: 'cancelled' as const }
            : event
        ));
      } else if (action === 'delete') {
        setEvents(prev => prev.filter(event => !selectedEvents.includes(event.id)));
        setSelectedEvents([]);
      } else if (action === 'feature') {
        setEvents(prev => prev.map(event => 
          selectedEvents.includes(event.id) 
            ? { ...event, isFeatured: true }
            : event
        ));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    setIsLoading(true);
    console.log(`Exporting events as ${format}...`);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleCreateEvent = () => {
    // Open create event modal
    console.log('Open create event modal');
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Event Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create, manage, and track all ISTE events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => console.log('Open analytics')}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button className="gap-2" onClick={handleCreateEvent}>
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold mt-1">{stats.upcoming}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Registered</p>
                <p className="text-2xl font-bold mt-1">{stats.totalRegistered}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Users className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                <p className="text-2xl font-bold mt-1">{stats.totalCapacity}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Users className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance</p>
                <p className="text-2xl font-bold mt-1">{stats.attendanceRate}%</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <CheckCircle className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <Progress value={stats.attendanceRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold mt-1">₹{stats.totalRevenue}</p>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10">
                <Tag className="h-5 w-5 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Filters & Controls</CardTitle>
              <CardDescription>Refine event list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Range */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Date Range</Label>
                <Select value={dateRange} onValueChange={(value) => setDateRange(value as 'all' | 'week' | 'month' | 'quarter')}>
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="week">Next 7 Days</SelectItem>
                    <SelectItem value="month">Next 30 Days</SelectItem>
                    <SelectItem value="quarter">Next 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Event Status</Label>
                <div className="space-y-2">
                  {filters.slice(1, 5).map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setSelectedFilter(filter.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedFilter === filter.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
                      )}
                    >
                      <span>{filter.label}</span>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Category Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Toggle Filters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Featured Only</Label>
                  <Switch 
                    checked={selectedFilter === 'featured'}
                    onCheckedChange={(checked) => setSelectedFilter(checked ? 'featured' : 'all')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Free Events Only</Label>
                  <Switch 
                    checked={selectedFilter === 'free'}
                    onCheckedChange={(checked) => setSelectedFilter(checked ? 'free' : 'all')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Certification</Label>
                  <Switch />
                </div>
              </div>

              <Separator />

              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedCategory('all');
                  setDateRange('all');
                }}
              >
                <Filter className="h-4 w-4" />
                Clear All Filters
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Upload className="h-4 w-4" />
                Import Events
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Bell className="h-4 w-4" />
                Send Reminders
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Email Attendees
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <QrCode className="h-4 w-4" />
                Generate QR Codes
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Events</CardTitle>
                  <CardDescription>
                    {filteredEvents.length} events found • Sort by: {sortBy} ({sortOrder})
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search events..."
                      className="pl-10 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex border border-white/10 rounded-lg">
                    <button
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "p-2 rounded-l-lg transition-colors",
                        viewMode === 'list' 
                          ? "bg-white/[0.08] text-white" 
                          : "text-muted-foreground hover:bg-white/[0.03]"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 transition-colors",
                        viewMode === 'grid' 
                          ? "bg-white/[0.08] text-white" 
                          : "text-muted-foreground hover:bg-white/[0.03]"
                      )}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('calendar')}
                      className={cn(
                        "p-2 rounded-r-lg transition-colors",
                        viewMode === 'calendar' 
                          ? "bg-white/[0.08] text-white" 
                          : "text-muted-foreground hover:bg-white/[0.03]"
                      )}
                    >
                      <CalendarIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Bulk Actions Bar */}
            {selectedEvents.length > 0 && (
              <div className="px-6 py-3 bg-primary/5 border-y border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedEvents.length} event{selectedEvents.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('publish')}
                    >
                      <CheckCircle className="h-3 w-3" />
                      Publish
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('feature')}
                    >
                      <Tag className="h-3 w-3" />
                      Feature
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('cancel')}
                    >
                      <XCircle className="h-3 w-3" />
                      Cancel
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-500 hover:text-red-600"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedEvents([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              {viewMode === 'list' ? (
                // List View
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left p-4">
                          <input
                            type="checkbox"
                            checked={selectedEvents.length === currentEvents.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded border-white/20"
                          />
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => handleSort('title')}
                        >
                          <div className="flex items-center gap-1">
                            Event
                            {sortBy === 'title' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => handleSort('date')}
                        >
                          <div className="flex items-center gap-1">
                            Date & Time
                            {sortBy === 'date' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => handleSort('registered')}
                        >
                          Registration
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentEvents.map((event) => (
                        <tr 
                          key={event.id} 
                          className={cn(
                            "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
                            selectedEvents.includes(event.id) && "bg-primary/5"
                          )}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedEvents.includes(event.id)}
                              onChange={() => handleSelectEvent(event.id)}
                              className="h-4 w-4 rounded border-white/20"
                            />
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium">{event.title}</p>
                                {event.isFeatured && (
                                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                                    Featured
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Tag className="h-3 w-3" />
                                <span className={cn("px-2 py-0.5 rounded text-xs", getCategoryColor(event.category))}>
                                  {event.category}
                                </span>
                                <MapPin className="h-3 w-3 ml-2" />
                                <span>{event.venue}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <CalendarIcon className="h-3 w-3" />
                                {formatDate(event.date)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {event.time} • {event.duration}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>{event.registered} / {event.capacity}</span>
                                <span>{getRegistrationProgress(event.registered, event.capacity)}%</span>
                              </div>
                              <Progress 
                                value={getRegistrationProgress(event.registered, event.capacity)} 
                                className={cn(
                                  "h-1.5",
                                  getRegistrationProgress(event.registered, event.capacity) >= 90 
                                    ? "bg-emerald-500" 
                                    : getRegistrationProgress(event.registered, event.capacity) >= 50
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                )}
                              />
                              {event.waitlist > 0 && (
                                <div className="text-xs text-amber-500">
                                  +{event.waitlist} on waitlist
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(event.status))}>
                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs">
                                {event.hasCertificate && (
                                  <span className="text-emerald-500 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Certificate
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Edit2 className="h-4 w-4" />
                                  Edit Event
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Users className="h-4 w-4" />
                                  View Attendees
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Share2 className="h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Bell className="h-4 w-4" />
                                  Send Reminders
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Link className="h-4 w-4" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : viewMode === 'grid' ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                  {currentEvents.map((event) => (
                    <Card 
                      key={event.id} 
                      className={cn(
                        "border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent transition-all hover:border-primary/20 hover:shadow-lg group",
                        selectedEvents.includes(event.id) && "ring-2 ring-primary/50",
                        event.status === 'cancelled' && "opacity-60"
                      )}
                    >
                      <CardContent className="p-5">
                        {/* Event Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className={cn("text-xs", getCategoryColor(event.category))}>
                                {event.category}
                              </Badge>
                              {event.isFeatured && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs">
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => handleSelectEvent(event.id)}
                            className="h-4 w-4 rounded border-white/20"
                          />
                        </div>

                        {/* Event Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{event.time} • {event.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>Organized by {event.organizer}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-white/[0.03] text-xs rounded border border-white/5"
                            >
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="px-2 py-1 bg-white/[0.03] text-xs rounded border border-white/5">
                              +{event.tags.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Stats & Status */}
                        <div className="space-y-3 mb-4 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Registration</p>
                              <p className="text-xs text-muted-foreground">
                                {event.registered} / {event.capacity} ({getRegistrationProgress(event.registered, event.capacity)}%)
                              </p>
                            </div>
                            <Badge variant="outline" className={cn("text-xs", getStatusColor(event.status))}>
                              {event.status}
                            </Badge>
                          </div>
                          <Progress 
                            value={getRegistrationProgress(event.registered, event.capacity)} 
                            className={cn(
                              "h-1.5",
                              getRegistrationProgress(event.registered, event.capacity) >= 90 
                                ? "bg-emerald-500" 
                                : getRegistrationProgress(event.registered, event.capacity) >= 50
                                ? "bg-amber-500"
                                : "bg-blue-500"
                            )}
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1 gap-2">
                            <Users className="h-3 w-3" />
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                // Calendar View Placeholder
                <div className="p-12 text-center">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-muted-foreground mb-6">
                    Calendar view would show events in a monthly/weekly calendar grid
                  </p>
                  <Button variant="outline" onClick={() => setViewMode('grid')}>
                    Switch to Grid View
                  </Button>
                </div>
              )}
            </CardContent>

            {/* Pagination */}
            {filteredEvents.length > 0 && (
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/5">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredEvents.length)} of {filteredEvents.length} events
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            )}

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <CardContent className="py-16 text-center">
                <div className="mx-auto max-w-md">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No events match "${searchQuery}". Try a different search term.`
                      : 'No events match your current filters.'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="mr-3"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedCategory('all');
                      setDateRange('all');
                    }}
                  >
                    Clear filters
                  </Button>
                  <Button onClick={handleCreateEvent}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;