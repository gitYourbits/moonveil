import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  Share2,
  BookOpen,
  ChevronRight
} from 'lucide-react';

// Mock data - replace with API call
const mockGuide = {
  id: 1,
  slug: 'getting-started',
  title: 'Getting Started with Finagen AI Platform',
  description: 'Learn the basics of setting up your account and making your first API call.',
  content: `
    <h2>Introduction</h2>
    <p>Welcome to Finagen, the premier AI-powered financial intelligence platform. This guide will walk you through the essential steps to get started with our platform and make your first successful API call.</p>
    
    <h2>Prerequisites</h2>
    <ul>
      <li>A valid Finagen account</li>
      <li>Basic understanding of REST APIs</li>
      <li>Your preferred development environment</li>
    </ul>
    
    <h2>Step 1: Account Setup</h2>
    <p>First, ensure your account is properly configured:</p>
    <ol>
      <li>Log into your Finagen dashboard</li>
      <li>Complete your profile information</li>
      <li>Verify your email address</li>
    </ol>
    
    <h2>Step 2: Generate API Keys</h2>
    <p>To access our APIs, you'll need to generate an API key:</p>
    <ol>
      <li>Navigate to the API Keys section in your dashboard</li>
      <li>Click "Create New Key"</li>
      <li>Choose appropriate permissions</li>
      <li>Save your key securely</li>
    </ol>
    
    <h2>Step 3: Your First API Call</h2>
    <p>Here's a simple example to get you started:</p>
    
    <pre><code>curl -X GET "https://api.finagen.com/v1/products" \\
  -H "Api-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json"</code></pre>
    
    <h2>Next Steps</h2>
    <p>Now that you've made your first API call, explore our other guides to learn about:</p>
    <ul>
      <li>Advanced risk analysis techniques</li>
      <li>Market intelligence integration</li>
      <li>Compliance automation</li>
    </ul>
  `,
  category: 'Getting Started',
  author: 'Finagen Team',
  author_avatar: '/placeholder.svg',
  read_time: '5 min read',
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-20T15:30:00Z',
  tags: ['beginner', 'setup', 'api'],
  related_guides: [
    {
      id: 2,
      slug: 'api-integration',
      title: 'API Integration Best Practices',
      category: 'Development'
    },
    {
      id: 3,
      slug: 'risk-analysis-guide',
      title: 'Advanced Risk Analysis Techniques',
      category: 'Risk Management'
    }
  ]
};

const GuideDetail = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState(mockGuide);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // TODO: Fetch guide details from API
    // const fetchGuide = async () => {
    //   setIsLoading(true);
    //   try {
    //     const response = await api.get(`/core/guides/${slug}`);
    //     setGuide(response.data);
    //   } catch (error) {
    //     console.error('Error fetching guide:', error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };
    // fetchGuide();
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link to="/guides" className="hover:text-foreground">Guides</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{guide.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="max-w-none">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{guide.category}</Badge>
                  {guide.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{guide.title}</h1>
                <p className="text-xl text-muted-foreground mb-6">{guide.description}</p>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {guide.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {guide.read_time}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(guide.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Content */}
              <div 
                className="prose prose-gray max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: guide.content }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Table of Contents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Table of Contents</CardTitle>
                </CardHeader>
                <CardContent>
                  <nav className="space-y-2 text-sm">
                    <a href="#introduction" className="block text-muted-foreground hover:text-foreground">
                      Introduction
                    </a>
                    <a href="#prerequisites" className="block text-muted-foreground hover:text-foreground">
                      Prerequisites
                    </a>
                    <a href="#step-1" className="block text-muted-foreground hover:text-foreground">
                      Step 1: Account Setup
                    </a>
                    <a href="#step-2" className="block text-muted-foreground hover:text-foreground">
                      Step 2: Generate API Keys
                    </a>
                    <a href="#step-3" className="block text-muted-foreground hover:text-foreground">
                      Step 3: Your First API Call
                    </a>
                    <a href="#next-steps" className="block text-muted-foreground hover:text-foreground">
                      Next Steps
                    </a>
                  </nav>
                </CardContent>
              </Card>

              {/* Related Guides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Related Guides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {guide.related_guides.map((relatedGuide) => (
                    <Link
                      key={relatedGuide.id}
                      to={`/guides/${relatedGuide.slug}`}
                      className="block p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="font-medium text-sm mb-1 line-clamp-2">
                        {relatedGuide.title}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {relatedGuide.category}
                      </Badge>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Help */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Need Help?</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Can't find what you're looking for?
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to="/support">Contact Support</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;