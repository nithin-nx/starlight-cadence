import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe as EarthIcon,
  Edit,
  Save,
  Upload,
  Camera,
  X,
  CheckCircle,
  Shield,
  CreditCard,
  FileText,
  Smartphone,
  Award,
  Users,
  Briefcase,
  BookOpen,
  Key,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  department: string | null;
  year_of_study: string | null;
  avatar_url: string | null;
  bio: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  created_at: string;
  updated_at: string;
}

interface SocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
  whatsapp: string;
}

interface FinancialInfo {
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder: string;
  upi_id: string;
}

interface ProfileFormData {
  full_name: string;
  phone: string;
  department: string;
  year_of_study: string;
  bio: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  social_links: SocialLinks;
  financial_info: FinancialInfo;
}

export default function Profile() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: "",
    phone: "",
    department: "",
    year_of_study: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    social_links: {
      github: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      website: "",
      whatsapp: ""
    },
    financial_info: {
      bank_name: "",
      account_number: "",
      ifsc_code: "",
      account_holder: "",
      upi_id: ""
    }
  });

  const departments = ["CSE", "ECE", "EEE", "ME", "CE", "Other"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const states = [
    "Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana",
    "Maharashtra", "Delhi", "West Bengal", "Gujarat", "Rajasthan", "Other"
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to view your profile",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch user profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (profileData) {
        setProfile({
          ...profileData,
          year_of_study: (profileData as any).year_of_study || null,
          bio: (profileData as any).bio || null,
          address: (profileData as any).address || null,
          city: (profileData as any).city || null,
          state: (profileData as any).state || null,
          pincode: (profileData as any).pincode || null,
          phone: profileData.phone || null
        });
      }

      if (profileData) {
        // Parse JSON fields if they exist
        const socialLinks = (profileData as any).social_links || {};
        const financialInfo = (profileData as any).financial_info || {};

        setFormData({
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
          department: profileData.department || "",
          year_of_study: (profileData as any).year_of_study || "",
          bio: (profileData as any).bio || "",
          address: (profileData as any).address || "",
          city: (profileData as any).city || "",
          state: (profileData as any).state || "",
          pincode: (profileData as any).pincode || "",
          social_links: {
            github: socialLinks.github || "",
            linkedin: socialLinks.linkedin || "",
            twitter: socialLinks.twitter || "",
            instagram: socialLinks.instagram || "",
            website: socialLinks.website || "",
            whatsapp: socialLinks.whatsapp || ""
          },
          financial_info: {
            bank_name: financialInfo.bank_name || "",
            account_number: financialInfo.account_number || "",
            ifsc_code: financialInfo.ifsc_code || "",
            account_holder: financialInfo.account_holder || "",
            upi_id: financialInfo.upi_id || ""
          }
        });
      }

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Omit<ProfileFormData, 'social_links' | 'financial_info'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleFinancialInfoChange = (field: keyof FinancialInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      financial_info: {
        ...prev.financial_info,
        [field]: value
      }
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB",
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setAvatarFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `avatars/${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('user-assets')
        .upload(fileName, avatarFile, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('user-assets')
        .getPublicUrl(fileName);

      return urlData.publicUrl;

    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture",
        variant: "destructive"
      });
      return null;
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to save profile",
          variant: "destructive"
        });
        return;
      }

      // Upload avatar if changed
      let avatarUrl = profile?.avatar_url;
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const updateData: any = {
        full_name: formData.full_name,
        phone: formData.phone,
        department: formData.department,
        year_of_study: formData.year_of_study,
        bio: formData.bio,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        social_links: formData.social_links,
        financial_info: formData.financial_info,
        updated_at: new Date().toISOString()
      };

      if (avatarUrl) {
        updateData.avatar_url = avatarUrl;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });

      setIsEditing(false);
      setAvatarFile(null);
      fetchProfile(); // Refresh profile data

    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getProfileCompleteness = () => {
    let filledFields = 0;
    const totalFields = 12; // Adjust based on your form fields
    
    if (formData.full_name.trim()) filledFields++;
    if (formData.phone.trim()) filledFields++;
    if (formData.department) filledFields++;
    if (formData.year_of_study) filledFields++;
    if (formData.bio.trim()) filledFields++;
    if (formData.address.trim()) filledFields++;
    if (formData.city.trim()) filledFields++;
    if (formData.state) filledFields++;
    if (formData.pincode.trim()) filledFields++;
    if (Object.values(formData.social_links).some(link => link.trim())) filledFields++;
    if (Object.values(formData.financial_info).some(info => info.trim())) filledFields++;
    if (profile?.avatar_url || avatarPreview) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const completeness = getProfileCompleteness();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completeness */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Profile Completeness</h3>
              <p className="text-sm text-gray-600">
                Complete your profile to unlock all features
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-primary">{completeness}%</span>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Basic Info</span>
            <span>Contact</span>
            <span>Social</span>
            <span>Complete</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-20 h-20 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 bg-primary text-white p-3 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-center">
                  {profile?.full_name || "Your Name"}
                </h2>
                <p className="text-gray-600 text-center">
                  {profile?.department && profile.year_of_study 
                    ? `${profile.department}, ${profile.year_of_study}`
                    : "ISTE Member"}
                </p>
                
                {profile?.email && (
                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{profile.email}</span>
                  </div>
                )}

                <div className="w-full mt-6 space-y-3">
                  {isEditing && avatarFile && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(null);
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                  
                  {!isEditing && (
                    <Button variant="outline" className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Profile Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {profile?.created_at 
                      ? format(new Date(profile.created_at), "MMM yyyy")
                      : "N/A"
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {profile?.updated_at 
                      ? format(new Date(profile.updated_at), "MMM dd, yyyy")
                      : "N/A"
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-medium">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Account Status</span>
                  <Badge className="bg-green-500">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange('department', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year_of_study">Year of Study</Label>
                    <Select
                      value={formData.year_of_study}
                      onValueChange={(value) => handleInputChange('year_of_study', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map(year => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </CardTitle>
              <CardDescription>
                Your contact address
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      disabled={!isEditing}
                      placeholder="City"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Github className="w-4 h-4" />
                    GitHub
                  </Label>
                  <Input
                    value={formData.social_links.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://github.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </Label>
                  <Input
                    value={formData.social_links.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Label>
                  <Input
                    value={formData.social_links.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Label>
                  <Input
                    value={formData.social_links.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <EarthIcon className="w-4 h-4" />
                    Website
                  </Label>
                  <Input
                    value={formData.social_links.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    WhatsApp
                  </Label>
                  <Input
                    value={formData.social_links.whatsapp}
                    onChange={(e) => handleSocialLinkChange('whatsapp', e.target.value)}
                    disabled={!isEditing}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Financial Information
                <Badge className="ml-2">
                  <Shield className="w-3 h-3 mr-1" />
                  Encrypted
                </Badge>
              </CardTitle>
              <CardDescription>
                For payment verification and reimbursements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input
                      id="bank_name"
                      value={formData.financial_info.bank_name}
                      onChange={(e) => handleFinancialInfoChange('bank_name', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., State Bank of India"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account_holder">Account Holder Name</Label>
                    <Input
                      id="account_holder"
                      value={formData.financial_info.account_holder}
                      onChange={(e) => handleFinancialInfoChange('account_holder', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Name as in bank account"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account_number" className="flex justify-between">
                      <span>Account Number</span>
                      {formData.financial_info.account_number && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAccountNumber(!showAccountNumber)}
                        >
                          {showAccountNumber ? (
                            <>
                              <EyeOff className="w-3 h-3 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-3 h-3 mr-1" />
                              Show
                            </>
                          )}
                        </Button>
                      )}
                    </Label>
                    <Input
                      id="account_number"
                      type={showAccountNumber ? "text" : "password"}
                      value={formData.financial_info.account_number}
                      onChange={(e) => handleFinancialInfoChange('account_number', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Enter account number"
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifsc_code">IFSC Code</Label>
                    <Input
                      id="ifsc_code"
                      value={formData.financial_info.ifsc_code}
                      onChange={(e) => handleFinancialInfoChange('ifsc_code', e.target.value)}
                      disabled={!isEditing}
                      placeholder="e.g., SBIN0001234"
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="upi_id">UPI ID</Label>
                  <Input
                    id="upi_id"
                    value={formData.financial_info.upi_id}
                    onChange={(e) => handleFinancialInfoChange('upi_id', e.target.value)}
                    disabled={!isEditing}
                    placeholder="username@bank"
                  />
                  <p className="text-xs text-gray-500">
                    For quick payments and reimbursements
                  </p>
                </div>

                {isEditing && (
                  <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-900">Security Notice</h4>
                        <p className="text-sm text-amber-700 mt-1">
                          Your financial information is encrypted and stored securely. 
                          Only authorized ISTE executives can access this information 
                          for payment verification purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {isEditing && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={saving}
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={saveProfile}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}