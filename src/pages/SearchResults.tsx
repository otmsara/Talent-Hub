import React from "react";
import { useParams } from "react-router-dom";
import { posts, findUserById } from "@/data/dummyData";
import FeedItem from "@/components/feed/FeedItem";

const filterPostsByTopic = (topic: string) => {
  // Match posts that mention the topic as a hashtag or plain word (case-insensitive)
  const normalized = topic.replace(/^#/, "").toLowerCase();
  return posts.filter(post =>
    post.text.toLowerCase().includes(`#${normalized}`) ||
    post.text.toLowerCase().includes(normalized)
  );
};

const SearchResults: React.FC = () => {
  const { topic } = useParams<{ topic: string }>();
  const decodedTopic = decodeURIComponent(topic || "");
  const filteredPosts = filterPostsByTopic(decodedTopic);

  return (
    <div className="max-w-2xl mx-auto w-full py-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for <span className="text-cyan-400">#{decodedTopic}</span>
      </h1>
      {filteredPosts.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          No posts found mentioning <span className="font-semibold">#{decodedTopic}</span>.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <FeedItem key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
