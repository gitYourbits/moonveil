import { useState, useEffect } from 'react';
import { apiKeysAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  MoreHorizontal,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Activity
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface APIKey {
  id: string;
  name: string;
  description: string;
  prefix: string;
  created_at: string;
  last_used: string | null;
  is_active: boolean;
  usage_count: number;
}

const APIKeys = () => {
  const { toast } = useToast();
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newKeyData, setNewKeyData] = useState({ name: '', description: '' });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newlyCreatedToken, setNewlyCreatedToken] = useState<string | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [showFullToken, setShowFullToken] = useState(false);

  useEffect(() => {
    const fetchKeys = async () => {
      setIsLoading(true);
      try {
        const { data } = await apiKeysAPI.getKeys();
        setKeys((data?.results ?? data ?? []).map((k: any) => ({
          id: String(k.id),
          name: k.name,
          description: '',
          prefix: k.prefix,
          created_at: k.created_at,
          last_used: k.last_used_at,
          is_active: k.is_active,
          usage_count: 0,
        })));
      } finally {
        setIsLoading(false);
      }
    };

    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    if (!newKeyData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "API key name is required.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const { data } = await apiKeysAPI.createKey({ name: newKeyData.name });
      const token = data.token as string;
      setNewlyCreatedToken(token);
      const created = {
        id: String(data.id),
        name: data.name,
        description: newKeyData.description,
        prefix: data.prefix,
        created_at: data.created_at,
        last_used: data.last_used_at,
        is_active: data.is_active,
        usage_count: 0,
      } as APIKey;
      setKeys(prev => [created, ...prev]);
      setShowCreateDialog(false);
      setShowTokenDialog(true);
      setNewKeyData({ name: '', description: '' });
      toast({ title: "API Key Created", description: "Your new API key has been generated successfully." });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRevokeKey = async (keyId: string, keyName: string) => {
    try {
      await apiKeysAPI.revokeKey(keyId);
      setKeys(prev => prev.map(key => key.id === keyId ? { ...key, is_active: false } : key));
      toast({ title: "API Key Revoked", description: `"${keyName}" has been revoked successfully.` });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteKey = async (keyId: string, keyName: string) => {
    try {
      await apiKeysAPI.deleteKey(keyId);
      setKeys(prev => prev.filter(key => key.id !== keyId));
      toast({ title: "API Key Deleted", description: `"${keyName}" has been deleted permanently.` });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 bg-muted rounded w-48 animate-pulse" />
              <div className="h-4 bg-muted rounded w-64 animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="h-5 bg-muted rounded w-32" />
                      <div className="h-4 bg-muted rounded w-48" />
                    </div>
                    <div className="h-6 w-16 bg-muted rounded" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded w-40" />
                    <div className="h-4 bg-muted rounded w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">
            Manage your API keys for accessing Finagen services.
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key for your application. Keep it secure and never share it publicly.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API"
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, name: e.target.value }))}
                  error={!newKeyData.name.trim() && isCreating ? 'Name is required' : undefined}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what this key is used for..."
                  value={newKeyData.description}
                  onChange={(e) => setNewKeyData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateKey} disabled={isCreating}>
                {isCreating ? 'Creating...' : 'Create Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Keys List */}
      <div className="space-y-4">
        {keys.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
              <p className="text-muted-foreground text-center mb-4">
                You haven't created any API keys yet. Create your first key to start using the Finagen API.
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          keys.map((key) => (
            <Card key={key.id} className="transition-colors hover:bg-muted/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{key.name}</CardTitle>
                      <Badge variant={key.is_active ? "default" : "destructive"}>
                        {key.is_active ? "Active" : "Revoked"}
                      </Badge>
                    </div>
                    {key.description && (
                      <CardDescription className="text-sm">
                        {key.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {key.is_active && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Revoke Key
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Revoke API Key</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to revoke "{key.name}"? This action will immediately 
                                stop all API requests using this key. This action can be reversed.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleRevokeKey(key.id, key.name)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Revoke Key
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Key
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to permanently delete "{key.name}"? This action cannot be undone 
                              and will immediately stop all API requests using this key.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteKey(key.id, key.name)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Permanently
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* API Key */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">API Key</Label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                        {key.prefix}
                      </code>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(key.prefix)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Metadata */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        Created
                      </div>
                      <div className="font-medium">
                        {formatDate(key.created_at)}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground">
                        <Activity className="mr-1 h-3 w-3" />
                        Last Used
                      </div>
                      <div className="font-medium">
                        {key.last_used ? formatDate(key.last_used) : 'Never'}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Total Requests</div>
                      <div className="font-medium">
                        {key.usage_count.toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Status</div>
                      <div className={`font-medium ${key.is_active ? 'text-success' : 'text-destructive'}`}>
                        {key.is_active ? 'Active' : 'Revoked'}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Show New Token Dialog */}
      <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-success" />
              API Key Created Successfully
            </DialogTitle>
            <DialogDescription>
              This is your new API key. Copy it now - you won't be able to see it again for security reasons.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center text-destructive mb-2">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Important Security Notice</span>
              </div>
              <p className="text-xs text-destructive/80">
                Store this key securely. It won't be shown again and provides full access to your account.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Your New API Key</Label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono break-all">
                  {showFullToken ? newlyCreatedToken : newlyCreatedToken?.replace(/.(?=.{8})/g, '•')}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFullToken(!showFullToken)}
                >
                  {showFullToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(newlyCreatedToken || '')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowTokenDialog(false);
                setNewlyCreatedToken(null);
                setShowFullToken(false);
              }}
            >
              I've Saved My Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default APIKeys;