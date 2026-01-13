import { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Save, 
  Upload, 
  CreditCard, 
  Globe, 
  Github, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Globe as Earth,
  Briefcase,
  MapPin,
  Calendar,
  Edit,
  X,
  Check,
  Eye,
  EyeOff,
  Building,
  Wallet,
  Link,
  FileText,
  Shield,
  Bell,
  Smartphone,
  BookOpen
} from "lucide-react";
import { format } from "date-fns";

interface ProfileData {
  personal: {
    fullName: string;
    email: string;
    phone: string;
    bio: string;
    dateOfBirth: string;
    address: string;
    city: string;
    country: string;
  };
  professional: {
    designation: string;
    department: string;
    employeeId: string;
    joinDate: string;
    skills: string[];
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
    whatsapp: string;
  };
  financial: {
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    upiId: string;
  };
  security: {
    twoFactorEnabled: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
  };
  avatar: string;
}

const initialProfileData: ProfileData = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
  },
  professional: {
    designation: "",
    department: "",
    employeeId: "",
    joinDate: "",
    skills: [],
  },
  social: {
    github: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    website: "",
    whatsapp: "",
  },
  financial: {
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    upiId: "",
  },
  security: {
    twoFactorEnabled: false,
    emailNotifications: true,
    pushNotifications: true,
  },
  avatar: "",
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData>(initialProfileData);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [tempSkill, setTempSkill] = useState("");
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  // Save profile data
  const saveProfile = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      localStorage.setItem("userProfile", JSON.stringify(profile));
      setSaveStatus("saved");
      setIsEditing(null);
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  // Handle file upload for avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const avatarUrl = reader.result as string;
        setProfile(prev => ({ ...prev, avatar: avatarUrl }));
        setAvatarPreview(avatarUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle input changes
  const handleInputChange = (
    section: keyof ProfileData,
    field: string,
    value: string | boolean | string[]
  ) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object || {}),
        [field]: value,
      },
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (tempSkill.trim() && !profile.professional.skills.includes(tempSkill.trim())) {
      handleInputChange(
        "professional",
        "skills",
        [...profile.professional.skills, tempSkill.trim()]
      );
      setTempSkill("");
    }
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    handleInputChange(
      "professional",
      "skills",
      profile.professional.skills.filter(s => s !== skill)
    );
  };

  // Social media icons mapping
  const socialIcons = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    instagram: Instagram,
    website: Earth,
    whatsapp: Smartphone,
  };

  // Render editable field
  const renderEditableField = (
    section: keyof ProfileData,
    field: string,
    label: string,
    icon: React.ReactNode,
    type: string = "text",
    placeholder: string = ""
  ) => {
    const value = (profile[section] as any)[field];
    const isEditingField = isEditing === `${section}.${field}`;

    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
          {icon}
          {label}
        </label>
        {isEditingField ? (
          <div className="flex gap-2">
            <input
              type={type}
              value={value}
              onChange={(e) => handleInputChange(section, field, e.target.value)}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={placeholder}
              autoFocus
            />
            <button
              onClick={() => setIsEditing(null)}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <Check size={18} />
            </button>
          </div>
        ) : (
          <div
            className="flex justify-between items-center bg-gray-800 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-700 transition-colors group"
            onClick={() => setIsEditing(`${section}.${field}`)}
          >
            <span className={value ? "text-white" : "text-gray-500"}>
              {value || placeholder}
            </span>
            <Edit size={16} className="text-gray-500 group-hover:text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Profile Management</h1>
          <p className="text-gray-400">Complete your profile with personal, professional, and financial details</p>
        </div>
        <button
          onClick={saveProfile}
          disabled={saveStatus === "saving"}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            saveStatus === "saving" 
              ? "bg-blue-700 cursor-not-allowed" 
              : saveStatus === "saved"
              ? "bg-green-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {saveStatus === "saving" ? (
            <>
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check size={18} />
              Saved Successfully!
            </>
          ) : (
            <>
              <Save size={18} />
              Save All Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar & Personal Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Upload */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-40 h-40 rounded-full bg-gray-800 border-4 border-gray-700 overflow-hidden">
                  {profile.avatar || avatarPreview ? (
                    <img
                      src={profile.avatar || avatarPreview || ""}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User size={64} className="text-gray-600" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-blue-600 p-3 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-white">
                {profile.personal.fullName || "Your Name"}
              </h2>
              <p className="text-gray-400">
                {profile.professional.designation || "Your Designation"}
              </p>
              
              <div className="mt-4 w-full space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors">
                  <Upload size={18} />
                  Upload New Photo
                </button>
                {profile.avatar && (
                  <button 
                    onClick={() => {
                      setProfile(prev => ({ ...prev, avatar: "" }));
                      setAvatarPreview(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded-lg transition-colors"
                  >
                    <X size={18} />
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Profile Completeness
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Profile Score</span>
                  <span className="text-green-400">68%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-2/3"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Personal Info</span>
                  <span className={profile.personal.fullName ? "text-green-400" : "text-yellow-400"}>
                    {profile.personal.fullName ? "✓" : "○"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Bank Details</span>
                  <span className={profile.financial.bankName ? "text-green-400" : "text-yellow-400"}>
                    {profile.financial.bankName ? "✓" : "○"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Social Links</span>
                  <span className={
                    profile.social.github || profile.social.linkedin ? "text-green-400" : "text-yellow-400"
                  }>
                    {profile.social.github || profile.social.linkedin ? "✓" : "○"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={24} />
                Personal Information
              </h3>
              <span className="text-sm text-gray-400">Private & Confidential</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField("personal", "fullName", "Full Name", <User size={16} />, "text", "Enter your full name")}
              {renderEditableField("personal", "email", "Email Address", <Mail size={16} />, "email", "your@email.com")}
              {renderEditableField("personal", "phone", "Phone Number", <Phone size={16} />, "tel", "+91 9876543210")}
              {renderEditableField("personal", "dateOfBirth", "Date of Birth", <Calendar size={16} />, "date", "YYYY-MM-DD")}
              {renderEditableField("personal", "address", "Address", <MapPin size={16} />, "text", "Your complete address")}
              {renderEditableField("personal", "city", "City", <Building size={16} />, "text", "Your city")}
              {renderEditableField("personal", "country", "Country", <Globe size={16} />, "text", "Your country")}
            </div>
            
            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                <FileText size={16} />
                Bio / About Me
              </label>
              <textarea
                value={profile.personal.bio}
                onChange={(e) => handleInputChange("personal", "bio", e.target.value)}
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase size={24} />
              Professional Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField("professional", "designation", "Designation", <Briefcase size={16} />, "text", "e.g., Software Engineer")}
              {renderEditableField("professional", "department", "Department", <Building size={16} />, "text", "e.g., Engineering")}
              {renderEditableField("professional", "employeeId", "Employee ID", <User size={16} />, "text", "EMP001")}
              {renderEditableField("professional", "joinDate", "Join Date", <Calendar size={16} />, "date", "YYYY-MM-DD")}
            </div>
            
            <div className="mt-6">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <BookOpen size={16} />
                Skills & Expertise
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tempSkill}
                  onChange={(e) => setTempSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a skill (press Enter)"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.professional.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full"
                  >
                    <span className="text-white">{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Globe size={24} />
              Social Media Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(socialIcons).map(([platform, Icon]) => (
                <div key={platform} className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
                    <Icon size={16} />
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
                      <Link size={14} className="text-gray-500" />
                      <input
                        type="text"
                        value={profile.social[platform as keyof typeof profile.social] as string}
                        onChange={(e) => handleInputChange("social", platform, e.target.value)}
                        className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none"
                        placeholder={`https://${platform}.com/username`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Information (Secured) */}
          <div className="bg-gray-900 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard size={24} />
                Financial Information
              </h3>
              <div className="flex items-center gap-2 text-amber-400">
                <Shield size={16} />
                <span className="text-sm">Encrypted & Secure</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderEditableField("financial", "bankName", "Bank Name", <Building size={16} />, "text", "e.g., State Bank of India")}
              {renderEditableField("financial", "accountHolderName", "Account Holder", <User size={16} />, "text", "Name as in bank records")}
              
              <div className="space-y-2">
                <label className="flex items-center justify-between text-sm font-medium text-gray-300">
                  <span className="flex items-center gap-2">
                    <Wallet size={16} />
                    Account Number
                  </span>
                  <button
                    onClick={() => setShowAccountNumber(!showAccountNumber)}
                    className="text-gray-400 hover:text-white"
                  >
                    {showAccountNumber ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </label>
                <div className="flex gap-2">
                  <input
                    type={showAccountNumber ? "text" : "password"}
                    value={profile.financial.accountNumber}
                    onChange={(e) => handleInputChange("financial", "accountNumber", e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
              </div>
              
              {renderEditableField("financial", "ifscCode", "IFSC Code", <FileText size={16} />, "text", "e.g., SBIN0001234")}
              {renderEditableField("financial", "upiId", "UPI ID", <Smartphone size={16} />, "text", "username@upi")}
            </div>
          </div>

          {/* Security & Privacy Settings */}
          <div className="bg-gray-900 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={24} />
              Security & Privacy
            </h3>
            
            <div className="space-y-4">
              {Object.entries(profile.security).map(([setting, value]) => (
                <div key={setting} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {setting === "twoFactorEnabled" ? (
                      <Shield size={18} className="text-blue-400" />
                    ) : setting === "emailNotifications" ? (
                      <Mail size={18} className="text-green-400" />
                    ) : (
                      <Bell size={18} className="text-purple-400" />
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {setting === "twoFactorEnabled" ? "Two-Factor Authentication" :
                         setting === "emailNotifications" ? "Email Notifications" : "Push Notifications"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {setting === "twoFactorEnabled" ? "Add an extra layer of security" :
                         "Receive important updates and alerts"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInputChange("security", setting, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-blue-600" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-sm text-gray-500 p-4">
        <p className="flex items-center justify-center gap-2">
          <Shield size={14} />
          Your data is encrypted and stored securely. Only authorized personnel can access sensitive information.
        </p>
      </div>
    </div>
  );
}