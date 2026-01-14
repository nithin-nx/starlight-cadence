"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  BellOff,
  Mail,
  Moon,
  Sun,
  Globe,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Calendar,
  Languages,
  FileText,
  Database,
  Cloud,
  HardDrive,
  Key,
  LogOut,
  Save,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Smartphone as MobileIcon,
  Tablet,
  Laptop,
  Monitor,
  Award,
  Info
} from "lucide-react";

interface UserSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  two_factor_auth: boolean;
  auto_logout: number;
  language: string;
  timezone: string;
  date_format: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  data_sharing: boolean;
  cookie_consent: boolean;
  display_density: 'compact' | 'comfortable' | 'spacious';
}

interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'laptop';
  last_active: string;
  location: string;
  current: boolean;
}

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<UserSettings>({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    two_factor_auth: false,
    auto_logout: 30,
    language: 'en',
    timezone: 'Asia/Kolkata',
    date_format: 'DD/MM/YYYY',
    theme: 'system',
    currency: 'INR',
    data_sharing: true,
    cookie_consent: true,
    display_density: 'comfortable'
  });
  const [devices, setDevices] = useState<ConnectedDevice[]>([
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'laptop',
      last_active: new Date().toISOString(),
      location: 'Kerala, IN',
      current: true
    },
    {
      id: '2',
      name: 'iPhone 14',
      type: 'mobile',
      last_active: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      location: 'Kerala, IN',
      current: false
    }
  ]);
  const [saving, setSaving] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [confirmDeleteChecked, setConfirmDeleteChecked] = useState(false);
  const [exportFirstChecked, setExportFirstChecked] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' }
  ];

  const timezones = [
    'Asia/Kolkata',
    'Asia/Dubai',
    'America/New_York',
    'Europe/London',
    'Asia/Singapore',
    'Australia/Sydney'
  ];

  const dateFormats = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'YYYY-MM-DD',
    'DD MMM YYYY'
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' }
  ];

  const autoLogoutOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 0, label: 'Never' }
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'account', label: 'Account', icon: User },
    { id: 'devices', label: 'Devices', icon: MobileIcon }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      
      // Save to localStorage
      localStorage.setItem('user_settings', JSON.stringify(settings));

      // Apply theme
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else if (settings.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        // System theme
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }

      toast({
        title: "Settings Saved",
        description: "Your preferences have been updated successfully",
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: keyof UserSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleExportData = () => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `iste-settings-${new Date().getTime()}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setShowExportModal(false);
    toast({
      title: "Data Exported",
      description: "Your settings have been exported successfully",
    });
  };

  const handleDeleteAccount = async () => {
    try {
      // Delete the user account using Supabase Auth Admin API
      const { error } = await supabase.auth.admin.deleteUser(
        (await supabase.auth.getUser()).data.user?.id || ''
      );
      
      if (error) throw error;

      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted",
      });

      // Sign out and redirect
      await supabase.auth.signOut();
      window.location.href = '/';

    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Deletion Failed",
        description: "Failed to delete account. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleRevokeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
    toast({
      title: "Device Revoked",
      description: "Device access has been revoked",
    });
  };

  const getDeviceIcon = (type: ConnectedDevice['type']) => {
    switch (type) {
      case 'mobile': return MobileIcon;
      case 'tablet': return Tablet;
      case 'laptop': return Laptop;
      case 'desktop': return Monitor;
      default: return MobileIcon;
    }
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">
          Customize your ISTE dashboard experience
        </p>
      </div>

      {/* Settings Tabs */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar - Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  className="w-full mb-2"
                  onClick={() => setShowExportModal(true)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={saveSettings}
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Content */}
        <div className="flex-1">
          {/* General Settings */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="w-5 h-5" />
                  General Settings
                </CardTitle>
                <CardDescription>
                  Basic application preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={settings.language}
                        onValueChange={(value) => handleSettingChange('language', value)}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Languages className="w-4 h-4" />
                            <SelectValue placeholder="Select language" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map(lang => (
                            <SelectItem key={lang.code} value={lang.code}>
                              {lang.name} ({lang.native})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={settings.timezone}
                        onValueChange={(value) => handleSettingChange('timezone', value)}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            <SelectValue placeholder="Select timezone" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {timezones.map(tz => (
                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date_format">Date Format</Label>
                      <Select
                        value={settings.date_format}
                        onValueChange={(value) => handleSettingChange('date_format', value)}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <SelectValue placeholder="Select date format" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {dateFormats.map(format => (
                            <SelectItem key={format} value={format}>{format}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select
                        value={settings.currency}
                        onValueChange={(value) => handleSettingChange('currency', value)}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <SelectValue placeholder="Select currency" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map(currency => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.symbol} {currency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Auto Logout
                  </h3>
                  <div className="space-y-2">
                    <Select
                      value={settings.auto_logout.toString()}
                      onValueChange={(value) => handleSettingChange('auto_logout', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select auto logout duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {autoLogoutOptions.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Automatically log out after {settings.auto_logout === 0 ? 'never' : `${settings.auto_logout} minutes`} of inactivity
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Control how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.email_notifications}
                      onCheckedChange={(checked) => handleSettingChange('email_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.push_notifications}
                      onCheckedChange={(checked) => handleSettingChange('push_notifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">
                        Promotional emails and newsletters
                      </p>
                    </div>
                    <Switch
                      checked={settings.marketing_emails}
                      onCheckedChange={(checked) => handleSettingChange('marketing_emails', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Notification Types</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Bell className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <Label>Event Updates</Label>
                          <p className="text-sm text-gray-500">New events & reminders</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <User className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <Label>Membership Updates</Label>
                          <p className="text-sm text-gray-500">Application status</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Award className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <Label>Certificate Updates</Label>
                          <p className="text-sm text-gray-500">New certificates</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Clock className="w-4 h-4 text-amber-600" />
                        </div>
                        <div>
                          <Label>Payment Reminders</Label>
                          <p className="text-sm text-gray-500">Due payments</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy & Security */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base flex items-center gap-2">
                        Two-Factor Authentication
                        <Badge className="bg-green-500">Recommended</Badge>
                      </Label>
                      <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={settings.two_factor_auth}
                      onCheckedChange={(checked) => handleSettingChange('two_factor_auth', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Data Sharing</Label>
                      <p className="text-sm text-gray-500">
                        Share anonymous usage data to improve ISTE
                      </p>
                    </div>
                    <Switch
                      checked={settings.data_sharing}
                      onCheckedChange={(checked) => handleSettingChange('data_sharing', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Cookie Consent</Label>
                      <p className="text-sm text-gray-500">
                        Allow cookies for enhanced experience
                      </p>
                    </div>
                    <Switch
                      checked={settings.cookie_consent}
                      onCheckedChange={(checked) => handleSettingChange('cookie_consent', checked)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Session Management
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <Label>Current Sessions</Label>
                        <p className="text-sm text-gray-500">
                          Manage active login sessions
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <Label>Login History</Label>
                        <p className="text-sm text-gray-500">
                          Recent login attempts
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Logs
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900">Security Tips</h4>
                      <ul className="mt-2 space-y-1 text-sm text-blue-700">
                        <li>• Use a strong, unique password</li>
                        <li>• Enable two-factor authentication</li>
                        <li>• Review connected devices regularly</li>
                        <li>• Log out from public computers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Theme</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleSettingChange('theme', 'light')}
                      className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
                        settings.theme === 'light'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-video bg-white border rounded-md mb-3 overflow-hidden">
                        <div className="h-3 bg-gray-100"></div>
                        <div className="p-2">
                          <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                          <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        <span className="font-medium">Light</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSettingChange('theme', 'dark')}
                      className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
                        settings.theme === 'dark'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-video bg-gray-900 border border-gray-700 rounded-md mb-3 overflow-hidden">
                        <div className="h-3 bg-gray-800"></div>
                        <div className="p-2">
                          <div className="h-2 bg-gray-700 rounded w-3/4 mb-1"></div>
                          <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        <span className="font-medium">Dark</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSettingChange('theme', 'system')}
                      className={`flex flex-col items-center p-4 border rounded-lg transition-all ${
                        settings.theme === 'system'
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="w-full aspect-video bg-gradient-to-br from-white to-gray-900 border rounded-md mb-3 overflow-hidden">
                        <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-800"></div>
                        <div className="p-2">
                          <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded w-3/4 mb-1"></div>
                          <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-700 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <SettingsIcon className="w-4 h-4" />
                        <span className="font-medium">System</span>
                      </div>
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Display Density</h3>
                  <div className="flex gap-4">
                    {['Compact', 'Comfortable', 'Spacious'].map(density => (
                      <button
                        key={density}
                        className={`px-4 py-2 border rounded-lg transition-colors ${
                          settings.display_density === density.toLowerCase()
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSettingChange('display_density', density.toLowerCase())}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-gray-50 border p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900">Preview Changes</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Changes to appearance settings will be applied immediately. 
                        Some features may require a page refresh.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Settings
                </CardTitle>
                <CardDescription>
                  Manage your account preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Account Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <Label>Email Address</Label>
                        <p className="text-sm text-gray-500">
                          Primary email for notifications
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <Label>Password</Label>
                        <p className="text-sm text-gray-500">
                          Last changed 30 days ago
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Data Management</h3>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => setShowExportModal(true)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Account Data
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900">Danger Zone</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Deleting your account will permanently remove all your data, 
                        including certificates, event history, and payment records. 
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connected Devices */}
          {activeTab === 'devices' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MobileIcon className="w-5 h-5" />
                  Connected Devices
                </CardTitle>
                <CardDescription>
                  Devices that have accessed your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {devices.map(device => {
                    const DeviceIcon = getDeviceIcon(device.type);
                    return (
                      <div
                        key={device.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <DeviceIcon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{device.name}</span>
                              {device.current && (
                                <Badge className="bg-green-500">Current</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {formatLastActive(device.last_active)} • {device.location}
                            </p>
                          </div>
                        </div>

                        {!device.current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeDevice(device.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold">Security Recommendations</h3>
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <ul className="space-y-2 text-sm text-blue-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Review connected devices regularly
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Revoke access for unfamiliar devices
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Use strong passwords for each device
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        Enable two-factor authentication
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download your account data in JSON format
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Export Format</Label>
                <Select defaultValue="json">
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON (Recommended)</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="xml">XML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Included</Label>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Profile Information</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Event History</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Certificate Records</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Payment History</span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-sm text-amber-700">
                  This export contains sensitive information. Keep it secure and do not share it publicly.
                </p>
              </div>
            </CardContent>
            <div className="flex gap-2 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExportModal(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleExportData}>
                <Download className="w-4 h-4 mr-2" />
                Export Now
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                Delete Account
              </CardTitle>
              <CardDescription>
                This action cannot be undone
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700">
                  You are about to permanently delete your ISTE account. All your data will be removed, including:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-red-700">
                  <li>• Your profile information</li>
                  <li>• All certificates earned</li>
                  <li>• Event participation history</li>
                  <li>• Payment records</li>
                  <li>• Membership status</li>
                </ul>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="confirm-delete"
                    className="mt-1"
                    checked={confirmDeleteChecked}
                    onChange={(e) => setConfirmDeleteChecked(e.target.checked)}
                  />
                  <label htmlFor="confirm-delete" className="text-sm text-gray-700">
                    I understand that this action is permanent and cannot be undone
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="export-first"
                    className="mt-1"
                    checked={exportFirstChecked}
                    onChange={(e) => setExportFirstChecked(e.target.checked)}
                  />
                  <label htmlFor="export-first" className="text-sm text-gray-700">
                    I have exported my data if needed
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Key className="w-4 h-4" />
                <span>Enter your password to confirm:</span>
              </div>
              <Input
                type="password"
                placeholder="Enter your password"
              />
            </CardContent>
            <div className="flex gap-2 p-6 pt-0">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDeleteAccount}
                disabled={!confirmDeleteChecked}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}