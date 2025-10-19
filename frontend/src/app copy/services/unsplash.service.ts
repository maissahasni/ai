import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

type UrlKey = 'raw' | 'full' | 'regular' | 'small' | 'thumb' | 'small_s3';

export interface UnsplashPhoto {
  id: string;
  alt_description: string | null;
  description: string | null;
  links: { html: string; download_location: string };
  user: { name: string; username: string; links: { html: string } };
  urls: Record<UrlKey, string>;
}
export interface UnsplashSearchResponse {
  total: number; total_pages: number; results: UnsplashPhoto[];
}

@Injectable({ providedIn: 'root' })
export class UnsplashService {
  private readonly base = 'https://api.unsplash.com';
  private readonly headers = new HttpHeaders({
    Authorization: `Client-ID ${environment.unsplashAccessKey}`
  });

  constructor(private http: HttpClient) {}

  searchPhotos(query: string, perPage = 10, page = 1): Observable<UnsplashSearchResponse> {
    const params = new HttpParams().set('query', query).set('per_page', perPage).set('page', page);
    return this.http.get<UnsplashSearchResponse>(`${this.base}/search/photos`, { headers: this.headers, params });
  }

  firstPhoto(query: string): Observable<UnsplashPhoto | null> {
    return this.searchPhotos(query, 1, 1).pipe(
      map(r => r.results?.[0] ?? null),
      catchError(() => of(null))
    );
  }

  imageUrlFor(query: string, size: Exclude<UrlKey,'raw'|'full'|'small_s3'> = 'regular'): Observable<string | null> {
    return this.firstPhoto(query).pipe(
      map(photo => {
        if (!photo) return null;
        const url = new URL(photo.urls[size]);
        url.searchParams.set('utm_source', environment.unsplashAppName || 'your_app_name');
        url.searchParams.set('utm_medium', 'referral');
        return url.toString();
      })
    );
  }

  /** Call this when the user actually uses the image (selects/attaches) */
  trackDownload(downloadLocation: string): Observable<void> {
    return this.http.get<void>(downloadLocation, { headers: this.headers });
  }
}
