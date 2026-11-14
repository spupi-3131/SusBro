import { Injectable } from '@angular/core';

import type { GameState, Player } from '../models/game.models';

const GAME_SESSION_KEY = 'susbro-current-game';

@Injectable({ providedIn: 'root' })
export class GameSessionService {
  private currentState?: GameState;

  get state(): GameState | undefined {
    if (this.currentState) return this.currentState;

    try {
      const savedState = localStorage.getItem(GAME_SESSION_KEY);
      if (savedState) this.currentState = JSON.parse(savedState) as GameState;
    } catch {
      this.currentState = undefined;
    }

    return this.currentState;
  }

  set state(state: GameState | undefined) {
    this.currentState = state;

    try {
      if (state) localStorage.setItem(GAME_SESSION_KEY, JSON.stringify(state));
      else localStorage.removeItem(GAME_SESSION_KEY);
    } catch {
      // Game state remains available in memory if browser storage is unavailable.
    }
  }

  save(): void {
    if (this.currentState) this.state = this.currentState;
  }

  start(players: Player[], theme: string, timerDuration: 30 | 45 | 60, secretWord: string): void {
    const playerIds = players.map((player) => player.id);
    const spyId = playerIds[Math.floor(Math.random() * playerIds.length)];
    this.state = {
      players: players.map((player) => ({ ...player })),
      settings: { theme, timerDuration },
      spyId,
      secretWord,
      turnOrder: this.shuffle(playerIds),
      phase: 'reveal',
      revealIndex: 0,
      turnIndex: 0,
      clueCycle: 1,
      votes: {},
      voteHistory: [],
      voteRound: 1,
      meetingUsed: false,
      secondsRemaining: timerDuration,
    };
  }

  player(id: string): Player {
    return this.state!.players.find((player) => player.id === id)!;
  }

  shuffle<T>(values: T[]): T[] {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
