import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, Timestamp } from "firebase/firestore";
import type { Post, InsertPost } from "@shared/schema";

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          content: data.content,
          category: data.category,
          author: data.author,
          imageUrl: data.imageUrl || "",
          createdAt: data.createdAt?.toDate() || new Date(),
          published: data.published ?? true,
          status: data.status || (data.published ? "published" : "pending"),
          authorName: data.authorName,
          authorEmail: data.authorEmail,
        };
      }) as Post[];
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: InsertPost) => {
    try {
      await addDoc(collection(db, "posts"), {
        ...post,
        createdAt: serverTimestamp(),
        published: true,
        status: "published",
      });
      await fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    createPost,
    refetch: fetchPosts,
  };
}