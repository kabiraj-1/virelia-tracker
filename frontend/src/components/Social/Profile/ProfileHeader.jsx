import React, { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import ProfilePicture from './ProfilePicture';
import { MapPin, Calendar, Edit3, Award, Share2, Users } from 'lucide-react';

const ProfileHeader = ({ user, isOwnProfile = false, onEdit }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user?.stats?.followers || 0);
  const [followingCount, setFollowingCount] = useState(user?.stats?.following || 0);

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/${user._id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setIsFollowing(!isFollowing);
        setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error('Follow action failed:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.username}'s Profile`,
          text: `Check out ${user.username}'s profile on Virelia Tracker`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // Show success message
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-primary-500 to-primary-600 relative">
        {isOwnProfile && (
          <button
            onClick={onEdit}
            className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 mb-6">
          {/* Profile Picture and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <ProfilePicture
              user={user}
              size="xl"
              editable={isOwnProfile}
              onUpdate={onEdit}
            />
            
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.username}
              </h1>
              {user.profile?.firstName && (
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {user.profile.firstName} {user.profile.lastName}
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center sm:justify-start space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                {user.profile?.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{user.profile.location}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            {!isOwnProfile && (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isFollowing
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            
            <button
              onClick={handleShare}
              className="p-2 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Bio */}
        {user.profile?.bio && (
          <div className="mb-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {user.profile.bio}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.karma?.points?.toLocaleString() || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Karma Points</p>
            <div className={`text-xs font-medium capitalize ${
              user.karma?.level === 'platinum' ? 'text-purple-600 dark:text-purple-400' :
              user.karma?.level === 'gold' ? 'text-yellow-600 dark:text-yellow-400' :
              user.karma?.level === 'silver' ? 'text-gray-600 dark:text-gray-400' :
              'text-amber-600 dark:text-amber-400'
            }`}>
              {user.karma?.level || 'bronze'}
            </div>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.stats?.totalLocations?.toLocaleString() || 0}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Locations Shared</p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {followersCount.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Followers</p>
          </div>

          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {followingCount.toLocaleString()}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Following</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;