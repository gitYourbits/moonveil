import { useState, useEffect } from 'react';
import { billingAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Plus, 
  Download, 
  Calendar,
  DollarSign,
  Trash2,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const mockBillingData = {
  current_balance: 247.50,
  upcoming_invoice: {
    amount: 149.00,
    due_date: '2024-02-01'
  },
  payment_methods: [
    {
      id: 1,
      type: 'card',
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2025,
      is_default: true
    },
    {
      id: 2,
      type: 'card',
      brand: 'mastercard',
      last4: '5555',
      exp_month: 8,
      exp_year: 2026,
      is_default: false
    }
  ],
  invoices: [
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      amount: 149.00,
      currency: 'USD',
      status: 'paid',
      created_at: '2024-01-01T00:00:00Z',
      due_date: '2024-01-15T00:00:00Z',
      paid_at: '2024-01-10T14:30:00Z',
      description: 'Professional Plan - January 2024'
    },
    {
      id: 'inv_002',
      number: 'INV-2024-002',
      amount: 149.00,
      currency: 'USD',
      status: 'pending',
      created_at: '2024-01-15T00:00:00Z',
      due_date: '2024-02-01T00:00:00Z',
      paid_at: null,
      description: 'Professional Plan - February 2024'
    },
    {
      id: 'inv_003',
      number: 'INV-2023-012',
      amount: 149.00,
      currency: 'USD',
      status: 'overdue',
      created_at: '2023-12-01T00:00:00Z',
      due_date: '2023-12-15T00:00:00Z',
      paid_at: null,
      description: 'Professional Plan - December 2023'
    }
  ]
};

const Billing = () => {
  const [billingData, setBillingData] = useState(mockBillingData);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBillingData = async () => {
      setIsLoading(true);
      try {
        const [pmRes, invRes] = await Promise.all([
          billingAPI.getPaymentMethods(),
          billingAPI.getInvoices(),
        ]);
        setBillingData({
          ...mockBillingData,
          payment_methods: (pmRes.data?.results ?? pmRes.data ?? []).map((m: any, i: number) => ({
            id: m.id ?? i,
            type: 'card',
            brand: m.brand ?? 'card',
            last4: m.last4 ?? '0000',
            exp_month: m.exp_month ?? 1,
            exp_year: m.exp_year ?? 2030,
            is_default: i === 0,
          })),
          invoices: (invRes.data?.results ?? invRes.data ?? []).map((iv: any, i: number) => ({
            id: String(iv.id ?? i),
            number: iv.number ?? `INV-${i}`,
            amount: (iv.amount_cents ?? 0) / 100,
            currency: iv.currency ?? 'USD',
            status: iv.paid ? 'paid' : 'pending',
            created_at: iv.issued_at,
            due_date: iv.issued_at,
            paid_at: iv.paid ? iv.issued_at : null,
            description: iv.number ?? 'Invoice',
          })),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBillingData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="text-success border-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Paid
        </Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-warning border-warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case 'overdue':
        return <Badge variant="outline" className="text-destructive border-destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Overdue
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCardBrandIcon = (brand: string) => {
    // This would typically use actual brand icons
    return <CreditCard className="h-4 w-4" />;
  };

  const handleAddPaymentMethod = async (paymentData: any) => {
    setIsLoading(true);
    try {
      await billingAPI.createPaymentMethod(paymentData);
      toast({
        title: 'Payment Method Added',
        description: 'Your payment method has been added successfully.',
      });
      setShowAddPaymentMethod(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add payment method.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: number) => {
    try {
      await billingAPI.deletePaymentMethod(String(id));
      toast({
        title: 'Payment Method Deleted',
        description: 'Payment method has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete payment method.',
        variant: 'destructive',
      });
    }
  };

  const downloadInvoice = (invoiceId: string) => {
    // TODO: Implement invoice download
    console.log('Downloading invoice:', invoiceId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Billing & Payments</h1>
            <p className="text-muted-foreground">Manage your payment methods and billing history</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${billingData.current_balance}</div>
              <p className="text-xs text-muted-foreground">
                Available credits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Invoice</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${billingData.upcoming_invoice.amount}</div>
              <p className="text-xs text-muted-foreground">
                Due {new Date(billingData.upcoming_invoice.due_date).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{billingData.payment_methods.length}</div>
              <p className="text-xs text-muted-foreground">
                Active payment methods
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods</CardDescription>
                  </div>
                  <Dialog open={showAddPaymentMethod} onOpenChange={setShowAddPaymentMethod}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Method
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Payment Method</DialogTitle>
                        <DialogDescription>
                          Add a new credit or debit card to your account
                        </DialogDescription>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="exp-month">Expiry Month</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Month" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => (
                                  <SelectItem key={i + 1} value={String(i + 1)}>
                                    {String(i + 1).padStart(2, '0')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="exp-year">Expiry Year</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 10 }, (_, i) => (
                                  <SelectItem key={2024 + i} value={String(2024 + i)}>
                                    {2024 + i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" maxLength={4} />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowAddPaymentMethod(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => handleAddPaymentMethod({})}>
                            Add Payment Method
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {billingData.payment_methods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getCardBrandIcon(method.brand)}
                        <div>
                          <div className="font-medium">
                            •••• •••• •••• {method.last4}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Expires {method.exp_month}/{method.exp_year}
                          </div>
                        </div>
                        {method.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePaymentMethod(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Invoices</CardTitle>
                <CardDescription>Your billing history</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billingData.invoices.slice(0, 5).map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{invoice.number}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(invoice.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${invoice.amount}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => downloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* All Invoices */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Complete billing history</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billingData.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.number}</TableCell>
                    <TableCell>{invoice.description}</TableCell>
                    <TableCell>${invoice.amount}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => downloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;