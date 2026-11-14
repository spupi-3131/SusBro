export interface Player {
  id: string;
  name: string;
}

export interface GameSettings {
  theme: string;
  timerDuration: 30 | 45 | 60;
}

export interface WordSuggestion {
  word: string;
  score: number;
}

export type GamePhase = 'reveal' | 'clues' | 'meeting' | 'voting' | 'guess' | 'results';

export interface GameState {
  players: Player[];
  settings: GameSettings;
  spyId: string;
  secretWord: string;
  turnOrder: string[];
  phase: GamePhase;
  revealIndex: number;
  turnIndex: number;
  clueCycle: number;
  votes: Record<string, string>;
  voteHistory: Record<string, string>[];
  voteRound: number;
  meetingUsed: boolean;
  secondsRemaining: number;
  winner?: 'CITIZENS' | 'SPY';
  finalGuess?: string;
  guessCorrect?: boolean;
}
