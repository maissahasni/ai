import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// NOTE ON SECURITY: It is highly recommended that you route this API call through 
// a secure backend proxy (like Node.js, Cloud Functions, etc.) to protect your 
// GEMINI_API_KEY from being exposed in the frontend code.

// --- Configure your API constants here ---
// Replace 'YOUR_API_KEY' with your actual Gemini API key.
const GEMINI_API_KEY = environment.openAiApiKey;
const MODEL_NAME = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;


// Simplified interface for the Gemini API response structure
interface GeminiApiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly http = inject(HttpClient);

  /**
   * Generates content using the Gemini API with the correct request body.
   */
  generateResponse(prompt: string): Observable<string> {
    // FIX: This is the correct request body structure for the Gemini API
    const requestBody = {
      contents: [
        {
          role: 'user', // Defines the message author
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      // You can add generationConfig here if needed (e.g., temperature)
    };

    return this.http.post<GeminiApiResponse>(API_URL, requestBody).pipe(
      // FIX: Correct response parsing for the Gemini API:
      // response.candidates[0].content.parts[0].text
      map(response => {
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || 'The model did not return a valid text response.';
      })
    );
  }
}