import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Trophy,
  Award,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface DashboardStats {
  totalMembers: number;
  upcomingEvents: number;
  myApplications: number;
  myCertificates: number;
  myEvents: number;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  location: string;
}

export default function Overview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    upcomingEvents: 0,
    myApplications: 0,
    myCertificates: 0,
    myEvents: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Handle unauthenticated state
        const { data: publicEvents } = await supabase
          .from('events')
          .select('id, title, date, location')
          .eq('is_upcoming', true)
          .order('date', { ascending: true })
          .limit(3);

        // @ts-expect-error - Supabase type inference issue with count queries
        const { count: membersCount } = await supabase
          .from('memberships')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true);

        setUpcomingEvents(publicEvents || []);
        setStats({
          totalMembers: membersCount || 0,
          upcomingEvents: publicEvents?.length || 0,
          myApplications: 0,
          myCertificates: 0,
          myEvents: 0
        });
        return;
      }

      // Fetch all data in parallel for authenticated users
      const [membersResult, eventsResult, applicationsResult, certificatesResult, eventsParticipantsResult] = await Promise.all([
        supabase
          .from('memberships')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        supabase
          .from('events')
          .select('id, title, date, location')
          .eq('is_upcoming', true)
          .order('date', { ascending: true })
          .limit(3),
        
        supabase
          .from('membership_applications')
          .select('*', { count: 'exact', head: true })
          .eq('email', user.email),
        
        supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id),
        
        supabase
          .from('event_participants')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
      ]);

      const membersCount = membersResult.count;
      const eventsData = eventsResult.data;
      const myApplicationsCount = applicationsResult.count;
      const myCertificatesCount = certificatesResult.count;
      const myEventsCount = eventsParticipantsResult.count;

      setUpcomingEvents(eventsData || []);
      setStats({
        totalMembers: membersCount || 0,
        upcomingEvents: eventsData?.length || 0,
        myApplications: myApplicationsCount || 0,
        myCertificates: myCertificatesCount || 0,
        myEvents: myEventsCount || 0
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      workshop: "bg-blue-500/10 text-blue-500",
      seminar: "bg-purple-500/10 text-purple-500",
      competition: "bg-green-500/10 text-green-500",
      meetup: "bg-amber-500/10 text-amber-500",
      webinar: "bg-cyan-500/10 text-cyan-500",
      conference: "bg-red-500/10 text-red-500"
    };
    return colors[type] || "bg-gray-500/10 text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to ISTE Dashboard
              </h1>
              <p className="text-gray-600">
                Indian Society for Technical Education - Student Chapter
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Empowering technical education and innovation
              </p>
            </div>
            <Link to="/membership">
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Become a Member
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ISTE community members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Workshops, seminars & competitions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myApplications}</div>
            <p className="text-xs text-muted-foreground">
              Membership & event applications
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myCertificates}</div>
            <p className="text-xs text-muted-foreground">
              Achievement certificates earned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{event.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(event.date), "MMM dd, yyyy")}
                        </span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Link to={`/events/${event.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming events scheduled</p>
                <p className="text-sm text-gray-400 mt-1">
                  Check back later for new events
                </p>
              </div>
            )}
            <div className="mt-4">
              <Link to="/events">
                <Button variant="ghost" className="w-full">
                  View All Events
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link to="/membership">
                <Button className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Apply for Membership
                </Button>
              </Link>
              
              <Link to="/events">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse Events
                </Button>
              </Link>
              
              <Link to="/certificates">
                <Button className="w-full justify-start" variant="outline">
                  <Award className="w-4 h-4 mr-2" />
                  View Certificates
                </Button>
              </Link>
              
              <Link to="/payments">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  My Profile
                </Button>
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h3 className="font-semibold mb-3">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>ISTE Workshop 2024 registration opened</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>New members joined this week</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Certificate distribution scheduled</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            ISTE Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900">
                    National Level Technical Symposium
                  </h4>
                  <p className="text-blue-700 mt-1">
                    Registrations open for "TechVista 2024". Participate in coding competitions,
                    paper presentations, and workshops.
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    Deadline: January 31, 2024
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">
                    Membership Drive 2024
                  </h4>
                  <p className="text-green-700 mt-1">
                    Join ISTE now and get access to exclusive workshops, certificates,
                    and networking opportunities with industry experts.
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Early bird benefits available
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}