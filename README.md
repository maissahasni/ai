# 🤖 Gemini Chat Interface (Angular)

A simple, standalone Angular component that integrates the Google Gemini API (`gemini-2.5-flash`) to provide a responsive, conversational chat interface.

## ✨ Features

  * **Gemini API Integration:** Communicates with the `gemini-2.5-flash` model for fast, relevant text generation.
  * **Angular Service Layer:** Uses a dedicated service (`GeminiService`) to handle API requests and response parsing, keeping component logic clean.
  * **Responsive UI:** Styled with a modern, clean design inspired by the provided "Course Explorer" aesthetic.
  * **Type-Safe Communication:** Uses TypeScript interfaces to define API payloads and responses.

## 🚀 Getting Started

### Prerequisites

  * **Node.js** and **npm** (or yarn)
  * **Angular CLI** (version 16+)
  * **A Gemini API Key** (Obtain one from Google AI Studio)

### 1\. Project Setup

Assuming you have an existing Angular project, ensure the required modules are available for HTTP requests and form binding:

```bash
# Ensure HttpClientModule is available (usually in app.config.ts or app.module.ts)
# Ensure CommonModule and FormsModule are imported in the chat component (they are in the provided code)
```

### 2\. Configure the API Key

The API key is configured within the service file.

1.  Open **`src/app/services/gemini.service.ts`**.

2.  Replace the placeholder `'YOUR_API_KEY'` with your actual Gemini API key:

    ```typescript
    // src/app/services/gemini.service.ts

    const GEMINI_API_KEY = 'AIzaSy...your-actual-key-here...'; // ⬅️ UPDATE THIS!
    const MODEL_NAME = 'gemini-2.5-flash';
    // ...
    ```

    > ⚠️ **SECURITY NOTE:** Hardcoding the API key in the frontend is a security risk. For production, use a **backend proxy** (e.g., Firebase Functions, Node/Express) to manage and secure your API key.

### 3\. Run the Application

Start your local development server:

```bash
ng serve
```

The chat interface should now be accessible, and the `Send` button will make calls to the Gemini API.

## 📁 File Structure

The core functionality of the chatbot is contained in these files:

```
src/
└── app/
    ├── chat/
    │   ├── chat.component.ts  # Component logic (input, sendPrompt)
    │   ├── chat.html          # HTML template (input, button, response display)
    │   └── chat.scss          # Styling for the component
    └── services/
        └── gemini.service.ts  # Handles all API communication with the Gemini endpoint
```

## 🛠️ Key Implementation Details

### `gemini.service.ts`

This service constructs the required JSON payload for the Gemini API (`generateContent` endpoint) and parses the response to return a simple string:

```typescript
// Correct Request Body Structure
const requestBody = {
  contents: [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ]
};

// Correct Response Parsing
// text = response.candidates[0].content.parts[0].text
```

### `chat.component.ts`

The component injects `GeminiService` and uses a reactive approach to handle the request and update the UI variables (`userInput` and `response`):

```typescript
sendPrompt(): void {
  this.geminiService.generateResponse(this.userInput).subscribe({
    next: (textResponse) => {
      this.response = textResponse.trim();
    },
    error: (error) => {
      this.response = 'Error. Check console.';
    }
  });
}
```

## 🎨 Styling

The design uses common CSS/Bootstrap-like classes (e.g., `card`, `btn-primary`, `container-xxl`) for a modern, component-based look, as requested. The primary interface is wrapped in a `card` element for a clear visual boundary.

## 🛑 Troubleshooting

| Issue | Resolution |
| :--- | :--- |
| **`400 OK` (Bad Request)** | **Verify the API Key** in `gemini.service.ts`. If it shows `YOUR_API_KEY` in the error URL, the key was not replaced. If it shows your actual key, the key may be invalid or restricted. |
| **CORS Errors** | Ensure that the Generative Language API is enabled for your key. For client-side apps, sometimes a browser extension or proxy setup is needed, but typically Google's API supports CORS. |
| **No Response on Send** | Check the browser console for network errors. Verify that `HttpClientModule` is imported in your Angular application. |
