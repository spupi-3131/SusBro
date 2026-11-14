import { HttpClient, HttpParams } from '@angular/common/http';
import { Capacitor, CapacitorHttp } from '@capacitor/core';
import { Injectable, inject } from '@angular/core';
import type { Observable } from 'rxjs';
import { from, map } from 'rxjs';

import type { WordSuggestion } from '../models/game.models';

@Injectable({ providedIn: 'root' })
export class WordService {
  private readonly http = inject(HttpClient);

  getRelatedWords(theme: string): Observable<WordSuggestion[]> {
    const query = theme.trim();
    const params = { ml: query, topics: query, max: '40' };
    const request = Capacitor.isNativePlatform()
      ? from(
          CapacitorHttp.get({
            url: 'https://api.datamuse.com/words',
            params,
            connectTimeout: 10000,
            readTimeout: 10000,
          }).then((response) => response.data as WordSuggestion[]),
        )
      : this.http.get<WordSuggestion[]>('https://api.datamuse.com/words', {
          params: new HttpParams({ fromObject: params }),
        });

    return request.pipe(
      map((items) => {
        const seen = new Set<string>();
        return items
          .map((item) => ({ word: item.word?.trim() ?? '', score: item.score ?? 0 }))
          .filter((item) => {
            const key = item.word.toLocaleLowerCase();
            if (!key || /\s/.test(key) || seen.has(key)) return false;
            seen.add(key);
            return true;
          });
      }),
    );
  }
}
