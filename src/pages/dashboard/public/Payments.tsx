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
  CreditCard,
  Download,
  Eye,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  ExternalLink,
  Printer,
  Copy,
  QrCode,
  IndianRupee,
  Receipt,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface PaymentRecord {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string | null;
  receipt_url: string | null;
  date: string;
  created_by: string | null;
  created_by_name: string | null;
  status: 'pending' | 'paid' | 'verified' | 'rejected';
  reference_id: string | null;
}

interface PaymentFilter {
  type: string;
  status: string;
  dateRange: string;
  search: string;
}

interface PaymentStats {
  totalPaid: number;
  totalPending: number;
  totalVerified: number;
  monthlyTotal: number;
}

export default function Payments() {
  const { toast } = useToast();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PaymentFilter>({
    type: "all",
    status: "all",
    dateRange: "all",
    search: ""
  });
  const [stats, setStats] = useState<PaymentStats>({
    totalPaid: 0,
    totalPending: 0,
    totalVerified: 0,
    monthlyTotal: 0
  });
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const paymentTypes = [
    { value: "membership", label: "Membership" },
    { value: "event", label: "Event" },
    { value: "sponsorship", label: "Sponsorship" },
    { value: "donation", label: "Donation" },
    { value: "expense", label: "Expense" },
    { value: "other", label: "Other" }
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [payments, filter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to view your payment history",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch financial records for the user (based on email or user_id)
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .or(`created_by.eq.${user.id},description.ilike.%${user.email}%`)
        .order('date', { ascending: false });

      if (error) throw error;

      // Fetch membership applications for user payments
      const { data: applications } = await supabase
        .from('membership_applications')
        .select('*')
        .eq('email', user.email);

      // Fetch event payments for user
      const { data: eventPayments } = await supabase
        .from('event_participants')
        .select('*')
        .eq('email', user.email);

      // Combine and format all payment records
      const formattedPayments: PaymentRecord[] = [];

      // Add financial records
      (data || []).forEach(record => {
        formattedPayments.push({
          id: record.id,
          title: record.title,
          amount: record.amount,
          type: (record.type === 'income' || record.type === 'expense') ? record.type : 'expense',
          category: 'other', // financial_records doesn't have category field
          description: record.description,
          receipt_url: null, // financial_records doesn't have receipt_url field
          date: record.date,
          created_by: record.created_by,
          created_by_name: null,
          status: 'verified', // Financial records are typically verified
          reference_id: `FIN-${record.id.slice(0, 8)}`
        });
      });

      // Add membership application payments
      (applications || []).forEach(app => {
        formattedPayments.push({
          id: app.id,
          title: `Membership Fee - ${app.full_name}`,
          amount: 500, // Assuming ₹500 membership fee
          type: 'expense',
          category: 'membership',
          description: `ISTE Membership Application - ${app.department || 'N/A'}, ${app.year_of_study || 'N/A'}`,
          receipt_url: null, // membership_applications doesn't have payment_proof_url field
          date: app.created_at.split('T')[0],
          created_by: app.user_id,
          created_by_name: null,
          status: app.status === 'approved' ? 'verified' : 
                  app.status === 'rejected' ? 'rejected' : 'pending',
          reference_id: `MEM-${app.id.slice(0, 8)}`
        });
      });

      // Add event payments
      (eventPayments || []).forEach(event => {
        formattedPayments.push({
          id: event.id,
          title: `Event Registration`,
          amount: 0, // Get actual amount from events table
          type: 'expense',
          category: 'event',
          description: `Event registration payment`,
          receipt_url: null,
          date: event.registered_at.split('T')[0],
          created_by: event.registered_by,
          created_by_name: null,
          status: 'pending', // event_participants doesn't have payment_status field
          reference_id: `EVT-${event.id.slice(0, 8)}`
        });
      });

      // Sort by date
      formattedPayments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setPayments(formattedPayments);

    } catch (error) {
      console.error('Error fetching payments:', error);
      toast({
        title: "Error",
        description: "Failed to load payment history",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...payments];

    // Filter by type
    if (filter.type !== "all") {
      result = result.filter(payment => payment.category === filter.type);
    }

    // Filter by status
    if (filter.status !== "all") {
      result = result.filter(payment => payment.status === filter.status);
    }

    // Filter by date range
    if (filter.dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();
      
      switch (filter.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "year":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      result = result.filter(payment => new Date(payment.date) >= startDate);
    }

    // Filter by search
    if (filter.search.trim()) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(payment =>
        payment.title.toLowerCase().includes(searchLower) ||
        payment.description?.toLowerCase().includes(searchLower) ||
        payment.reference_id?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredPayments(result);
  };

  const calculateStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getMonth() === currentMonth && 
             paymentDate.getFullYear() === currentYear;
    });

    const totalPaid = payments
      .filter(p => p.status === 'paid' || p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPending = payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalVerified = payments
      .filter(p => p.status === 'verified')
      .reduce((sum, p) => sum + p.amount, 0);

    const monthlyTotal = monthlyPayments
      .filter(p => p.type === 'expense')
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({
      totalPaid,
      totalPending,
      totalVerified,
      monthlyTotal
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, JSX.Element> = {
      pending: <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
        <Clock className="w-3 h-3 mr-1" /> Pending
      </Badge>,
      paid: <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        <CheckCircle className="w-3 h-3 mr-1" /> Paid
      </Badge>,
      verified: <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle className="w-3 h-3 mr-1" /> Verified
      </Badge>,
      rejected: <Badge className="bg-red-500/10 text-red-500 border-red-500/20">
        <XCircle className="w-3 h-3 mr-1" /> Rejected
      </Badge>
    };
    return badges[status] || <Badge variant="outline">{status}</Badge>;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      membership: "bg-blue-500",
      event: "bg-purple-500",
      sponsorship: "bg-green-500",
      donation: "bg-amber-500",
      expense: "bg-red-500",
      other: "bg-gray-500"
    };
    return colors[category] || "bg-gray-500";
  };

  const handleDownloadReceipt = async (payment: PaymentRecord) => {
    try {
      setDownloading(payment.id);
      
      if (!payment.receipt_url) {
        toast({
          title: "No Receipt",
          description: "No receipt available for this payment",
          variant: "destructive"
        });
        return;
      }

      const response = await fetch(payment.receipt_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${payment.reference_id || payment.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: "Receipt download has started",
      });

    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download receipt",
        variant: "destructive"
      });
    } finally {
      setDownloading(null);
    }
  };

  const handleCopyReference = (referenceId: string) => {
    navigator.clipboard.writeText(referenceId);
    toast({
      title: "Copied!",
      description: "Reference ID copied to clipboard",
    });
  };

  const generateReceipt = (payment: PaymentRecord) => {
    // In a real app, this would generate a PDF receipt
    const receiptContent = `
      ISTE PAYMENT RECEIPT
      ====================
      
      Receipt No: ${payment.reference_id}
      Date: ${format(new Date(payment.date), "dd/MM/yyyy")}
      
      Paid By: [Your Name]
      Amount: ₹${payment.amount}
      For: ${payment.title}
      
      Status: ${payment.status.toUpperCase()}
      Category: ${payment.category.toUpperCase()}
      
      ${payment.description ? `Description: ${payment.description}` : ''}
      
      --------------------
      ISTE Student Chapter
      GECI Dukki
      
      This is a computer-generated receipt.
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${payment.reference_id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Receipt Generated",
      description: "Payment receipt has been generated",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">
          Track all your ISTE payments and receipts
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold">
                  <IndianRupee className="inline w-5 h-5" />
                  {stats.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">
                  <IndianRupee className="inline w-5 h-5" />
                  {stats.totalPending.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verified</p>
                <p className="text-2xl font-bold">
                  <IndianRupee className="inline w-5 h-5" />
                  {stats.totalVerified.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold">
                  <IndianRupee className="inline w-5 h-5" />
                  {stats.monthlyTotal.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search payments by title, description, or reference..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select
                value={filter.type}
                onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Category" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {paymentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
                    <AlertCircle className="w-4 h-4" />
                    <SelectValue placeholder="Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                value={filter.dateRange}
                onValueChange={(value) => setFilter(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <SelectValue placeholder="Date Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading payment history...</p>
        </div>
      ) : filteredPayments.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Records
            </CardTitle>
            <CardDescription>
              {filteredPayments.length} payment records found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                    <th className="text-left py-3 px-4 font-medium">Category</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Reference</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {format(new Date(payment.date), "dd/MM/yyyy")}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{payment.title}</div>
                          {payment.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {payment.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`flex items-center gap-1 font-bold ${
                          payment.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {payment.type === 'income' ? '+' : '-'}
                          <IndianRupee className="w-4 h-4" />
                          {payment.amount.toLocaleString()}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`${getCategoryColor(payment.category)}/10 text-${getCategoryColor(payment.category).split('-')[1]}-600 border-${getCategoryColor(payment.category).split('-')[1]}-500/20`}>
                          {payment.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {payment.reference_id || 'N/A'}
                          </span>
                          {payment.reference_id && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6"
                              onClick={() => handleCopyReference(payment.reference_id!)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {payment.receipt_url && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadReceipt(payment)}
                              disabled={downloading === payment.id}
                            >
                              {downloading === payment.id ? (
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <>
                                  <Download className="w-4 h-4 mr-1" />
                                  Receipt
                                </>
                              )}
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateReceipt(payment)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Generate
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Payments Found</h3>
            <p className="text-gray-600">
              {filter.search || filter.type !== "all" || filter.status !== "all" || filter.dateRange !== "all"
                ? "Try changing your filters"
                : "No payment records found"}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Accepted payment methods and instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IndianRupee className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">UPI Payment</h4>
                    <p className="text-sm text-blue-700">Fast and secure UPI payments</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">UPI ID:</span>
                    <span className="font-medium">istegeci@oksbi</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">QR Code:</span>
                    <Button size="sm" variant="outline">
                      <QrCode className="w-4 h-4 mr-1" />
                      Show QR
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">Bank Transfer</h4>
                    <p className="text-sm text-green-700">Direct bank transfer details</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Name:</span>
                    <span className="font-medium">ISTE GECI</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Number:</span>
                    <span className="font-medium">1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IFSC:</span>
                    <span className="font-medium">SBIN0001234</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">Important Notes</h4>
                    <p className="text-sm text-amber-700">Please read before making payments</p>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Always include your name and purpose in payment remarks
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Save payment screenshot/slip for verification
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Payments are verified within 24-48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    Contact ISTE treasurer for payment issues
                  </li>
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Receipt className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold">Need Help?</h4>
                    <p className="text-sm text-purple-700">Contact ISTE payment support</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Treasurer:</span>
                    <span className="font-medium">John Doe</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">treasurer@istegeci.in</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">+91 9876543210</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Payment Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Payment Categories</h4>
              <div className="space-y-3">
                {paymentTypes.map(type => {
                  const categoryTotal = payments
                    .filter(p => p.category === type.value)
                    .reduce((sum, p) => sum + p.amount, 0);
                  const percentage = payments.length > 0 
                    ? (categoryTotal / stats.totalPaid) * 100 
                    : 0;
                  
                  return (
                    <div key={type.value} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{type.label}</span>
                        <span className="font-medium">
                          <IndianRupee className="inline w-3 h-3" />
                          {categoryTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getCategoryColor(type.value)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <div className="space-y-3">
                {payments.slice(0, 5).map(payment => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{payment.title}</div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(payment.date), "MMM dd")}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${payment.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.type === 'income' ? '+' : '-'}
                        <IndianRupee className="inline w-3 h-3" />
                        {payment.amount}
                      </div>
                      <div className="text-xs">{getStatusBadge(payment.status)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}