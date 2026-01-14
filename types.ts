export interface Recommendation {
  id: string;
  title: string;
  category: 'Writing' | 'Speaking' | 'Listening' | 'Reading';
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ErrorMetric {
  name: string;
  value: number;
  color: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
