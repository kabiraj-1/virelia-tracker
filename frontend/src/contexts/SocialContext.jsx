import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { socialService } from '../services/socialService';

const SocialContext = createContext();

const socialReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'SET_FEED':
      return { ...state, feed: action.payload };
    case 'ADD_POST':
      return { ...state, feed: [action.payload, ...state.feed] };
    case 'SET_LEADERBOARD':
      return { ...state, leaderboard: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [events, feed, leaderboard] = await Promise.all([
        socialService.getEvents(),
        socialService.getFeed(),
        socialService.getLeaderboard()
      ]);

      dispatch({ type: 'SET_EVENTS', payload: events });
      dispatch({ type: 'SET_FEED', payload: feed.posts });
      dispatch({ type: 'SET_LEADERBOARD', payload: leaderboard });
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = await socialService.createEvent(eventData);
      dispatch({ type: 'ADD_EVENT', payload: newEvent });
      return newEvent;
    } catch (error) {
      throw error;
    }
  };

  const createPost = async (postData) => {
    try {
      const newPost = await socialService.createPost(postData);
      dispatch({ type: 'ADD_POST', payload: newPost });
      return newPost;
    } catch (error) {
      throw error;
    }
  };

  const joinEvent = async (eventId) => {
    try {
      await socialService.joinEvent(eventId);
      // Refresh events
      const events = await socialService.getEvents();
      dispatch({ type: 'SET_EVENTS', payload: events });
    } catch (error) {
      throw error;
    }
  };

  return (
    <SocialContext.Provider value={{
      ...state,
      createEvent,
      createPost,
      joinEvent,
      refreshData: loadInitialData
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