import React, { useState } from 'react';

const CreatePost = ({ onClose }) => {
  const [postContent, setPostContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (postContent.trim()) {
      alert('Post created: ' + postContent);
      setPostContent('');
      if (onClose) onClose();
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          placeholder="What's happening in the community?"
          rows="4"
        />
        <div className="post-actions">
          <button type="submit" className="post-btn">
            Post
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
