import { useEffect, useCallback } from 'react';

export const usePerformance = () => {
  const measurePerformance = useCallback((metricName, duration) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${metricName}: ${duration}ms`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: metricName,
        value: duration,
        event_category: 'Performance'
      });
    }
  }, []);

  const startTimer = useCallback((name) => {
    const start = performance.now();
    return () => {
      const end = performance.now();
      measurePerformance(name, Math.round(end - start));
    };
  }, [measurePerformance]);

  const trackWebVitals = useCallback(() => {
    // Track Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        measurePerformance('LCP', entry.startTime);
      }
    });
    observer.observe({ entryTypes: ['largest-contentful-paint'] });

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        measurePerformance('FID', entry.processingStart - entry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    return () => {
      observer.disconnect();
      fidObserver.disconnect();
    };
  }, [measurePerformance]);

  useEffect(() => {
    return trackWebVitals();
  }, [trackWebVitals]);

  return {
    measurePerformance,
    startTimer,
    trackWebVitals
  };
};