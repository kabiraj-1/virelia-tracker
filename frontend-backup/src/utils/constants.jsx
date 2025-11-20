export const APP_CONFIG = {
  APP_NAME: 'Virelia Tracker',
  VERSION: '1.0.0',
  SOCIAL: {
    MAX_EVENT_PARTICIPANTS: 100,
    POST_MAX_LENGTH: 1000,
    COMMENT_MAX_LENGTH: 500,
    KARMA_POINTS: {
      EVENT_PARTICIPATION: 10,
      EVENT_CREATION: 25,
      HELPFUL_POST: 5,
      POSITIVE_REVIEW: 15
    }
  },
  API_ENDPOINTS: {
    AUTH: '/api/auth',
    SOCIAL: '/api/social',
    TRACKER: '/api/tracker'
  }
}

export const EVENT_TYPES = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const KARMA_TYPES = {
  EVENT_PARTICIPATION: 'event_participation',
  EVENT_CREATION: 'event_creation',
  HELPFUL_POST: 'helpful_post',
  POSITIVE_REVIEW: 'positive_review',
  COMMUNITY_SERVICE: 'community_service'
}