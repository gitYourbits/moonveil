import { useState, useEffect } from 'react';
import { usageAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  TrendingUp, 
  Clock, 
  Filter,
  Download,
  Calendar,
  Search
} from 'lucide-react';

const mockUsageData = {
  overview: {
    total_requests: 15420,
    total_tokens: 2847361,
    avg_response_time: 0.245,
    success_rate: 99.8
  },
  events: [
    {
      id: 1,
      timestamp: '2024-01-20T14:30:00Z',
      product: 'Risk Analyzer',
      api_key_prefix: 'ra_prod_abc',
      endpoint: '/api/v1/analyze-portfolio',
      method: 'POST',
      status_code: 200,
      response_time: 0.234,
      tokens_used: 1250,
      cost: 0.0125
    },
    {
      id: 2,
      timestamp: '2024-01-20T14:25:00Z',
      product: 'Market Intelligence',
      api_key_prefix: 'mi_prod_def',
      endpoint: '/api/v1/market-sentiment',
      method: 'GET',
      status_code: 200,
      response_time: 0.156,
      tokens_used: 850,
      cost: 0.0085
    },
    {
      id: 3,
      timestamp: '2024-01-20T14:20:00Z',
      product: 'Risk Analyzer',
      api_key_prefix: 'ra_test_ghi',
      endpoint: '/api/v1/risk-metrics',
      method: 'GET',
      status_code: 429,
      response_time: 0.089,
      tokens_used: 0,
      cost: 0
    }
  ],
  charts: {
    requests_over_time: [
      { date: '2024-01-14', requests: 1200, tokens: 245000 },
      { date: '2024-01-15', requests: 1350, tokens: 267000 },
      { date: '2024-01-16', requests: 1100, tokens: 223000 },
      { date: '2024-01-17', requests: 1450, tokens: 289000 },
      { date: '2024-01-18', requests: 1580, tokens: 312000 },
      { date: '2024-01-19', requests: 1620, tokens: 325000 },
      { date: '2024-01-20', requests: 1420, tokens: 286000 }
    ],
    product_usage: [
      { name: 'Risk Analyzer', value: 45, color: 'hsl(215, 25%, 30%)' },
      { name: 'Market Intelligence', value: 30, color: 'hsl(230, 25%, 45%)' },
      { name: 'Compliance Suite', value: 25, color: 'hsl(145, 50%, 40%)' }
    ]
  }
};

const Usage = () => {
  const [usageData, setUsageData] = useState(mockUsageData);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    product: '',
    api_key_prefix: '',
    date_from: '',
    date_to: '',
    status: ''
  });

  useEffect(() => {
    const fetchUsageData = async () => {
      setIsLoading(true);
      try {
        const { data } = await usageAPI.getEvents({ product: filters.product, api_key_prefix: filters.api_key_prefix });
        const results = data?.results ?? data ?? [];
        setUsageData({
          ...mockUsageData,
          events: results.map((e: any, idx: number) => ({
            id: e.id ?? idx,
            timestamp: e.created_at,
            product: String(e.product),
            api_key_prefix: e.api_key_prefix,
            endpoint: e.endpoint,
            method: 'POST',
            status_code: 200,
            response_time: (e.latency_ms ?? 0) / 1000,
            tokens_used: (e.tokens_in ?? 0) + (e.tokens_out ?? 0),
            cost: 0,
          })),
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsageData();
  }, [filters]);

  const getStatusBadge = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <Badge variant="outline" className="text-success border-success">Success</Badge>;
    } else if (statusCode >= 400 && statusCode < 500) {
      return <Badge variant="outline" className="text-warning border-warning">Client Error</Badge>;
    } else if (statusCode >= 500) {
      return <Badge variant="outline" className="text-destructive border-destructive">Server Error</Badge>;
    } else {
      return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const exportData = () => {
    // TODO: Implement data export functionality
    console.log('Exporting usage data...');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Usage Analytics</h1>
            <p className="text-muted-foreground">Monitor your API usage and performance metrics</p>
          </div>
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.overview.total_requests.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.overview.total_tokens.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.overview.avg_response_time}s</div>
              <p className="text-xs text-muted-foreground">
                -5.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usageData.overview.success_rate}%</div>
              <p className="text-xs text-muted-foreground">
                +0.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Data */}
        <Tabs defaultValue="charts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="events">Event Log</TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requests Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle>Requests Over Time</CardTitle>
                  <CardDescription>Daily API request volume</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageData.charts.requests_over_time}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="requests" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Product Usage Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage by Product</CardTitle>
                  <CardDescription>Distribution of API calls by product</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={usageData.charts.product_usage}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {usageData.charts.product_usage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Token Usage */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Token Usage Over Time</CardTitle>
                  <CardDescription>Daily token consumption</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={usageData.charts.requests_over_time}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="tokens" fill="hsl(var(--accent))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select 
                    value={filters.product} 
                    onValueChange={(value) => setFilters({...filters, product: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Products</SelectItem>
                      <SelectItem value="risk-analyzer">Risk Analyzer</SelectItem>
                      <SelectItem value="market-intelligence">Market Intelligence</SelectItem>
                      <SelectItem value="compliance-suite">Compliance Suite</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="API Key Prefix"
                    value={filters.api_key_prefix}
                    onChange={(e) => setFilters({...filters, api_key_prefix: e.target.value})}
                  />

                  <Input
                    type="date"
                    placeholder="From Date"
                    value={filters.date_from}
                    onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                  />

                  <Input
                    type="date"
                    placeholder="To Date"
                    value={filters.date_to}
                    onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                  />

                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters({...filters, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>API Events</CardTitle>
                <CardDescription>Detailed log of API requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>API Key</TableHead>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response Time</TableHead>
                      <TableHead>Tokens</TableHead>
                      <TableHead>Cost</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usageData.events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(event.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{event.product}</TableCell>
                        <TableCell className="font-mono text-sm">{event.api_key_prefix}</TableCell>
                        <TableCell className="font-mono text-sm">{event.endpoint}</TableCell>
                        <TableCell>{getStatusBadge(event.status_code)}</TableCell>
                        <TableCell>{event.response_time}s</TableCell>
                        <TableCell>{event.tokens_used.toLocaleString()}</TableCell>
                        <TableCell>${event.cost.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Usage;