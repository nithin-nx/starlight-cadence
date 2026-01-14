import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Image as ImageIcon,
  Grid3x3,
  List,
  Filter,
  Search,
  Calendar,
  Users,
  Trophy,
  Download,
  Share2,
  ZoomIn,
  Heart,
  Eye,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

interface GalleryImage {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  event_id: string | null;
  event_title: string | null;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  is_featured: boolean;
  created_at: string;
}

interface EventOption {
  id: string;
  title: string;
}

export default function Gallery() {
  const { toast } = useToast();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchGalleryData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [images, selectedEvent, searchQuery]);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);

      // Fetch gallery images with event info
      const { data: galleryData, error } = await supabase
        .from('gallery')
        .select(`
          *,
          events!gallery_event_id_fkey(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch events for filter
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, title')
        .order('date', { ascending: false });

      const formattedImages = (galleryData || []).map((item: any) => ({
        ...item,
        event_title: item.events?.title || null
      }));

      setImages(formattedImages);
      setEvents(eventsData || []);

    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...images];

    // Filter by event
    if (selectedEvent !== 'all') {
      result = result.filter(img => img.event_id === selectedEvent);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(img =>
        (img.title?.toLowerCase().includes(query)) ||
        (img.description?.toLowerCase().includes(query)) ||
        (img.event_title?.toLowerCase().includes(query))
      );
    }

    setFilteredImages(result);
  };

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!selectedImage) return;

    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    // Loop around
    if (newIndex < 0) newIndex = filteredImages.length - 1;
    if (newIndex >= filteredImages.length) newIndex = 0;

    setSelectedImage(filteredImages[newIndex]);
    setCurrentIndex(newIndex);
  };

  const handleDownload = async (imageUrl: string, title: string | null) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title || 'iste-image'}-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Image download has started",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download image",
        variant: "destructive"
      });
    }
  };

  const handleShare = async (image: GalleryImage) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: image.title || 'ISTE Gallery Image',
          text: image.description || 'Check out this image from ISTE gallery',
          url: image.image_url,
        });
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(image.image_url);
        toast({
          title: "Link Copied",
          description: "Image link copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getImageCountByEvent = (eventId: string | null) => {
    return images.filter(img => img.event_id === eventId).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ISTE Gallery</h1>
        <p className="text-gray-600 mt-2">
          Memories from our events, workshops, and celebrations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Images</p>
                <p className="text-2xl font-bold">{images.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Events Covered</p>
                <p className="text-2xl font-bold">
                  {[...new Set(images.map(img => img.event_id).filter(Boolean))].length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Featured</p>
                <p className="text-2xl font-bold">
                  {images.filter(img => img.is_featured).length}
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Latest Update</p>
                <p className="text-lg font-bold">
                  {images.length > 0 
                    ? format(new Date(images[0].created_at), "MMM dd")
                    : "N/A"
                  }
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search images by title, description, or event..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by Event" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title} ({getImageCountByEvent(event.id)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex-1"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
                className="flex-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading gallery...</p>
        </div>
      ) : filteredImages.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <Card key={image.id} className="overflow-hidden group cursor-pointer">
                  <div 
                    className="relative aspect-square overflow-hidden bg-gray-100"
                    onClick={() => openLightbox(image, index)}
                  >
                    <img
                      src={image.image_url}
                      alt={image.title || 'ISTE Gallery Image'}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="secondary" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image.image_url, image.title);
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Featured Badge */}
                    {image.is_featured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-amber-500">
                          <Trophy className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-3">
                    <h3 className="font-semibold line-clamp-1">{image.title || 'Untitled'}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {image.description || 'No description'}
                    </p>
                    {image.event_title && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {image.event_title}
                      </Badge>
                    )}
                    <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
                      <span>{format(new Date(image.created_at), 'MMM dd, yyyy')}</span>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShare(image);
                          }}
                        >
                          <Share2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredImages.map((image, index) => (
                <Card key={image.id} className="overflow-hidden">
                  <div className="flex">
                    <div 
                      className="w-48 flex-shrink-0 cursor-pointer"
                      onClick={() => openLightbox(image, index)}
                    >
                      <div className="relative h-full aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={image.image_url}
                          alt={image.title || 'ISTE Gallery Image'}
                          className="w-full h-full object-cover"
                        />
                        {image.is_featured && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-amber-500">
                              <Trophy className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{image.title || 'Untitled'}</h3>
                          <p className="text-gray-600 mt-1">{image.description || 'No description'}</p>
                          
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            {image.event_title && (
                              <Badge variant="outline">{image.event_title}</Badge>
                            )}
                            <span>{format(new Date(image.created_at), 'MMM dd, yyyy • hh:mm a')}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(image.image_url, image.title)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShare(image)}
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Images Found</h3>
            <p className="text-gray-600">
              {searchQuery || selectedEvent !== 'all'
                ? "Try changing your search or filter"
                : "No gallery images available yet"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Events with Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Events Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.filter(event => getImageCountByEvent(event.id) > 0).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => getImageCountByEvent(event.id) > 0)
                .slice(0, 6)
                .map(event => {
                  const eventImages = images.filter(img => img.event_id === event.id);
                  return (
                    <Card key={event.id} className="overflow-hidden group cursor-pointer">
                      <div className="relative aspect-video overflow-hidden bg-gray-100">
                        {eventImages[0] && (
                          <img
                            src={eventImages[0].image_url}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <p className="text-sm opacity-90">
                            {getImageCountByEvent(event.id)} photos
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No event galleries available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh]">
            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Navigation Buttons */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={() => navigateLightbox('prev')}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:bg-white/20"
              onClick={() => navigateLightbox('next')}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            {/* Image */}
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title || 'ISTE Gallery Image'}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
              
              {/* Info Panel */}
              <div className="bg-white p-4 rounded-t-lg mt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{selectedImage.title || 'Untitled'}</h3>
                    <p className="text-gray-600 mt-1">{selectedImage.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      {selectedImage.event_title && (
                        <Badge variant="outline">{selectedImage.event_title}</Badge>
                      )}
                      <span>{format(new Date(selectedImage.created_at), 'MMM dd, yyyy')}</span>
                      {selectedImage.is_featured && (
                        <Badge className="bg-amber-500">
                          <Trophy className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(selectedImage.image_url, selectedImage.title)}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(selectedImage)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Thumbnails */}
                <div className="flex gap-2 mt-4 overflow-x-auto py-2">
                  {filteredImages.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => {
                        setSelectedImage(img);
                        setCurrentIndex(index);
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 ${
                        currentIndex === index ? 'border-primary' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.image_url}
                        alt={img.title || ''}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}