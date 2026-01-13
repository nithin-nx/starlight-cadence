import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  Languages,
  CreditCard,
  Key,
  Users,
  FileText,
  AlertTriangle,
  RefreshCw,
  Trash2,
  Check,
  X,
  LogOut,
  BellRing,
  Mail as MailIcon,
  MessageSquare,
  Cloud,
  HardDrive,
  Network,
  Cpu,
  MemoryStick,
  ShieldAlert,
  KeyRound,
  BadgeCheck,
  Scan,
  QrCode,
  Fingerprint,
  Smartphone as Mobile,
  Tablet,
  Laptop,
  ChevronRight,
  Info,
  HelpCircle,
  ExternalLink,
  Copy,
  Share2,
  Zap,
  Battery,
  Wifi,
  WifiOff,
  Bluetooth,
  SmartphoneNfc,
  ShieldCheck,
  ShieldOff,
  ShieldQuestion,
  DatabaseBackup,
  CloudOff,
  Wrench,
  Code,
  Terminal,
  GitBranch,
  GitPullRequest,
  GitCommit,
  GitCompare,
  GitMerge,
  GitFork,
  GitPullRequestClosed,
  GitPullRequestDraft,
  Github,
} from "lucide-react";

// Types
interface SettingCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

interface Theme {
  id: string;
  name: string;
  value: string;
  icon: React.ReactNode;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface BackupSchedule {
  id: string;
  label: string;
  frequency: string;
  lastBackup: string | null;
  enabled: boolean;
}

interface Device {
  id: string;
  name: string;
  type: string;
  lastActive: string;
  location: string;
  current: boolean;
}

// Initial state
const initialSettings = {
  // Appearance
  theme: "dark",
  fontSize: 14,
  density: "comfortable",
  reducedMotion: false,
  
  // Notifications
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  soundEnabled: true,
  
  // Privacy
  twoFactorAuth: false,
  showOnlineStatus: true,
  dataCollection: true,
  cookieConsent: true,
  
  // Account
  language: "en",
  timezone: "UTC",
  dateFormat: "MM/DD/YYYY",
  currency: "USD",
  
  // Security
  autoLogout: 30,
  loginAlerts: true,
  suspiciousActivityAlerts: true,
  
  // Performance
  cacheEnabled: true,
  hardwareAcceleration: true,
  backgroundSync: true,
  
  // Data
  autoSave: true,
  backupFrequency: "daily",
  exportFormat: "json",
  
  // Advanced
  developerMode: false,
  apiAccess: false,
  webhooksEnabled: false,
};

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [activeTab, setActiveTab] = useState("general");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: "1",
      name: "MacBook Pro",
      type: "laptop",
      lastActive: "2024-01-14T10:30:00",
      location: "New York, US",
      current: true,
    },
    {
      id: "2",
      name: "iPhone 15 Pro",
      type: "mobile",
      lastActive: "2024-01-14T09:15:00",
      location: "New York, US",
      current: false,
    },
    {
      id: "3",
      name: "iPad Air",
      type: "tablet",
      lastActive: "2024-01-13T14:20:00",
      location: "London, UK",
      current: false,
    },
  ]);

  // Settings categories
  const categories: SettingCategory[] = [
    {
      id: "general",
      title: "General",
      icon: <SettingsIcon size={20} />,
      description: "Basic application settings",
    },
    {
      id: "appearance",
      title: "Appearance",
      icon: <Palette size={20} />,
      description: "Theme, layout, and display",
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: <Bell size={20} />,
      description: "Alerts and notification preferences",
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: <Shield size={20} />,
      description: "Security and privacy controls",
    },
    {
      id: "account",
      title: "Account",
      icon: <User size={20} />,
      description: "Account preferences and language",
    },
    {
      id: "data",
      title: "Data & Storage",
      icon: <Database size={20} />,
      description: "Backup, export, and storage",
    },
    {
      id: "advanced",
      title: "Advanced",
      icon: <Code size={20} />,
      description: "Developer and advanced options",
    },
  ];

  // Theme options
  const themes: Theme[] = [
    { id: "light", name: "Light", value: "light", icon: <Sun size={18} /> },
    { id: "dark", name: "Dark", value: "dark", icon: <Moon size={18} /> },
    { id: "system", name: "System", value: "system", icon: <Monitor size={18} /> },
  ];

  // Language options
  const languages: Language[] = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  ];

  // Notification preferences
  const notificationPrefs: NotificationPreference[] = [
    {
      id: "messages",
      label: "Direct Messages",
      description: "When someone sends you a message",
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: "mentions",
      label: "Mentions",
      description: "When someone mentions you",
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: "updates",
      label: "System Updates",
      description: "Important system notifications",
      email: true,
      push: false,
      inApp: true,
    },
    {
      id: "events",
      label: "Event Reminders",
      description: "Upcoming events and deadlines",
      email: true,
      push: true,
      inApp: true,
    },
    {
      id: "security",
      label: "Security Alerts",
      description: "Login attempts and security events",
      email: true,
      push: true,
      inApp: true,
    },
  ];

  // Backup schedules
  const backupSchedules: BackupSchedule[] = [
    {
      id: "daily",
      label: "Daily Backup",
      frequency: "Every day at 2:00 AM",
      lastBackup: "2024-01-14T02:00:00",
      enabled: true,
    },
    {
      id: "weekly",
      label: "Weekly Backup",
      frequency: "Every Sunday at 3:00 AM",
      lastBackup: "2024-01-14T03:00:00",
      enabled: true,
    },
    {
      id: "monthly",
      label: "Monthly Backup",
      frequency: "1st of every month at 4:00 AM",
      lastBackup: "2024-01-01T04:00:00",
      enabled: false,
    },
  ];

  // Timezone options (simplified)
  const timezones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Asia/Kolkata",
    "Australia/Sydney",
  ];

  // Date format options
  const dateFormats = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    { value: "DD MMM YYYY", label: "DD MMM YYYY" },
  ];

  // Currency options
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "JPY", symbol: "¥", name: "Japanese Yen" },
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
  ];

  // Handle setting change
  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Save settings
  const saveSettings = async () => {
    setSaveStatus("saving");
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem("appSettings", JSON.stringify(settings));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  // Reset settings
  const resetSettings = () => {
    setSettings(initialSettings);
    localStorage.removeItem("appSettings");
    setShowConfirm(null);
  };

  // Export data
  const exportData = (format: string) => {
    const data = {
      settings,
      exportedAt: new Date().toISOString(),
      version: "1.0.0",
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/${format};charset=utf-8,${encodeURIComponent(dataStr)}`;
    const exportFileDefaultName = `settings-export-${new Date().getTime()}.${format}`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Simulate backup
  const simulateBackup = () => {
    setBackupProgress(0);
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Revoke device access
  const revokeDevice = (deviceId: string) => {
    setDevices(prev => prev.filter(device => device.id !== deviceId));
  };

  // Render setting control based on type
  const renderSettingControl = (
    key: keyof typeof settings,
    label: string,
    description: string,
    type: "toggle" | "select" | "slider" | "radio" | "text" | "number" = "toggle"
  ) => {
    const value = settings[key];

    return (
      <div className="flex items-start justify-between py-4 border-b border-gray-800 last:border-0">
        <div className="flex-1 mr-4">
          <h4 className="font-medium text-white">{label}</h4>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
        
        <div className="flex-shrink-0">
          {type === "toggle" && (
            <button
              onClick={() => handleSettingChange(key, !value)}
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
          )}
          
          {type === "select" && (
            <select
              value={value as string}
              onChange={(e) => handleSettingChange(key, e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {key === "language" && languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
              {key === "timezone" && timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
              {key === "dateFormat" && dateFormats.map(format => (
                <option key={format.value} value={format.value}>{format.label}</option>
              ))}
              {key === "currency" && currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name}
                </option>
              ))}
              {key === "backupFrequency" && (
                <>
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </>
              )}
            </select>
          )}
          
          {type === "slider" && (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={value as number}
                onChange={(e) => handleSettingChange(key, parseInt(e.target.value))}
                className="w-32 accent-blue-600"
              />
              <span className="text-white text-sm w-12">
                {value} min
              </span>
            </div>
          )}
          
          {type === "radio" && key === "theme" && (
            <div className="flex gap-2">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleSettingChange(key, theme.value)}
                  className={`flex flex-col items-center p-2 rounded-lg border transition-all ${
                    value === theme.value
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="mb-1">{theme.icon}</div>
                  <span className="text-xs text-white">{theme.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Customize your application experience</p>
        </div>
        <button
          onClick={saveSettings}
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
              <RefreshCw size={18} className="animate-spin" />
              Saving...
            </>
          ) : saveStatus === "saved" ? (
            <>
              <Check size={18} />
              Saved!
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Categories */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-xl p-4 space-y-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === category.id
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                {category.icon}
                <div className="text-left">
                  <div className="font-medium">{category.title}</div>
                  <div className="text-xs opacity-70">{category.description}</div>
                </div>
                <ChevronRight size={16} className="ml-auto" />
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-gray-900 rounded-xl p-4">
            <h3 className="font-medium text-white mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => exportData("json")}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Download size={16} />
                Export All Settings
              </button>
              <button
                onClick={() => setShowConfirm("reset")}
                className="w-full flex items-center gap-2 px-3 py-2 text-red-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <RefreshCw size={16} />
                Reset to Defaults
              </button>
              <button
                onClick={simulateBackup}
                className="w-full flex items-center gap-2 px-3 py-2 text-blue-300 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
              >
                <DatabaseBackup size={16} />
                Create Backup
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-xl p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">General Settings</h2>
                
                {renderSettingControl(
                  "language",
                  "Language",
                  "Choose your preferred language",
                  "select"
                )}
                
                {renderSettingControl(
                  "timezone",
                  "Timezone",
                  "Set your local timezone",
                  "select"
                )}
                
                {renderSettingControl(
                  "dateFormat",
                  "Date Format",
                  "Preferred date display format",
                  "select"
                )}
                
                {renderSettingControl(
                  "currency",
                  "Currency",
                  "Default currency for financial data",
                  "select"
                )}
                
                {renderSettingControl(
                  "autoSave",
                  "Auto Save",
                  "Automatically save changes as you work",
                  "toggle"
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-3">System Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-gray-400">App Version</div>
                      <div className="text-white">v2.4.0</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-gray-400">Build Date</div>
                      <div className="text-white">Jan 14, 2024</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-gray-400">Storage Used</div>
                      <div className="text-white">245 MB / 1 GB</div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-gray-400">Last Updated</div>
                      <div className="text-white">2 hours ago</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Appearance</h2>
                
                {renderSettingControl(
                  "theme",
                  "Theme",
                  "Choose your preferred theme",
                  "radio"
                )}
                
                {renderSettingControl(
                  "fontSize",
                  "Font Size",
                  "Adjust text size for better readability",
                  "slider"
                )}
                
                {renderSettingControl(
                  "reducedMotion",
                  "Reduced Motion",
                  "Minimize animations and transitions",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "density",
                  "Display Density",
                  "Control spacing and element size",
                  "select"
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-3">Custom CSS</h3>
                  <textarea
                    className="w-full h-40 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter custom CSS here..."
                    defaultValue={`
/* Custom styles */
:root {
  --primary-color: #3b82f6;
  --border-radius: 8px;
}
`}
                  />
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-gray-400">For advanced users only</span>
                    <button className="text-sm text-blue-400 hover:text-blue-300">
                      Apply CSS
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>
                
                {renderSettingControl(
                  "emailNotifications",
                  "Email Notifications",
                  "Receive notifications via email",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "pushNotifications",
                  "Push Notifications",
                  "Receive push notifications on your devices",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "soundEnabled",
                  "Notification Sounds",
                  "Play sounds for notifications",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "marketingEmails",
                  "Marketing Emails",
                  "Receive promotional emails and updates",
                  "toggle"
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    {notificationPrefs.map(pref => (
                      <div key={pref.id} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-white">{pref.label}</h4>
                            <p className="text-sm text-gray-400">{pref.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={pref.email} className="rounded" />
                            <span className="text-sm text-gray-300">Email</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={pref.push} className="rounded" />
                            <span className="text-sm text-gray-300">Push</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input type="checkbox" checked={pref.inApp} className="rounded" />
                            <span className="text-sm text-gray-300">In-App</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Privacy & Security Settings */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Privacy & Security</h2>
                
                {renderSettingControl(
                  "twoFactorAuth",
                  "Two-Factor Authentication",
                  "Add an extra layer of security to your account",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "showOnlineStatus",
                  "Show Online Status",
                  "Allow others to see when you're online",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "dataCollection",
                  "Data Collection",
                  "Help improve the app by sharing anonymous usage data",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "cookieConsent",
                  "Cookie Preferences",
                  "Manage cookie settings for enhanced experience",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "autoLogout",
                  "Auto Logout",
                  "Automatically log out after inactivity",
                  "slider"
                )}
                
                {renderSettingControl(
                  "loginAlerts",
                  "Login Alerts",
                  "Get notified about new login attempts",
                  "toggle"
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-4">Connected Devices</h3>
                  <div className="space-y-3">
                    {devices.map(device => (
                      <div key={device.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {device.type === "mobile" && <Mobile size={20} />}
                          {device.type === "tablet" && <Tablet size={20} />}
                          {device.type === "laptop" && <Laptop size={20} />}
                          <div>
                            <div className="font-medium text-white">{device.name}</div>
                            <div className="text-sm text-gray-400">
                              Last active: {new Date(device.lastActive).toLocaleDateString()} • {device.location}
                              {device.current && <span className="ml-2 text-green-400">Current Device</span>}
                            </div>
                          </div>
                        </div>
                        {!device.current && (
                          <button
                            onClick={() => revokeDevice(device.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Account Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-white">Email Address</h4>
                      <p className="text-sm text-gray-400">Change your primary email address</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
                      Change
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-white">Password</h4>
                      <p className="text-sm text-gray-400">Update your account password</p>
                    </div>
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
                      Change
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-white">Close Account</h4>
                      <p className="text-sm text-gray-400">Permanently delete your account</p>
                    </div>
                    <button 
                      onClick={() => setShowConfirm("delete")}
                      className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-800">
                  <h3 className="font-medium text-white mb-3">Linked Accounts</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Github size={20} />
                        <span className="text-white">GitHub</span>
                      </div>
                      <span className="text-green-400 text-sm">Connected</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Google size={20} />
                        <span className="text-white">Google</span>
                      </div>
                      <span className="text-blue-400 text-sm">Connect</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Data & Storage Settings */}
            {activeTab === "data" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Data & Storage</h2>
                
                {renderSettingControl(
                  "backupFrequency",
                  "Backup Frequency",
                  "How often to automatically backup your data",
                  "select"
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-4">Backup Schedules</h3>
                  <div className="space-y-3">
                    {backupSchedules.map(schedule => (
                      <div key={schedule.id} className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
                        <div>
                          <div className="font-medium text-white">{schedule.label}</div>
                          <div className="text-sm text-gray-400">{schedule.frequency}</div>
                          {schedule.lastBackup && (
                            <div className="text-xs text-gray-500 mt-1">
                              Last backup: {new Date(schedule.lastBackup).toLocaleString()}
                            </div>
                          )}
                        </div>
                        <button
                          className={`px-3 py-1 rounded text-sm ${
                            schedule.enabled
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-700 text-gray-400"
                          }`}
                        >
                          {schedule.enabled ? "Enabled" : "Disabled"}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-400 font-medium">Manual Backup</span>
                      <span className="text-sm text-gray-400">{backupProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${backupProgress}%` }}
                      />
                    </div>
                    <button
                      onClick={simulateBackup}
                      disabled={backupProgress > 0 && backupProgress < 100}
                      className="mt-3 w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed rounded-lg"
                    >
                      {backupProgress === 0 ? "Start Backup" : 
                       backupProgress === 100 ? "Backup Complete" : "Backing up..."}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-4">Export Data</h3>
                  <div className="flex gap-3">
                    <button
                      onClick={() => exportData("json")}
                      className="flex-1 flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg"
                    >
                      <FileText size={24} className="mb-2" />
                      <span className="text-white">JSON</span>
                      <span className="text-xs text-gray-400">Universal format</span>
                    </button>
                    <button
                      onClick={() => exportData("csv")}
                      className="flex-1 flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg"
                    >
                      <Database size={24} className="mb-2" />
                      <span className="text-white">CSV</span>
                      <span className="text-xs text-gray-400">Spreadsheets</span>
                    </button>
                    <button
                      onClick={() => exportData("xml")}
                      className="flex-1 flex flex-col items-center p-4 bg-gray-800 hover:bg-gray-700 rounded-lg"
                    >
                      <Code size={24} className="mb-2" />
                      <span className="text-white">XML</span>
                      <span className="text-xs text-gray-400">Structured data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            {activeTab === "advanced" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-6">Advanced Settings</h2>
                
                {renderSettingControl(
                  "developerMode",
                  "Developer Mode",
                  "Enable developer tools and features",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "apiAccess",
                  "API Access",
                  "Enable access to the application API",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "webhooksEnabled",
                  "Webhooks",
                  "Enable webhook notifications",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "cacheEnabled",
                  "Cache",
                  "Enable caching for better performance",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "hardwareAcceleration",
                  "Hardware Acceleration",
                  "Use GPU acceleration when available",
                  "toggle"
                )}
                
                {renderSettingControl(
                  "backgroundSync",
                  "Background Sync",
                  "Sync data in the background",
                  "toggle"
                )}
                
                <div className="pt-4">
                  <h3 className="font-medium text-white mb-4">API Configuration</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">API Key</label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value="sk_live_51Hx...x9F"
                          readOnly
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white font-mono"
                        />
                        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg">
                          <Copy size={18} />
                        </button>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg">
                          Regenerate
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Webhook URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://your-domain.com/webhook"
                          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white"
                        />
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showConfirm === "reset" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-500" size={24} />
              <h3 className="text-xl font-bold text-white">Reset Settings</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to reset all settings to their default values? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={resetSettings}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              >
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirm === "delete" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
            </div>
            <p className="text-gray-300 mb-6">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="space-y-3 mb-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-300">
                  I understand this action is irreversible
                </span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-300">
                  I have exported my data if needed
                </span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle account deletion
                  setShowConfirm(null);
                }}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add missing icon component
const Google = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);