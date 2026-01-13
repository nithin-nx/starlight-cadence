import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  UserPlus, 
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Shield,
  Calendar,
  MailCheck,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Member' | 'Executive' | 'Volunteer' | 'Faculty' | 'Alumni';
  department: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  year: string;
  eventsAttended: number;
  certificates: number;
}

const MembersDirectory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const membersPerPage = 10;

  // Fetch members from database
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const { data: applicationsData, error } = await supabase
        .from('membership_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform database data to Member interface
      const transformedMembers: Member[] = (applicationsData || []).map((app) => ({
        id: app.id,
        name: app.full_name,
        email: app.email,
        phone: app.phone || '',
        role: 'Member',
        department: app.department || 'Unknown',
        joinDate: app.created_at,
        status: (app.status as 'active' | 'inactive' | 'pending') || 'pending',
        year: app.year_of_study || '1st Year',
        eventsAttended: 0,
        certificates: 0,
      }));

      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { value: 'all', label: 'All Members', count: members.length },
    { value: 'active', label: 'Active', count: members.filter(m => m.status === 'active').length },
    { value: 'pending', label: 'Pending', count: members.filter(m => m.status === 'pending').length },
    { value: 'inactive', label: 'Inactive', count: members.filter(m => m.status === 'inactive').length },
    { value: 'executive', label: 'Executives', count: members.filter(m => m.role === 'Executive').length },
    { value: 'faculty', label: 'Faculty', count: members.filter(m => m.role === 'Faculty').length },
  ];

  // Filter members based on search and filter
  const filteredMembers = members.filter(member => {
    const matchesSearch = searchQuery === '' || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'active' && member.status === 'active') ||
      (selectedFilter === 'pending' && member.status === 'pending') ||
      (selectedFilter === 'inactive' && member.status === 'inactive') ||
      (selectedFilter === 'executive' && member.role === 'Executive') ||
      (selectedFilter === 'faculty' && member.role === 'Faculty');
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const startIndex = (currentPage - 1) * membersPerPage;
  const endIndex = startIndex + membersPerPage;
  const currentMembers = filteredMembers.slice(startIndex, endIndex);

  const stats = {
    total: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    executives: members.filter(m => m.role === 'Executive').length,
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Executive': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Faculty': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Volunteer': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Alumni': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'inactive': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const handleExport = async () => {
    try {
      const csv = [
        ['Name', 'Email', 'Phone', 'Department', 'Status', 'Join Date'],
        ...filteredMembers.map(m => [
          m.name,
          m.email,
          m.phone,
          m.department,
          m.status,
          new Date(m.joinDate).toLocaleDateString()
        ])
      ]
        .map(row => row.join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `members-${new Date().toISOString()}.csv`;
      a.click();
      toast.success('Members exported successfully');
    } catch (error) {
      toast.error('Failed to export members');
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('membership_applications')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      
      setMembers(members.filter(m => m.id !== memberId));
      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Failed to remove member');
    }
  };

  const handleUpdateStatus = async (memberId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      const { error } = await supabase
        .from('membership_applications')
        .update({ status: newStatus })
        .eq('id', memberId);

      if (error) throw error;

      setMembers(members.map(m => 
        m.id === memberId ? { ...m, status: newStatus } : m
      ));
      toast.success(`Member status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Member Directory</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all ISTE members efficiently
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <UserPlus className="h-4 w-4" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold mt-1">{stats.active}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/10">
                <UserCheck className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10">
                <MailCheck className="h-6 w-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Executives</p>
                <p className="text-2xl font-bold mt-1">{stats.executives}</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Shield className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search members by name, email, or department..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setSelectedFilter('all')}>
                    All Members
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedFilter('active')}>
                    Active Members
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('pending')}>
                    Pending Approval
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('inactive')}>
                    Inactive Members
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedFilter('executive')}>
                    Executive Team
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedFilter('faculty')}>
                    Faculty Members
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5",
                  selectedFilter === filter.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
                )}
              >
                {filter.label}
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[10px]",
                  selectedFilter === filter.value
                    ? "bg-primary-foreground/20"
                    : "bg-white/[0.08]"
                )}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Members Table */}
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent overflow-hidden">
            <CardHeader>
              <CardTitle>All Members</CardTitle>
              <CardDescription>
                Showing {currentMembers.length} of {filteredMembers.length} members
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Member</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Joined</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentMembers.map((member) => (
                      <tr key={member.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <Mail className="h-3 w-3" />
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{member.department}</p>
                            <p className="text-xs text-muted-foreground">{member.year}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className={cn("text-xs", getStatusColor(member.status))}>
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{new Date(member.joinDate).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <Eye className="h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => handleUpdateStatus(member.id, 'active')}
                              >
                                <UserCheck className="h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="gap-2"
                                onClick={() => handleUpdateStatus(member.id, 'inactive')}
                              >
                                <UserX className="h-4 w-4" />
                                Deactivate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="gap-2 text-red-500"
                                onClick={() => handleRemoveMember(member.id)}
                              >
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentMembers.map((member) => (
              <Card key={member.id} className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <Badge variant="outline" className={cn("text-xs mt-1", getStatusColor(member.status))}>
                          {member.status}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="gap-2"
                          onClick={() => handleUpdateStatus(member.id, 'active')}
                        >
                          <UserCheck className="h-4 w-4" />
                          Approve
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{member.phone || 'N/A'}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Department: </span>
                      {member.department}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <Badge variant="outline" className={cn("text-xs", getStatusColor(member.status))}>
                      {member.status}
                    </Badge>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <ExternalLink className="h-3 w-3" />
                      Profile
                    </Button>
                    <Button size="sm" className="flex-1">
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(endIndex, filteredMembers.length)} of {filteredMembers.length} members
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
      </div>
    </div>
  );
};

export default MembersDirectory;