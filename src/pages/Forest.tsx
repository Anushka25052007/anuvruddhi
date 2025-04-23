
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TreePine, Map, QrCode, Camera, Users } from "lucide-react";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const treeData = [
  { month: 'Jan', trees: 12 },
  { month: 'Feb', trees: 19 },
  { month: 'Mar', trees: 15 },
  { month: 'Apr', trees: 25 },
  { month: 'May', trees: 32 },
  { month: 'Jun', trees: 28 },
];

const locationData = [
  { name: 'Local Area', trees: 65, color: '#7FB069' },
  { name: 'Regional', trees: 45, color: '#6A9957' },
  { name: 'National', trees: 20, color: '#5D874C' },
  { name: 'International', trees: 10, color: '#4A6F3B' },
];

const communityPosts = [
  {
    id: 1,
    user: "Priya M.",
    location: "Mumbai, India",
    date: "2 days ago",
    trees: 3,
    content: "Planted three neem trees at our local community garden today!"
  },
  {
    id: 2,
    user: "Rahul S.",
    location: "Delhi, India",
    date: "5 days ago",
    trees: 2,
    content: "Joined the school's eco-club plantation drive. Added two mango trees to our campus."
  },
  {
    id: 3,
    user: "Ananya K.",
    location: "Bangalore, India",
    date: "1 week ago",
    trees: 5,
    content: "Our neighborhood initiative's first milestone reached - 5 banyan trees planted along the street!"
  }
];

export default function Forest() {
  const [activeTab, setActiveTab] = useState("tracking");
  
  const totalTrees = treeData.reduce((sum, item) => sum + item.trees, 0);
  
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-[#2D3047] mb-2">My Growing Forest</h1>
        <p className="text-gray-600">Track your tree planting journey and impact</p>
        <div className="flex justify-center items-center gap-2 mt-4">
          <TreePine className="h-6 w-6 text-[#7FB069]" />
          <span className="text-2xl font-bold text-[#7FB069]">{totalTrees}</span>
          <span className="text-gray-600">Trees Planted</span>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tracking">Tree Tracking</TabsTrigger>
          <TabsTrigger value="qrcode">QR Verification</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tracking">
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Monthly Planting Progress</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={treeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="trees" fill="#7FB069" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Planting Locations</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="trees"
                    >
                      {locationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center">
                <div>
                  <h4 className="font-medium mb-2">Next Trip Target</h4>
                  <p className="text-sm mb-4">Plant 25 more trees to unlock a free eco-trip!</p>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-[#7FB069] h-4 rounded-full" 
                      style={{ width: `${Math.min(100, (totalTrees / 150) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>0</span>
                    <span>{totalTrees}/150 trees</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="qrcode">
          <Card className="p-6 text-center">
            <QrCode className="h-16 w-16 mx-auto mb-4 text-[#7FB069]" />
            <h3 className="text-lg font-medium mb-2">Tree Planting Verification</h3>
            <p className="text-gray-600 mb-6">
              Scan this QR code or upload a photo to verify your tree planting
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#7FB069] hover:bg-[#6A9957]">
                <Camera className="mr-2 h-4 w-4" /> Upload Photo
              </Button>
              <Button variant="outline">
                <Map className="mr-2 h-4 w-4" /> Share Location
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="community">
          <div className="mb-6">
            <Button className="bg-[#7FB069] hover:bg-[#6A9957] w-full">
              <TreePine className="mr-2 h-4 w-4" /> Share Your Planting Story
            </Button>
          </div>
          
          <div className="space-y-4">
            {communityPosts.map(post => (
              <Card key={post.id} className="p-4">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#7FB069] text-white rounded-full h-8 w-8 flex items-center justify-center">
                      {post.user.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{post.user}</h4>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Map className="h-3 w-3" />
                        {post.location}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{post.date}</div>
                </div>
                <p className="text-sm mb-2">{post.content}</p>
                <div className="flex items-center gap-1 text-[#7FB069] text-sm">
                  <TreePine className="h-4 w-4" />
                  <span>{post.trees} trees planted</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
