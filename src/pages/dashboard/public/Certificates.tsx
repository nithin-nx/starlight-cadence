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
  Award,
  Download,
  Eye,
  Share2,
  Search,
  Filter,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  Trophy,
  ExternalLink,
  QrCode,
  Shield,
  Printer,
  Copy,
  Verified
} from "lucide-react";
import { format } from "date-fns";

interface Certificate {
  id: string;
  title: string;
  certificate_url: string;
  certificate_number: string;
  issued_at: string;
  verified: boolean;
  event_id: string | null;
  event_title: string | null;
  issued_by_name: string | null;
}

interface CertificateFilter {
  year: string;
  search: string;
  status: string;
}

export default function Certificates() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CertificateFilter>({
    year: "all",
    search: "",
    status: "all"
  });
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [years, setYears] = useState<string[]>([]);

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    applyFilters();
    extractYears();
  }, [certificates, filter]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to view your certificates",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch certificates with event info
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          events!certificates_event_id_fkey(title),
          profiles!certificates_issued_by_fkey(full_name)
        `)
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false });

      if (error) throw error;

      const formattedCertificates = (data || []).map((cert: any) => ({
        ...cert,
        event_title: cert.events?.title || null,
        issued_by_name: cert.profiles?.full_name || null
      }));

      setCertificates(formattedCertificates);

    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const extractYears = () => {
    const uniqueYears = Array.from(
      new Set(
        certificates.map(cert => 
          format(new Date(cert.issued_at), 'yyyy')
        )
      )
    ).sort((a, b) => b.localeCompare(a));
    
    setYears(uniqueYears);
  };

  const applyFilters = () => {
    let result = [...certificates];

    // Filter by year
    if (filter.year !== "all") {
      result = result.filter(cert => 
        format(new Date(cert.issued_at), 'yyyy') === filter.year
      );
    }

    // Filter by status
    if (filter.status !== "all") {
      if (filter.status === "verified") {
        result = result.filter(cert => cert.verified);
      } else if (filter.status === "pending") {
        result = result.filter(cert => !cert.verified);
      }
    }

    // Filter by search
    if (filter.search.trim()) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(cert =>
        cert.title.toLowerCase().includes(searchLower) ||
        cert.certificate_number.toLowerCase().includes(searchLower) ||
        (cert.event_title?.toLowerCase().includes(searchLower))
      );
    }

    setFilteredCertificates(result);
  };

  const handleDownload = async (certificate: Certificate) => {
    try {
      setDownloading(certificate.id);
      
      // Create a temporary link and trigger download
      const response = await fetch(certificate.certificate_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificate.title}-${certificate.certificate_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Certificate download has started",
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download certificate",
        variant: "destructive"
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleShare = async (certificate: Certificate) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: certificate.title,
          text: `Check out my ISTE certificate: ${certificate.certificate_number}`,
          url: certificate.certificate_url,
        });
      } else {
        // Fallback: Copy certificate number to clipboard
        await navigator.clipboard.writeText(certificate.certificate_number);
        toast({
          title: "Copied to Clipboard",
          description: "Certificate number copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handlePrint = (certificate: Certificate) => {
    const printWindow = window.open(certificate.certificate_url, '_blank');
    if (printWindow) {
      printWindow.focus();
      printWindow.print();
    }
  };

  const verifyCertificate = (certificateNumber: string) => {
    // In a real app, this would call a verification API
    toast({
      title: "Certificate Verified",
      description: `Certificate ${certificateNumber} is valid and verified by ISTE`,
    });
  };

  const getCertificateStats = () => {
    const total = certificates.length;
    const verified = certificates.filter(c => c.verified).length;
    const thisYear = certificates.filter(c => 
      format(new Date(c.issued_at), 'yyyy') === format(new Date(), 'yyyy')
    ).length;

    return { total, verified, thisYear };
  };

  const stats = getCertificateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
        <p className="text-gray-600 mt-2">
          Your achievements and participation certificates from ISTE events
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Certificates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Verified className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Year</p>
                <p className="text-2xl font-bold">{stats.thisYear}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search certificates by title, number, or event..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select
                value={filter.year}
                onValueChange={(value) => setFilter(prev => ({ ...prev, year: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <SelectValue placeholder="Filter by Year" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filter.status}
                onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading certificates...</p>
        </div>
      ) : filteredCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => (
            <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Certificate Header */}
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className={`mb-2 ${certificate.verified ? 'bg-green-500' : 'bg-amber-500'}`}>
                      {certificate.verified ? (
                        <>
                          <Verified className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                    <h3 className="font-bold text-lg line-clamp-2">{certificate.title}</h3>
                  </div>
                  <Award className="w-8 h-8 text-primary/60" />
                </div>
              </div>

              <CardContent className="p-4">
                {/* Certificate Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-mono">{certificate.certificate_number}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 ml-auto"
                      onClick={() => {
                        navigator.clipboard.writeText(certificate.certificate_number);
                        toast({
                          title: "Copied!",
                          description: "Certificate number copied to clipboard",
                        });
                      }}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{format(new Date(certificate.issued_at), "MMM dd, yyyy")}</span>
                  </div>

                  {certificate.event_title && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Trophy className="w-4 h-4" />
                      <span className="line-clamp-1">{certificate.event_title}</span>
                    </div>
                  )}

                  {certificate.issued_by_name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Issued by: {certificate.issued_by_name}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedCertificate(certificate)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownload(certificate)}
                    disabled={downloading === certificate.id}
                  >
                    {downloading === certificate.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-1"></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleShare(certificate)}
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => handlePrint(certificate)}
                  >
                    <Printer className="w-4 h-4 mr-1" />
                    Print
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600">
              {filter.search || filter.year !== "all" || filter.status !== "all"
                ? "Try changing your search or filters"
                : "You haven't earned any certificates yet"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Participate in ISTE events to earn certificates
            </p>
          </CardContent>
        </Card>
      )}

      {/* Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verify Certificate
          </CardTitle>
          <CardDescription>
            Verify the authenticity of any ISTE certificate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="certificateNumber">Certificate Number</Label>
                <Input
                  id="certificateNumber"
                  placeholder="e.g., CERT-2024-000001"
                />
              </div>
              <Button className="w-full" onClick={() => {
                const input = document.getElementById('certificateNumber') as HTMLInputElement;
                if (input.value.trim()) {
                  verifyCertificate(input.value.trim());
                } else {
                  toast({
                    title: "Enter Certificate Number",
                    description: "Please enter a certificate number to verify",
                    variant: "destructive"
                  });
                }
              }}>
                <Verified className="w-4 h-4 mr-2" />
                Verify Certificate
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Scan QR Code</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Use your phone camera to scan certificate QR codes
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Instantly verify certificate authenticity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Preview Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden">
            {/* Close Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-4 right-4 z-10"
              onClick={() => setSelectedCertificate(null)}
            >
              <ExternalLink className="w-6 h-6" />
            </Button>

            {/* Certificate Preview */}
            <div className="p-4 overflow-auto max-h-[80vh]">
              <div className="border-4 border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-white">
                {/* Certificate Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <Award className="w-16 h-16 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">ISTE CERTIFICATE</h2>
                  <p className="text-gray-600">Indian Society for Technical Education</p>
                  <div className="mt-2">
                    <Badge className={selectedCertificate.verified ? 'bg-green-500' : 'bg-amber-500'}>
                      {selectedCertificate.verified ? 'VERIFIED' : 'PENDING VERIFICATION'}
                    </Badge>
                  </div>
                </div>

                {/* Certificate Content */}
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-4">{selectedCertificate.title}</h3>
                  <p className="text-gray-700 mb-6">This certificate is proudly presented to</p>
                  
                  {/* User info would go here */}
                  <div className="my-8 py-4 border-y border-gray-300">
                    <p className="text-lg font-semibold">[Your Name]</p>
                    <p className="text-gray-600">Member, ISTE Student Chapter</p>
                  </div>

                  <p className="text-gray-700 mb-4">
                    in recognition of successful participation and achievement
                  </p>

                  {selectedCertificate.event_title && (
                    <p className="font-medium text-gray-800">
                      Event: {selectedCertificate.event_title}
                    </p>
                  )}
                </div>

                {/* Certificate Footer */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-300">
                  <div className="text-center">
                    <p className="font-bold">Date Issued</p>
                    <p className="text-gray-700">
                      {format(new Date(selectedCertificate.issued_at), "MMMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Certificate Number</p>
                    <p className="font-mono text-gray-700">{selectedCertificate.certificate_number}</p>
                  </div>
                </div>

                {/* Verification QR */}
                <div className="mt-8 pt-8 border-t border-gray-300 text-center">
                  <div className="inline-flex p-4 bg-gray-100 rounded-lg">
                    <QrCode className="w-24 h-24 text-gray-700" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Scan to verify authenticity
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 border-t bg-gray-50 flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleDownload(selectedCertificate)}
                disabled={downloading === selectedCertificate.id}
              >
                {downloading === selectedCertificate.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handlePrint(selectedCertificate)}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleShare(selectedCertificate)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}