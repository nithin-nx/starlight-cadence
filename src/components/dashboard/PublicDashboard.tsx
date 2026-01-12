import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Bell, Calendar, Award, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Profile {
  full_name: string | null;
  email: string | null;
  phone: string | null;
  department: string | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
}

interface Certificate {
  id: string;
  certificate_url: string | null;
  issued_at: string;
  events: { title: string } | null;
}

const PublicDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Application form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department: '',
    year_of_study: '',
    reason: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotifications();
      fetchCertificates();
      checkExistingApplication();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, email, phone, department')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (data) {
      setProfile(data);
      setFormData(prev => ({
        ...prev,
        full_name: data.full_name || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        department: data.department || ''
      }));
    }
  };

  const fetchNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('id, title, message, created_at')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setNotifications(data);
  };

  const fetchCertificates = async () => {
    const { data } = await supabase
      .from('certificates')
      .select('id, certificate_url, issued_at, events(title)')
      .eq('user_id', user?.id)
      .order('issued_at', { ascending: false });
    
    if (data) setCertificates(data as Certificate[]);
  };

  const checkExistingApplication = async () => {
    const { data } = await supabase
      .from('membership_applications')
      .select('id, status')
      .eq('user_id', user?.id)
      .maybeSingle();
    
    if (data) setApplicationSubmitted(true);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase
      .from('membership_applications')
      .insert({
        user_id: user?.id,
        ...formData
      });

    if (error) {
      toast.error('Failed to submit application');
    } else {
      toast.success('Application submitted successfully!');
      setApplicationSubmitted(true);
    }
    setIsSubmitting(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'apply', label: 'Apply Membership', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'certificates', label: 'Certificates', icon: Award },
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-foreground">
            Welcome, <span className="text-primary">{profile?.full_name || 'Member'}</span>
          </h1>
          <p className="text-muted-foreground mt-1">Public Member Dashboard</p>
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
        {activeTab === 'profile' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label>Full Name</Label>
                <p className="text-foreground mt-1">{profile?.full_name || 'Not set'}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-foreground mt-1">{profile?.email || user?.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-foreground mt-1">{profile?.phone || 'Not set'}</p>
              </div>
              <div>
                <Label>Department</Label>
                <p className="text-foreground mt-1">{profile?.department || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'apply' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Membership Application</h2>
            {applicationSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-primary" size={32} />
                </div>
                <h3 className="text-lg font-semibold">Application Submitted</h3>
                <p className="text-muted-foreground mt-2">
                  Your application is under review. We'll notify you once it's processed.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="year">Year of Study</Label>
                    <Input
                      id="year"
                      value={formData.year_of_study}
                      onChange={(e) => setFormData({ ...formData, year_of_study: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Why do you want to join ISTE?</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Notifications</h2>
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No notifications yet</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <p className="text-muted-foreground text-sm mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-6">Your Certificates</h2>
            {certificates.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No certificates yet</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-4 bg-muted/50 rounded-lg">
                    <Award className="text-primary mb-2" size={24} />
                    <h3 className="font-semibold">{cert.events?.title || 'Certificate'}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Issued: {new Date(cert.issued_at).toLocaleDateString()}
                    </p>
                    {cert.certificate_url && (
                      <a
                        href={cert.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary text-sm mt-2 inline-block hover:underline"
                      >
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PublicDashboard;
