"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Link as LinkIcon,
  MoreHorizontal,
  Camera,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import TweetCard from "./TweetCard";
import { Card, CardContent } from "./ui/card";
import Editprofile from "./Editprofile";
import axiosInstance from "@/lib/axiosInstance";

export default function ProfilePage() {
  const { user }: any = useAuth();
  const [activeTab, setActiveTab] = useState("posts");
  const [showEditModal, setShowEditModal] = useState(false);
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setloading] = useState(true);

  const fetchTweets = async () => {
    try {
      setloading(true);
      const res = await axiosInstance.get("/post");
      setTweets(res.data || []);
    } catch (error) {
      console.error("Fetch tweets error:", error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    if (user) fetchTweets();
  }, [user]);

  // FIX: User identity-ai email moolam filter seigirom (Backend data match aaga)
  const userTweets = tweets.filter((tweet: any) => 
    tweet?.userEmail === user?.email
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading user profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-gray-800 z-10">
        <div className="flex items-center px-4 py-3 space-x-8">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 rounded-full hover:bg-gray-900"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{user.displayName || "User"}</h1>
            <p className="text-sm text-gray-400">{userTweets.length} posts</p>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-purple-600 relative" />

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-black">
              <AvatarImage src={user.photoURL || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName}`} />
              <AvatarFallback className="text-2xl bg-gray-800 text-white">
                {(user.displayName || "U").charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="flex justify-end p-4">
          <Button
            variant="outline"
            className="border-gray-600 text-white bg-gray-950 font-semibold rounded-full px-6 hover:bg-gray-900"
            onClick={() => setShowEditModal(true)}
          >
            Edit profile
          </Button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4 mt-12">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
            <p className="text-gray-400">@{user.displayName?.replace(/\s+/g, '').toLowerCase() || "user"}</p>
          </div>
        </div>

        {user.bio && <p className="text-white mb-3 leading-relaxed">{user.bio}</p>}

        <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{user.location || "Earth"}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-transparent border-b border-gray-800 rounded-none h-auto">
          {["posts", "replies", "highlights", "articles", "media"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="data-[state=active]:bg-transparent data-[state=active]:text-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:rounded-none text-gray-400 hover:bg-gray-900/50 py-4 font-semibold capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <div className="divide-y divide-gray-800">
            {loading ? (
              <div className="py-12 text-center text-gray-400">Loading posts...</div>
            ) : userTweets.length > 0 ? (
              userTweets.map((tweet: any) => (
                <TweetCard key={tweet._id} tweet={tweet} />
              ))
            ) : (
              <Card className="bg-black border-none">
                <CardContent className="py-12 text-center text-gray-400">
                  <h3 className="text-2xl font-bold mb-2">You haven't posted yet</h3>
                  <p>When you post, it will show up here.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        {/* Matra TabsContent-kal unga pazhaya code-padiye irukkum */}
      </Tabs>

      <Editprofile
        isopen={showEditModal}
        onclose={() => setShowEditModal(false)}
      />
    </div>
  );
}