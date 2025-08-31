import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { 
  Moon, 
  Sun, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Settings, 
  CreditCard,
  Key,
  BarChart3,
  HelpCircle,
  Home,
  Package,
  BookOpen,
  FileText,
  Mail
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: Package },
    { href: '/guides', label: 'Guides', icon: BookOpen },
    { href: '/docs', label: 'Docs', icon: FileText },
    { href: '/contact', label: 'Contact', icon: Mail },
  ];

  const authNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/usage', label: 'Usage', icon: BarChart3 },
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/keys', label: 'API Keys', icon: Key },
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/support', label: 'Support', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => (
    <Link
      to={href}
      className={`${mobile ? 'flex items-center gap-2 px-3 py-2 rounded-md' : 'px-3 py-2 rounded-md'} text-sm font-medium transition-colors ${
        isActive(href)
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
      }`}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-sm font-bold text-primary-foreground">F</span>
          </div>
          <span className="text-xl font-bold text-gradient-primary">Finagen</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {!isAuthenticated ? (
            publicNavItems.map(({ href, label }) => (
              <NavLink key={href} href={href}>
                {label}
              </NavLink>
            ))
          ) : (
            authNavItems.map(({ href, label }) => (
              <NavLink key={href} href={href}>
                {label}
              </NavLink>
            ))
          )}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Desktop Auth Actions */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          ) : (
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{user?.first_name || user?.username}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/keys" className="flex items-center">
                      <Key className="mr-2 h-4 w-4" />
                      API Keys
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/support" className="flex items-center">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col space-y-4">
                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-2">
                  {!isAuthenticated ? (
                    <>
                      {publicNavItems.map(({ href, label, icon: Icon }) => (
                        <NavLink key={href} href={href} mobile>
                          <Icon className="h-4 w-4" />
                          {label}
                        </NavLink>
                      ))}
                      <div className="pt-4 space-y-2">
                        <Button variant="ghost" size="sm" asChild className="w-full justify-start">
                          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button size="sm" asChild className="w-full">
                          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            Get Started
                          </Link>
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      {authNavItems.map(({ href, label, icon: Icon }) => (
                        <NavLink key={href} href={href} mobile>
                          <Icon className="h-4 w-4" />
                          {label}
                        </NavLink>
                      ))}
                      <div className="pt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full justify-start text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;