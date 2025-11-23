import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import socialService from '../../services/socialService';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [goalId, setGoalId] = useState('');
  const [scheduledPublish, setScheduledPublish] = useState('');
  const [visibility, setVisibility] = useState('friends');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      setError('');

      const postData = {
        content: content.trim(),
        visibility
      };

      if (goalId) {
        postData.goalId = goalId;
      }

      if (scheduledPublish) {
        postData.scheduledPublish = scheduledPublish;
      }

      const newPost = await socialService.createPost(postData, mediaFiles);
      onPostCreated(newPost);
      
      // Reset form
      setContent('');
      setMediaFiles([]);
      setGoalId('');
      setScheduledPublish('');
      setVisibility('friends');
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    setMediaFiles(files);
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit} className="post-form">
        <div className="post-header">
          <div className="user-avatar">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="post-user-info">
            <h4>{user.username}</h4>
            <select 
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="visibility-select"
            >
              <option value="friends">Ì±• Friends</option>
              <option value="public">Ìºç Public</option>
              <option value="private">Ì¥í Private</option>
            </select>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your progress, achievements, or thoughts..."
          rows="4"
          maxLength="2000"
        />

        <div className="post-options">
          <div className="media-upload">
            <label htmlFor="media-upload" className="upload-btn">
              Ì≥∑ Add Media
            </label>
            <input
              id="media-upload"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaChange}
              style={{ display: 'none' }}
            />
            {mediaFiles.length > 0 && (
              <span className="file-count">{mediaFiles.length} files selected</span>
            )}
          </div>

          <div className="schedule-option">
            <label>
              Ìµí Schedule:
              <input
                type="datetime-local"
                value={scheduledPublish}
                onChange={(e) => setScheduledPublish(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
              />
            </label>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="post-actions">
          <div className="char-count">
            {content.length}/2000
          </div>
          <button 
            type="submit" 
            disabled={!content.trim() || isSubmitting}
            className="post-btn"
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
