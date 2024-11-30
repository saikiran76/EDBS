type EventName = 'brainstorm_start' | 'brainstorm_generate' | 'brainstorm_error';

interface EventProperties {
  source?: string;
  error?: string;
  elementCount?: number;
}

export const trackEvent = (
  eventName: EventName,
  properties: EventProperties = {}
) => {
  // Implementation depends on your analytics provider
  // For now, just console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, properties);
  }
}; 