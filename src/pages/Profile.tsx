import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera, Save, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "@/lib/api/users";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Profile() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile: userProfile, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Form state
  const [formData, setFormData] = useState({
    first_name: userProfile?.first_name || "",
    last_name: userProfile?.last_name || "",
    department: userProfile?.department || "",
    level: userProfile?.level || "",
    avatar: userProfile?.avatar || "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    urgent: true,
    department: true,
    events: false,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => {
      if (!userProfile?.id) throw new Error("No user ID");
      return updateUserProfile(userProfile.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load profile. Please try refreshing the page.
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Profile & Settings</h1>
            <p className="text-muted-foreground text-lg">
              Manage your account settings and preferences
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                
                <div className="flex items-center gap-6 mb-8">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                      {formData.avatar ? (
                        <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span>{formData.first_name[0]}{formData.last_name[0]}</span>
                      )}
                    </div>
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{userProfile.name}</h3>
                    <p className="text-muted-foreground capitalize">{userProfile.role}</p>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({ ...formData, first_name: e.target.value })
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({ ...formData, last_name: e.target.value })
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={formData.department}
                        onValueChange={(value) =>
                          setFormData({ ...formData, department: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="computer_science">Computer Science</SelectItem>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="medicine">Medicine</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="arts">Arts</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="law">Law</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) =>
                          setFormData({ ...formData, level: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="100">100 Level</SelectItem>
                          <SelectItem value="200">200 Level</SelectItem>
                          <SelectItem value="300">300 Level</SelectItem>
                          <SelectItem value="400">400 Level</SelectItem>
                          <SelectItem value="500">500 Level</SelectItem>
                          <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar">Avatar URL (Optional)</Label>
                    <Input
                      id="avatar"
                      value={formData.avatar}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <Button 
                    className="gradient-primary" 
                    onClick={handleSaveProfile}
                    disabled={updateProfileMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Receive push notifications on your device
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Urgent Alerts</h3>
                      <p className="text-sm text-muted-foreground">
                        Get notified about urgent announcements
                      </p>
                    </div>
                    <Switch
                      checked={notifications.urgent}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, urgent: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Department Updates</h3>
                      <p className="text-sm text-muted-foreground">
                        News from your department
                      </p>
                    </div>
                    <Switch
                      checked={notifications.department}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, department: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Event Reminders</h3>
                      <p className="text-sm text-muted-foreground">
                        Reminders about upcoming events
                      </p>
                    </div>
                    <Switch
                      checked={notifications.events}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, events: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Dark Mode</h3>
                      <p className="text-sm text-muted-foreground">
                        Toggle between light and dark themes
                      </p>
                    </div>
                    <Switch
                      checked={isDarkMode}
                      onCheckedChange={setIsDarkMode}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <div className="glass rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Account</h2>
                
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={() => signOut()}
                  >
                    Logout
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-destructive">
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
