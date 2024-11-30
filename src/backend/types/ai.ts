export interface BrainstormRequest {
  texts?: string[] | string;
  image?: string;
  theme?: string;
  context?: string;
  elements?: string;
  prompt?: string;
}

export interface BrainstormResponse {
  questions: string[];
  error?: string;
  success: boolean;
} 