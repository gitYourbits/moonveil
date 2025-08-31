import { useState, useEffect } from 'react';
import { coreAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  Clock, 
  User,
  ChevronRight,
  TrendingUp,
  Shield,
  Code,
  HelpCircle
} from 'lucide-react';

// Fallback mock
const mockGuides = [
  {
    id: 1,
    slug: 'getting-started',
    title: 'Getting Started with Finagen',
    description: 'Learn the basics of setting up your account and making your first API call.',
    category: 'Getting Started',
    author: 'Finagen Team',
    read_time: '5 min read',
    created_at: '2024-01-15',
    is_featured: true,
    tags: ['beginner', 'setup', 'api']
  },
  {
    id: 2,
    slug: 'risk-analysis-guide',
    title: 'Advanced Risk Analysis Techniques',
    description: 'Deep dive into portfolio risk assessment and optimization strategies.',
    category: 'Risk Management',
    author: 'Dr. Sarah Chen',
    read_time: '12 min read',
    created_at: '2024-01-10',
    is_featured: true,
    tags: ['advanced', 'risk', 'portfolio']
  },
  {
    id: 3,
    slug: 'api-integration',
    title: 'API Integration Best Practices',
    description: 'How to integrate Finagen APIs into your existing systems effectively.',
    category: 'Development',
    author: 'Mark Johnson',
    read_time: '8 min read',
    created_at: '2024-01-08',
    is_featured: false,
    tags: ['api', 'integration', 'development']
  },
  {
    id: 4,
    slug: 'market-intelligence',
    title: 'Understanding Market Intelligence Signals',
    description: 'Learn how to interpret and act on AI-generated market insights.',
    category: 'Market Analysis',
    author: 'Alex Thompson',
    read_time: '10 min read',
    created_at: '2024-01-05',
    is_featured: false,
    tags: ['market', 'ai', 'signals']
  },
  {
    id: 5,
    slug: 'compliance-automation',
    title: 'Automating Compliance Workflows',
    description: 'Streamline your regulatory reporting with automated compliance tools.',
    category: 'Compliance',
    author: 'Jennifer Liu',
    read_time: '15 min read',
    created_at: '2024-01-01',
    is_featured: false,
    tags: ['compliance', 'automation', 'regulatory']
  }
];

const categories = [
  { name: 'Getting Started', icon: BookOpen, count: 3 },
  { name: 'Risk Management', icon: Shield, count: 5 },
  { name: 'Development', icon: Code, count: 8 },
  { name: 'Market Analysis', icon: TrendingUp, count: 4 },
  { name: 'Compliance', icon: HelpCircle, count: 2 }
];

const Guides = () => {
  const [guides, setGuides] = useState(mockGuides);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchGuides = async () => {
      setIsLoading(true);
      try {
        const { data } = await coreAPI.getGuides();
        setGuides((data?.results ?? data ?? []).map((g: any) => ({
          id: g.id,
          slug: g.slug,
          title: g.title,
          description: g.body?.slice(0, 160) || '',
          category: g.page_type,
          author: 'Finagen Team',
          read_time: '—',
          created_at: g.created_at,
          is_featured: false,
          tags: [g.page_type],
        })));
      } finally {
        setIsLoading(false);
      }
    };
    fetchGuides();
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === '' || guide.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredGuides = guides.filter(guide => guide.is_featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-subtle py-16">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Knowledge Base</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Comprehensive guides and documentation to help you get the most out of Finagen.
            </p>
            
            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === '' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                  }`}
                >
                  All Guides ({guides.length})
                </button>
                {categories.map(({ name, icon: Icon, count }) => (
                  <button
                    key={name}
                    onClick={() => setSelectedCategory(name)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center justify-between ${
                      selectedCategory === name 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 mr-2" />
                      {name}
                    </div>
                    <span className="text-sm opacity-70">{count}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Guides */}
            {searchQuery === '' && selectedCategory === '' && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Featured Guides</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredGuides.map((guide) => (
                    <Card key={guide.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary">{guide.category}</Badge>
                          <Badge variant="outline">Featured</Badge>
                        </div>
                        <CardTitle className="line-clamp-2">
                          <Link 
                            to={`/guides/${guide.slug}`}
                            className="hover:text-primary transition-colors"
                          >
                            {guide.title}
                          </Link>
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {guide.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {guide.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {guide.read_time}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Guides */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory || 'All Guides'} 
                <span className="text-muted-foreground text-lg ml-2">
                  ({filteredGuides.length})
                </span>
              </h2>
              
              {filteredGuides.length > 0 ? (
                <div className="space-y-4">
                  {filteredGuides.map((guide) => (
                    <Card key={guide.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{guide.category}</Badge>
                              {guide.is_featured && (
                                <Badge variant="outline">Featured</Badge>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                              <Link 
                                to={`/guides/${guide.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {guide.title}
                              </Link>
                            </h3>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {guide.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {guide.author}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {guide.read_time}
                                </div>
                              </div>
                              <div className="flex gap-1">
                                {guide.tags.slice(0, 3).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground ml-4 flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No guides found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or category filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guides;