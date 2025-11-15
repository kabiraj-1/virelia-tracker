import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    // Implement comment submission
    console.log('Adding comment:', newComment);
    setNewComment('');
  };

  const handleLike = async () => {
    // Implement like functionality
    console.log('Liking post:', post._id);
  };

  const isLiked = post.likes.includes(user?.id);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img
            src={post.author.avatar || '/default-avatar.png'}
            alt={post.author.username}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-800">{post.author.username}</h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt))} ago
              {post.eventId && ` · in ${post.eventId.title}`}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <span>⭐</span>
          <span>{post.author.karmaPoints || 0} karma</span>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post attachment"
            className="mt-3 rounded-lg max-w-full h-auto"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <span>❤️</span>
            <span>{post.likes.length}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
          >
            <span>💬</span>
            <span>{post.commentCount}</span>
          </button>
        </div>

        <button className="text-gray-500 hover:text-gray-700">
          🔗 Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 border-t border-gray-100 pt-4">
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </form>

          {/* Comments list would go here */}
          <div className="text-center text-gray-500 text-sm py-2">
            Comments feature coming soon...
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;