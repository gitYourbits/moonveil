import { useEffect, useState } from 'react';
import { accountsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  CreditCard, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Key,
  BarChart3,
  Settings,
  Plus,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const [dashboardData, setDashboardData] = useState({
    usage_events: { total: 0, change: '+0%', trend: 'up' },
    invoices_total: { amount: 0, currency: 'USD', change: '+0%', trend: 'up' },
    invoices_unpaid: { count: 0, amount: 0, currency: 'USD' },
    active_subscriptions: { count: 0, plans: [] as string[] },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const { data } = await accountsAPI.getDashboard();
        setDashboardData({
          usage_events: { total: data?.usage_events ?? 0, change: '+0%', trend: 'up' },
          invoices_total: { amount: data?.invoices_total ?? 0, currency: 'USD', change: '+0%', trend: 'up' },
          invoices_unpaid: { count: data?.invoices_unpaid ?? 0, amount: 0, currency: 'USD' },
          active_subscriptions: { count: data?.active_subscriptions ?? 0, plans: [] },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Generate API Key',
      description: 'Create a new API key for your applications',
      icon: Key,
      href: '/keys',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'View Usage',
      description: 'Check your API usage and analytics',
      icon: BarChart3,
      href: '/usage',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Billing Settings',
      description: 'Manage your subscription and payments',
      icon: CreditCard,
      href: '/billing',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      icon: Settings,
      href: '/settings',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    }
  ];

  const recentActivity = [
    {
      type: 'api_call',
      description: 'Risk Analysis API called',
      timestamp: '2 minutes ago',
      status: 'success'
    },
    {
      type: 'subscription',
      description: 'Pro Plan subscription renewed',
      timestamp: '1 hour ago',
      status: 'success'
    },
    {
      type: 'api_key',
      description: 'New API key generated',
      timestamp: '3 hours ago',
      status: 'success'
    },
    {
      type: 'payment',
      description: 'Invoice payment failed',
      timestamp: '1 day ago',
      status: 'error'
    }
  ];

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded w-48 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-16 animate-pulse" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.first_name || user?.username}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your Finagen account today.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.usage_events.total.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              {dashboardData.usage_events.trend === 'up' ? (
                <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
              ) : (
                <ArrowDownRight className="mr-1 h-3 w-3 text-destructive" />
              )}
              {dashboardData.usage_events.change} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${dashboardData.invoices_total.amount.toFixed(2)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ArrowUpRight className="mr-1 h-3 w-3 text-success" />
              {dashboardData.invoices_total.change} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.invoices_unpaid.count}
            </div>
            <div className="text-xs text-muted-foreground">
              ${dashboardData.invoices_unpaid.amount.toFixed(2)} total due
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.active_subscriptions.count}
            </div>
            <div className="text-xs text-muted-foreground">
              subscriptions active
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ title, description, icon: Icon, href, color, bgColor }) => (
            <Card key={title} className="hover:shadow-md transition-shadow cursor-pointer group">
              <Link to={href} className="block">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <div className="space-y-1">
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="text-sm">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Active Subscriptions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Activity
              <Button variant="outline" size="sm" asChild>
                <Link to="/usage">View All</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`mt-0.5 ${activity.status === 'success' ? 'text-success' : 'text-destructive'}`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Subscriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Active Subscriptions
              <Button variant="outline" size="sm" asChild>
                <Link to="/billing">Manage</Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.active_subscriptions.plans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{plan}</p>
                    <p className="text-xs text-muted-foreground">Active subscription</p>
                  </div>
                  <Badge variant="outline" className="text-success border-success/20 bg-success/10">
                    Active
                  </Badge>
                </div>
              ))}
              
              <Button variant="outline" className="w-full" asChild>
                <Link to="/products">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Subscription
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;