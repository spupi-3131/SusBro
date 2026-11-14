import { provideHttpClient } from '@angular/common/http';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomePage } from './home.page';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('requires a theme and valid player names before starting', () => {
    expect(component.players).toHaveLength(4);
    expect(component.canStart).toBe(false);
    component.theme = 'beach';
    expect(component.canStart).toBe(true);
    component.players[1].name = ' alex ';
    expect(component.duplicateNames).toBe(true);
    expect(component.canStart).toBe(false);
  });

  it('does not remove a player below the four player minimum', () => {
    component.removePlayer(component.players[0].id);
    expect(component.players).toHaveLength(4);
  });
});
