import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye, Plus, AlertCircle, Users, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnnouncements, deleteAnnouncement, getAnnouncementsCount } from "@/lib/api/announcements";
import { getAllUsers, getUserStats } from "@/lib/api/users";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all announcements (admin view)
  const { data: announcementsResult, isLoading: announcementsLoading, error: announcementsError } = useQuery({
    queryKey: ['admin-announcements'],
    queryFn: () => getAnnouncements({ limit: 50 }), // Get latest 50
  });

  const announcements = announcementsResult?.data || [];

  // Fetch total announcement count
  const { data: totalCountResult } = useQuery({
    queryKey: ['total-announcements-count'],
    queryFn: () => getAnnouncementsCount(),
  });

  // Fetch all users
  const { data: usersResult } = useQuery({
    queryKey: ['all-users'],
    queryFn: getAllUsers,
  });

  const users = usersResult?.data || [];

  // Fetch user stats
  const { data: userStatsResult } = useQuery({
    queryKey: ['user-stats'],
    queryFn: getUserStats,
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: (id: string) => deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['total-announcements-count'] });
      toast({
        title: "Announcement deleted",
        description: "The announcement has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setSelectedAnnouncementId(null);
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      });
      console.error("Delete error:", error);
    },
  });

  const handleDeleteClick = (id: string) => {
    setSelectedAnnouncementId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAnnouncementId) {
      deleteAnnouncementMutation.mutate(selectedAnnouncementId);
    }
  };

  // Check if user is admin
  if (!profile || profile.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Access denied. This page is only accessible to administrators.
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Announcements", 
      value: totalCountResult?.count || 0, 
      icon: <FileText className="h-8 w-8" />,
      color: "text-blue-500"
    },
    { 
      label: "Active Users", 
      value: userStatsResult?.data?.total || 0, 
      icon: <Users className="h-8 w-8" />,
      color: "text-green-500"
    },
    { 
      label: "Admins", 
      value: userStatsResult?.data?.admins || 0, 
      icon: <Users className="h-8 w-8" />,
      color: "text-purple-500"
    },
    { 
      label: "Lecturers", 
      value: userStatsResult?.data?.lecturers || 0, 
      icon: <TrendingUp className="h-8 w-8" />,
      color: "text-orange-500"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Manage announcements and monitor platform activity
                </p>
              </div>
              <Button
                onClick={() => navigate("/create")}
                className="gradient-primary"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Post
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>

          {announcementsError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load announcements. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          )}

          {/* Recent Posts Table */}
          <div className="glass rounded-2xl p-4 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">All Announcements</h2>
            
            {announcementsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Desktop/Tablet Table View - Hidden on Mobile */}
                <div className="hidden md:block overflow-x-auto -mx-6 md:-mx-8">
                  <div className="inline-block min-w-full align-middle px-6 md:px-8">
                    <Table className="min-w-[800px]">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Priority</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Published</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {announcements.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                              No announcements found
                            </TableCell>
                          </TableRow>
                        ) : (
                          announcements.map((announcement) => (
                            <TableRow key={announcement.id}>
                              <TableCell className="font-medium max-w-xs truncate">
                                {announcement.title}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize">
                                  {announcement.category.replace(/_/g, ' ')}
                                </Badge>
                              </TableCell>
                              <TableCell className="capitalize">
                                {announcement.department.replace(/_/g, ' ')}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={
                                    announcement.priority === "urgent"
                                      ? "bg-red-500"
                                      : announcement.priority === "high"
                                      ? "bg-orange-500"
                                      : announcement.priority === "medium"
                                      ? "bg-yellow-500"
                                      : "bg-gray-500"
                                  }
                                >
                                  {announcement.priority}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {announcement.view_count}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate(`/news/${announcement.id}`)}
                                    title="View"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteClick(announcement.id)}
                                    disabled={deleteAnnouncementMutation.isPending}
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Mobile Card View - Visible Only on Mobile */}
                <div className="md:hidden space-y-4">
                  {announcements.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No announcements found
                    </div>
                  ) : (
                    announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="border border-border rounded-lg p-4 space-y-3 bg-card hover:bg-accent/50 transition-colors"
                      >
                        {/* Title & Actions Row */}
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-semibold text-base flex-1 line-clamp-2">
                            {announcement.title}
                          </h3>
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => navigate(`/news/${announcement.id}`)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-9 w-9"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => handleDeleteClick(announcement.id)}
                              disabled={deleteAnnouncementMutation.isPending}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground text-xs">Category</span>
                            <div className="mt-1">
                              <Badge variant="outline" className="capitalize text-xs">
                                {announcement.category.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Priority</span>
                            <div className="mt-1">
                              <Badge
                                className={`text-xs ${
                                  announcement.priority === "urgent"
                                    ? "bg-red-500"
                                    : announcement.priority === "high"
                                    ? "bg-orange-500"
                                    : announcement.priority === "medium"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                                }`}
                              >
                                {announcement.priority}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Department</span>
                            <div className="mt-1 capitalize text-sm">
                              {announcement.department.replace(/_/g, ' ')}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground text-xs">Views</span>
                            <div className="mt-1 font-medium text-sm">
                              {announcement.view_count}
                            </div>
                          </div>
                        </div>

                        {/* Published Date */}
                        <div className="pt-2 border-t border-border">
                          <span className="text-xs text-muted-foreground">
                            Published {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the announcement
                  and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
}
