import { Home, Grid3x3, Bookmark, Building2, Settings, Plus, Shield, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { DownloadAppModal } from "@/components/DownloadAppModal";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  
  // Role checks
  const isLecturerOrAdmin = profile?.role === 'lecturer' || profile?.role === 'admin';
  const isAdmin = profile?.role === 'admin';

  // Add Admin Panel to navigation for admins only
  const navigationItems = [
    { name: "Home", href: "/dashboard", icon: Home, roles: ['all'], isLink: true },
    { name: "Categories", href: "/categories", icon: Grid3x3, roles: ['all'], isLink: true },
    { name: "Bookmarks", href: "/bookmarks", icon: Bookmark, roles: ['all'], isLink: true },
    { name: "Departments", href: "/departments", icon: Building2, roles: ['all'], isLink: true },
    { name: "Admin Panel", href: "/admin", icon: Shield, roles: ['admin'], isLink: true },
    { name: "Download App", href: "#download", icon: Download, roles: ['all'], isLink: false },
    { name: "Settings", href: "/profile", icon: Settings, roles: ['all'], isLink: true },
  ].filter(item => 
    item.roles.includes('all') || 
    (profile?.role && item.roles.includes(profile.role))
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-[60] h-screen w-[85vw] max-w-xs sm:w-64 glass border-r transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                  {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{profile?.name || 'User'}</p>
                <p className="text-sm text-muted-foreground truncate capitalize">
                  {profile?.department?.replace(/_/g, ' ') || 'Department'}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              // Handle Download App button separately
              if (!item.isLink) {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setShowDownloadModal(true);
                      if (onClose) onClose();
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth",
                      "hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Download App Modal */}
          <DownloadAppModal 
            open={showDownloadModal} 
            onOpenChange={setShowDownloadModal} 
          />

          {isLecturerOrAdmin && (
            <div className="p-4 border-t">
              <Link to="/create">
                <Button className="w-full gradient-primary" size="lg" onClick={onClose}>
                  <Plus className="h-5 w-5 mr-2" />
                  Create Post
                </Button>
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
