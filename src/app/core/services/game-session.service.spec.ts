import { GameSessionService } from './game-session.service';

describe('GameSessionService', () => {
  it('assigns one spy independently from a complete shuffled speaking order', () => {
    const service = new GameSessionService();
    const players = ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, name: id.toUpperCase() }));
    const random = vi.spyOn(Math, 'random').mockReturnValueOnce(0.75).mockReturnValue(0);
    service.start(players, 'beach', 45, 'shore');
    const state = service.state!;
    expect(state.players.filter((player) => player.id === state.spyId)).toHaveLength(1);
    expect(new Set(state.turnOrder)).toEqual(new Set(players.map((player) => player.id)));
    expect(state.spyId).toBe('d');
    expect(state.turnOrder[0]).toBe('b');
    expect(state.settings.timerDuration).toBe(45);
    random.mockRestore();
  });
});
