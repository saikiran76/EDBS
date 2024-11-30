import { atom } from 'jotai';

export interface BrainstormingState {
  isOpen: boolean;
  isLoading: boolean;
  questions: string[];
  error: string | null;
}

export const brainstormingAtom = atom<BrainstormingState>({
  isOpen: false,
  isLoading: false,
  questions: [],
  error: null,
}); 