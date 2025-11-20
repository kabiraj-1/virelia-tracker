import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import PostCard from '../../components/social/Feed/PostCard';
import CreatePost from '../../components/social/Feed/CreatePost';

const FeedPage = () => {
  const { feed, loading } = useSocial();
  const [showCreatePost, setShowCreatePost] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">Loading feed...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Community Feed</h1>
            <p className="text-gray-600 mt-2">Share updates and connect with others</p>
          </div>
          
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Create Post
          </button>
        </div>

        {/* Create Post */}
        {showCreatePost && (
          <CreatePost onClose={() => setShowCreatePost(false)} />
        )}

        {/* Feed */}
        <div className="space-y-4">
          {feed.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">
                Be the first to share something with the community!
              </p>
              <button
                onClick={() => setShowCreatePost(true)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Create First Post
              </button>
            </div>
          ) : (
            feed.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedPage;