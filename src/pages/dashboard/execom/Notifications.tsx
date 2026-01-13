import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Bell,
  BellOff,
  Check,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Mail,
  MessageSquare,
  Users,
  User,
  Calendar,
  Award,
  DollarSign,
  Trash2,
  Eye,
  EyeOff,
  Archive,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Loader2,
  Settings,
  Download,
  Send,
  Volume2,
  VolumeX,
  ExternalLink,
  FileText,
  BarChart3,
  RefreshCw,
  Zap
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
import { Textarea } from '@/components/ui/textarea';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'event' | 'payment' | 'certificate' | 'system';
  priority: 'low' | 'medium' | 'high' | 'critical';
  sender: string;
  senderAvatar?: string;
  recipientType: 'all' | 'members' | 'executives' | 'specific' | 'event_attendees';
  recipientCount: number;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  read: boolean;
  timestamp: string;
  scheduled: boolean;
  scheduledTime?: string;
  actions?: {
    label: string;
    action: string;
  }[];
  category: string;
  attachments?: number;
  readBy: string[];
  clickThroughRate?: number;
  channels: string[];
}

const NotificationsManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'status' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isComposing, setIsComposing] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const,
    priority: 'medium' as const,
    recipientType: 'all' as const,
  });
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    sentToday: 0,
    readRate: 0,
    deliveryRate: 0,
  });
  const notificationsPerPage = 10;

  // Mock data - In real app, fetch from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Web Dev Bootcamp Reminder',
      message: 'Reminder: Web Development Bootcamp starts tomorrow at 10 AM. Please arrive 15 minutes early for registration.',
      type: 'event',
      priority: 'high',
      sender: 'Arjun Sharma',
      senderAvatar: '/avatars/arjun.jpg',
      recipientType: 'event_attendees',
      recipientCount: 42,
      status: 'delivered',
      read: false,
      timestamp: '2024-01-19 14:30',
      scheduled: false,
      category: 'Event Reminder',
      readBy: ['Priya Patel', 'Rohan Desai', 'Sneha Nair'],
      clickThroughRate: 78,
      channels: ['email', 'in-app'],
    },
    {
      id: '2',
      title: 'Certificate Issued',
      message: 'Your certificate for AI & ML Workshop has been issued. You can download it from your dashboard.',
      type: 'certificate',
      priority: 'medium',
      sender: 'System',
      recipientType: 'specific',
      recipientCount: 1,
      status: 'read',
      read: true,
      timestamp: '2024-01-16 11:15',
      scheduled: false,
      category: 'Certificate',
      readBy: ['Karthik Menon'],
      clickThroughRate: 95,
      channels: ['email', 'in-app', 'sms'],
    },
    {
      id: '3',
      title: 'Payment Confirmation',
      message: 'Your payment of ₹100 for Annual Tech Conference has been successfully processed.',
      type: 'payment',
      priority: 'medium',
      sender: 'System',
      recipientType: 'specific',
      recipientCount: 1,
      status: 'read',
      read: true,
      timestamp: '2024-01-18 16:45',
      scheduled: false,
      category: 'Payment',
      readBy: ['Meera Iyer'],
      clickThroughRate: 100,
      channels: ['email'],
    },
    {
      id: '4',
      title: 'System Maintenance',
      message: 'Scheduled maintenance on January 25th from 2 AM to 5 AM. Portal will be temporarily unavailable.',
      type: 'system',
      priority: 'high',
      sender: 'Admin',
      recipientType: 'all',
      recipientCount: 156,
      status: 'sent',
      read: false,
      timestamp: '2024-01-17 09:00',
      scheduled: true,
      scheduledTime: '2024-01-17 09:00',
      category: 'System Alert',
      readBy: ['Arjun Sharma', 'Dr. Vikram Singh'],
      clickThroughRate: 45,
      channels: ['in-app', 'email'],
    },
    {
      id: '5',
      title: 'New Executive Announcement',
      message: 'Please welcome our new executive team members. Check the members directory for details.',
      type: 'info',
      priority: 'medium',
      sender: 'Arjun Sharma',
      senderAvatar: '/avatars/arjun.jpg',
      recipientType: 'members',
      recipientCount: 156,
      status: 'delivered',
      read: true,
      timestamp: '2024-01-15 12:30',
      scheduled: false,
      category: 'Announcement',
      readBy: ['Priya Patel', 'Rohan Desai', 'Sneha Nair', 'Ananya Reddy'],
      clickThroughRate: 62,
      channels: ['in-app'],
    },
    {
      id: '6',
      title: 'Registration Deadline Approaching',
      message: 'Only 2 days left to register for Hackathon 2024. Last chance to secure your spot!',
      type: 'warning',
      priority: 'high',
      sender: 'Rohan Desai',
      senderAvatar: '/avatars/rohan.jpg',
      recipientType: 'members',
      recipientCount: 156,
      status: 'failed',
      read: false,
      timestamp: '2024-01-14 15:20',
      scheduled: false,
      category: 'Event Alert',
      readBy: [],
      clickThroughRate: 0,
      channels: ['email', 'in-app'],
    },
    {
      id: '7',
      title: 'Congratulations!',
      message: 'Your team has been selected for the final round of Hackathon 2024. Best of luck!',
      type: 'success',
      priority: 'high',
      sender: 'Rohan Desai',
      senderAvatar: '/avatars/rohan.jpg',
      recipientType: 'specific',
      recipientCount: 4,
      status: 'delivered',
      read: false,
      timestamp: '2024-01-13 18:00',
      scheduled: false,
      actions: [
        { label: 'View Details', action: 'view_hackathon' },
        { label: 'Team Info', action: 'team_info' }
      ],
      category: 'Competition',
      readBy: ['Team Alpha'],
      clickThroughRate: 100,
      channels: ['email', 'in-app', 'sms'],
    },
    {
      id: '8',
      title: 'Feedback Request',
      message: 'Please share your feedback for the Web Development Bootcamp. Your input helps us improve.',
      type: 'info',
      priority: 'low',
      sender: 'Priya Patel',
      senderAvatar: '/avatars/priya.jpg',
      recipientType: 'event_attendees',
      recipientCount: 42,
      status: 'sent',
      read: true,
      timestamp: '2024-01-20 10:00',
      scheduled: false,
      actions: [
        { label: 'Give Feedback', action: 'feedback' }
      ],
      category: 'Feedback',
      readBy: ['Arjun Sharma', 'Sneha Nair'],
      clickThroughRate: 34,
      channels: ['email'],
    },
    {
      id: '9',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from unknown device. Please verify your account.',
      type: 'error',
      priority: 'critical',
      sender: 'System',
      recipientType: 'specific',
      recipientCount: 1,
      status: 'read',
      read: true,
      timestamp: '2024-01-12 03:15',
      scheduled: false,
      category: 'Security',
      readBy: ['Admin'],
      clickThroughRate: 100,
      channels: ['email', 'sms'],
    },
    {
      id: '10',
      title: 'Monthly Newsletter',
      message: 'January edition of ISTE newsletter is now available. Check out the latest updates and events.',
      type: 'info',
      priority: 'low',
      sender: 'Newsletter Team',
      recipientType: 'all',
      recipientCount: 156,
      status: 'delivered',
      read: false,
      timestamp: '2024-01-01 08:00',
      scheduled: true,
      scheduledTime: '2024-01-01 08:00',
      attachments: 1,
      category: 'Newsletter',
      readBy: ['Dr. Vikram Singh', 'Karthik Menon'],
      clickThroughRate: 28,
      channels: ['email'],
    },
  ]);

  const notificationTypes = [
    { value: 'all', label: 'All Types', count: notifications.length },
    { value: 'info', label: 'Information', count: notifications.filter(n => n.type === 'info').length },
    { value: 'success', label: 'Success', count: notifications.filter(n => n.type === 'success').length },
    { value: 'warning', label: 'Warnings', count: notifications.filter(n => n.type === 'warning').length },
    { value: 'error', label: 'Errors', count: notifications.filter(n => n.type === 'error').length },
    { value: 'event', label: 'Events', count: notifications.filter(n => n.type === 'event').length },
    { value: 'payment', label: 'Payments', count: notifications.filter(n => n.type === 'payment').length },
    { value: 'certificate', label: 'Certificates', count: notifications.filter(n => n.type === 'certificate').length },
    { value: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length },
  ];

  const priorities = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  const recipientTypes = [
    { value: 'all', label: 'All Users' },
    { value: 'members', label: 'All Members' },
    { value: 'executives', label: 'Executive Team' },
    { value: 'event_attendees', label: 'Event Attendees' },
    { value: 'specific', label: 'Specific Users' },
  ];

  // Calculate statistics
  useEffect(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const today = new Date();
    const sentToday = notifications.filter(n => {
      const notifDate = new Date(n.timestamp);
      return notifDate.toDateString() === today.toDateString();
    }).length;
    const readRate = Math.round((notifications.filter(n => n.read).length / total) * 100) || 0;
    const deliveryRate = Math.round((notifications.filter(n => n.status === 'delivered' || n.status === 'read').length / total) * 100) || 0;
    
    setStats({ total, unread, sentToday, readRate, deliveryRate });
  }, [notifications]);

  // Filter and sort notifications
  const filteredNotifications = notifications
    .filter(notification => {
      const matchesSearch = searchQuery === '' || 
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'unread' && !notification.read) ||
        (selectedFilter === 'read' && notification.read) ||
        (selectedFilter === 'failed' && notification.status === 'failed') ||
        (selectedFilter === 'scheduled' && notification.scheduled);
      
      const matchesType = selectedType === 'all' || 
        notification.type === selectedType;
      
      const matchesPriority = selectedPriority === 'all' || 
        notification.priority === selectedPriority;
      
      return matchesSearch && matchesFilter && matchesType && matchesPriority;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'date': 
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
          break;
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        case 'status':
          const statusOrder = { failed: 1, sent: 2, delivered: 3, read: 4 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = new Date(a.timestamp).getTime();
          bValue = new Date(b.timestamp).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const endIndex = startIndex + notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(startIndex, endIndex);

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'info': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'success': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'warning': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'error': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'event': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'payment': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'certificate': return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'system': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return XCircle;
      case 'event': return Calendar;
      case 'payment': return DollarSign;
      case 'certificate': return Award;
      case 'system': return Bell;
      default: return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-rose-500 text-white';
      case 'high': return 'bg-amber-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-slate-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return 'bg-blue-500/15 text-blue-400';
      case 'delivered': return 'bg-emerald-500/15 text-emerald-400';
      case 'read': return 'bg-green-500/15 text-green-400';
      case 'failed': return 'bg-rose-500/15 text-rose-400';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev =>
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === currentNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(currentNotifications.map(n => n.id));
    }
  };

  const handleBulkAction = (action: string) => {
    setIsLoading(true);
    console.log(`Bulk ${action} for notifications:`, selectedNotifications);
    
    // Simulate API call
    setTimeout(() => {
      if (action === 'mark-read') {
        setNotifications(prev => prev.map(notification => 
          selectedNotifications.includes(notification.id) 
            ? { ...notification, read: true }
            : notification
        ));
      } else if (action === 'mark-unread') {
        setNotifications(prev => prev.map(notification => 
          selectedNotifications.includes(notification.id) 
            ? { ...notification, read: false }
            : notification
        ));
      } else if (action === 'archive') {
        setNotifications(prev => prev.filter(notification => !selectedNotifications.includes(notification.id)));
        setSelectedNotifications([]);
      } else if (action === 'resend') {
        setNotifications(prev => prev.map(notification => 
          selectedNotifications.includes(notification.id) 
            ? { ...notification, status: 'sent' as const }
            : notification
        ));
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSendNotification = () => {
    if (!newNotification.title || !newNotification.message) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        priority: newNotification.priority,
        sender: 'Current User',
        recipientType: newNotification.recipientType,
        recipientCount: 156,
        status: 'sent',
        read: false,
        timestamp: new Date().toISOString(),
        scheduled: false,
        category: 'Manual',
        readBy: [],
        clickThroughRate: 0,
        channels: ['in-app'],
      };
      
      setNotifications(prev => [newNotif, ...prev]);
      setNewNotification({
        title: '',
        message: '',
        type: 'info',
        priority: 'medium',
        recipientType: 'all',
      });
      setIsComposing(false);
      setIsLoading(false);
    }, 1500);
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
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
            Notifications Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage alerts, announcements, and communications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => console.log('Export notifications')}
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
          <Button 
            className="gap-2"
            onClick={() => setIsComposing(true)}
          >
            <Send className="h-4 w-4" />
            New Notification
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unread</p>
                <p className="text-2xl font-bold mt-1">{stats.unread}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold mt-1">{stats.sentToday}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Send className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Read Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.readRate}%</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Eye className="h-5 w-5 text-blue-500" />
              </div>
            </div>
            <Progress value={stats.readRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivery Rate</p>
                <p className="text-2xl font-bold mt-1">{stats.deliveryRate}%</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <CheckCircle className="h-5 w-5 text-purple-500" />
              </div>
            </div>
            <Progress value={stats.deliveryRate} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Compose New Notification */}
      {isComposing && (
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent animate-in slide-in-from-top duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Compose New Notification</span>
              <Button variant="ghost" size="icon" onClick={() => setIsComposing(false)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Send a new notification to selected recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Notification Title</Label>
                <Input
                  placeholder="Enter notification title"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={newNotification.type}
                  onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Enter notification message..."
                rows={4}
                value={newNotification.message}
                onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={newNotification.priority}
                  onValueChange={(value) => setNewNotification(prev => ({ ...prev, priority: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Recipients</Label>
                <Select
                  value={newNotification.recipientType}
                  onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipientType: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    {recipientTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Channels</Label>
                <div className="flex gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Mail className="h-3 w-3" />
                    Email
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Bell className="h-3 w-3" />
                    In-app
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <MessageSquare className="h-3 w-3" />
                    SMS
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsComposing(false)}>
              Cancel
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Clock className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button onClick={handleSendNotification} className="gap-2">
                <Send className="h-4 w-4" />
                Send Now
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <CardTitle className="text-lg">Filters & Settings</CardTitle>
              <CardDescription>Manage notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Notification Type</Label>
                <div className="space-y-2">
                  {notificationTypes.slice(0, 5).map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSelectedType(type.value)}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedType === type.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
                      )}
                    >
                      <span>{type.label}</span>
                      <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                        {type.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Quick Filters */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Filters</Label>
                <div className="space-y-2">
                  {[
                    { value: 'unread', label: 'Unread', count: stats.unread },
                    { value: 'read', label: 'Read', count: stats.total - stats.unread },
                    { value: 'failed', label: 'Failed', count: notifications.filter(n => n.status === 'failed').length },
                    { value: 'scheduled', label: 'Scheduled', count: notifications.filter(n => n.scheduled).length },
                  ].map((filter) => (
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

              {/* Priority Filter */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Priority</Label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Settings */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Sound Alerts</Label>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                  setSelectedType('all');
                  setSelectedPriority('all');
                }}
              >
                <Filter className="h-4 w-4" />
                Clear All Filters
              </Button>

              <Button variant="ghost" className="w-full gap-2 mt-2">
                <Settings className="h-4 w-4" />
                Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent mt-4">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">5 new notifications sent</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <XCircle className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">2 notifications failed</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Users className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">45 users engaged</p>
                  <p className="text-xs text-muted-foreground">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    {filteredNotifications.length} notifications found • Sort by: {sortBy} ({sortOrder})
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search notifications..."
                      className="pl-10 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      // Refresh notifications
                      console.log('Refreshing notifications...');
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Bulk Actions Bar */}
            {selectedNotifications.length > 0 && (
              <div className="px-6 py-3 bg-primary/5 border-y border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {selectedNotifications.length} notification{selectedNotifications.length > 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('mark-read')}
                    >
                      <Eye className="h-3 w-3" />
                      Mark as Read
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('mark-unread')}
                    >
                      <EyeOff className="h-3 w-3" />
                      Mark as Unread
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleBulkAction('resend')}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Resend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-500 hover:text-red-600"
                      onClick={() => handleBulkAction('archive')}
                    >
                      <Trash2 className="h-3 w-3" />
                      Archive
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedNotifications([])}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <CardContent className="p-0">
              {/* List View */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedNotifications.length === currentNotifications.length}
                          onChange={handleSelectAll}
                          className="h-4 w-4 rounded border-white/20"
                        />
                      </th>
                      <th 
                        className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                        onClick={() => handleSort('type')}
                      >
                        <div className="flex items-center gap-1">
                          Type
                          {sortBy === 'type' && (
                            <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                        Notification
                      </th>
                      <th 
                        className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                        onClick={() => handleSort('priority')}
                      >
                        Priority
                      </th>
                      <th 
                        className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                        onClick={() => handleSort('date')}
                      >
                        Time
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
                    {currentNotifications.map((notification) => {
                      const TypeIcon = getTypeIcon(notification.type);
                      return (
                        <tr 
                          key={notification.id} 
                          className={cn(
                            "border-b border-white/5 hover:bg-white/[0.02] transition-colors group",
                            selectedNotifications.includes(notification.id) && "bg-primary/5",
                            !notification.read && "bg-blue-500/5"
                          )}
                        >
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notification.id)}
                              onChange={() => handleSelectNotification(notification.id)}
                              className="h-4 w-4 rounded border-white/20"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className={cn("p-2 rounded-lg", getTypeColor(notification.type))}>
                                <TypeIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-medium">{notification.category}</div>
                                <div className="text-xs text-muted-foreground capitalize">{notification.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-sm">{notification.title}</p>
                                    {!notification.read && (
                                      <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                                {notification.attachments && (
                                  <Badge variant="outline" className="text-xs">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {notification.attachments}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  <span>{notification.recipientCount} recipients</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="flex items-center gap-1">
                                    {notification.channels.map((channel, idx) => (
                                      <span key={idx} className="text-[10px]">
                                        {channel === 'email' && <Mail className="h-2.5 w-2.5" />}
                                        {channel === 'in-app' && <Bell className="h-2.5 w-2.5" />}
                                        {channel === 'sms' && <MessageSquare className="h-2.5 w-2.5" />}
                                      </span>
                                    ))}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge 
                              className={cn("text-xs", getPriorityColor(notification.priority))}
                            >
                              {notification.priority.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="text-sm">
                                {formatDateTime(notification.timestamp)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                {notification.senderAvatar ? (
                                  <Avatar className="h-4 w-4">
                                    <AvatarImage src={notification.senderAvatar} />
                                    <AvatarFallback>{notification.sender[0]}</AvatarFallback>
                                  </Avatar>
                                ) : (
                                  <User className="h-3 w-3" />
                                )}
                                <span>{notification.sender}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <Badge variant="outline" className={cn("text-xs", getStatusColor(notification.status))}>
                                {notification.status.toUpperCase()}
                              </Badge>
                              {notification.clickThroughRate && (
                                <div className="text-xs">
                                  <span className="text-muted-foreground">CTR: </span>
                                  <span className={cn(
                                    "font-medium",
                                    notification.clickThroughRate > 70 ? "text-emerald-500" :
                                    notification.clickThroughRate > 40 ? "text-amber-500" : "text-rose-500"
                                  )}>
                                    {notification.clickThroughRate}%
                                  </span>
                                </div>
                              )}
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
                                {!notification.read ? (
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <Check className="h-4 w-4" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <EyeOff className="h-4 w-4" />
                                    Mark as Unread
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="gap-2 cursor-pointer">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {notification.status === 'failed' && (
                                  <DropdownMenuItem className="gap-2 cursor-pointer">
                                    <RefreshCw className="h-4 w-4" />
                                    Resend
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {notification.actions?.map((action, index) => (
                                  <DropdownMenuItem key={index} className="gap-2 cursor-pointer">
                                    <ExternalLink className="h-4 w-4" />
                                    {action.label}
                                  </DropdownMenuItem>
                                ))}
                                <DropdownMenuItem className="gap-2 cursor-pointer text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>

            {/* Pagination */}
            {filteredNotifications.length > 0 && (
              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/5">
                <p className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredNotifications.length)} of {filteredNotifications.length} notifications
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
            {filteredNotifications.length === 0 && (
              <CardContent className="py-16 text-center">
                <div className="mx-auto max-w-md">
                  <Bell className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? `No notifications match "${searchQuery}". Try a different search term.`
                      : 'No notifications match your current filters.'
                    }
                  </p>
                  <Button 
                    variant="outline" 
                    className="mr-3"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedType('all');
                      setSelectedPriority('all');
                    }}
                  >
                    Clear filters
                  </Button>
                  <Button onClick={() => setIsComposing(true)}>
                    <Send className="h-4 w-4 mr-2" />
                    Create Notification
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

export default NotificationsManagement;