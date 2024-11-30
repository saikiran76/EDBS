import React from 'react';
import { Brain } from 'lucide-react';
import { useAtom } from 'jotai';
import { brainstormingAtom } from '../atoms/brainstormingAtom';

export const BrainstormingButton = () => {
  const [brainstormState, setBrainstormState] = useAtom(brainstormingAtom);

  const togglePanel = () => {
    setBrainstormState(prev => ({
      ...prev,
      isOpen: !prev.isOpen
    }));
  };

  return (
    <>
      <style>
        {`
          .brainstorm-button {
            position: fixed;
            right: 1rem;
            top: 1rem;
            padding: 0.5rem;
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: box-shadow 0.2s;
          }
          
          .brainstorm-button:hover {
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
          }
          
          .brainstorm-icon {
            width: 1.25rem;
            height: 1.25rem;
            color: #2563eb;
          }
          
          .brainstorm-text {
            font-size: 0.875rem;
            font-weight: 500;
          }
        `}
      </style>
      <button
        onClick={togglePanel}
        className="brainstorm-button"
        aria-label="Toggle brainstorming panel"
      >
        <Brain className="brainstorm-icon" />
        <span className="brainstorm-text">✨Brainstorm</span>
      </button>
    </>
  );
} 