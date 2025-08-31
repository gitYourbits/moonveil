import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  Bot,
  DollarSign,
  Users,
  Star,
  CheckCircle
} from 'lucide-react';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Analytics',
      description: 'Advanced machine learning algorithms analyze financial patterns and predict market trends.',
      color: 'text-primary'
    },
    {
      icon: TrendingUp,
      title: 'Real-time Insights',
      description: 'Get instant access to market data and financial metrics with live dashboard updates.',
      color: 'text-accent'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with end-to-end encryption and compliance certifications.',
      color: 'text-success'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of transactions and generate reports in milliseconds.',
      color: 'text-warning'
    }
  ];

  const products = [
    {
      name: 'Risk Analyzer',
      description: 'Advanced portfolio risk assessment with AI-driven recommendations.',
      badge: 'Most Popular',
      features: ['Real-time monitoring', 'Predictive analytics', 'Custom alerts']
    },
    {
      name: 'Market Intelligence',
      description: 'Comprehensive market analysis and trend prediction platform.',
      badge: 'New',
      features: ['Market sentiment', 'Technical analysis', 'News integration']
    },
    {
      name: 'Compliance Suite',
      description: 'Automated compliance monitoring and regulatory reporting.',
      badge: 'Enterprise',
      features: ['Regulatory updates', 'Automated reports', 'Audit trails']
    }
  ];

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: DollarSign, value: '$50B+', label: 'Assets Analyzed' },
    { icon: BarChart3, value: '99.9%', label: 'Uptime' },
    { icon: Star, value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
        <div className="container relative">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Badge variant="secondary" className="mb-4 glass">
              🚀 New AI Models Available
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
              The Future of
              <span className="block text-gradient-hero">
                Financial Intelligence
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Harness the power of AI to transform your financial operations. From risk analysis to market intelligence, 
              our platform delivers enterprise-grade solutions that scale with your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-primary">
                <Link to="/products" className="flex items-center">
                  Explore Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/docs">
                  View Documentation
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label }, index) => (
              <div 
                key={label} 
                className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
              >
                <div className="flex justify-center mb-2">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Built for Modern Finance
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-driven platform combines cutting-edge technology with financial expertise 
              to deliver unparalleled insights and automation.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description, color }, index) => (
              <Card 
                key={title} 
                className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-subtle ${isVisible ? 'animate-fade-in' : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our AI Agent Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our suite of specialized AI agents designed for different financial use cases.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {products.map(({ name, description, badge, features }, index) => (
              <Card 
                key={name} 
                className={`group hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border-0 bg-background ${isVisible ? 'animate-slide-up' : ''}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={badge === 'Most Popular' ? 'default' : badge === 'New' ? 'secondary' : 'outline'}>
                      {badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{name}</CardTitle>
                  <CardDescription className="text-base">
                    {description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {features.map(feature => (
                      <li key={feature} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full group-hover:shadow-md transition-shadow">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="bg-gradient-primary rounded-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your Finance Operations?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Join thousands of financial professionals who trust Finagen to power their operations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link to="/products">
                    Start Free Trial
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;