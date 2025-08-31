import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { coreAPI } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Mock content for static pages
const mockContent = {
  'usage-guide': {
    title: 'Usage Guide',
    content: `
      <h2>Getting Started with Finagen</h2>
      <p>Welcome to Finagen's comprehensive usage guide. This document will help you understand how to make the most of our AI-powered financial intelligence platform.</p>
      
      <h3>Quick Start</h3>
      <ol>
        <li>Sign up for your Finagen account</li>
        <li>Generate your API keys</li>
        <li>Choose your first AI agent product</li>
        <li>Make your first API call</li>
      </ol>
      
      <h3>Core Concepts</h3>
      <p>Understanding these key concepts will help you leverage Finagen more effectively:</p>
      <ul>
        <li><strong>AI Agents:</strong> Specialized AI models for different financial use cases</li>
        <li><strong>API Keys:</strong> Secure tokens for accessing our services</li>
        <li><strong>Usage Tracking:</strong> Monitor and optimize your consumption</li>
        <li><strong>Real-time Analytics:</strong> Get instant insights into your data</li>
      </ul>
      
      <h3>Best Practices</h3>
      <p>Follow these recommendations for optimal results:</p>
      <ul>
        <li>Start with small datasets to test integration</li>
        <li>Implement proper error handling</li>
        <li>Monitor your usage regularly</li>
        <li>Use webhooks for real-time updates</li>
      </ul>
    `
  },
  'docs': {
    title: 'Documentation',
    content: `
      <h2>Finagen Platform Documentation</h2>
      <p>Complete technical documentation for developers and financial professionals.</p>
      
      <h3>API Documentation</h3>
      <p>Our REST API provides access to all Finagen services. Key endpoints include:</p>
      <ul>
        <li><code>GET /api/products</code> - List available AI agent products</li>
        <li><code>POST /api/analyze</code> - Submit data for analysis</li>
        <li><code>GET /api/reports</code> - Retrieve generated reports</li>
        <li><code>GET /api/usage</code> - Check your usage statistics</li>
      </ul>
      
      <h3>Authentication</h3>
      <p>All API requests require authentication using API keys. Include your key in the request header:</p>
      <pre><code>Api-Key: your_api_key_here</code></pre>
      
      <h3>SDKs and Libraries</h3>
      <p>We provide official SDKs for popular programming languages:</p>
      <ul>
        <li>Python SDK</li>
        <li>JavaScript/Node.js SDK</li>
        <li>Java SDK</li>
        <li>C# SDK</li>
      </ul>
      
      <h3>Webhooks</h3>
      <p>Configure webhooks to receive real-time notifications about analysis results and system events.</p>
    `
  },
  'contact': {
    title: 'Contact Us',
    content: `
      <h2>Get in Touch</h2>
      <p>We're here to help you succeed with Finagen. Reach out to us through any of the following channels:</p>
      
      <h3>Sales & General Inquiries</h3>
      <p>Email: <a href="mailto:sales@finagen.com">sales@finagen.com</a><br>
      Phone: +1 (555) 123-4567</p>
      
      <h3>Technical Support</h3>
      <p>Email: <a href="mailto:support@finagen.com">support@finagen.com</a><br>
      For faster support, please use our <a href="/support">support portal</a>.</p>
      
      <h3>Partnership Opportunities</h3>
      <p>Email: <a href="mailto:partnerships@finagen.com">partnerships@finagen.com</a></p>
      
      <h3>Media & Press</h3>
      <p>Email: <a href="mailto:press@finagen.com">press@finagen.com</a></p>
      
      <h3>Office Locations</h3>
      <div style="margin: 2em 0;">
        <h4>Headquarters</h4>
        <p>123 Financial District<br>
        New York, NY 10005<br>
        United States</p>
        
        <h4>European Office</h4>
        <p>456 Canary Wharf<br>
        London, E14 5AB<br>
        United Kingdom</p>
      </div>
      
      <h3>Business Hours</h3>
      <p>Monday - Friday: 9 AM - 6 PM EST<br>
      Saturday: 10 AM - 2 PM EST<br>
      Sunday: Closed</p>
    `
  }
};

const StaticPage = () => {
  const { page } = useParams();
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        if (page === 'usage-guide') {
          const { data } = await coreAPI.getUsageGuidePage();
          setContent({ title: data.title || 'Usage Guide', content: data.content || '' });
        } else if (page === 'docs') {
          const { data } = await coreAPI.getDocsPage();
          setContent({ title: data.title || 'Documentation', content: data.content || '' });
        } else if (page === 'contact') {
          const { data } = await coreAPI.getContactPage();
          setContent({ title: data.title || 'Contact', content: data.content || '' });
        } else {
          const fallback = mockContent[page as keyof typeof mockContent];
          setContent(fallback || { title: 'Page Not Found', content: '<p>The requested page could not be found.</p>' });
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        setContent({
          title: 'Error',
          content: '<p>An error occurred while loading the page content.</p>'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [page]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-1/2 mb-8" />
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{content?.title}</h1>
          <Card>
            <CardContent className="pt-6">
              <div 
                className="prose prose-gray max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content?.content || '' }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;