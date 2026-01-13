import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  Download,
  MoreVertical,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  UserPlus,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const ExecomOverview = () => {
  const [timeRange, setTimeRange] = useState('week');

  // Mock data
  const stats = {
    totalMembers: 156,
    activeEvents: 8,
    pendingCertificates: 42,
    totalRevenue: 12500,
    pendingTasks: 12,
    completedTasks: 48,
  };

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'registered for Workshop', time: '10 min ago', type: 'registration' },
    { id: 2, user: 'Jane Smith', action: 'uploaded event photos', time: '25 min ago', type: 'upload' },
    { id: 3, user: 'Robert Johnson', action: 'issued certificate', time: '1 hour ago', type: 'certificate' },
    { id: 4, user: 'Sarah Williams', action: 'approved budget request', time: '2 hours ago', type: 'approval' },
    { id: 5, user: 'Mike Brown', action: 'created new event', time: '4 hours ago', type: 'event' },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Web Dev Workshop', date: 'Tomorrow, 2 PM', attendees: 45, status: 'confirmed' },
    { id: 2, title: 'Annual Meet', date: 'Jan 20, 10 AM', attendees: 120, status: 'confirmed' },
    { id: 3, title: 'Hackathon Planning', date: 'Jan 22, 3 PM', attendees: 15, status: 'pending' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Create Event', path: '/dashboard/execom/events/create', color: 'primary' },
    { icon: UserPlus, label: 'Add Member', path: '/dashboard/execom/members/add', color: 'blue' },
    { icon: FileText, label: 'Issue Certificate', path: '/dashboard/execom/certificates/issue', color: 'green' },
    { icon: DollarSign, label: 'Add Transaction', path: '/dashboard/execom/finance/add', color: 'amber' },
  ];

  const metricCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      change: '+12%',
      isPositive: true,
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      change: '+3',
      isPositive: true,
      icon: Calendar,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Pending Certificates',
      value: stats.pendingCertificates,
      change: '-5',
      isPositive: false,
      icon: FileText,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: '+18%',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Title and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your organization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search dashboard..."
              className="pl-9 h-10 w-full sm:w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange('week')}>
                This Week
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('month')}>
                This Month
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('quarter')}>
                This Quarter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange('year')}>
                This Year
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, index) => (
          <Card key={index} className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className={cn("p-2 rounded-lg", card.bgColor)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center gap-1 text-xs mt-1">
                {card.isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={cn(card.isPositive ? 'text-green-500' : 'text-red-500')}>
                  {card.change}
                </span>
                <span className="text-muted-foreground ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Overview Chart */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Overview</CardTitle>
                  <CardDescription>Events, registrations, and engagement this month</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center rounded-lg border border-dashed border-white/10 bg-white/[0.01]">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Chart visualization would appear here</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Using Chart.js or Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto flex-col items-center justify-center gap-3 p-4 border-white/10 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                    onClick={() => console.log(`Navigate to ${action.path}`)}
                  >
                    <div className={cn(
                      "p-3 rounded-full",
                      action.color === 'primary' && "bg-primary/10 text-primary",
                      action.color === 'blue' && "bg-blue-500/10 text-blue-500",
                      action.color === 'green' && "bg-green-500/10 text-green-500",
                      action.color === 'amber' && "bg-amber-500/10 text-amber-500",
                    )}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity and Upcoming Events */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions from your team</CardDescription>
                </div>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.02] transition-colors">
                    <div className="mt-1">
                      {activity.type === 'registration' && (
                        <UserPlus className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.type === 'upload' && (
                        <FileText className="h-4 w-4 text-green-500" />
                      )}
                      {activity.type === 'certificate' && (
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                      )}
                      {activity.type === 'approval' && (
                        <CheckCircle className="h-4 w-4 text-amber-500" />
                      )}
                      {activity.type === 'event' && (
                        <Calendar className="h-4 w-4 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Scheduled activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-3 rounded-lg border border-white/5 hover:border-primary/10 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Users className="h-3 w-3" />
                          {event.attendees} attendees
                        </div>
                      </div>
                      <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        Manage
                      </Button>
                      <Button size="sm" className="flex-1">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full gap-2">
                <Calendar className="h-4 w-4" />
                View Calendar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Bottom Row - Task Progress and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Progress */}
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardHeader>
            <CardTitle>Task Progress</CardTitle>
            <CardDescription>Your pending and completed tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span className="font-medium">80%</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="text-2xl font-bold mt-2">{stats.pendingTasks}</div>
                <div className="text-xs text-muted-foreground mt-1">Tasks to complete</div>
              </div>
              <div className="p-3 rounded-lg border border-white/5">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <div className="text-2xl font-bold mt-2">{stats.completedTasks}</div>
                <div className="text-xs text-muted-foreground mt-1">Tasks done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <p className="font-medium">All Systems Operational</p>
                    <p className="text-xs text-muted-foreground">No issues detected</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  Stable
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-white/5">
                  <p className="text-sm font-medium">Storage</p>
                  <p className="text-2xl font-bold mt-1">2.4/10 GB</p>
                  <Progress value={24} className="h-1.5 mt-2" />
                </div>
                <div className="p-3 rounded-lg border border-white/5">
                  <p className="text-sm font-medium">Uptime</p>
                  <p className="text-2xl font-bold mt-1">99.8%</p>
                  <div className="text-xs text-muted-foreground mt-2">Last 30 days</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/5">
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download System Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExecomOverview;