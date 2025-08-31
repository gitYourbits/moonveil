import { useState, useEffect } from 'react';
import { supportAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Mail,
  Phone,
  ExternalLink
} from 'lucide-react';

const ticketSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  category: z.string().min(1, 'Category is required'),
  priority: z.string().min(1, 'Priority is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

const mockTickets = [
  {
    id: 'TKT-001',
    subject: 'API Rate Limiting Issues',
    category: 'Technical',
    priority: 'high',
    status: 'open',
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    assigned_to: 'Support Team'
  },
  {
    id: 'TKT-002',
    subject: 'Billing Question About Usage',
    category: 'Billing',
    priority: 'medium',
    status: 'in_progress',
    created_at: '2024-01-19T15:20:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    assigned_to: 'Sarah Chen'
  },
  {
    id: 'TKT-003',
    subject: 'Feature Request: Export Functionality',
    category: 'Feature Request',
    priority: 'low',
    status: 'resolved',
    created_at: '2024-01-18T11:30:00Z',
    updated_at: '2024-01-19T16:45:00Z',
    assigned_to: 'Product Team'
  }
];

const Support = () => {
  const [tickets, setTickets] = useState(mockTickets);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      category: '',
      priority: '',
      description: '',
    },
  });

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        const { data } = await supportAPI.getTickets();
        setTickets((data?.results ?? data ?? []).map((t: any) => ({
          id: String(t.id),
          subject: t.subject,
          category: 'General',
          priority: 'medium',
          status: t.status,
          created_at: t.created_at,
          updated_at: t.updated_at,
          assigned_to: '-',
        })));
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const onSubmit = async (data: z.infer<typeof ticketSchema>) => {
    setIsLoading(true);
    try {
      const response = await supportAPI.createTicket({
        subject: data.subject,
        message: data.description,
      });
      toast({
        title: 'Ticket Created',
        description: 'Your support ticket has been created successfully.',
      });
      setShowCreateTicket(false);
      form.reset();
      setTickets([{ id: String(response.data.id), subject: response.data.subject, category: 'General', priority: 'medium', status: response.data.status, created_at: response.data.created_at, updated_at: response.data.updated_at, assigned_to: '-' }, ...tickets]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create support ticket.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="text-destructive border-destructive">
          <AlertCircle className="h-3 w-3 mr-1" />
          Open
        </Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="text-warning border-warning">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>;
      case 'resolved':
        return <Badge variant="outline" className="text-success border-success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Resolved
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">Get help and manage your support tickets</p>
          </div>
          <Dialog open={showCreateTicket} onOpenChange={setShowCreateTicket}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>
                  Describe your issue and we'll get back to you as soon as possible
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    {...form.register('subject')}
                    error={form.formState.errors.subject?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => form.setValue('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                        <SelectItem value="feature-request">Feature Request</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.category && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select onValueChange={(value) => form.setValue('priority', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.priority && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide detailed information about your issue..."
                    rows={6}
                    {...form.register('description')}
                    error={form.formState.errors.description?.message}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowCreateTicket(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create Ticket'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Your Support Tickets</CardTitle>
                <CardDescription>Track and manage your support requests</CardDescription>
              </CardHeader>
              <CardContent>
                {tickets.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tickets.map((ticket) => (
                        <TableRow key={ticket.id} className="cursor-pointer">
                          <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                          <TableCell className="font-medium">{ticket.subject}</TableCell>
                          <TableCell>{ticket.category}</TableCell>
                          <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                          <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(ticket.updated_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tickets yet</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't created any support tickets yet.
                    </p>
                    <Button onClick={() => setShowCreateTicket(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">How do I generate API keys?</h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate to the API Keys section in your dashboard and click "Create New Key". 
                    Choose the appropriate permissions and save your key securely.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">What are the API rate limits?</h4>
                  <p className="text-sm text-muted-foreground">
                    Rate limits vary by plan. Starter plans have 1,000 requests per hour, 
                    Professional plans have 10,000 requests per hour, and Enterprise plans have custom limits.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">How is billing calculated?</h4>
                  <p className="text-sm text-muted-foreground">
                    Billing is based on your subscription plan plus any usage-based charges for tokens consumed. 
                    You can monitor your usage in the Usage Analytics section.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">support@finagen.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Available 9 AM - 5 PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Helpful Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/guides" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/api/docs" target="_blank" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    API Reference
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/guides/getting-started" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Getting Started Guide
                  </a>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <a href="/usage" className="flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Usage Analytics
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Support Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9 AM - 6 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10 AM - 4 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;