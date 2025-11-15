import React, { useState } from 'react';
import { useSocial } from '../../contexts/social/SocialContext';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from '../../components/social/PostCard';

const FeedPage = () => {
  const { feed, createPost, loading } = useSocial();
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    try {
      await createPost({ content: postContent });
      setPostContent('');
      alert('Post created successfully!');
    } catch (error) {
      alert('Error creating post: ' + error.response?.data?.message);
    }
  };

  if (loading) return <div>Loading feed...</div>;

  return (
    <div className="feed-page">
      <h1>Community Feed</h1>
      
      {user ? (
        <form onSubmit={handleCreatePost} className="create-post-form">
          <textarea
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share something with the community..."
            rows="4"
          />
          <button type="submit" disabled={!postContent.trim()}>
            Post
          </button>
        </form>
      ) : (
        <div className="auth-prompt">
          <p>Please login to post and interact with the community</p>
        </div>
      )}

      <div className="feed">
        {feed.map(post => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {feed.length === 0 && (
        <div className="empty-state">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
};

export default FeedPage;