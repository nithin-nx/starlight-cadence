import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Image as ImageIcon,
  Upload,
  Download,
  Share2,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Tag,
  Calendar,
  User,
  Grid,
  List,
  Folder,
  FolderPlus,
  Check,
  X,
  Loader2,
  ExternalLink,
  Heart,
  MessageSquare,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Album,
  Video,
  File,
  Star,
  StarOff,
  Clock,
  Users,
  MapPin
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  albumId: string;
  albumName: string;
  eventId?: string;
  eventName?: string;
  uploadDate: string;
  uploadedBy: string;
  uploadedByAvatar?: string;
  fileSize: string;
  dimensions?: string;
  duration?: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  downloads: number;
  isFeatured: boolean;
  isPublic: boolean;
  resolution?: string;
  format?: string;
  permissions: string[];
}

interface Album {
  id: string;
  name: string;
  description?: string;
  coverImage?: string;
  mediaCount: number;
  eventId?: string;
  eventName?: string;
  createdDate: string;
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

const GalleryManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'size' | 'likes' | 'views'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'media' | 'albums' | 'events'>('media');
  const [gridSize, setGridSize] = useState<number>(4); // 2-6 columns
  const itemsPerPage = viewMode === 'grid' ? gridSize * 4 : 12;

  // Mock data - In real app, fetch from API
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      title: 'Web Dev Bootcamp Group Photo',
      description: 'Group photo from the Web Development Bootcamp 2024',
      type: 'image',
      url: '/gallery/web-dev-group.jpg',
      thumbnail: '/gallery/thumbnails/web-dev-group.jpg',
      albumId: '1',
      albumName: 'Web Development Bootcamp 2024',
      eventId: '1',
      eventName: 'Web Development Bootcamp',
      uploadDate: '2024-01-20 16:30',
      uploadedBy: 'Arjun Sharma',
      uploadedByAvatar: '/avatars/arjun.jpg',
      fileSize: '4.2 MB',
      dimensions: '1920x1080',
      tags: ['workshop', 'group', 'web', 'bootcamp'],
      likes: 42,
      comments: 12,
      views: 156,
      downloads: 28,
      isFeatured: true,
      isPublic: true,
      resolution: 'HD',
      format: 'JPEG',
      permissions: ['view', 'download', 'share'],
    },
    {
      id: '2',
      title: 'AI Workshop Presentation',
      description: 'Keynote presentation slides from AI & ML Workshop',
      type: 'document',
      url: '/gallery/ai-workshop-slides.pdf',
      thumbnail: '/gallery/thumbnails/pdf-icon.png',
      albumId: '2',
      albumName: 'AI & ML Workshop',
      eventId: '3',
      eventName: 'AI & ML Workshop',
      uploadDate: '2024-01-15 14:20',
      uploadedBy: 'Dr. Vikram Singh',
      uploadedByAvatar: '/avatars/vikram.jpg',
      fileSize: '8.5 MB',
      tags: ['ai', 'ml', 'presentation', 'slides'],
      likes: 31,
      comments: 8,
      views: 98,
      downloads: 45,
      isFeatured: true,
      isPublic: true,
      format: 'PDF',
      permissions: ['view', 'download'],
    },
    {
      id: '3',
      title: 'Hackathon Final Presentation',
      description: 'Recording of final project presentations',
      type: 'video',
      url: '/gallery/hackathon-final.mp4',
      thumbnail: '/gallery/thumbnails/hackathon-thumb.jpg',
      albumId: '3',
      albumName: 'Hackathon 2024',
      eventId: '4',
      eventName: 'Hackathon 2024',
      uploadDate: '2024-02-10 21:15',
      uploadedBy: 'Rohan Desai',
      uploadedByAvatar: '/avatars/rohan.jpg',
      fileSize: '156 MB',
      duration: '45:22',
      tags: ['hackathon', 'video', 'presentation', 'recording'],
      likes: 67,
      comments: 24,
      views: 234,
      downloads: 89,
      isFeatured: true,
      isPublic: true,
      resolution: '1080p',
      format: 'MP4',
      permissions: ['view', 'download', 'share'],
    },
    {
      id: '4',
      title: 'Tech Conference Crowd Shot',
      description: 'Audience during keynote speech',
      type: 'image',
      url: '/gallery/conference-crowd.jpg',
      thumbnail: '/gallery/thumbnails/conference-crowd.jpg',
      albumId: '4',
      albumName: 'Annual Tech Conference',
      eventId: '2',
      eventName: 'Annual Tech Conference',
      uploadDate: '2024-01-25 12:45',
      uploadedBy: 'Meera Iyer',
      uploadedByAvatar: '/avatars/meera.jpg',
      fileSize: '3.8 MB',
      dimensions: '1920x1080',
      tags: ['conference', 'crowd', 'keynote', 'audience'],
      likes: 28,
      comments: 5,
      views: 112,
      downloads: 19,
      isFeatured: false,
      isPublic: true,
      resolution: 'HD',
      format: 'JPEG',
      permissions: ['view', 'download'],
    },
    {
      id: '5',
      title: 'Workshop Setup',
      description: 'Before the workshop started',
      type: 'image',
      url: '/gallery/workshop-setup.jpg',
      thumbnail: '/gallery/thumbnails/workshop-setup.jpg',
      albumId: '1',
      albumName: 'Web Development Bootcamp 2024',
      eventId: '1',
      eventName: 'Web Development Bootcamp',
      uploadDate: '2024-01-20 09:15',
      uploadedBy: 'Priya Patel',
      uploadedByAvatar: '/avatars/priya.jpg',
      fileSize: '3.5 MB',
      dimensions: '1920x1080',
      tags: ['setup', 'workshop', 'preparation'],
      likes: 19,
      comments: 3,
      views: 87,
      downloads: 12,
      isFeatured: false,
      isPublic: true,
      resolution: 'HD',
      format: 'JPEG',
      permissions: ['view', 'download'],
    },
    {
      id: '6',
      title: 'Certificate Template',
      description: 'Official ISTE certificate template',
      type: 'document',
      url: '/gallery/certificate-template.psd',
      thumbnail: '/gallery/thumbnails/psd-icon.png',
      albumId: '5',
      albumName: 'Templates & Resources',
      uploadDate: '2024-01-05 11:30',
      uploadedBy: 'Admin',
      fileSize: '12.3 MB',
      tags: ['template', 'certificate', 'design', 'resource'],
      likes: 15,
      comments: 2,
      views: 56,
      downloads: 34,
      isFeatured: true,
      isPublic: false,
      format: 'PSD',
      permissions: ['view', 'download'],
    },
    {
      id: '7',
      title: 'Team Building Activity',
      description: 'Fun team building games during annual meet',
      type: 'video',
      url: '/gallery/team-building.mp4',
      thumbnail: '/gallery/thumbnails/team-building.jpg',
      albumId: '6',
      albumName: 'ISTE Annual Meet',
      eventId: '7',
      eventName: 'ISTE Annual Meet',
      uploadDate: '2023-12-20 19:30',
      uploadedBy: 'Sneha Nair',
      uploadedByAvatar: '/avatars/sneha.jpg',
      fileSize: '89 MB',
      duration: '12:45',
      tags: ['fun', 'games', 'team-building', 'social'],
      likes: 53,
      comments: 18,
      views: 167,
      downloads: 42,
      isFeatured: false,
      isPublic: true,
      resolution: '720p',
      format: 'MP4',
      permissions: ['view', 'download', 'share'],
    },
    {
      id: '8',
      title: 'Event Banner Design',
      description: 'Official event banner for social media',
      type: 'image',
      url: '/gallery/event-banner.png',
      thumbnail: '/gallery/thumbnails/event-banner.jpg',
      albumId: '5',
      albumName: 'Templates & Resources',
      uploadDate: '2024-01-08 10:00',
      uploadedBy: 'Design Team',
      fileSize: '2.1 MB',
      dimensions: '1200x600',
      tags: ['design', 'banner', 'social-media', 'marketing'],
      likes: 22,
      comments: 4,
      views: 78,
      downloads: 41,
      isFeatured: true,
      isPublic: false,
      resolution: 'Social Media',
      format: 'PNG',
      permissions: ['view', 'download'],
    },
  ]);

  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      name: 'Web Development Bootcamp 2024',
      description: 'Photos and videos from the 3-day web development bootcamp',
      coverImage: '/gallery/thumbnails/web-dev-group.jpg',
      mediaCount: 24,
      eventId: '1',
      eventName: 'Web Development Bootcamp',
      createdDate: '2024-01-20',
      createdBy: 'Arjun Sharma',
      isPublic: true,
      tags: ['workshop', 'web', 'bootcamp', 'coding'],
    },
    {
      id: '2',
      name: 'AI & ML Workshop',
      description: 'Materials from the artificial intelligence workshop',
      coverImage: '/gallery/thumbnails/pdf-icon.png',
      mediaCount: 18,
      eventId: '3',
      eventName: 'AI & ML Workshop',
      createdDate: '2024-01-15',
      createdBy: 'Dr. Vikram Singh',
      isPublic: true,
      tags: ['ai', 'ml', 'workshop', 'presentation'],
    },
    {
      id: '3',
      name: 'Hackathon 2024',
      description: 'Projects and presentations from the annual hackathon',
      coverImage: '/gallery/thumbnails/hackathon-thumb.jpg',
      mediaCount: 42,
      eventId: '4',
      eventName: 'Hackathon 2024',
      createdDate: '2024-02-10',
      createdBy: 'Rohan Desai',
      isPublic: true,
      tags: ['hackathon', 'competition', 'coding', 'projects'],
    },
    {
      id: '4',
      name: 'Annual Tech Conference',
      description: 'Highlights from the largest tech conference of the year',
      coverImage: '/gallery/thumbnails/conference-crowd.jpg',
      mediaCount: 56,
      eventId: '2',
      eventName: 'Annual Tech Conference',
      createdDate: '2024-01-25',
      createdBy: 'Meera Iyer',
      isPublic: true,
      tags: ['conference', 'keynote', 'networking', 'tech'],
    },
    {
      id: '5',
      name: 'Templates & Resources',
      description: 'Official templates, banners, and design resources',
      coverImage: '/gallery/thumbnails/event-banner.jpg',
      mediaCount: 12,
      createdDate: '2024-01-05',
      createdBy: 'Admin',
      isPublic: false,
      tags: ['templates', 'resources', 'design', 'official'],
    },
    {
      id: '6',
      name: 'ISTE Annual Meet',
      description: 'Memories from the year-end celebration',
      coverImage: '/gallery/thumbnails/team-building.jpg',
      mediaCount: 38,
      eventId: '7',
      eventName: 'ISTE Annual Meet',
      createdDate: '2023-12-20',
      createdBy: 'Sneha Nair',
      isPublic: true,
      tags: ['social', 'celebration', 'annual', 'memories'],
    },
  ]);

  const events = [
    { id: 'all', name: 'All Events' },
    { id: '1', name: 'Web Development Bootcamp' },
    { id: '2', name: 'Annual Tech Conference' },
    { id: '3', name: 'AI & ML Workshop' },
    { id: '4', name: 'Hackathon 2024' },
    { id: '5', name: 'Career Guidance Seminar' },
    { id: '6', name: 'Cybersecurity Workshop' },
    { id: '7', name: 'ISTE Annual Meet' },
    { id: '8', name: 'Open Source Contribution' },
    { id: '9', name: 'IoT Workshop' },
  ];

  const filters = [
    { value: 'all', label: 'All Media', count: mediaItems.length },
    { value: 'image', label: 'Images', count: mediaItems.filter(m => m.type === 'image').length },
    { value: 'video', label: 'Videos', count: mediaItems.filter(m => m.type === 'video').length },
    { value: 'document', label: 'Documents', count: mediaItems.filter(m => m.type === 'document').length },
    { value: 'featured', label: 'Featured', count: mediaItems.filter(m => m.isFeatured).length },
    { value: 'public', label: 'Public', count: mediaItems.filter(m => m.isPublic).length },
    { value: 'private', label: 'Private', count: mediaItems.filter(m => !m.isPublic).length },
    { value: 'recent', label: 'Recent (7 days)', count: mediaItems.filter(m => {
      const itemDate = new Date(m.uploadDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate > weekAgo;
    }).length },
  ];

  // Calculate statistics
  const stats = {
    totalMedia: mediaItems.length,
    totalAlbums: albums.length,
    totalEvents: events.length - 1,
    totalSize: mediaItems.reduce((sum, m) => sum + parseFloat(m.fileSize), 0).toFixed(1) + ' MB',
    images: mediaItems.filter(m => m.type === 'image').length,
    videos: mediaItems.filter(m => m.type === 'video').length,
    documents: mediaItems.filter(m => m.type === 'document').length,
    publicMedia: mediaItems.filter(m => m.isPublic).length,
    featuredMedia: mediaItems.filter(m => m.isFeatured).length,
    totalLikes: mediaItems.reduce((sum, m) => sum + m.likes, 0),
    totalViews: mediaItems.reduce((sum, m) => sum + m.views, 0),
    totalDownloads: mediaItems.reduce((sum, m) => sum + m.downloads, 0),
  };

  // Filter and sort media items
  const filteredItems = mediaItems
    .filter(item => {
      const matchesSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'image' && item.type === 'image') ||
        (selectedFilter === 'video' && item.type === 'video') ||
        (selectedFilter === 'document' && item.type === 'document') ||
        (selectedFilter === 'featured' && item.isFeatured) ||
        (selectedFilter === 'public' && item.isPublic) ||
        (selectedFilter === 'private' && !item.isPublic) ||
        (selectedFilter === 'recent' && new Date(item.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
      
      const matchesAlbum = selectedAlbum === 'all' || 
        item.albumId === selectedAlbum;
      
      const matchesType = selectedType === 'all' || 
        item.type === selectedType;
      
      return matchesSearch && matchesFilter && matchesAlbum && matchesType;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'date': 
          aValue = new Date(a.uploadDate).getTime();
          bValue = new Date(b.uploadDate).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'size':
          aValue = parseFloat(a.fileSize);
          bValue = parseFloat(b.fileSize);
          break;
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        default:
          aValue = new Date(a.uploadDate).getTime();
          bValue = new Date(b.uploadDate).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Filter albums
  const filteredAlbums = albums.filter(album => {
    const matchesSearch = searchQuery === '' || 
      album.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const getMediaTypeColor = (type: string) => {
    switch(type) {
      case 'image': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'video': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'document': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getMediaTypeIcon = (type: string) => {
    switch(type) {
      case 'image': return ImageIcon;
      case 'video': return Video;
      case 'document': return File;
      default: return File;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === currentItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(currentItems.map(i => i.id));
    }
  };

  const handleBulkAction = (action: string) => {
    setIsLoading(true);
    console.log(`Bulk ${action} for items:`, selectedItems);
    
    // Simulate API call
    setTimeout(() => {
      if (action === 'delete') {
        setMediaItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
      } else if (action === 'feature') {
        setMediaItems(prev => prev.map(item => 
          selectedItems.includes(item.id) 
            ? { ...item, isFeatured: true }
            : item
        ));
      } else if (action === 'publish') {
        setMediaItems(prev => prev.map(item => 
          selectedItems.includes(item.id) 
            ? { ...item, isPublic: true }
            : item
        ));
      } else if (action === 'download') {
        console.log('Downloading selected items');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // Add new media item
          const newItem: MediaItem = {
            id: Date.now().toString(),
            title: 'New Upload',
            type: 'image',
            url: '/gallery/new-upload.jpg',
            thumbnail: '/gallery/thumbnails/default.jpg',
            albumId: '1',
            albumName: 'Web Development Bootcamp 2024',
            uploadDate: new Date().toISOString(),
            uploadedBy: 'Current User',
            fileSize: '2.5 MB',
            tags: ['uploaded'],
            likes: 0,
            comments: 0,
            views: 0,
            downloads: 0,
            isFeatured: false,
            isPublic: false,
            permissions: ['view', 'download'],
          };
          setMediaItems(prev => [newItem, ...prev]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleCreateAlbum = () => {
    // Open create album modal
    console.log('Open create album modal');
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const handleGridSizeChange = (value: number[]) => {
    setGridSize(value[0]);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Media Gallery
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage photos, videos, and documents from all events
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleBulkAction('download')}
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => console.log('Open analytics')}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button className="gap-2" onClick={handleCreateAlbum}>
            <FolderPlus className="h-4 w-4" />
            New Album
          </Button>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Media</p>
                <p className="text-2xl font-bold mt-1">{stats.totalMedia}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <ImageIcon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Albums</p>
                <p className="text-2xl font-bold mt-1">{stats.totalAlbums}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Album className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Images</p>
                <p className="text-2xl font-bold mt-1">{stats.images}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <ImageIcon className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold mt-1">{stats.videos}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Video className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Likes</p>
                <p className="text-2xl font-bold mt-1">{stats.totalLikes}</p>
              </div>
              <div className="p-2 rounded-lg bg-rose-500/10">
                <Heart className="h-5 w-5 text-rose-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Downloads</p>
                <p className="text-2xl font-bold mt-1">{stats.totalDownloads}</p>
              </div>
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Download className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="media">Media Library</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="events">Event Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="media" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Options</CardTitle>
                  <CardDescription>Refine gallery view</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Album Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Album</Label>
                    <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
                      <SelectTrigger>
                        <SelectValue placeholder="All albums" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Albums</SelectItem>
                        {albums.map(album => (
                          <SelectItem key={album.id} value={album.id}>
                            {album.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Media Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                        <SelectItem value="document">Documents</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Quick Filters</Label>
                    <div className="space-y-2">
                      {filters.slice(1, 5).map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => setSelectedFilter(filter.value)}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                            selectedFilter === filter.value
                              ? "bg-primary text-primary-foreground"
                              : "bg-white/[0.03] text-muted-foreground hover:bg-white/[0.06]"
                          )}
                        >
                          <span>{filter.label}</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded">
                            {filter.count}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Grid Size Control */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Grid Size</Label>
                      <span className="text-xs text-muted-foreground">{gridSize} columns</span>
                    </div>
                    <Slider
                      defaultValue={[4]}
                      min={2}
                      max={6}
                      step={1}
                      onValueChange={handleGridSizeChange}
                      className="w-full"
                    />
                  </div>

                  <Separator />

                  {/* View Options */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Show File Info</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Show Tags</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Show Stats</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedAlbum('all');
                      setSelectedType('all');
                    }}
                  >
                    <Filter className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Media Library</CardTitle>
                      <CardDescription>
                        {filteredItems.length} items found • Sort by: {sortBy} ({sortOrder})
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search media..."
                          className="pl-10 w-full sm:w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex border border-white/10 rounded-lg">
                        <button
                          onClick={() => setViewMode('grid')}
                          className={cn(
                            "p-2 rounded-l-lg transition-colors",
                            viewMode === 'grid' 
                              ? "bg-white/[0.08] text-white" 
                              : "text-muted-foreground hover:bg-white/[0.03]"
                          )}
                        >
                          <Grid className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('list')}
                          className={cn(
                            "p-2 rounded-r-lg transition-colors",
                            viewMode === 'list' 
                              ? "bg-white/[0.08] text-white" 
                              : "text-muted-foreground hover:bg-white/[0.03]"
                          )}
                        >
                          <List className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Bulk Actions Bar */}
                {selectedItems.length > 0 && (
                  <div className="px-6 py-3 bg-primary/5 border-y border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleBulkAction('download')}
                        >
                          <Download className="h-3 w-3" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleBulkAction('feature')}
                        >
                          <Star className="h-3 w-3" />
                          Feature
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleBulkAction('publish')}
                        >
                          <Share2 className="h-3 w-3" />
                          Make Public
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-red-500 hover:text-red-600"
                          onClick={() => handleBulkAction('delete')}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItems([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <CardContent className="p-0">
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className={`grid grid-cols-2 md:grid-cols-${gridSize} gap-4 p-6`}>
                      {currentItems.map((item) => {
                        const MediaIcon = getMediaTypeIcon(item.type);
                        return (
                          <Card 
                            key={item.id} 
                            className={cn(
                              "border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent transition-all hover:border-primary/20 hover:shadow-lg group",
                              selectedItems.includes(item.id) && "ring-2 ring-primary/50",
                              item.isFeatured && "ring-2 ring-amber-500/50"
                            )}
                          >
                            <div className="relative">
                              {/* Thumbnail/Preview */}
                              <div className="aspect-square bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-t-lg overflow-hidden">
                                {item.type === 'image' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
                                    <ImageIcon className="h-12 w-12 text-primary/40" />
                                  </div>
                                ) : item.type === 'video' ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-500/5 to-purple-500/10">
                                    <Video className="h-12 w-12 text-purple-500/40" />
                                  </div>
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-500/5 to-amber-500/10">
                                    <File className="h-12 w-12 text-amber-500/40" />
                                  </div>
                                )}
                                {item.isFeatured && (
                                  <div className="absolute top-2 left-2">
                                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  </div>
                                )}
                              </div>

                              {/* Selection Checkbox */}
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                                className="absolute top-2 right-2 h-4 w-4 rounded border-white/20 bg-black/50"
                              />
                            </div>

                            <CardContent className="p-4">
                              {/* Title & Type */}
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate" title={item.title}>
                                    {item.title}
                                  </h4>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Badge variant="outline" className={cn("text-xs", getMediaTypeColor(item.type))}>
                                      {item.type.toUpperCase()}
                                    </Badge>
                                    {!item.isPublic && (
                                      <Badge variant="outline" className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
                                        Private
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              {item.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                                  {item.description}
                                </p>
                              )}

                              {/* Album & Event */}
                              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <Folder className="h-3 w-3" />
                                  <span className="truncate">{item.albumName}</span>
                                </div>
                                {item.eventName && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{item.eventName}</span>
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {item.tags.slice(0, 2).map((tag, index) => (
                                  <span 
                                    key={index}
                                    className="px-1.5 py-0.5 bg-white/[0.03] text-[10px] rounded border border-white/5"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {item.tags.length > 2 && (
                                  <span className="px-1.5 py-0.5 bg-white/[0.03] text-[10px] rounded border border-white/5">
                                    +{item.tags.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* Stats */}
                              <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-white/5">
                                <div className="flex items-center gap-1" title="Likes">
                                  <Heart className="h-3 w-3" />
                                  <span>{item.likes}</span>
                                </div>
                                <div className="flex items-center gap-1" title="Views">
                                  <Eye className="h-3 w-3" />
                                  <span>{item.views}</span>
                                </div>
                                <div className="flex items-center gap-1" title="Downloads">
                                  <Download className="h-3 w-3" />
                                  <span>{item.downloads}</span>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex gap-1 mt-3">
                                <Button size="sm" className="flex-1 text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs px-2">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    // List View
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="text-left p-4">
                              <input
                                type="checkbox"
                                checked={selectedItems.length === currentItems.length}
                                onChange={handleSelectAll}
                                className="h-4 w-4 rounded border-white/20"
                              />
                            </th>
                            <th 
                              className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                              onClick={() => handleSort('title')}
                            >
                              <div className="flex items-center gap-1">
                                Media
                                {sortBy === 'title' && (
                                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                              onClick={() => handleSort('date')}
                            >
                              <div className="flex items-center gap-1">
                                Upload Date
                                {sortBy === 'date' && (
                                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                              Album & Event
                            </th>
                            <th 
                              className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                              onClick={() => handleSort('views')}
                            >
                              Stats
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.map((item) => {
                            const MediaIcon = getMediaTypeIcon(item.type);
                            return (
                              <tr 
                                key={item.id} 
                                className={cn(
                                  "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
                                  selectedItems.includes(item.id) && "bg-primary/5"
                                )}
                              >
                                <td className="p-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => handleSelectItem(item.id)}
                                    className="h-4 w-4 rounded border-white/20"
                                  />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className={cn(
                                      "p-2 rounded-lg",
                                      item.type === 'image' && "bg-blue-500/10",
                                      item.type === 'video' && "bg-purple-500/10",
                                      item.type === 'document' && "bg-amber-500/10"
                                    )}>
                                      <MediaIcon className={cn(
                                        "h-4 w-4",
                                        item.type === 'image' && "text-blue-500",
                                        item.type === 'video' && "text-purple-500",
                                        item.type === 'document' && "text-amber-500"
                                      )} />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">{item.title}</p>
                                        {item.isFeatured && (
                                          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                        <span>{item.fileSize}</span>
                                        {item.dimensions && <span>• {item.dimensions}</span>}
                                        {item.duration && <span>• {item.duration}</span>}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="space-y-1">
                                    <div className="text-sm">
                                      {formatDateTime(item.uploadDate)}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <User className="h-3 w-3" />
                                      {item.uploadedBy}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div>
                                    <p className="text-sm font-medium">{item.albumName}</p>
                                    {item.eventName && (
                                      <p className="text-xs text-muted-foreground">{item.eventName}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-4">
                                    <div className="text-center">
                                      <div className="text-sm font-medium">{item.views}</div>
                                      <div className="text-xs text-muted-foreground">Views</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-sm font-medium">{item.likes}</div>
                                      <div className="text-xs text-muted-foreground">Likes</div>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-sm font-medium">{item.downloads}</div>
                                      <div className="text-xs text-muted-foreground">Downloads</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                      <DropdownMenuItem className="gap-2 cursor-pointer">
                                        <Eye className="h-4 w-4" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2 cursor-pointer">
                                        <Download className="h-4 w-4" />
                                        Download
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2 cursor-pointer">
                                        <Share2 className="h-4 w-4" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem className="gap-2 cursor-pointer">
                                        <Edit2 className="h-4 w-4" />
                                        Edit Details
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2 cursor-pointer">
                                        {item.isFeatured ? (
                                          <>
                                            <StarOff className="h-4 w-4" />
                                            Remove Feature
                                          </>
                                        ) : (
                                          <>
                                            <Star className="h-4 w-4" />
                                            Mark as Featured
                                          </>
                                        )}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="gap-2 cursor-pointer text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>

                {/* Pagination */}
                {filteredItems.length > 0 && (
                  <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/5">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} of {filteredItems.length} items
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
                  </CardFooter>
                )}

                {/* Empty State */}
                {filteredItems.length === 0 && (
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto max-w-md">
                      <ImageIcon className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No media found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery 
                          ? `No media matches "${searchQuery}". Try a different search term.`
                          : 'No media matches your current filters.'
                        }
                      </p>
                      <Button 
                        variant="outline" 
                        className="mr-3"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedFilter('all');
                          setSelectedAlbum('all');
                          setSelectedType('all');
                        }}
                      >
                        Clear filters
                      </Button>
                      <Button onClick={handleUpload}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Media
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="albums" className="space-y-6">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Albums</CardTitle>
                  <CardDescription>
                    Organize media into collections for easier access
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search albums..."
                      className="pl-10 w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleCreateAlbum}>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    New Album
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlbums.map((album) => (
                  <Card 
                    key={album.id} 
                    className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent group hover:border-primary/20 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg flex items-center justify-center">
                      {album.coverImage ? (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                          <Album className="h-12 w-12 text-primary/40" />
                        </div>
                      ) : (
                        <Album className="h-12 w-12 text-primary/40" />
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {album.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {album.mediaCount} items
                            </Badge>
                            {!album.isPublic && (
                              <Badge variant="outline" className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
                                Private
                              </Badge>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Album</DropdownMenuItem>
                            <DropdownMenuItem>Edit Album</DropdownMenuItem>
                            <DropdownMenuItem>Add Media</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete Album</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      {album.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {album.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 text-sm">
                        {album.eventName && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{album.eventName}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Created by {album.createdBy}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{album.createdDate}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-4">
                        {album.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-white/[0.03] text-xs rounded border border-white/5"
                          >
                            {tag}
                          </span>
                        ))}
                        {album.tags.length > 3 && (
                          <span className="px-2 py-1 bg-white/[0.03] text-xs rounded border border-white/5">
                            +{album.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1">
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Manage
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <CardTitle>Event Galleries</CardTitle>
              <CardDescription>
                Browse media organized by events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(1).map((event) => {
                  const eventAlbums = albums.filter(a => a.eventId === event.id);
                  const eventMedia = mediaItems.filter(m => m.eventId === event.id);
                  const featuredImage = mediaItems.find(m => m.eventId === event.id && m.isFeatured);
                  
                  return (
                    <Card 
                      key={event.id} 
                      className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent group hover:border-primary/20 transition-all"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        {featuredImage ? (
                          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-primary/40" />
                          </div>
                        ) : (
                          <ImageIcon className="h-12 w-12 text-primary/40" />
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs">
                          {eventAlbums.length} albums
                        </div>
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                              {event.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {eventMedia.length} media
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {eventAlbums.length} albums
                              </Badge>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Views</span>
                            <span className="font-medium">
                              {eventMedia.reduce((sum, m) => sum + m.views, 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Total Likes</span>
                            <span className="font-medium">
                              {eventMedia.reduce((sum, m) => sum + m.likes, 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last Updated</span>
                            <span className="font-medium">
                              {eventMedia.length > 0 
                                ? formatDateTime(eventMedia.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0].uploadDate).split(',')[0]
                                : 'No media'
                              }
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                          <Button variant="outline" size="sm" className="flex-1">
                            Browse Gallery
                          </Button>
                          <Button size="sm" className="flex-1">
                            Add Media
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryManagement;