import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { socialService } from '../../services/social/socialService';

const SocialContext = createContext();

const socialReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'SET_FEED':
      return { ...state, feed: action.payload };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'ADD_POST':
      return { ...state, feed: [action.payload, ...state.feed] };
    default:
      return state;
  }
};

const initialState = {
  events: [],
  feed: [],
  leaderboard: [],
  loading: false
};

export const SocialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(socialReducer, initialState);

  const loadSocialData = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const [events, feed, leaderboard] = await Promise.all([
        socialService.getEvents(),
        socialService.getFeed(),
        socialService.getLeaderboard()
      ]);
      
      if (events.data.success) dispatch({ type: 'SET_EVENTS', payload: events.data.data });
      if (feed.data.success) dispatch({ type: 'SET_FEED', payload: feed.data.data.posts });
      if (leaderboard.data.success) dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard.data.data });
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = await socialService.createEvent(eventData);
      if (newEvent.data.success) {
        dispatch({ type: 'ADD_EVENT', payload: newEvent.data.data });
      }
      return newEvent;
    } catch (error) {
      throw error;
    }
  };

  const createPost = async (postData) => {
    try {
      const newPost = await socialService.createPost(postData);
      if (newPost.data.success) {
        dispatch({ type: 'ADD_POST', payload: newPost.data.data });
      }
      return newPost;
    } catch (error) {
      throw error;
    }
  };

  const joinEvent = async (eventId) => {
    try {
      await socialService.joinEvent(eventId);
      await loadSocialData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    loadSocialData();
  }, []);

  return (
    <SocialContext.Provider value={{
      ...state,
      createEvent,
      createPost,
      joinEvent,
      refreshData: loadSocialData
    }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};
