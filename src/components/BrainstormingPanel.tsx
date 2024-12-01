import React from 'react';
import { useAtom } from 'jotai';
import { brainstormingAtom } from '../atoms/brainstormingAtom';
import { trackEvent } from '../../packages/excalidraw/analytics';
import type { ExcalidrawImperativeAPI } from '../../packages/excalidraw/types';
import { exportToBlob, getTextFromElements } from '../../packages/excalidraw';
import { getDataURL } from '../../packages/excalidraw/data/blob';
import { safelyParseJSON } from '../../packages/excalidraw/utils';

interface BrainstormingPanelProps {
  excalidrawAPI: ExcalidrawImperativeAPI;
}

export const BrainstormingPanel: React.FC<BrainstormingPanelProps> = ({ excalidrawAPI }) => {
  const [brainstormState, setBrainstormState] = useAtom(brainstormingAtom);
  const [rateLimits, setRateLimits] = React.useState<{
    rateLimit?: number;
    rateLimitRemaining?: number;
  }>({});

  const generateQuestions = async () => {
    try {
      setBrainstormState(prev => ({ ...prev, isLoading: true, error: null }));
      trackEvent("ai", "generate (start)", "brainstorm");

      const API_URL = import.meta.env.VITE_AIBACKEND_URL || 'https://brainstormbackend-vh9n.onrender.com';
      
      const response = await fetch(
        `${API_URL}/v1/ai/brainstorm/generate`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            texts: getTextFromElements(excalidrawAPI.getSceneElements()),
            image: await getImageData(excalidrawAPI),
            theme: excalidrawAPI.getAppState().theme,
          }),
        }
      ).catch(error => {
        console.error("Backend connection error:", error);
        throw new Error(`AI service connection failed. Please ensure the backend server is running on ${API_URL}`);
      });

    
      const rateLimit = response.headers.has('X-Ratelimit-Limit')
        ? parseInt(response.headers.get('X-Ratelimit-Limit') || '0', 10)
        : undefined;

      const rateLimitRemaining = response.headers.has('X-Ratelimit-Remaining')
        ? parseInt(response.headers.get('X-Ratelimit-Remaining') || '0', 10)
        : undefined;

      setRateLimits({ rateLimit, rateLimitRemaining });

      if (!response.ok) {
        const text = await response.text();
        const errorJSON = safelyParseJSON(text);

        if (response.status === 429) {
          setBrainstormState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Too many requests today, please try again tomorrow!'
          }));
          return;
        }

        throw new Error(errorJSON?.message || text);
      }

      const { questions } = await response.json();
      trackEvent("ai", "generate (success)", "brainstorm");

      setBrainstormState(prev => ({
        ...prev,
        questions,
        isLoading: false
      }));

    } catch (error: any) {
      console.error("Brainstorm error:", error);
      trackEvent("ai", "generate (failed)", "brainstorm");
      setBrainstormState(prev => ({
        ...prev,
        isLoading: false,
        error: `${error.message}. Make sure the backend server is running on port 3015.`
      }));
    }
  };

  const getImageData = async (api: ExcalidrawImperativeAPI) => {
    const blob = await exportToBlob({
      elements: api.getSceneElements(),
      appState: {
        ...api.getAppState(),
        exportBackground: true,
        viewBackgroundColor: api.getAppState().viewBackgroundColor,
      },
      files: api.getFiles(),
      mimeType: 'image/jpeg'
    });
    
    return getDataURL(blob);
  };

  // Similar UI as before, but add rate limit warning
  return (
    <>
      <style>
        {`
          .generate-button {
            width: 100%;
            background-color: #2563eb;
            color: white;
            padding: 0.5rem 0;
            border-radius: 0.375rem;
            border: none;
            cursor: pointer;
          }
          
          .generate-button:hover {
            background-color: #1d4ed8;
          }
          
          .generate-button:disabled {
            background-color: #93c5fd;
            cursor: not-allowed;
          }
        `}
      </style>
      <div
        style={{
          position: 'fixed',
          right: '1rem',
          top: '4rem',
          width: '20rem',
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '1rem'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h3 style={{ 
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Brainstorming Questions
          </h3>
          <button
            onClick={() => setBrainstormState(prev => ({ ...prev, isOpen: false }))}
            style={{
              color: '#6b7280',
              cursor: 'pointer',
              border: 'none',
              background: 'none',
              fontSize: '1.5rem'
            }}
          >
            ×
          </button>
        </div>

        {rateLimits.rateLimitRemaining === 0 ? (
          <div style={{ 
            color: '#ef4444',
            fontSize: '0.875rem',
            marginBottom: '1rem'
          }}>
            You've reached the daily limit. Try again tomorrow or upgrade to Excalidraw+
          </div>
        ) : (
          <button
            onClick={generateQuestions}
            disabled={brainstormState.isLoading || rateLimits.rateLimitRemaining === 0}
            className="generate-button"
          >
            {brainstormState.isLoading ? 'Generating...' : 'Generate Questions'}
          </button>
        )}

        {brainstormState.error && (
          <div style={{ 
            marginTop: '1rem',
            color: '#ef4444',
            fontSize: '0.875rem'
          }}>
            {brainstormState.error}
          </div>
        )}

        {brainstormState.questions.length > 0 && (
          <ul style={{ 
            marginTop: '1rem',
            listStyle: 'none',
            padding: 0
          }}>
            {brainstormState.questions.map((question, index) => (
              <li 
                key={index} 
                style={{
                  padding: '0.5rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '0.25rem',
                  marginBottom: '0.5rem'
                }}
              >
                {question}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}; 