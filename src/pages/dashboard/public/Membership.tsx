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
  Users,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  Building,
  GraduationCap,
  Phone,
  Mail,
  Upload,
  Shield,
  Award,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";

interface MembershipApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  year_of_study: string;
  status: string;
  created_at: string;
  reviewed_at: string;
  reviewed_by: string;
  reason: string;
  user_id: string;
}

interface NewApplication {
  full_name: string;
  email: string;
  phone: string;
  department: string;
  year_of_study: string;
  dob: string;
  payment_proof: File | null;
}

export default function Membership() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [newApplication, setNewApplication] = useState<NewApplication>({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    year_of_study: "",
    dob: "",
    payment_proof: null
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const departments = ["CSE", "ECE", "EEE", "ME", "CE"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('email', user.email)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load your applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      pending: <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>,
      under_review: <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        <AlertCircle className="w-3 h-3 mr-1" /> Under Review
      </Badge>,
      approved: <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle className="w-3 h-3 mr-1" /> Approved
      </Badge>,
      rejected: <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" /> Rejected
      </Badge>
    };
    return badges[status] || <Badge variant="outline">{status}</Badge>;
  };

  const handleInputChange = (field: keyof NewApplication, value: string | File) => {
    setNewApplication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!newApplication.full_name.trim()) errors.push("Full name is required");
    if (!newApplication.email.trim() || !/\S+@\S+\.\S+/.test(newApplication.email)) 
      errors.push("Valid email is required");
    if (!newApplication.phone.trim() || !/^\d{10}$/.test(newApplication.phone))
      errors.push("10-digit phone number is required");
    if (!newApplication.department) errors.push("Department is required");
    if (!newApplication.year_of_study) errors.push("Year of study is required");
    if (!newApplication.dob) errors.push("Date of birth is required");
    if (!newApplication.payment_proof) errors.push("Payment proof is required");

    return errors;
  };

  const handleSubmit = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast({
        title: "Validation Error",
        description: errors[0],
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload payment proof
      let paymentProofUrl = "";
      if (newApplication.payment_proof) {
        const fileExt = newApplication.payment_proof.name.split('.').pop();
        const fileName = `payment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, newApplication.payment_proof);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);
        
        paymentProofUrl = urlData.publicUrl;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('membership_applications')
        .insert([{
          full_name: newApplication.full_name,
          email: newApplication.email,
          phone: newApplication.phone,
          department: newApplication.department,
          year_of_study: newApplication.year_of_study,
          dob: newApplication.dob,
          payment_proof_url: paymentProofUrl,
          user_id: user?.id || null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast({
        title: "Application Submitted",
        description: "Your membership application has been submitted successfully.",
      });

      // Reset form and refresh applications
      setNewApplication({
        full_name: "",
        email: "",
        phone: "",
        department: "",
        year_of_study: "",
        dob: "",
        payment_proof: null
      });
      setShowApplicationForm(false);
      fetchApplications();

    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    handleInputChange('payment_proof', file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ISTE Membership</h1>
        <p className="text-gray-600 mt-2">
          Join the Indian Society for Technical Education and enhance your technical journey
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Certificates</CardTitle>
            </div>
            <CardDescription>
              Receive participation and achievement certificates for all events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Workshop participation certificates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Competition achievement certificates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Membership certificate
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Events & Workshops</CardTitle>
            </div>
            <CardDescription>
              Access to exclusive technical events and workshops
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Technical workshops by industry experts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Coding competitions and hackathons
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Industrial visits and guest lectures
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Networking</CardTitle>
            </div>
            <CardDescription>
              Connect with industry professionals and fellow students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Industry expert mentorship
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Alumni network access
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Placement assistance
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Application Status & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              My Applications
            </CardTitle>
            <CardDescription>
              Track your membership application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading applications...</p>
              </div>
            ) : applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{app.full_name}</h3>
                        <p className="text-sm text-gray-500">{app.email}</p>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                      <div>
                        <span className="font-medium">Department:</span> {app.department}
                      </div>
                      <div>
                        <span className="font-medium">Year:</span> {app.year_of_study}
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span>{" "}
                        {format(new Date(app.created_at), "MMM dd, yyyy")}
                      </div>
                      {app.reviewed_at && (
                        <div>
                          <span className="font-medium">Reviewed:</span>{" "}
                          {format(new Date(app.reviewed_at), "MMM dd, yyyy")}
                        </div>
                      )}
                    </div>
                    {app.reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-600">
                          <span className="font-medium">Reason:</span> {app.reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No applications found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Submit your first membership application
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Application Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              New Membership Application
            </CardTitle>
            <CardDescription>
              Fill in your details to apply for ISTE membership
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showApplicationForm ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={newApplication.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newApplication.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="student@gecidukki.ac.in"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newApplication.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={newApplication.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year of Study *</Label>
                    <Select
                      value={newApplication.year_of_study}
                      onValueChange={(value) => handleInputChange('year_of_study', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth *</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={newApplication.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment_proof">Payment Proof *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="payment_proof"
                      accept="image/*,.pdf"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="payment_proof" className="cursor-pointer">
                      {newApplication.payment_proof ? (
                        <div className="space-y-2">
                          <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                          <p className="font-medium">{newApplication.payment_proof.name}</p>
                          <p className="text-sm text-gray-500">
                            {(newApplication.payment_proof.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <p className="font-medium">Click to upload payment proof</p>
                          <p className="text-sm text-gray-500">
                            Screenshot of ₹500 payment (Max 5MB)
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowApplicationForm(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 space-y-4">
                <div className="inline-flex p-4 bg-primary/10 rounded-full">
                  <Users className="w-12 h-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Become an ISTE Member</h3>
                  <p className="text-gray-600 mb-6">
                    Join our community of technical enthusiasts and gain access to exclusive benefits
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-amber-600" />
                      <span className="font-semibold text-amber-900">Membership Fee: ₹500</span>
                    </div>
                    <p className="text-sm text-amber-700">
                      One-time payment for lifetime membership benefits
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full"
                  >
                    Start Application
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}