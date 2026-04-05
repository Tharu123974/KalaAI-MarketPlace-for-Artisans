# Kala AI - Artisans' Marketplace Assistant Prototype

This is the frontend prototype for the Kala AI Marketplace Assistant. It is a visually stunning, pure HTML/CSS/JS application designed to help local artisans generate product listings using AI.

## Project Structure
- `index.html`: The landing page with value props and features.
- `upload.html`: The AI generator interface where artisans "upload" a product image.
- `results.html`: Displays the generated AI output.
- `reviews.html`: Showcases how "Review Intelligence" uses customer feedback to enhance listings.
- `auth.html`: The Login/Signup interface for buyers and sellers.
- `feedback.html`: A page for users to submit anonymous feedback to developers.
- `about.html` / `contact.html`: Company mission and contact info.
- `styles.css`: Central stylesheet containing global variables, responsive grid systems, card styles, and theme colors.
- `app.js`: Central logic for mobile navigation, theme switching, and simulated AI delays.

## Connecting to a Backend

This prototype is currently fully frontend and utilizes `localStorage` and `setTimeout` to mock data passing and AI generation delays. To make this functional, you will need to integrate a backend (e.g., Node.js/Express, Python/Django, or Go).

### 1. Form Submissions
Replace the `onsubmit="event.preventDefault();"` attributes on forms in `upload.html`, `auth.html`, `feedback.html`, and `reviews.html` with actual API calls using `fetch()` or `axios`.

Example:
```javascript
document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // 1. Show loading spinner
    // 2. Call your backend AI endpoint
    const response = await fetch('/api/v1/generate-listing', {
        method: 'POST',
        body: formData
    });
    
    // 3. Parse and redirect
    const data = await response.json();
    localStorage.setItem('ai_result', JSON.stringify(data));
    window.location.href = 'results.html';
});
```

### 2. User Authentication
The `auth.html` page contains both Login and Signup forms. You should attach event listeners to submit the credentials to your authentication endpoints (e.g., `/api/auth/login` and `/api/auth/register`). Upon a successful JWT or Session token generation, store it in `document.cookie` or `localStorage` and redirect the user back to `index.html`.

### 3. Theme State Persistence
The theme switcher currently saves the selected theme to `localStorage`. If you want the theme to persist across different devices for logged-in users, send the theme preference to your backend when it changes, and inject it on page load.

### 4. Database Schema Recommendations
- **Users Table**: `id`, `name`, `email`, `password_hash`, `role` (artisan vs buyer).
- **Products Table**: `id`, `artisan_id`, `image_url`, `ai_title`, `ai_desc`, `cultural_story`, `price_range`.
- **Reviews Table**: `id`, `product_id`, `rating`, `comment`, `ai_insight_extracted`.
- **Feedback Table**: `id`, `message`, `timestamp` (no user ID link required for anonymity).

## Theme Switcher Implementation
The application uses CSS variables (`--primary`, `--primary-hover`, `--secondary`, etc.) defined in `:root`. The theme switcher in `app.js` listens for changes and applies a `data-theme` attribute to the `<body>` element. `styles.css` handles the specific color overrides for `[data-theme="blue"]`, `[data-theme="green"]`, and `[data-theme="red"]`. The Light/Dark mode works similarly using `data-mode="dark"`.

## Note on AI Features
Currently, the AI generation feature is **fully mocked**. No actual AI models or backend APIs are being called. When a user clicks "Generate", a frontend `setTimeout` simulates processing time, and hardcoded AI responses are displayed on the `results.html` page to demonstrate what the final product will look like when connected to an LLM (Large Language Model) like OpenAI's GPT-4 or Gemini.
