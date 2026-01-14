import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Trophy,
  Award,
  ExternalLink,
  Search,
  Filter,
  CalendarDays,
  Video,
  BookOpen,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format, formatDistance } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  date: string;
  end_date: string | null;
  location: string;
  max_participants: number | null;
  image_url: string | null;
  is_upcoming: boolean;
  registration_open: boolean;
  fee: number;
  current_participants: number;
}

interface EventFilter {
  type: string;
  dateRange: string;
  search: string;
}

export default function Events() {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<EventFilter>({
    type: "all",
    dateRange: "upcoming",
    search: ""
  });
  const [registeringEvent, setRegisteringEvent] = useState<string | null>(null);

  const eventTypes = [
    { value: "workshop", label: "Workshop", icon: BookOpen, color: "bg-blue-500" },
    { value: "seminar", label: "Seminar", icon: Video, color: "bg-purple-500" },
    { value: "competition", label: "Competition", icon: Trophy, color: "bg-green-500" },
    { value: "meetup", label: "Meetup", icon: Users, color: "bg-amber-500" },
    { value: "webinar", label: "Webinar", icon: Video, color: "bg-cyan-500" },
    { value: "conference", label: "Conference", icon: CalendarDays, color: "bg-red-500" }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      // Fetch events with participant count
      const { data: eventsData, error } = await supabase
        .from('events')
        .select(`
          *,
          event_participants(count)
        `)
        .order('date', { ascending: true });

      if (error) throw error;

      const formattedEvents = (eventsData || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.description,
        event_type: (event as any).event_type || 'workshop',
        date: event.date,
        end_date: (event as any).end_date,
        location: event.location,
        max_participants: (event as any).max_participants,
        image_url: event.image_url,
        is_upcoming: event.is_upcoming,
        registration_open: (event as any).registration_open || false,
        fee: (event as any).fee || 0,
        current_participants: (event as any).event_participants?.[0]?.count || 0
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: "Error",
        description: "Failed to load events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...events];

    // Filter by type
    if (filter.type !== "all") {
      result = result.filter(event => event.event_type === filter.type);
    }

    // Filter by date range
    if (filter.dateRange === "upcoming") {
      result = result.filter(event => event.is_upcoming);
    } else if (filter.dateRange === "past") {
      result = result.filter(event => !event.is_upcoming);
    }

    // Filter by search
    if (filter.search.trim()) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchLower) ||
        event.description?.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(result);
  };

  const getEventTypeInfo = (type: string) => {
    return eventTypes.find(t => t.value === type) || eventTypes[0];
  };

  const handleRegister = async (eventId: string) => {
    try {
      setRegisteringEvent(eventId);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to register for events",
          variant: "destructive"
        });
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email, department')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        toast({
          title: "Profile Required",
          description: "Please complete your profile first",
          variant: "destructive"
        });
        return;
      }

      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from('event_participants')
        .select('id')
        .eq('event_id', eventId)
        .eq('email', profile.email)
        .single();

      if (existingRegistration) {
        toast({
          title: "Already Registered",
          description: "You have already registered for this event",
          variant: "destructive"
        });
        return;
      }

      // Register for event
      const { error } = await supabase
        .from('event_participants')
        .insert([{
          event_id: eventId,
          user_id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          department: profile.department,
          payment_status: 'pending',
          registered_by: user.id
        }]);

      if (error) throw error;

      toast({
        title: "Registration Successful",
        description: "You have been registered for the event",
      });

      // Refresh events
      fetchEvents();

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later",
        variant: "destructive"
      });
    } finally {
      setRegisteringEvent(null);
    }
  };

  const getRemainingSeats = (event: Event) => {
    if (!event.max_participants) return "Unlimited";
    const remaining = event.max_participants - event.current_participants;
    return remaining > 0 ? `${remaining} remaining` : "Full";
  };

  const isEventFull = (event: Event) => {
    return event.max_participants && event.current_participants >= event.max_participants;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ISTE Events</h1>
        <p className="text-gray-600 mt-2">
          Discover workshops, competitions, seminars, and networking opportunities
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search events by title, description, or location..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Select
                value={filter.type}
                onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Event Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filter.dateRange}
                onValueChange={(value) => setFilter(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <SelectValue placeholder="Date Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming Events</SelectItem>
                  <SelectItem value="past">Past Events</SelectItem>
                  <SelectItem value="all">All Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.is_upcoming).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Workshops</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.event_type === 'workshop').length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Competitions</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.event_type === 'competition').length}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Trophy className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => {
            const typeInfo = getEventTypeInfo(event.event_type);
            const isFull = isEventFull(event);
            const canRegister = event.registration_open && !isFull && event.is_upcoming;

            return (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 ${typeInfo.color}`}></div>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={`${typeInfo.color}/10 text-${typeInfo.color.split('-')[1]}-600 border-${typeInfo.color.split('-')[1]}-500/20`}>
                      <typeInfo.icon className="w-3 h-3 mr-1" />
                      {typeInfo.label}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{event.fee || "Free"}
                      </div>
                      <div className="text-xs text-gray-500">Fee</div>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(event.date), "MMM dd, yyyy • hh:mm a")}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>
                        {event.current_participants} registered • {getRemainingSeats(event)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2">
                        {event.is_upcoming ? (
                          event.registration_open ? (
                            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Open
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
                              <XCircle className="w-3 h-3 mr-1" />
                              Closed
                            </Badge>
                          )
                        ) : (
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = `/events/${event.id}`}>
                          Details
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                        
                        {canRegister && (
                          <Button
                            size="sm"
                            onClick={() => handleRegister(event.id)}
                            disabled={registeringEvent === event.id}
                          >
                            {registeringEvent === event.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                                Registering...
                              </>
                            ) : (
                              "Register"
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600">
              {filter.type !== "all" || filter.dateRange !== "all" || filter.search
                ? "Try changing your filters"
                : "No events are scheduled at the moment"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Event Types Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Event Types
          </CardTitle>
          <CardDescription>
            Different types of events we organize
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {eventTypes.map((type) => (
              <div key={type.value} className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`inline-flex p-3 ${type.color}/10 rounded-full mb-3`}>
                  <type.icon className={`w-6 h-6 ${type.color.replace('bg-', 'text-')}`} />
                </div>
                <h4 className="font-medium">{type.label}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  {type.value === "workshop" && "Hands-on technical sessions"}
                  {type.value === "seminar" && "Expert talks and discussions"}
                  {type.value === "competition" && "Coding & technical contests"}
                  {type.value === "meetup" && "Networking and social events"}
                  {type.value === "webinar" && "Online learning sessions"}
                  {type.value === "conference" && "Large-scale technical events"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}