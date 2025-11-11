import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '../Shared/Loading/LoadingSpinner';

// Lazy load heavy components
const AnalyticsDashboard = lazy(() => import('../Analytics/Dashboard/AnalyticsDashboard'));
const GlobalLeaderboard = lazy(() => import('../Social/Leaderboard/GlobalLeaderboard'));
const VideoCallRoom = lazy(() => import('../Communication/VideoCall/VideoCallRoom'));
const SocialFeed = lazy(() => import('../Social/Feed/SocialFeed'));

export const LazyAnalyticsDashboard = (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <AnalyticsDashboard {...props} />
  </Suspense>
);

export const LazyGlobalLeaderboard = (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <GlobalLeaderboard {...props} />
  </Suspense>
);

export const LazyVideoCallRoom = (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <VideoCallRoom {...props} />
  </Suspense>
);

export const LazySocialFeed = (props) => (
  <Suspense fallback={<LoadingSpinner />}>
    <SocialFeed {...props} />
  </Suspense>
);

// Route-based code splitting
export const lazyPages = {
  Dashboard: lazy(() => import('../../pages/Dashboard')),
  Analytics: lazy(() => import('../../pages/Analytics')),
  Location: lazy(() => import('../../pages/Location')),
  Chat: lazy(() => import('../../pages/Chat')),
  Profile: lazy(() => import('../../pages/Profile')),
  Settings: lazy(() => import('../../pages/Settings')),
};