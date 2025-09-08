// Analytics and monitoring utilities for production deployment

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
}

class Analytics {
  private isEnabled: boolean;
  private userId?: string;

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production';
  }

  // Initialize analytics with user context
  identify(userId: string, properties?: Record<string, any>) {
    this.userId = userId;
    
    if (!this.isEnabled) return;

    // In production, integrate with analytics services like:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - PostHog
    
    console.log('Analytics: User identified', { userId, properties });
  }

  // Track user events
  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    const eventData = {
      ...event,
      userId: event.userId || this.userId,
      timestamp: event.timestamp || new Date(),
    };

    // In production, send to analytics service
    console.log('Analytics: Event tracked', eventData);
    
    // Example integrations:
    // gtag('event', event.name, event.properties);
    // mixpanel.track(event.name, event.properties);
    // amplitude.logEvent(event.name, event.properties);
  }

  // Track page views
  page(pageName: string, properties?: Record<string, any>) {
    this.track({
      name: 'page_view',
      properties: {
        page: pageName,
        ...properties,
      },
    });
  }

  // Track performance metrics
  performance(metric: PerformanceMetric) {
    if (!this.isEnabled) return;

    console.log('Analytics: Performance metric', metric);
    
    // In production, send to monitoring service like:
    // - DataDog
    // - New Relic
    // - Sentry Performance
  }

  // Track errors
  error(error: Error, context?: Record<string, any>) {
    if (!this.isEnabled) {
      console.error('Error:', error, context);
      return;
    }

    // In production, send to error tracking service
    console.error('Analytics: Error tracked', { error, context });
    
    // Example integrations:
    // Sentry.captureException(error, { extra: context });
    // LogRocket.captureException(error);
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Predefined event tracking functions
export const trackEvents = {
  // User actions
  walletConnected: (walletAddress: string) => {
    analytics.track({
      name: 'wallet_connected',
      properties: { walletAddress },
    });
  },

  walletDisconnected: () => {
    analytics.track({
      name: 'wallet_disconnected',
    });
  },

  // Bio generation events
  bioGenerationStarted: (interests: string[], personalityTraits: string[]) => {
    analytics.track({
      name: 'bio_generation_started',
      properties: {
        interests_count: interests.length,
        traits_count: personalityTraits.length,
      },
    });
  },

  bioGenerationCompleted: (bioCount: number, duration: number) => {
    analytics.track({
      name: 'bio_generation_completed',
      properties: {
        bio_count: bioCount,
        duration_ms: duration,
      },
    });
  },

  bioGenerationFailed: (error: string) => {
    analytics.track({
      name: 'bio_generation_failed',
      properties: { error },
    });
  },

  bioCopied: (bioIndex: number) => {
    analytics.track({
      name: 'bio_copied',
      properties: { bio_index: bioIndex },
    });
  },

  // Date idea events
  dateIdeaGenerationStarted: (interests: string[], location: string) => {
    analytics.track({
      name: 'date_idea_generation_started',
      properties: {
        interests_count: interests.length,
        location,
      },
    });
  },

  dateIdeaGenerationCompleted: (ideaCount: number, duration: number) => {
    analytics.track({
      name: 'date_idea_generation_completed',
      properties: {
        idea_count: ideaCount,
        duration_ms: duration,
      },
    });
  },

  dateIdeaGenerationFailed: (error: string) => {
    analytics.track({
      name: 'date_idea_generation_failed',
      properties: { error },
    });
  },

  // Payment events
  paymentInitiated: (serviceType: string, amount: string) => {
    analytics.track({
      name: 'payment_initiated',
      properties: {
        service_type: serviceType,
        amount,
      },
    });
  },

  paymentCompleted: (serviceType: string, transactionHash: string) => {
    analytics.track({
      name: 'payment_completed',
      properties: {
        service_type: serviceType,
        transaction_hash: transactionHash,
      },
    });
  },

  paymentFailed: (serviceType: string, error: string) => {
    analytics.track({
      name: 'payment_failed',
      properties: {
        service_type: serviceType,
        error,
      },
    });
  },

  // UI interactions
  tabSwitched: (fromTab: string, toTab: string) => {
    analytics.track({
      name: 'tab_switched',
      properties: {
        from_tab: fromTab,
        to_tab: toTab,
      },
    });
  },

  featureUsed: (feature: string) => {
    analytics.track({
      name: 'feature_used',
      properties: { feature },
    });
  },
};

// Performance monitoring utilities
export const performanceMonitor = {
  // Measure function execution time
  measureAsync: async <T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      analytics.performance({
        name,
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
      });
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      
      analytics.performance({
        name: `${name}_error`,
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
      });
      
      throw error;
    }
  },

  // Measure component render time
  measureRender: (componentName: string) => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      analytics.performance({
        name: `render_${componentName}`,
        value: duration,
        unit: 'ms',
        timestamp: new Date(),
      });
    };
  },

  // Track Web Vitals
  trackWebVitals: () => {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals when available
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS((metric) => {
        analytics.performance({
          name: 'web_vital_cls',
          value: metric.value,
          unit: 'score',
          timestamp: new Date(),
        });
      });

      getFID((metric) => {
        analytics.performance({
          name: 'web_vital_fid',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
        });
      });

      getFCP((metric) => {
        analytics.performance({
          name: 'web_vital_fcp',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
        });
      });

      getLCP((metric) => {
        analytics.performance({
          name: 'web_vital_lcp',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
        });
      });

      getTTFB((metric) => {
        analytics.performance({
          name: 'web_vital_ttfb',
          value: metric.value,
          unit: 'ms',
          timestamp: new Date(),
        });
      });
    }).catch(() => {
      // web-vitals not available, skip tracking
    });
  },
};
