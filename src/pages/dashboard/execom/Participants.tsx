import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Users,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Download,
  Upload,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  QrCode,
  Check,
  X,
  Send,
  Printer,
  FileText,
  ExternalLink,
  Loader2,
  DownloadCloud,
  Tag,
  Award,
  MapPin
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  year: string;
  eventId: string;
  eventTitle: string;
  registrationDate: string;
  status: 'registered' | 'checked-in' | 'waitlisted' | 'cancelled' | 'no-show';
  checkInTime?: string;
  paymentStatus: 'paid' | 'pending' | 'free';
  amountPaid: number;
  paymentMethod?: string;
  certificateIssued: boolean;
  feedbackSubmitted: boolean;
  specialRequirements?: string;
  attendanceDuration?: string;
  seatNumber?: string;
  group?: string;
}

const ParticipantsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'registrationDate' | 'status' | 'department'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const participantsPerPage = 12;

  // Mock data - In real app, fetch from API
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Arjun Sharma',
      email: 'arjun.sharma@iste.gec.edu',
      phone: '+91 98765 43210',
      studentId: 'CS201',
      department: 'Computer Science & Engineering',
      year: '3rd Year',
      eventId: '1',
      eventTitle: 'Web Development Bootcamp',
      registrationDate: '2024-01-10 14:30',
      status: 'checked-in',
      checkInTime: '2024-01-20 09:45',
      paymentStatus: 'paid',
      amountPaid: 0,
      certificateIssued: true,
      feedbackSubmitted: true,
      attendanceDuration: 'Full',
      seatNumber: 'A12',
    },
    {
      id: '2',
      name: 'Priya Patel',
      email: 'priya.patel@iste.gec.edu',
      phone: '+91 87654 32109',
      studentId: 'EC202',
      department: 'Electronics & Communication',
      year: '2nd Year',
      eventId: '1',
      eventTitle: 'Web Development Bootcamp',
      registrationDate: '2024-01-11 10:15',
      status: 'checked-in',
      checkInTime: '2024-01-20 10:00',
      paymentStatus: 'paid',
      amountPaid: 0,
      certificateIssued: true,
      feedbackSubmitted: true,
      specialRequirements: 'Vegetarian meal',
      attendanceDuration: 'Full',
      seatNumber: 'A13',
    },
    {
      id: '3',
      name: 'Rohan Desai',
      email: 'rohan.desai@iste.gec.edu',
      phone: '+91 76543 21098',
      studentId: 'ME203',
      department: 'Mechanical Engineering',
      year: '4th Year',
      eventId: '2',
      eventTitle: 'Annual Tech Conference',
      registrationDate: '2024-01-15 11:20',
      status: 'registered',
      paymentStatus: 'paid',
      amountPaid: 100,
      paymentMethod: 'Online',
      certificateIssued: false,
      feedbackSubmitted: false,
      attendanceDuration: 'Partial',
      group: 'Team Alpha',
    },
    {
      id: '4',
      name: 'Sneha Nair',
      email: 'sneha.nair@iste.gec.edu',
      phone: '+91 65432 10987',
      studentId: 'CE204',
      department: 'Civil Engineering',
      year: '3rd Year',
      eventId: '3',
      eventTitle: 'AI & ML Workshop',
      registrationDate: '2024-01-12 16:45',
      status: 'waitlisted',
      paymentStatus: 'pending',
      amountPaid: 50,
      certificateIssued: false,
      feedbackSubmitted: false,
      specialRequirements: 'Wheelchair access',
    },
    {
      id: '5',
      name: 'Dr. Vikram Singh',
      email: 'vikram.singh@gec.edu',
      phone: '+91 54321 09876',
      studentId: 'FAC001',
      department: 'Computer Science & Engineering',
      year: 'Faculty',
      eventId: '2',
      eventTitle: 'Annual Tech Conference',
      registrationDate: '2024-01-10 09:00',
      status: 'checked-in',
      checkInTime: '2024-01-25 08:30',
      paymentStatus: 'free',
      amountPaid: 0,
      certificateIssued: true,
      feedbackSubmitted: true,
      attendanceDuration: 'Full',
      group: 'Faculty',
    },
    {
      id: '6',
      name: 'Ananya Reddy',
      email: 'ananya.reddy@iste.gec.edu',
      phone: '+91 43210 98765',
      studentId: 'EE205',
      department: 'Electrical Engineering',
      year: '1st Year',
      eventId: '1',
      eventTitle: 'Web Development Bootcamp',
      registrationDate: '2024-01-13 15:30',
      status: 'cancelled',
      paymentStatus: 'pending',
      amountPaid: 0,
      certificateIssued: false,
      feedbackSubmitted: false,
    },
    {
      id: '7',
      name: 'Karthik Menon',
      email: 'karthik.menon@alumni.gec.edu',
      phone: '+91 32109 87654',
      studentId: 'ALM001',
      department: 'Computer Science & Engineering',
      year: 'Alumni',
      eventId: '4',
      eventTitle: 'Hackathon 2024',
      registrationDate: '2024-01-20 12:00',
      status: 'registered',
      paymentStatus: 'paid',
      amountPaid: 0,
      certificateIssued: false,
      feedbackSubmitted: false,
      attendanceDuration: 'Full',
      group: 'Team Innovators',
    },
    {
      id: '8',
      name: 'Meera Iyer',
      email: 'meera.iyer@iste.gec.edu',
      phone: '+91 21098 76543',
      studentId: 'EC206',
      department: 'Electronics & Communication',
      year: '4th Year',
      eventId: '2',
      eventTitle: 'Annual Tech Conference',
      registrationDate: '2024-01-18 14:20',
      status: 'no-show',
      paymentStatus: 'paid',
      amountPaid: 100,
      paymentMethod: 'Cash',
      certificateIssued: false,
      feedbackSubmitted: false,
    },
    {
      id: '9',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@iste.gec.edu',
      phone: '+91 10987 65432',
      studentId: 'ME207',
      department: 'Mechanical Engineering',
      year: '3rd Year',
      eventId: '3',
      eventTitle: 'AI & ML Workshop',
      registrationDate: '2024-01-11 11:45',
      status: 'checked-in',
      checkInTime: '2024-01-15 13:50',
      paymentStatus: 'paid',
      amountPaid: 50,
      certificateIssued: true,
      feedbackSubmitted: true,
      attendanceDuration: 'Full',
      seatNumber: 'B05',
    },
    {
      id: '10',
      name: 'Sonia Gupta',
      email: 'sonia.gupta@iste.gec.edu',
      phone: '+91 98765 12340',
      studentId: 'CS208',
      department: 'Computer Science & Engineering',
      year: '2nd Year',
      eventId: '6',
      eventTitle: 'Cybersecurity Workshop',
      registrationDate: '2024-01-25 16:00',
      status: 'registered',
      paymentStatus: 'paid',
      amountPaid: 25,
      certificateIssued: false,
      feedbackSubmitted: false,
    },
  ]);

  const events = [
    { id: 'all', title: 'All Events' },
    { id: '1', title: 'Web Development Bootcamp' },
    { id: '2', title: 'Annual Tech Conference' },
    { id: '3', title: 'AI & ML Workshop' },
    { id: '4', title: 'Hackathon 2024' },
    { id: '5', title: 'Career Guidance Seminar' },
    { id: '6', title: 'Cybersecurity Workshop' },
    { id: '7', title: 'ISTE Annual Meet' },
    { id: '8', title: 'Open Source Contribution' },
    { id: '9', title: 'IoT Workshop' },
  ];

  const filters = [
    { value: 'all', label: 'All Participants', count: participants.length },
    { value: 'registered', label: 'Registered', count: participants.filter(p => p.status === 'registered').length },
    { value: 'checked-in', label: 'Checked-in', count: participants.filter(p => p.status === 'checked-in').length },
    { value: 'waitlisted', label: 'Waitlisted', count: participants.filter(p => p.status === 'waitlisted').length },
    { value: 'cancelled', label: 'Cancelled', count: participants.filter(p => p.status === 'cancelled').length },
    { value: 'no-show', label: 'No-show', count: participants.filter(p => p.status === 'no-show').length },
    { value: 'certificate-pending', label: 'Certificate Pending', count: participants.filter(p => !p.certificateIssued && p.status === 'checked-in').length },
    { value: 'payment-pending', label: 'Payment Pending', count: participants.filter(p => p.paymentStatus === 'pending').length },
  ];

  // Calculate statistics
  const stats = {
    total: participants.length,
    registered: participants.filter(p => p.status === 'registered').length,
    checkedIn: participants.filter(p => p.status === 'checked-in').length,
    waitlisted: participants.filter(p => p.status === 'waitlisted').length,
    cancelled: participants.filter(p => p.status === 'cancelled').length,
    noShow: participants.filter(p => p.status === 'no-show').length,
    paid: participants.filter(p => p.paymentStatus === 'paid').length,
    pendingPayment: participants.filter(p => p.paymentStatus === 'pending').length,
    certificateIssued: participants.filter(p => p.certificateIssued).length,
    feedbackSubmitted: participants.filter(p => p.feedbackSubmitted).length,
    totalRevenue: participants.reduce((sum, p) => sum + p.amountPaid, 0),
    attendanceRate: Math.round((participants.filter(p => p.status === 'checked-in').length / 
      participants.filter(p => ['registered', 'checked-in', 'waitlisted'].includes(p.status)).length) * 100) || 0,
  };

  // Filter and sort participants
  const filteredParticipants = participants
    .filter(participant => {
      const matchesSearch = searchQuery === '' || 
        participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        participant.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'registered' && participant.status === 'registered') ||
        (selectedFilter === 'checked-in' && participant.status === 'checked-in') ||
        (selectedFilter === 'waitlisted' && participant.status === 'waitlisted') ||
        (selectedFilter === 'cancelled' && participant.status === 'cancelled') ||
        (selectedFilter === 'no-show' && participant.status === 'no-show') ||
        (selectedFilter === 'certificate-pending' && !participant.certificateIssued && participant.status === 'checked-in') ||
        (selectedFilter === 'payment-pending' && participant.paymentStatus === 'pending');
      
      const matchesEvent = selectedEvent === 'all' || 
        participant.eventId === selectedEvent;
      
      return matchesSearch && matchesFilter && matchesEvent;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'name': 
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'registrationDate':
          aValue = new Date(a.registrationDate).getTime();
          bValue = new Date(b.registrationDate).getTime();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'department':
          aValue = a.department;
          bValue = b.department;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredParticipants.length / participantsPerPage);
  const startIndex = (currentPage - 1) * participantsPerPage;
  const endIndex = startIndex + participantsPerPage;
  const currentParticipants = filteredParticipants.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'registered': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'checked-in': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'waitlisted': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'cancelled': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'no-show': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getPaymentColor = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-emerald-500/15 text-emerald-400';
      case 'pending': return 'bg-amber-500/15 text-amber-400';
      case 'free': return 'bg-blue-500/15 text-blue-400';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectParticipant = (participantId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(participantId)
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleSelectAll = () => {
    if (selectedParticipants.length === currentParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(currentParticipants.map(p => p.id));
    }
  };

  const handleBulkAction = (action: string) => {
    setIsLoading(true);
    console.log(`Bulk ${action} for participants:`, selectedParticipants);
    
    // Simulate API call
    setTimeout(() => {
      if (action === 'check-in') {
        setParticipants(prev => prev.map(participant => 
          selectedParticipants.includes(participant.id) 
            ? { 
                ...participant, 
                status: 'checked-in' as const,
                checkInTime: new Date().toISOString()
              }
            : participant
        ));
      } else if (action === 'issue-certificate') {
        setParticipants(prev => prev.map(participant => 
          selectedParticipants.includes(participant.id) 
            ? { ...participant, certificateIssued: true }
            : participant
        ));
      } else if (action === 'send-email') {
        console.log('Sending email to selected participants');
      } else if (action === 'delete') {
        setParticipants(prev => prev.filter(participant => !selectedParticipants.includes(participant.id)));
        setSelectedParticipants([]);
      } else if (action === 'mark-paid') {
        setParticipants(prev => prev.map(participant => 
          selectedParticipants.includes(participant.id) 
            ? { ...participant, paymentStatus: 'paid' as const }
            : participant
        ));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (format: 'csv' | 'pdf' | 'excel') => {
    setIsLoading(true);
    console.log(`Exporting participants as ${format}...`);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleImport = () => {
    // Open import modal
    console.log('Open import participants modal');
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
            Participants Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage registrations, check-ins, and attendee data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleExport('csv')}
          >
            <DownloadCloud className="h-4 w-4" />
            Export
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleImport}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => console.log('Open analytics')}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button className="gap-2">
            <QrCode className="h-4 w-4" />
            Check-in
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Checked-in</p>
                <p className="text-2xl font-bold mt-1">{stats.checkedIn}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <Progress value={stats.attendanceRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Waitlisted</p>
                <p className="text-2xl font-bold mt-1">{stats.waitlisted}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
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

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                <p className="text-2xl font-bold mt-1">{stats.certificateIssued}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Award className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feedback</p>
                <p className="text-2xl font-bold mt-1">{stats.feedbackSubmitted}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-500" />
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
              <CardTitle className="text-lg">Filters & Actions</CardTitle>
              <CardDescription>Manage participants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Event Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Event</Label>
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    {events.map(event => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Status</Label>
                <div className="space-y-2">
                  {filters.slice(1, 6).map((filter) => (
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

              {/* Payment Status */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Payment Status</Label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedFilter('payment-pending')}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                      selectedFilter === 'payment-pending'
                        ? "bg-primary text-primary-foreground"
                        : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
                    )}
                  >
                    <span>Payment Pending</span>
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                      {stats.pendingPayment}
                    </span>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Quick Actions */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Actions</Label>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => handleBulkAction('check-in')}
                  >
                    <UserCheck className="h-4 w-4" />
                    Bulk Check-in
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => handleBulkAction('issue-certificate')}
                  >
                    <Award className="h-4 w-4" />
                    Issue Certificates
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => handleBulkAction('send-email')}
                  >
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => handleBulkAction('mark-paid')}
                  >
                    <Check className="h-4 w-4" />
                    Mark as Paid
                  </Button>
                </div>
              </div>

              <Separator />

              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedEvent('all');
                }}
              >
                <Filter className="h-4 w-4" />
                Clear All Filters
              </Button>
            </CardContent>
          </Card>

          {/* Registration Summary */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Registration Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Attendance Rate</span>
                <span className="text-sm font-medium">{stats.attendanceRate}%</span>
              </div>
              <Progress value={stats.attendanceRate} className="h-2" />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm">Certificate Rate</span>
                <span className="text-sm font-medium">
                  {Math.round((stats.certificateIssued / stats.checkedIn) * 100) || 0}%
                </span>
              </div>
              <Progress 
                value={Math.round((stats.certificateIssued / stats.checkedIn) * 100) || 0} 
                className="h-2" 
              />
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm">Feedback Rate</span>
                <span className="text-sm font-medium">
                  {Math.round((stats.feedbackSubmitted / stats.checkedIn) * 100) || 0}%
                </span>
              </div>
              <Progress 
                value={Math.round((stats.feedbackSubmitted / stats.checkedIn) * 100) || 0} 
                className="h-2" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Participants</CardTitle>
                  <CardDescription>
                    {filteredParticipants.length} participants found • Sort by: {sortBy} ({sortOrder})
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search participants..."
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
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "p-2 rounded-r-lg transition-colors",
                        viewMode === 'grid' 
                          ? "bg-white/[0.08] text-white" 
                          : "text-muted-foreground hover:bg-white/[0.03]"
                      )}
                    >
                      <Users className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </CardHeader>

            {/* Bulk Actions Bar */}
            {selectedParticipants.length > 0 && (
              <div className="px-6 py-3 bg-primary/5 border-y border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedParticipants.length} participant{selectedParticipants.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('check-in')}
                    >
                      <UserCheck className="h-3 w-3" />
                      Check-in
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('issue-certificate')}
                    >
                      <Award className="h-3 w-3" />
                      Issue Certificate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('send-email')}
                    >
                      <Mail className="h-3 w-3" />
                      Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-500 hover:text-red-600"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <Trash2 className="h-3 w-3" />
                      Remove
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedParticipants([])}
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
                            checked={selectedParticipants.length === currentParticipants.length}
                            onChange={handleSelectAll}
                            className="h-4 w-4 rounded border-white/20"
                          />
                        </th>
                        <th 
                          className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                          onClick={() => handleSort('name')}
                        >
                          <div className="flex items-center gap-1">
                            Participant
                            {sortBy === 'name' && (
                              <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Event
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Registration
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentParticipants.map((participant) => (
                        <tr 
                          key={participant.id} 
                          className={cn(
                            "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
                            selectedParticipants.includes(participant.id) && "bg-primary/5"
                          )}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedParticipants.includes(participant.id)}
                              onChange={() => handleSelectParticipant(participant.id)}
                              className="h-4 w-4 rounded border-white/20"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={`/avatars/${participant.studentId}.jpg`} />
                                <AvatarFallback className="bg-white/[0.08]">
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{participant.name}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Mail className="h-3 w-3" />
                                  {participant.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-sm">{participant.eventTitle}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Tag className="h-3 w-3" />
                                {participant.department}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 text-sm">
                                <Calendar className="h-3 w-3" />
                                {formatDateTime(participant.registrationDate)}
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className={cn("px-2 py-0.5 rounded", getPaymentColor(participant.paymentStatus))}>
                                  {participant.paymentStatus === 'paid' ? `Paid ₹${participant.amountPaid}` : 
                                   participant.paymentStatus === 'free' ? 'Free' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(participant.status))}>
                                {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                              </Badge>
                              <div className="flex items-center gap-1 text-xs">
                                {participant.certificateIssued && (
                                  <span className="text-emerald-500 flex items-center gap-1">
                                    <Award className="h-3 w-3" />
                                    Certified
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
                                  Edit
                                </DropdownMenuItem>
                                {participant.status === 'registered' && (
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <UserCheck className="h-4 w-4" />
                                    Check-in
                                  </DropdownMenuItem>
                                )}
                                {participant.status === 'checked-in' && !participant.certificateIssued && (
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Award className="h-4 w-4" />
                                    Issue Certificate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Mail className="h-4 w-4" />
                                  Send Email
                                </DropdownMenuItem>
                                <DropdownMenuItem className="gap-2 cursor-pointer text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                  {currentParticipants.map((participant) => (
                    <Card 
                      key={participant.id} 
                      className={cn(
                        "border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent transition-all hover:border-primary/20 hover:shadow-lg group",
                        selectedParticipants.includes(participant.id) && "ring-2 ring-primary/50"
                      )}
                    >
                      <CardContent className="p-5">
                        {/* Participant Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={`/avatars/${participant.studentId}.jpg`} />
                              <AvatarFallback className="bg-white/[0.08]">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-xs text-muted-foreground">{participant.studentId}</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={selectedParticipants.includes(participant.id)}
                            onChange={() => handleSelectParticipant(participant.id)}
                            className="h-4 w-4 rounded border-white/20"
                          />
                        </div>

                        {/* Event Info */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{participant.eventTitle}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{participant.department} • {participant.year}</span>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{participant.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{participant.phone}</span>
                          </div>
                        </div>

                        {/* Status & Payment */}
                        <div className="space-y-2 mb-4 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={cn("text-xs", getStatusColor(participant.status))}>
                              {participant.status}
                            </Badge>
                            <span className={cn("text-xs px-2 py-1 rounded", getPaymentColor(participant.paymentStatus))}>
                              {participant.paymentStatus === 'paid' ? `₹${participant.amountPaid}` : participant.paymentStatus}
                            </span>
                          </div>
                          {participant.checkInTime && (
                            <div className="text-xs text-muted-foreground">
                              Checked in: {formatDateTime(participant.checkInTime)}
                            </div>
                          )}
                          {participant.seatNumber && (
                            <div className="text-xs text-muted-foreground">
                              Seat: {participant.seatNumber}
                            </div>
                          )}
                        </div>

                        {/* Icons Row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div title="Certificate Issued">
                              {participant.certificateIssued ? (
                                <Award className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Award className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div title="Feedback Submitted">
                              {participant.feedbackSubmitted ? (
                                <FileText className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            {participant.specialRequirements && (
                              <div title="Special Requirements">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                              </div>
                            )}
                          </div>
                          {participant.attendanceDuration && (
                            <span className="text-xs px-2 py-1 bg-white/[0.03] rounded">
                              {participant.attendanceDuration}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Eye className="h-3 w-3" />
                            View
                          </Button>
                          <Button size="sm" className="flex-1 gap-2">
                            <Mail className="h-3 w-3" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>

            {/* Pagination */}
            {filteredParticipants.length > 0 && (
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/5">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredParticipants.length)} of {filteredParticipants.length} participants
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
            {filteredParticipants.length === 0 && (
              <CardContent className="py-16 text-center">
                <div className="mx-auto max-w-md">
                  <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No participants found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No participants match "${searchQuery}". Try a different search term.`
                      : 'No participants match your current filters.'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="mr-3"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedEvent('all');
                    }}
                  >
                    Clear filters
                  </Button>
                  <Button onClick={handleImport}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Participants
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

export default ParticipantsManagement;