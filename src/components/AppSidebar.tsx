
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Bike, Heart, Leaf, Crown, Trophy, Brain, Music, BookOpen, TreePine } from "lucide-react";

const menuItems = [
  { title: "Motivation Arena", icon: Heart, path: "/arena" },
  { title: "Daily Wheel", icon: Bike, path: "/wheel" },
  { title: "Habit Garden", icon: Leaf, path: "/habits" },
  { title: "Temple of You", icon: Crown, path: "/temple" },
  { title: "Meditation", icon: Brain, path: "/meditation" },
  { title: "Exercise", icon: Bike, path: "/exercise" },
  { title: "Study", icon: BookOpen, path: "/study" },
  { title: "My Forest", icon: TreePine, path: "/forest" },
  { title: "Certificates", icon: Trophy, path: "/certificates" },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Anuvruddhi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
