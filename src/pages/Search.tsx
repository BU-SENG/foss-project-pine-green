import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { NewsCard } from "@/components/NewsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "@/lib/api/announcements";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Skeleton component for loading state
const NewsGridSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <div key={i} className="glass rounded-2xl p-6 animate-pulse">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="h-6 bg-muted rounded w-3/4 mb-3" />
            <div className="h-4 bg-muted rounded w-full mb-2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
          <div className="w-32 h-32 bg-muted rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

export default function Search() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  // Fetch search results from Supabase
  const { data: result, isLoading, error } = useQuery({
    queryKey: ['search-results', query],
    queryFn: () => getAnnouncements({ search: query.trim() || undefined }),
    enabled: true, // Always fetch, but filter by query if provided
  });

  const announcements = result?.data || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Update URL with search query
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  // Update query when URL params change
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    setQuery(urlQuery);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">Search News</h1>
            
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for news, announcements, events..."
                  className="pl-12 h-14 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </form>

            {query && (
              <p className="text-muted-foreground mt-4">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    Found {announcements.length || 0}{" "}
                    {announcements.length === 1 ? 'result' : 'results'} for "{query}"
                  </>
                )}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load search results. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <NewsGridSkeleton />
          ) : announcements && announcements.length > 0 ? (
            <div className="space-y-6">
              {announcements.map((announcement, index) => {
                // Map Supabase data to NewsCard format
                const newsData = {
                  id: announcement.id,
                  title: announcement.title,
                  excerpt: announcement.content.substring(0, 150) + '...',
                  content: announcement.content,
                  image: announcement.image_url || '/placeholder.svg',
                  category: announcement.category as any,
                  priority: (announcement.priority === 'low' || announcement.priority === 'medium') 
                    ? 'normal' 
                    : announcement.priority as any,
                  author: {
                    id: announcement.author?.id || '',
                    name: announcement.author?.name || 'Unknown',
                    avatar: announcement.author?.avatar || '/placeholder.svg',
                    role: 'student' as const,
                    email: '',
                    department: announcement.department,
                  },
                  publishedAt: announcement.created_at,
                  readTime: Math.ceil(announcement.content.length / 200),
                  views: announcement.view_count || 0,
                  department: announcement.department,
                };

                return (
                  <div
                    key={announcement.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <NewsCard news={newsData} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-6">
                Try different keywords or browse by category
              </p>
              <Button
                onClick={() => (window.location.href = "/categories")}
                className="gradient-primary"
              >
                Browse Categories
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
