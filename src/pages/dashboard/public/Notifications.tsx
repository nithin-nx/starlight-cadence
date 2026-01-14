import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  Bell,
  BellRing,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  Calendar,
  Settings,
  ExternalLink,
  Archive
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  notification_type: string;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
  read: boolean;
  read_at: string | null;
}

interface NotificationPreferences {
  email_notifications: boolean;
  push_notifications: boolean;
  event_notifications: boolean;
  membership_notifications: boolean;
  marketing_emails: boolean;
}

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: "all",
    readStatus: "all",
    search: ""
  });
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: true,
    event_notifications: true,
    membership_notifications: true,
    marketing_emails: false
  });
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const notificationTypes = [
    { value: "info", label: "Information", icon: Info, color: "bg-blue-500" },
    { value: "warning", label: "Warning", icon: AlertCircle, color: "bg-amber-500" },
    { value: "success", label: "Success", icon: CheckCircle, color: "bg-green-500" },
    { value: "event", label: "Event", icon: Calendar, color: "bg-purple-500" },
    { value: "membership", label: "Membership", icon: BellRing, color: "bg-cyan-500" }
  ];

  useEffect(() => {
    fetchNotifications();
    fetchPreferences();
  }, []);

  useEffect(() => {
    applyFilters();
    updateUnreadCount();
  }, [notifications, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch notifications for the user
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedNotifications = (data || []).map((item: any) => ({
        ...item,
        read: false,
        read_at: null
      }));

      setNotifications(formattedNotifications);

    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    // In a real app, fetch from user profile or preferences table
    // For now, using localStorage
    const savedPrefs = localStorage.getItem('notification_preferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
  };

  const applyFilters = () => {
    let result = [...notifications];

    // Filter by type
    if (filter.type !== "all") {
      result = result.filter(notification => notification.notification_type === filter.type);
    }

    // Filter by read status
    if (filter.readStatus !== "all") {
      const isRead = filter.readStatus === "read";
      result = result.filter(notification => notification.read === isRead);
    }

    // Filter by search
    if (filter.search.trim()) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(notification =>
        notification.title.toLowerCase().includes(searchLower) ||
        notification.message.toLowerCase().includes(searchLower)
      );
    }

    // Filter expired notifications
    const now = new Date();
    result = result.filter(notification => {
      if (!notification.is_active) return false;
      if (notification.expires_at && new Date(notification.expires_at) < now) return false;
      return true;
    });

    setFilteredNotifications(result);
  };

  const updateUnreadCount = () => {
    const count = notifications.filter(n => !n.read && n.is_active).length;
    setUnreadCount(count);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      setMarkingAsRead(notificationId);

      // Update local state immediately
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, read: true, read_at: new Date().toISOString() }
            : n
        )
      );

      toast({
        title: "Marked as Read",
        description: "Notification has been marked as read",
      });

    } catch (error) {
      console.error('Error marking as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive"
      });
    } finally {
      setMarkingAsRead(null);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true, read_at: new Date().toISOString() }))
      );

      toast({
        title: "All Notifications Read",
        description: "All notifications have been marked as read",
      });

    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      toast({
        title: "Deleted",
        description: "Notification has been deleted",
      });

    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const savePreferences = () => {
    localStorage.setItem('notification_preferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been saved",
    });
  };

  const getNotificationIcon = (type: string) => {
    const typeInfo = notificationTypes.find(t => t.value === type) || notificationTypes[0];
    return typeInfo.icon;
  };

  const getNotificationColor = (type: string) => {
    const typeInfo = notificationTypes.find(t => t.value === type) || notificationTypes[0];
    return typeInfo.color;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with ISTE announcements and alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark All as Read ({unreadCount})
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold">{notifications.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread</p>
                <p className="text-2xl font-bold">{unreadCount}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <BellRing className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => n.is_active).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold">
                  {notifications.filter(n => 
                    new Date(n.created_at).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Recent Notifications
              </CardTitle>
              
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search..."
                    value={filter.search}
                    onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8 w-40"
                  />
                </div>
                
                <Select
                  value={filter.type}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="w-32">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {notificationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.readStatus}
                  onValueChange={(value) => setFilter(prev => ({ ...prev, readStatus: value }))}
                >
                  <SelectTrigger className="w-32">
                    <Eye className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.notification_type);
                  const colorClass = getNotificationColor(notification.notification_type);
                  
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        notification.read ? 'bg-gray-50' : 'bg-white border-l-4 border-l-primary'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                          <div className={`p-2 ${colorClass}/10 rounded-lg`}>
                            <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{notification.title}</h3>
                              {!notification.read && (
                                <Badge className="bg-primary text-primary-foreground text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600">{notification.message}</p>
                            
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                              </span>
                              {notification.expires_at && (
                                <span className="flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" />
                                  Expires: {format(new Date(notification.expires_at), "MMM dd")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(notification.id)}
                              disabled={markingAsRead === notification.id}
                            >
                              {markingAsRead === notification.id ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Eye className="w-3 h-3 mr-1" />
                                  Mark Read
                                </>
                              )}
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Notifications</h3>
                <p className="text-gray-600">
                  {filter.search || filter.type !== "all" || filter.readStatus !== "all"
                    ? "Try changing your filters"
                    : "You're all caught up!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control how you receive notifications
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, email_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <BellRing className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Browser push notifications</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.push_notifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, push_notifications: checked }))
                    }
                  />
                </div>
              </div>

              {/* Notification Types */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Event Updates</h4>
                      <p className="text-sm text-gray-500">New events, reminders, changes</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.event_notifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, event_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-100 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Membership Updates</h4>
                      <p className="text-sm text-gray-500">Application status, renewals</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.membership_notifications}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, membership_notifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Info className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Marketing Emails</h4>
                      <p className="text-sm text-gray-500">Newsletters, promotions</p>
                    </div>
                  </div>
                  <Switch
                    checked={preferences.marketing_emails}
                    onCheckedChange={(checked) =>
                      setPreferences(prev => ({ ...prev, marketing_emails: checked }))
                    }
                  />
                </div>
              </div>

              {/* Save Button */}
              <Button className="w-full" onClick={savePreferences}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>

              {/* Notification Types Info */}
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Notification Types</h4>
                <div className="space-y-2">
                  {notificationTypes.map(type => (
                    <div key={type.value} className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${type.color}`}></div>
                      <span>{type.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Archived Notifications */}
      {notifications.filter(n => !n.is_active).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="w-5 h-5" />
              Archived Notifications
            </CardTitle>
            <CardDescription>
              Inactive or expired notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {notifications
                .filter(n => !n.is_active)
                .slice(0, 3)
                .map(notification => (
                  <div
                    key={notification.id}
                    className="p-3 bg-gray-50 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium line-through">{notification.title}</span>
                        <Badge variant="outline">Archived</Badge>
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-1">{notification.message}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(new Date(notification.created_at), "MMM dd, yyyy")}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}