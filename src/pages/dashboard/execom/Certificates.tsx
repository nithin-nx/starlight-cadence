import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Award,
  Upload,
  Download,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  BarChart3,
  Folder,
  ExternalLink,
  Mail,
  Send,
  QrCode,
  Shield,
  Image as ImageIcon,
  Settings,
  RefreshCw,
  Zap,
  FileSpreadsheet,
  FolderOpen,
  Link,
  Copy,
  Printer,
  Layout,
  Sparkles,
  Info
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
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';

interface Certificate {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientEmail: string;
  recipientId: string;
  eventId: string;
  eventName: string;
  certificateType: 'Participation' | 'Achievement' | 'Completion' | 'Excellence' | 'Volunteer';
  issueDate: string;
  expiryDate?: string;
  status: 'draft' | 'generated' | 'issued' | 'delivered' | 'expired' | 'revoked';
  templateId: string;
  templateName: string;
  downloadUrl?: string;
  viewUrl?: string;
  qrCodeUrl?: string;
  verified: boolean;
  verificationCode: string;
  metadata: {
    hours?: number;
    grade?: string;
    position?: string;
    organizerSignature?: string;
    coordinatorSignature?: string;
  };
  emailSent: boolean;
  emailSentDate?: string;
  downloadCount: number;
  lastAccessed?: string;
  batchId?: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  category: string;
  fields: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  defaultFor: string[];
}

interface BatchProcess {
  id: string;
  name: string;
  eventId: string;
  eventName: string;
  templateId: string;
  templateName: string;
  status: 'uploading' | 'processing' | 'generating' | 'completed' | 'failed';
  totalRecords: number;
  processedRecords: number;
  successfulGenerations: number;
  failedGenerations: number;
  startTime: string;
  endTime?: string;
  uploadedFile?: File;
  driveFolderUrl?: string;
  errors?: string[];
}

const CertificateManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'issueDate' | 'name' | 'status' | 'event'>('issueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'certificates' | 'templates' | 'batch'>('certificates');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [driveFolderLink, setDriveFolderLink] = useState('');
  const [batchName, setBatchName] = useState('');
  const [batchProcesses, setBatchProcesses] = useState<BatchProcess[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const certificatesPerPage = 12;

  // Mock data - In real app, fetch from API
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: '1',
      certificateNumber: 'ISTE-CERT-2024-001',
      recipientName: 'Arjun Sharma',
      recipientEmail: 'arjun.sharma@iste.gec.edu',
      recipientId: 'CS201',
      eventId: '1',
      eventName: 'Web Development Bootcamp',
      certificateType: 'Completion',
      issueDate: '2024-01-21',
      status: 'issued',
      templateId: '1',
      templateName: 'Modern Tech Certificate',
      downloadUrl: 'https://drive.google.com/certificates/1.pdf',
      viewUrl: 'https://certificates.iste.org/view/1',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-001',
      verified: true,
      verificationCode: 'VC2024001',
      metadata: {
        hours: 24,
        grade: 'A+',
        organizerSignature: 'Dr. Vikram Singh',
        coordinatorSignature: 'Arjun Sharma'
      },
      emailSent: true,
      emailSentDate: '2024-01-21 14:30',
      downloadCount: 3,
      lastAccessed: '2024-01-22 10:15'
    },
    {
      id: '2',
      certificateNumber: 'ISTE-CERT-2024-002',
      recipientName: 'Priya Patel',
      recipientEmail: 'priya.patel@iste.gec.edu',
      recipientId: 'EC202',
      eventId: '1',
      eventName: 'Web Development Bootcamp',
      certificateType: 'Achievement',
      issueDate: '2024-01-21',
      status: 'delivered',
      templateId: '1',
      templateName: 'Modern Tech Certificate',
      downloadUrl: 'https://drive.google.com/certificates/2.pdf',
      viewUrl: 'https://certificates.iste.org/view/2',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-002',
      verified: true,
      verificationCode: 'VC2024002',
      metadata: {
        hours: 24,
        grade: 'A',
        position: '1st',
        organizerSignature: 'Dr. Vikram Singh',
        coordinatorSignature: 'Arjun Sharma'
      },
      emailSent: true,
      emailSentDate: '2024-01-21 14:30',
      downloadCount: 5,
      lastAccessed: '2024-01-23 11:20'
    },
    {
      id: '3',
      certificateNumber: 'ISTE-CERT-2024-003',
      recipientName: 'Rohan Desai',
      recipientEmail: 'rohan.desai@iste.gec.edu',
      recipientId: 'ME203',
      eventId: '2',
      eventName: 'Annual Tech Conference',
      certificateType: 'Participation',
      issueDate: '2024-01-26',
      status: 'generated',
      templateId: '2',
      templateName: 'Conference Certificate',
      downloadUrl: 'https://drive.google.com/certificates/3.pdf',
      viewUrl: 'https://certificates.iste.org/view/3',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-003',
      verified: false,
      verificationCode: 'VC2024003',
      metadata: {
        hours: 8,
        organizerSignature: 'Dr. Vikram Singh'
      },
      emailSent: false,
      downloadCount: 1,
      lastAccessed: '2024-01-26 16:45'
    },
    {
      id: '4',
      certificateNumber: 'ISTE-CERT-2024-004',
      recipientName: 'Sneha Nair',
      recipientEmail: 'sneha.nair@iste.gec.edu',
      recipientId: 'CE204',
      eventId: '3',
      eventName: 'AI & ML Workshop',
      certificateType: 'Completion',
      issueDate: '2024-01-16',
      expiryDate: '2025-01-16',
      status: 'issued',
      templateId: '3',
      templateName: 'Workshop Certificate',
      downloadUrl: 'https://drive.google.com/certificates/4.pdf',
      viewUrl: 'https://certificates.iste.org/view/4',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-004',
      verified: true,
      verificationCode: 'VC2024004',
      metadata: {
        hours: 16,
        grade: 'A+',
        organizerSignature: 'Dr. Vikram Singh',
        coordinatorSignature: 'Priya Patel'
      },
      emailSent: true,
      emailSentDate: '2024-01-16 18:00',
      downloadCount: 7,
      lastAccessed: '2024-01-20 14:30',
      batchId: 'BATCH-001'
    },
    {
      id: '5',
      certificateNumber: 'ISTE-CERT-2024-005',
      recipientName: 'Dr. Vikram Singh',
      recipientEmail: 'vikram.singh@gec.edu',
      recipientId: 'FAC001',
      eventId: '2',
      eventName: 'Annual Tech Conference',
      certificateType: 'Excellence',
      issueDate: '2024-01-26',
      status: 'draft',
      templateId: '2',
      templateName: 'Conference Certificate',
      verified: false,
      verificationCode: 'VC2024005',
      metadata: {
        hours: 8,
        position: 'Keynote Speaker',
        organizerSignature: 'ISTE Committee'
      },
      emailSent: false,
      downloadCount: 0
    },
    {
      id: '6',
      certificateNumber: 'ISTE-CERT-2024-006',
      recipientName: 'Ananya Reddy',
      recipientEmail: 'ananya.reddy@iste.gec.edu',
      recipientId: 'EE205',
      eventId: '4',
      eventName: 'Hackathon 2024',
      certificateType: 'Achievement',
      issueDate: '2024-02-11',
      status: 'revoked',
      templateId: '4',
      templateName: 'Competition Certificate',
      downloadUrl: 'https://drive.google.com/certificates/6.pdf',
      viewUrl: 'https://certificates.iste.org/view/6',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-006',
      verified: true,
      verificationCode: 'VC2024006',
      metadata: {
        hours: 24,
        position: '2nd Runner-up',
        organizerSignature: 'Rohan Desai'
      },
      emailSent: true,
      emailSentDate: '2024-02-11 10:00',
      downloadCount: 4,
      lastAccessed: '2024-02-12 09:15'
    },
    {
      id: '7',
      certificateNumber: 'ISTE-CERT-2024-007',
      recipientName: 'Karthik Menon',
      recipientEmail: 'karthik.menon@alumni.gec.edu',
      recipientId: 'ALM001',
      eventId: '7',
      eventName: 'ISTE Annual Meet',
      certificateType: 'Volunteer',
      issueDate: '2023-12-21',
      status: 'expired',
      templateId: '5',
      templateName: 'Volunteer Certificate',
      downloadUrl: 'https://drive.google.com/certificates/7.pdf',
      viewUrl: 'https://certificates.iste.org/view/7',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-007',
      verified: true,
      verificationCode: 'VC2024007',
      metadata: {
        hours: 40,
        organizerSignature: 'Meera Iyer'
      },
      emailSent: true,
      emailSentDate: '2023-12-21 16:00',
      downloadCount: 2,
      lastAccessed: '2024-01-05 11:30'
    },
    {
      id: '8',
      certificateNumber: 'ISTE-CERT-2024-008',
      recipientName: 'Meera Iyer',
      recipientEmail: 'meera.iyer@iste.gec.edu',
      recipientId: 'EC206',
      eventId: '6',
      eventName: 'Cybersecurity Workshop',
      certificateType: 'Completion',
      issueDate: '2024-01-31',
      status: 'issued',
      templateId: '3',
      templateName: 'Workshop Certificate',
      downloadUrl: 'https://drive.google.com/certificates/8.pdf',
      viewUrl: 'https://certificates.iste.org/view/8',
      qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?data=ISTE-CERT-2024-008',
      verified: true,
      verificationCode: 'VC2024008',
      metadata: {
        hours: 8,
        grade: 'A',
        organizerSignature: 'Karthik Menon'
      },
      emailSent: true,
      emailSentDate: '2024-01-31 12:00',
      downloadCount: 6,
      lastAccessed: '2024-02-02 15:45',
      batchId: 'BATCH-002'
    }
  ]);

  const [templates, setTemplates] = useState<CertificateTemplate[]>([
    {
      id: '1',
      name: 'Modern Tech Certificate',
      description: 'Modern design with gradient background for tech events',
      previewImage: '/templates/modern-tech.jpg',
      category: 'Technology',
      fields: ['recipientName', 'eventName', 'issueDate', 'certificateNumber', 'hours', 'grade', 'signatures'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      usageCount: 45,
      defaultFor: ['workshop', 'bootcamp']
    },
    {
      id: '2',
      name: 'Conference Certificate',
      description: 'Professional design for conferences and seminars',
      previewImage: '/templates/conference.jpg',
      category: 'Conference',
      fields: ['recipientName', 'eventName', 'issueDate', 'certificateNumber', 'position', 'signatures'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-10',
      usageCount: 78,
      defaultFor: ['conference', 'seminar']
    },
    {
      id: '3',
      name: 'Workshop Certificate',
      description: 'Clean design for workshops and training sessions',
      previewImage: '/templates/workshop.jpg',
      category: 'Workshop',
      fields: ['recipientName', 'eventName', 'issueDate', 'certificateNumber', 'hours', 'grade', 'signatures'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-12',
      usageCount: 32,
      defaultFor: ['workshop', 'training']
    },
    {
      id: '4',
      name: 'Competition Certificate',
      description: 'Elegant design for competitions and hackathons',
      previewImage: '/templates/competition.jpg',
      category: 'Competition',
      fields: ['recipientName', 'eventName', 'issueDate', 'certificateNumber', 'position', 'signatures'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-08',
      usageCount: 21,
      defaultFor: ['competition', 'hackathon']
    },
    {
      id: '5',
      name: 'Volunteer Certificate',
      description: 'Appreciation certificate for volunteers',
      previewImage: '/templates/volunteer.jpg',
      category: 'Volunteer',
      fields: ['recipientName', 'eventName', 'issueDate', 'certificateNumber', 'hours', 'signatures'],
      isActive: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-05',
      usageCount: 15,
      defaultFor: ['volunteer', 'social']
    }
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
  ];

  const filters = [
    { value: 'all', label: 'All Certificates', count: certificates.length },
    { value: 'issued', label: 'Issued', count: certificates.filter(c => c.status === 'issued').length },
    { value: 'generated', label: 'Generated', count: certificates.filter(c => c.status === 'generated').length },
    { value: 'draft', label: 'Draft', count: certificates.filter(c => c.status === 'draft').length },
    { value: 'delivered', label: 'Delivered', count: certificates.filter(c => c.status === 'delivered').length },
    { value: 'expired', label: 'Expired', count: certificates.filter(c => c.status === 'expired').length },
    { value: 'revoked', label: 'Revoked', count: certificates.filter(c => c.status === 'revoked').length },
    { value: 'unverified', label: 'Unverified', count: certificates.filter(c => !c.verified).length },
    { value: 'unsent', label: 'Email Not Sent', count: certificates.filter(c => !c.emailSent).length },
  ];

  const certificateTypes = [
    'Participation', 'Achievement', 'Completion', 'Excellence', 'Volunteer'
  ];

  // Calculate statistics
  const stats = {
    total: certificates.length,
    issued: certificates.filter(c => c.status === 'issued').length,
    delivered: certificates.filter(c => c.status === 'delivered').length,
    draft: certificates.filter(c => c.status === 'draft').length,
    emailSent: certificates.filter(c => c.emailSent).length,
    verified: certificates.filter(c => c.verified).length,
    totalDownloads: certificates.reduce((sum, c) => sum + c.downloadCount, 0),
    batchGenerated: certificates.filter(c => c.batchId).length,
  };

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(certificate => {
      const matchesSearch = searchQuery === '' || 
        certificate.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        certificate.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        certificate.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        certificate.eventName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'all' || 
        certificate.status === selectedFilter ||
        (selectedFilter === 'unverified' && !certificate.verified) ||
        (selectedFilter === 'unsent' && !certificate.emailSent);
      
      const matchesEvent = selectedEvent === 'all' || 
        certificate.eventId === selectedEvent;
      
      const matchesStatus = selectedStatus === 'all' || 
        certificate.status === selectedStatus;
      
      return matchesSearch && matchesFilter && matchesEvent && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch(sortBy) {
        case 'issueDate': 
          aValue = new Date(a.issueDate).getTime();
          bValue = new Date(b.issueDate).getTime();
          break;
        case 'name':
          aValue = a.recipientName.toLowerCase();
          bValue = b.recipientName.toLowerCase();
          break;
        case 'status':
          const statusOrder = { draft: 1, generated: 2, issued: 3, delivered: 4, expired: 5, revoked: 6 };
          aValue = statusOrder[a.status as keyof typeof statusOrder];
          bValue = statusOrder[b.status as keyof typeof statusOrder];
          break;
        case 'event':
          aValue = a.eventName.toLowerCase();
          bValue = b.eventName.toLowerCase();
          break;
        default:
          aValue = new Date(a.issueDate).getTime();
          bValue = new Date(b.issueDate).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredCertificates.length / certificatesPerPage);
  const startIndex = (currentPage - 1) * certificatesPerPage;
  const endIndex = startIndex + certificatesPerPage;
  const currentCertificates = filteredCertificates.slice(startIndex, endIndex);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'issued': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'generated': return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'draft': return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      case 'delivered': return 'bg-green-500/15 text-green-400 border-green-500/30';
      case 'expired': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'revoked': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Achievement': return 'bg-purple-500/15 text-purple-400';
      case 'Completion': return 'bg-blue-500/15 text-blue-400';
      case 'Participation': return 'bg-green-500/15 text-green-400';
      case 'Excellence': return 'bg-amber-500/15 text-amber-400';
      case 'Volunteer': return 'bg-rose-500/15 text-rose-400';
      default: return 'bg-slate-500/15 text-slate-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSelectCertificate = (certificateId: string) => {
    setSelectedCertificates(prev =>
      prev.includes(certificateId)
        ? prev.filter(id => id !== certificateId)
        : [...prev, certificateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCertificates.length === currentCertificates.length) {
      setSelectedCertificates([]);
    } else {
      setSelectedCertificates(currentCertificates.map(c => c.id));
    }
  };

  const handleBulkAction = (action: string) => {
    setIsLoading(true);
    console.log(`Bulk ${action} for certificates:`, selectedCertificates);
    
    // Simulate API call
    setTimeout(() => {
      if (action === 'issue') {
        setCertificates(prev => prev.map(certificate => 
          selectedCertificates.includes(certificate.id) 
            ? { ...certificate, status: 'issued' as const }
            : certificate
        ));
      } else if (action === 'send-email') {
        setCertificates(prev => prev.map(certificate => 
          selectedCertificates.includes(certificate.id) 
            ? { 
                ...certificate, 
                emailSent: true,
                emailSentDate: new Date().toISOString()
              }
            : certificate
        ));
      } else if (action === 'revoke') {
        setCertificates(prev => prev.map(certificate => 
          selectedCertificates.includes(certificate.id) 
            ? { ...certificate, status: 'revoked' as const }
            : certificate
        ));
      } else if (action === 'download') {
        console.log('Downloading selected certificates');
        // Trigger download for selected certificates
      } else if (action === 'verify') {
        setCertificates(prev => prev.map(certificate => 
          selectedCertificates.includes(certificate.id) 
            ? { ...certificate, verified: true }
            : certificate
        ));
      } else if (action === 'delete') {
        setCertificates(prev => prev.filter(certificate => !selectedCertificates.includes(certificate.id)));
        setSelectedCertificates([]);
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert('Please upload an Excel file (.xlsx, .xls) or CSV file');
      return;
    }

    // Start batch process
    setIsBatchProcessing(true);
    setUploadProgress(0);

    const batchId = `BATCH-${Date.now()}`;
    const newBatch: BatchProcess = {
      id: batchId,
      name: batchName || `Batch ${new Date().toLocaleDateString()}`,
      eventId: selectedEvent,
      eventName: events.find(e => e.id === selectedEvent)?.name || 'Unknown Event',
      templateId: selectedTemplate,
      templateName: templates.find(t => t.id === selectedTemplate)?.name || 'Unknown Template',
      status: 'uploading',
      totalRecords: 0,
      processedRecords: 0,
      successfulGenerations: 0,
      failedGenerations: 0,
      startTime: new Date().toISOString(),
      uploadedFile: file,
    };

    setBatchProcesses(prev => [newBatch, ...prev]);

    // Simulate upload and processing
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          
          // Simulate processing
          setTimeout(() => {
            setBatchProcesses(prev => prev.map(batch => 
              batch.id === batchId 
                ? { 
                    ...batch, 
                    status: 'completed',
                    totalRecords: 50,
                    processedRecords: 50,
                    successfulGenerations: 48,
                    failedGenerations: 2,
                    endTime: new Date().toISOString(),
                    driveFolderUrl: driveFolderLink || 'https://drive.google.com/drive/folders/example',
                    errors: ['Row 25: Missing email address', 'Row 42: Invalid name format']
                  }
                : batch
            ));
            
            // Add new certificates
            const newCertificates: Certificate[] = Array.from({ length: 48 }, (_, i) => ({
              id: `auto-${Date.now()}-${i}`,
              certificateNumber: `ISTE-CERT-${new Date().getFullYear()}-${1000 + i}`,
              recipientName: `Participant ${i + 1}`,
              recipientEmail: `participant${i + 1}@example.com`,
              recipientId: `ID${1000 + i}`,
              eventId: selectedEvent,
              eventName: events.find(e => e.id === selectedEvent)?.name || 'Unknown Event',
              certificateType: 'Participation',
              issueDate: new Date().toISOString().split('T')[0],
              status: 'generated',
              templateId: selectedTemplate,
              templateName: templates.find(t => t.id === selectedTemplate)?.name || 'Unknown Template',
              verified: false,
              verificationCode: `VC${new Date().getFullYear()}${1000 + i}`,
              metadata: {},
              emailSent: false,
              downloadCount: 0,
              batchId: batchId,
            }));

            setCertificates(prev => [...newCertificates, ...prev]);
            setIsBatchProcessing(false);
          }, 2000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleGenerateCertificates = () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification in real app
    console.log('Copied to clipboard:', text);
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
            Certificate Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate, issue, and manage certificates automatically
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleBulkAction('download')}
          >
            <Download className="h-4 w-4" />
            Bulk Download
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setActiveTab('batch')}
          >
            <BarChart3 className="h-4 w-4" />
            View Batches
          </Button>
          <Button className="gap-2" onClick={() => setActiveTab('batch')}>
            <Sparkles className="h-4 w-4" />
            Auto Generate
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold mt-1">{stats.total}</p>
              </div>
              <div className="p-2 rounded-lg bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Issued</p>
                <p className="text-2xl font-bold mt-1">{stats.issued}</p>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold mt-1">{stats.delivered}</p>
              </div>
              <div className="p-2 rounded-lg bg-green-500/10">
                <Send className="h-5 w-5 text-green-500" />
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
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Download className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Batch Generated</p>
                <p className="text-2xl font-bold mt-1">{stats.batchGenerated}</p>
              </div>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Zap className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="batch">Batch Generation</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Filters */}
            <div className="lg:col-span-1">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Actions</CardTitle>
                  <CardDescription>Manage certificates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Event Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Event</Label>
                    <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                      <SelectTrigger>
                        <SelectValue placeholder="All events" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map(event => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Status</Label>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="All status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="generated">Generated</SelectItem>
                        <SelectItem value="issued">Issued</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="revoked">Revoked</SelectItem>
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

                  {/* Bulk Actions */}
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Bulk Actions</Label>
                    <div className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleBulkAction('issue')}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Issued
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleBulkAction('send-email')}
                      >
                        <Send className="h-4 w-4" />
                        Send Email
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2"
                        onClick={() => handleBulkAction('verify')}
                      >
                        <Shield className="h-4 w-4" />
                        Verify
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 text-red-500"
                        onClick={() => handleBulkAction('revoke')}
                      >
                        <XCircle className="h-4 w-4" />
                        Revoke
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedFilter('all');
                      setSelectedEvent('all');
                      setSelectedStatus('all');
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
                      <CardTitle>Certificates</CardTitle>
                      <CardDescription>
                        {filteredCertificates.length} certificates found • Sort by: {sortBy} ({sortOrder})
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search certificates..."
                          className="pl-10 w-full sm:w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex border border-white/10 rounded-lg">
                        <button
                          onClick={() => setViewMode('list')}
                          className={cn(
                            "p-2 rounded-l-lg transition-colors",
                            viewMode === 'list' 
                              ? "bg-white/[0.08] text-white" 
                              : "text-muted-foreground hover:bg-white/[0.03]"
                          )}
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={cn(
                            "p-2 rounded-r-lg transition-colors",
                            viewMode === 'grid' 
                              ? "bg-white/[0.08] text-white" 
                              : "text-muted-foreground hover:bg-white/[0.03]"
                          )}
                        >
                          <Award className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                {/* Bulk Actions Bar */}
                {selectedCertificates.length > 0 && (
                  <div className="px-6 py-3 bg-primary/5 border-y border-white/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {selectedCertificates.length} certificate{selectedCertificates.length > 1 ? 's' : ''} selected
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleBulkAction('issue')}
                        >
                          <CheckCircle className="h-3 w-3" />
                          Issue
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleBulkAction('send-email')}
                        >
                          <Send className="h-3 w-3" />
                          Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleBulkAction('verify')}
                        >
                          <Shield className="h-3 w-3" />
                          Verify
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
                          onClick={() => setSelectedCertificates([])}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <CardContent className="p-0">
                  {viewMode === 'list' ? (
                    // List View
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/5">
                            <th className="text-left p-4">
                              <input
                                type="checkbox"
                                checked={selectedCertificates.length === currentCertificates.length}
                                onChange={handleSelectAll}
                                className="h-4 w-4 rounded border-white/20"
                              />
                            </th>
                            <th 
                              className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                              onClick={() => handleSort('name')}
                            >
                              <div className="flex items-center gap-1">
                                Recipient
                                {sortBy === 'name' && (
                                  <span className="text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                )}
                              </div>
                            </th>
                            <th 
                              className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                              onClick={() => handleSort('event')}
                            >
                              Event
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                              Certificate Details
                            </th>
                            <th 
                              className="text-left p-4 text-sm font-medium text-muted-foreground cursor-pointer hover:text-white"
                              onClick={() => handleSort('status')}
                            >
                              Status
                            </th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentCertificates.map((certificate) => (
                            <tr 
                              key={certificate.id} 
                              className={cn(
                                "border-b border-white/5 hover:bg-white/[0.02] transition-colors",
                                selectedCertificates.includes(certificate.id) && "bg-primary/5"
                              )}
                            >
                              <td className="p-4">
                                <input
                                  type="checkbox"
                                  checked={selectedCertificates.includes(certificate.id)}
                                  onChange={() => handleSelectCertificate(certificate.id)}
                                  className="h-4 w-4 rounded border-white/20"
                                />
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium">{certificate.recipientName}</p>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    {certificate.recipientEmail}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    ID: {certificate.recipientId}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div>
                                  <p className="font-medium text-sm">{certificate.eventName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(certificate.issueDate)}
                                  </p>
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono">{certificate.certificateNumber}</span>
                                    <Badge variant="outline" className={cn("text-xs", getTypeColor(certificate.certificateType))}>
                                      {certificate.certificateType}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Layout className="h-3 w-3" />
                                    {certificate.templateName}
                                  </div>
                                  {certificate.metadata.hours && (
                                    <div className="text-xs text-muted-foreground">
                                      {certificate.metadata.hours} hours • {certificate.metadata.grade}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="space-y-1">
                                  <Badge variant="outline" className={cn("text-xs", getStatusColor(certificate.status))}>
                                    {certificate.status.toUpperCase()}
                                  </Badge>
                                  <div className="flex items-center gap-1 text-xs">
                                    {certificate.verified ? (
                                      <span className="text-emerald-500 flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="text-amber-500 flex items-center gap-1">
                                        <Shield className="h-3 w-3" />
                                        Unverified
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {certificate.emailSent ? (
                                      <span className="flex items-center gap-1">
                                        <Send className="h-3 w-3 text-emerald-500" />
                                        Email sent
                                      </span>
                                    ) : (
                                      <span className="flex items-center gap-1">
                                        <Send className="h-3 w-3 text-rose-500" />
                                        Email pending
                                      </span>
                                    )}
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
                                      Preview
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                      <Download className="h-4 w-4" />
                                      Download PDF
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                      <QrCode className="h-4 w-4" />
                                      View QR Code
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                      <Edit2 className="h-4 w-4" />
                                      Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                      <Send className="h-4 w-4" />
                                      Send Email
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 cursor-pointer">
                                      <Copy className="h-4 w-4" />
                                      Copy Verification Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="gap-2 cursor-pointer text-red-500">
                                      <Trash2 className="h-4 w-4" />
                                      Revoke Certificate
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    // Grid View
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                      {currentCertificates.map((certificate) => (
                        <Card 
                          key={certificate.id} 
                          className={cn(
                            "border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent transition-all hover:border-primary/20 hover:shadow-lg group",
                            selectedCertificates.includes(certificate.id) && "ring-2 ring-primary/50"
                          )}
                        >
                          <CardContent className="p-5">
                            {/* Certificate Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="outline" className={cn("text-xs", getTypeColor(certificate.certificateType))}>
                                    {certificate.certificateType}
                                  </Badge>
                                  <Badge variant="outline" className={cn("text-xs", getStatusColor(certificate.status))}>
                                    {certificate.status}
                                  </Badge>
                                </div>
                                <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                                  {certificate.recipientName}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">{certificate.recipientEmail}</p>
                              </div>
                              <input
                                type="checkbox"
                                checked={selectedCertificates.includes(certificate.id)}
                                onChange={() => handleSelectCertificate(certificate.id)}
                                className="h-4 w-4 rounded border-white/20"
                              />
                            </div>

                            {/* Certificate Details */}
                            <div className="space-y-3 mb-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Certificate Number</p>
                                <p className="font-mono text-sm">{certificate.certificateNumber}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Event</p>
                                <p className="text-sm font-medium">{certificate.eventName}</p>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <div>
                                  <p className="text-xs text-muted-foreground">Issue Date</p>
                                  <p>{formatDate(certificate.issueDate)}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Downloads</p>
                                  <p className="text-center">{certificate.downloadCount}</p>
                                </div>
                              </div>
                            </div>

                            {/* Verification & Email Status */}
                            <div className="flex items-center justify-between mb-4 pt-4 border-t border-white/5">
                              <div className="flex items-center gap-2">
                                {certificate.verified ? (
                                  <div className="flex items-center gap-1 text-emerald-500 text-xs">
                                    <Shield className="h-3 w-3" />
                                    Verified
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                                    <Shield className="h-3 w-3" />
                                    Unverified
                                  </div>
                                )}
                              </div>
                              <div>
                                {certificate.emailSent ? (
                                  <div className="flex items-center gap-1 text-emerald-500 text-xs">
                                    <Send className="h-3 w-3" />
                                    Sent
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 text-rose-500 text-xs">
                                    <Send className="h-3 w-3" />
                                    Pending
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 gap-2">
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                              <Button size="sm" className="flex-1 gap-2">
                                <Download className="h-3 w-3" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>

                {/* Pagination */}
                {filteredCertificates.length > 0 && (
                  <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/5">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredCertificates.length)} of {filteredCertificates.length} certificates
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
                {filteredCertificates.length === 0 && (
                  <CardContent className="py-16 text-center">
                    <div className="mx-auto max-w-md">
                      <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No certificates found</h3>
                      <p className="text-muted-foreground mb-6">
                        {searchQuery 
                          ? `No certificates match "${searchQuery}". Try a different search term.`
                          : 'No certificates match your current filters.'
                        }
                      </p>
                      <Button 
                        variant="outline" 
                        className="mr-3"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedFilter('all');
                          setSelectedEvent('all');
                          setSelectedStatus('all');
                        }}
                      >
                        Clear filters
                      </Button>
                      <Button onClick={() => setActiveTab('batch')}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Certificates
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Certificate Templates</CardTitle>
                  <CardDescription>
                    Manage certificate templates for different events
                  </CardDescription>
                </div>
                <Button>
                  <Layout className="h-4 w-4 mr-2" />
                  New Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent group hover:border-primary/20 transition-all"
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-primary/40" />
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                            {template.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            {template.isActive ? (
                              <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-slate-500/15 text-slate-400 border-slate-500/30 text-xs">
                                Inactive
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
                            <DropdownMenuItem>Preview</DropdownMenuItem>
                            <DropdownMenuItem>Edit Template</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Set as Default</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {template.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Usage Count</span>
                          <span className="font-medium">{template.usageCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Last Updated</span>
                          <span className="font-medium">{template.updatedAt}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Fields</span>
                          <span className="font-medium">{template.fields.length}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-4">
                        {template.defaultFor.slice(0, 3).map((category, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-white/[0.03] text-xs rounded border border-white/5"
                          >
                            {category}
                          </span>
                        ))}
                        {template.defaultFor.length > 3 && (
                          <span className="px-2 py-1 bg-white/[0.03] text-xs rounded border border-white/5">
                            +{template.defaultFor.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex gap-2 mt-6">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Preview
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Edit2 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Batch Generation Form */}
            <div className="lg:col-span-2">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Batch Certificate Generation
                  </CardTitle>
                  <CardDescription>
                    Upload Excel sheet with participant data to generate certificates automatically
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Upload Progress */}
                  {isBatchProcessing && (
                    <Alert className="bg-blue-500/5 border-blue-500/20">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                        <div className="flex-1">
                          <AlertTitle>Processing Batch</AlertTitle>
                          <AlertDescription>
                            Generating certificates from uploaded file...
                          </AlertDescription>
                          <Progress value={uploadProgress} className="h-2 mt-2" />
                          <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% complete</p>
                        </div>
                      </div>
                    </Alert>
                  )}

                  {/* Batch Details Form */}
                  <div className="space-y-4">
                    <div>
                      <Label>Batch Name</Label>
                      <Input
                        placeholder="e.g., Web Dev Bootcamp Certificates Jan 2024"
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event</Label>
                        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event" />
                          </SelectTrigger>
                          <SelectContent>
                            {events.slice(1).map(event => (
                              <SelectItem key={event.id} value={event.id}>
                                {event.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Certificate Template</Label>
                        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Google Drive Folder Link (Optional)</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://drive.google.com/drive/folders/..."
                          value={driveFolderLink}
                          onChange={(e) => setDriveFolderLink(e.target.value)}
                        />
                        <Button variant="outline" size="icon">
                          <FolderOpen className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Certificates will be saved to this folder. Leave empty to create a new folder.
                      </p>
                    </div>

                    {/* File Upload Area */}
                    <div className="border-2 border-dashed border-white/10 rounded-lg p-8 text-center hover:border-primary/20 transition-colors">
                      <FileSpreadsheet className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                      <h3 className="font-medium mb-2">Upload Participant Data</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload Excel (.xlsx, .xls) or CSV file with participant details
                      </p>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept=".xlsx,.xls,.csv"
                        className="hidden"
                      />
                      
                      <Button 
                        onClick={handleGenerateCertificates}
                        disabled={!selectedTemplate || isBatchProcessing}
                        className="gap-2"
                      >
                        {isBatchProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4" />
                            Select File & Generate
                          </>
                        )}
                      </Button>
                      
                      <p className="text-xs text-muted-foreground mt-4">
                        Required columns: Name, Email, ID, Additional fields based on template
                      </p>
                    </div>

                    {/* Instructions */}
                    <Alert className="bg-amber-500/5 border-amber-500/20">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-500" />
                        <div>
                          <AlertTitle>File Format Requirements</AlertTitle>
                          <AlertDescription className="space-y-2">
                            <p className="text-sm">Your Excel/CSV file should include these columns:</p>
                            <ul className="text-xs space-y-1 list-disc list-inside">
                              <li><strong>Name:</strong> Participant's full name</li>
                              <li><strong>Email:</strong> Valid email address</li>
                              <li><strong>ID:</strong> Student ID or unique identifier</li>
                              <li><strong>Additional Fields:</strong> Based on selected template (hours, grade, position, etc.)</li>
                            </ul>
                            <p className="text-sm mt-2">
                              <a href="/templates/participants-template.xlsx" className="text-primary hover:underline">
                                Download sample template
                              </a>
                            </p>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Batches */}
            <div className="lg:col-span-1">
              <Card className="border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <CardHeader>
                  <CardTitle>Recent Batches</CardTitle>
                  <CardDescription>Latest certificate generation jobs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {batchProcesses.map((batch) => (
                      <div 
                        key={batch.id}
                        className="p-4 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{batch.name}</h4>
                            <p className="text-xs text-muted-foreground">{batch.eventName}</p>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-xs",
                            batch.status === 'completed' ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                            batch.status === 'failed' ? "bg-rose-500/15 text-rose-400 border-rose-500/30" :
                            batch.status === 'processing' ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                            "bg-amber-500/15 text-amber-400 border-amber-500/30"
                          )}>
                            {batch.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Processed</span>
                            <span>{batch.processedRecords}/{batch.totalRecords}</span>
                          </div>
                          <Progress 
                            value={batch.totalRecords ? (batch.processedRecords / batch.totalRecords) * 100 : 0} 
                            className="h-1.5"
                          />
                          
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-medium text-emerald-500">{batch.successfulGenerations}</div>
                              <div className="text-muted-foreground">Success</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium text-rose-500">{batch.failedGenerations}</div>
                              <div className="text-muted-foreground">Failed</div>
                            </div>
                          </div>
                          
                          {batch.driveFolderUrl && (
                            <div className="flex items-center gap-1 text-xs">
                              <Folder className="h-3 w-3 text-muted-foreground" />
                              <a 
                                href={batch.driveFolderUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate"
                              >
                                View in Drive
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {batchProcesses.length === 0 && (
                      <div className="text-center py-8">
                        <FileSpreadsheet className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No batch processes yet</p>
                        <p className="text-xs text-muted-foreground mt-1">Upload a file to start generating certificates</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CertificateManagement;