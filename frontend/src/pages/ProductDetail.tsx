import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Shield, 
  Zap, 
  BarChart3,
  Users,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Mock data - replace with API call
const mockProduct = {
  slug: 'risk-analyzer',
  name: 'Risk Analyzer Pro',
  description: 'Advanced portfolio risk assessment with AI-driven recommendations and real-time monitoring.',
  long_description: 'Our Risk Analyzer Pro uses cutting-edge machine learning algorithms to provide comprehensive portfolio risk assessment. Monitor your investments in real-time, receive predictive insights, and get actionable recommendations to optimize your risk-return profile.',
  features: [
    'Real-time portfolio monitoring',
    'AI-powered risk predictions',
    'Custom alert system',
    'Regulatory compliance checks',
    'Historical backtesting',
    'Multi-asset class support'
  ],
  benefits: [
    'Reduce portfolio volatility by up to 30%',
    'Early warning system for market downturns',
    'Automated compliance reporting',
    'Seamless integration with existing systems'
  ],
  plans: [
    {
      id: 1,
      name: 'Starter',
      price: 49,
      currency: 'USD',
      interval: 'month',
      features: ['Up to 10 assets', 'Basic alerts', 'Email support'],
      is_popular: false
    },
    {
      id: 2,
      name: 'Professional',
      price: 149,
      currency: 'USD',
      interval: 'month',
      features: ['Up to 100 assets', 'Advanced analytics', 'Priority support', 'API access'],
      is_popular: true
    },
    {
      id: 3,
      name: 'Enterprise',
      price: 399,
      currency: 'USD',
      interval: 'month',
      features: ['Unlimited assets', 'Custom models', 'Dedicated support', 'White-label options'],
      is_popular: false
    }
  ],
  rating: 4.8,
  reviews_count: 247,
  is_active: true
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch product details from API
    // const fetchProduct = async () => {
    //   try {
    //     const response = await api.get(`/products/items/${slug}`);
    //     setProduct(response.data);
    //   } catch (error) {
    //     console.error('Error fetching product:', error);
    //   }
    // };
    // fetchProduct();
  }, [slug]);

  const handleSubscribe = async (planId: number) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to subscribe to a plan.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement subscription API call
      // await api.post('/accounts/me/subscribe', { plan: planId });
      toast({
        title: 'Subscription Successful',
        description: 'You have successfully subscribed to the plan.',
      });
    } catch (error) {
      toast({
        title: 'Subscription Failed',
        description: 'There was an error processing your subscription.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container py-8">
        <Link to="/products" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Overview */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">AI Agent</Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Star className="h-4 w-4 fill-warning text-warning mr-1" />
                  {mockProduct.rating} ({mockProduct.reviews_count} reviews)
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4">{mockProduct.name}</h1>
              <p className="text-xl text-muted-foreground mb-6">{mockProduct.description}</p>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {mockProduct.long_description}
                </p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  Key Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockProduct.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-accent" />
                  Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockProduct.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Shield className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pricing Plans */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Choose Your Plan
                </CardTitle>
                <CardDescription>
                  Select the plan that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockProduct.plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedPlan === plan.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    } ${plan.is_popular ? 'ring-2 ring-primary/20' : ''}`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{plan.name}</h3>
                      {plan.is_popular && (
                        <Badge variant="default" className="text-xs">Most Popular</Badge>
                      )}
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      ${plan.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{plan.interval}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="h-3 w-3 text-success mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                <Separator />
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!selectedPlan || isLoading}
                  onClick={() => selectedPlan && handleSubscribe(selectedPlan)}
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </Button>
                
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-center">
                    <Link to="/login" className="text-primary hover:underline">
                      Sign in
                    </Link> to subscribe
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;