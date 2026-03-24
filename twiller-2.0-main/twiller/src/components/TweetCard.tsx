"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

export default function TweetCard({ tweet }: any) {
  const { user }: any = useAuth();
  const [tweetstate, settweetstate] = useState(tweet);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (tweet) settweetstate(tweet);
  }, [tweet]);

  // --- API HANDLERS ---

  const handleAction = async (endpoint: string) => {
    if (!user?._id) return alert("Please login first!");
    try {
      const res = await axiosInstance.post(`/like/${tweetstate?._id}`, {
        userId: user?._id,
      });
      settweetstate(res.data);
    } catch (error) {
      console.error(`${endpoint} error:`, error);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await axiosInstance.post(`/comment/${tweetstate?._id}`, {
        userId: user?._id,
        userName: user?.displayName || "Hamrutha Saravanan",
        avatar: user?.photoURL || user?.avatar || "",
        text: commentText,
      });
      settweetstate(res.data);
      setCommentText("");
      setShowCommentInput(false);
    } catch (error) {
      console.error("Comment error:", error);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Check out this tweet",
        url: window.location.href,
      });
    } catch (err) {
      console.log("Share failed");
    }
  };

  const formatNumber = (num: any) => {
    const n = Number(num);
    if (isNaN(n) || n <= 0) return "0";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  const isLiked = tweetstate?.likedBy?.includes(user?._id);

  // FIXED LINE: Correct Avatar URL logic
  const getDefaultAvatar = (name: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'user'}&backgroundColor=ffdfbf,ffd5dc,ffb6c1`;

  return (
    <Card className="bg-black border-gray-800 border-x-0 border-t-0 rounded-none hover:bg-gray-950/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src={tweetstate?.avatar || getDefaultAvatar(tweetstate?.userName)} />
            <AvatarFallback>{(tweetstate?.userName || "U").charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-bold text-white truncate">
                {tweetstate?.userName || "Hamrutha Saravanan"}
              </span>
              <span className="text-gray-500 truncate text-sm">
                @{tweetstate?.userName?.replace(/\s+/g, '').toLowerCase() || "user"}
              </span>
              <span className="text-gray-500">·</span>
              <span className="text-gray-500 text-sm">
                {tweetstate?.createdAt ? new Date(tweetstate.createdAt).toLocaleDateString() : "Just now"}
              </span>
              <div className="ml-auto">
                <Button variant="ghost" size="sm" className="p-1 h-8 w-8 rounded-full hover:bg-gray-900">
                  <MoreHorizontal className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>

            <div className="text-white mb-3 break-words whitespace-pre-wrap leading-normal">
              {tweetstate?.postText || tweetstate?.content}
            </div>

            {tweetstate?.image && (
              <div className="mb-3 rounded-2xl border border-gray-800 overflow-hidden bg-zinc-900">
                <img src={tweetstate.image} alt="Tweet" className="w-full h-auto max-h-[512px] object-contain" />
              </div>
            )}

            <div className="flex items-center justify-between max-w-md text-gray-500 mb-2">
              <Button 
                onClick={() => setShowCommentInput(!showCommentInput)} 
                variant="ghost" size="sm" 
                className={`flex items-center space-x-2 group hover:text-blue-400 ${showCommentInput ? "text-blue-400" : ""}`}
              >
                <MessageCircle className="h-5 w-5 group-hover:bg-blue-400/10 rounded-full p-0.5" />
                <span className="text-sm">{formatNumber(tweetstate?.commentsCount || tweetstate?.replies?.length)}</span>
              </Button>

              <Button variant="ghost" size="sm" className="flex items-center space-x-2 group hover:text-green-400">
                <Repeat2 className="h-5 w-5 group-hover:bg-green-400/10 rounded-full p-0.5" />
                <span className="text-sm">0</span>
              </Button>

              <Button 
                onClick={(e) => { e.stopPropagation(); handleAction("like"); }}
                variant="ghost" size="sm" 
                className={`flex items-center space-x-2 group ${isLiked ? "text-red-500" : "hover:text-red-400"}`}
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""} group-hover:bg-red-400/10 rounded-full p-0.5`} />
                <span className="text-sm">{formatNumber(tweetstate?.likesCount)}</span>
              </Button>

              <Button onClick={handleShare} variant="ghost" size="sm" className="group hover:text-blue-400">
                <Share className="h-5 w-5 group-hover:bg-blue-400/10 rounded-full p-0.5" />
              </Button>
            </div>

            {showCommentInput && (
              <div className="flex items-center space-x-2 mt-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.photoURL || user?.avatar || getDefaultAvatar(user?.displayName)} />
                  <AvatarFallback>{(user?.displayName || "U").charAt(0)}</AvatarFallback>
                </Avatar>
                <Input 
                  placeholder="Post your reply" 
                  className="bg-transparent border-gray-800 text-white focus:ring-blue-500 h-9"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button 
                  size="sm" 
                  className="bg-blue-500 hover:bg-blue-600 rounded-full h-8"
                  onClick={submitComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 space-y-3 border-t border-gray-800 pt-4">
          {tweetstate?.replies?.map((reply: any, index: number) => (
            <div key={index} className="flex space-x-3 pb-2 last:border-0 border-b border-gray-900/50">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={reply.avatar || getDefaultAvatar(reply.userName)} /> 
                <AvatarFallback>{(reply.userName || "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">
                    {reply.userName || "Hamrutha Saravanan"}
                  </span>
                  <span className="text-xs text-gray-500">
                    @{reply.userName?.replace(/\s+/g,'').toLowerCase() || "user"} · {reply.createdAt ? new Date(reply.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                  </span>
                </div>
                <p className="text-sm text-gray-300 break-words mt-1">{reply.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}