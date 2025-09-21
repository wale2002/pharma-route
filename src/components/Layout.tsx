import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Stethoscope, Pill, Truck } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();

  if (!user) return <>{children}</>;

  const getRoleIcon = () => {
    switch (user.role) {
      case 'clinic':
        return <Stethoscope className="h-5 w-5" />;
      case 'pharmacy':
        return <Pill className="h-5 w-5" />;
      case 'rider':
        return <Truck className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getRoleColor = () => {
    switch (user.role) {
      case 'clinic':
        return 'bg-gradient-primary';
      case 'pharmacy':
        return 'bg-gradient-secondary';
      case 'rider':
        return 'bg-gradient-to-r from-accent to-primary';
      default:
        return 'bg-gradient-primary';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`${getRoleColor()} rounded-lg p-2 text-white`}>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  {getRoleIcon()}
                  MediLink
                </h1>
              </div>
              <div className="hidden md:block">
                <p className="text-sm text-muted-foreground">
                  {user.role === 'clinic' && 'Healthcare Provider Dashboard'}
                  {user.role === 'pharmacy' && 'Pharmacy Management Portal'}
                  {user.role === 'rider' && 'Delivery Driver Hub'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}