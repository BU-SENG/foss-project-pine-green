import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { Building2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Departments() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Define departments with their metadata
  const departments = [
    { name: 'Computer Science', color: 'bg-primary' },
    { name: 'Engineering', color: 'bg-secondary' },
    { name: 'Medicine', color: 'bg-red-500' },
    { name: 'Business', color: 'bg-green-500' },
    { name: 'Arts', color: 'bg-purple-500' },
    { name: 'Science', color: 'bg-blue-500' },
    { name: 'Law', color: 'bg-indigo-500' },
    { name: 'Education', color: 'bg-yellow-500' },
    { name: 'All Departments', color: 'bg-gray-500' },
  ];

  // Fetch announcement counts per department
  const { data: departmentCounts, isLoading, error } = useQuery({
    queryKey: ['department-counts'],
    queryFn: async () => {
      const counts: Record<string, number> = {};
      
      // Fetch count for each department
      for (const dept of departments) {
        if (dept.name === 'All Departments') {
          // For "All Departments", get total count
          const { count, error } = await supabase
            .from('announcements')
            .select('*', { count: 'exact', head: true })
            .eq('is_deleted', false);
          
          if (!error) {
            counts[dept.name] = count || 0;
          }
        } else {
          const { count, error } = await supabase
            .from('announcements')
            .select('*', { count: 'exact', head: true })
            .eq('department', dept.name.toLowerCase().replace(/\s+/g, '_'))
            .eq('is_deleted', false);
          
          if (!error) {
            counts[dept.name] = count || 0;
          }
        }
      }
      
      return counts;
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Departments</h1>
            <p className="text-muted-foreground text-lg">
              Browse news and announcements by department
            </p>
          </div>

          



          

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-8 animate-pulse"
                >
                  <div className={`w-16 h-16 ${dept.color} rounded-xl mb-4`} />
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => {
                const count = departmentCounts?.[dept.name] || 0;
                return (
                  <button
                    key={index}
                    onClick={() => navigate(dept.name === 'All Departments' ? '/dashboard' : `/dashboard?department=${dept.name}`)}
                    className="glass rounded-2xl p-8 hover:shadow-lg transition-smooth text-left group animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`w-16 h-16 ${dept.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-smooth">
                      {dept.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {count} {count === 1 ? 'announcement' : 'announcements'}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
