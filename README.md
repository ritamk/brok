# Brok - AI-Powered Stock Analysis Dashboard

A modern, real-time stock analysis dashboard built with Vite, React, TypeScript, and Tailwind CSS. Brok provides comprehensive technical analysis, AI-powered trade recommendations, and news sentiment analysis for Indian stocks.

## Features

- 🔍 **Smart Stock Search** - Autocomplete search powered by Yahoo Finance API
- 📊 **Technical Analysis** - RSI, MACD, Moving Averages, Bollinger Bands, and more
- 🤖 **AI Trade Decisions** - Get buy/sell/hold recommendations with confidence scores
- 📰 **News & Sentiment** - Latest headlines with AI-generated summaries
- ⏱️ **Multiple Timeframes** - Analyze stocks across 5m, 15m, and 1D intervals
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Tech Stack

- **Frontend Framework**: Vite + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **APIs**: 
  - Yahoo Finance via RapidAPI (search, quotes, news)
  - Custom FastAPI backend (technical analysis)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A RapidAPI account with access to Yahoo Finance API
- A running FastAPI backend (see backend setup)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd brok
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   # Yahoo Finance RapidAPI Key (Required)
   VITE_RAPIDAPI_KEY=your_rapidapi_key_here

   # Yahoo Finance Base URL (Default provided)
   VITE_YAHOO_BASE_URL=https://yh-finance.p.rapidapi.com

   # Backend API URL (Update if your backend runs elsewhere)
   VITE_BACKEND_URL=http://0.0.0.0:8080
   ```

   **Getting a RapidAPI Key:**
   - Sign up at [RapidAPI](https://rapidapi.com/)
   - Subscribe to [Yahoo Finance API](https://rapidapi.com/apidojo/api/yahoo-finance1)
   - Copy your API key from the dashboard

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Backend Setup

Brok requires a FastAPI backend for technical analysis. Ensure your backend:

1. **Runs on the configured URL** (default: `http://0.0.0.0:8080`)

2. **Has CORS enabled** for the frontend origin:
   ```python
   from fastapi.middleware.cors import CORSMiddleware
   
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:5173"],  # Add your frontend URL
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

3. **Implements the `/v1/tickers/data` endpoint**:
   - Method: POST
   - Request body:
     ```json
     {
       "tickers": ["APOLLOTYRE.NS", "INFY.NS"],
       "timeframes": ["5m", "15m", "1D"]
     }
     ```
   - Response: See `src/types/backend.ts` for the expected structure

## Project Structure

```
brok/
├── src/
│   ├── api/
│   │   ├── backend.ts          # Backend API client
│   │   └── yahoo.ts            # Yahoo Finance API client
│   ├── components/
│   │   ├── results/
│   │   │   ├── AnalysisGroup.tsx      # Symbol analysis container
│   │   │   ├── TimeframePanel.tsx     # Timeframe-specific results
│   │   │   ├── IndicatorTable.tsx     # Technical indicators display
│   │   │   └── NewsList.tsx           # News headlines list
│   │   ├── AnalyzeButton.tsx          # CTA button with loading
│   │   ├── LoadingView.tsx            # Full-screen loading animation
│   │   ├── TickerSearch.tsx           # Stock search with autocomplete
│   │   └── TimeframePicker.tsx        # Timeframe selection toggles
│   ├── types/
│   │   ├── backend.ts          # Backend API types
│   │   └── yahoo.ts            # Yahoo Finance API types
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # App entry point with providers
│   └── index.css               # Tailwind imports and base styles
├── .env.example                # Environment variables template
├── index.html                  # HTML entry point
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
├── vite.config.ts              # Vite configuration
└── package.json                # Dependencies and scripts
```

## Usage

1. **Search for stocks** - Type a company name or symbol (e.g., "Apollo Tyres", "INFY")
2. **Select multiple tickers** - Add as many stocks as you want to analyze
3. **Choose timeframes** - Select 5m, 15m, and/or 1D intervals
4. **Click Analyze** - Wait for the AI to process market data
5. **Review results** - Explore technical indicators, trade recommendations, and news

## Features in Detail

### Technical Analysis
- **Signal Detection**: Buy/Sell/Hold signals with confidence scores
- **Indicators**: RSI, MACD, Moving Averages, Bollinger Bands, ATR, ADX, Stochastic
- **Risk Management**: Stop Loss, Take Profit, Risk/Reward ratios
- **Rules Triggered**: See which technical rules fired for each signal

### Trade Decisions
- **AI Recommendations**: Get detailed trade decisions with rationale
- **Confidence Scores**: Understand the strength of each recommendation
- **Risk Notes**: Important risk considerations for each trade
- **Alignment**: How technical and fundamental factors align

### News & Sentiment
- **AI Summaries**: Backend-generated news summaries
- **Key Drivers**: Major market-moving factors
- **Latest Headlines**: Real-time news from Yahoo Finance
- **Source Attribution**: Publisher and timestamp for each article

## Troubleshooting

### CORS Errors
If you see CORS errors in the console:
- Ensure your backend has CORS middleware configured
- Add your frontend URL to the `allow_origins` list
- Restart your backend server

### Rate Limiting
Yahoo Finance API has rate limits:
- Free tier: Limited requests per day
- If rate-limited, wait or upgrade your RapidAPI plan
- The app will show a friendly error message

### Backend Connection Failed
If the backend is unreachable:
- Verify `VITE_BACKEND_URL` in `.env` is correct
- Ensure your backend is running
- Check firewall/network settings

### Missing API Key Warning
If you see the configuration warning:
- Ensure `.env` file exists in the project root
- Verify `VITE_RAPIDAPI_KEY` is set
- Restart the dev server after adding the key

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

The codebase is modular and easy to extend:

- **New API endpoints**: Add to `src/api/`
- **New components**: Add to `src/components/`
- **New types**: Add to `src/types/`
- **Styling**: Use Tailwind utility classes

## Production Build

To build for production:

```bash
npm run build
```

The optimized files will be in the `dist/` directory. Deploy to any static hosting service (Vercel, Netlify, etc.).

### Environment Variables in Production

Ensure your production environment has:
- `VITE_RAPIDAPI_KEY` - Your RapidAPI key
- `VITE_YAHOO_BASE_URL` - Yahoo Finance API URL
- `VITE_BACKEND_URL` - Your production backend URL

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

## Acknowledgments

- Yahoo Finance API via RapidAPI for market data
- FastAPI backend for technical analysis
- Tailwind CSS for beautiful styling
- TanStack Query for data management

---

Built with ❤️ using modern web technologies

## Deploy to Firebase Hosting (brok)

1. Install the CLI (or use npx):
   ```bash
   npm i -g firebase-tools
   # or use npx without global install
   ```

2. Login and select your project:
   ```bash
   firebase login
   firebase use brok
   ```

3. Build with your backend URL (FastAPI) set:
   ```bash
   VITE_BACKEND_URL="https://YOUR-BACKEND-HOST" npm run build
   ```

   - The app reads `import.meta.env.VITE_BACKEND_URL` in production.
   - Dev uses the Vite proxy (`/v1`) from `vite.config.ts`.

4. Deploy hosting:
   ```bash
   npm run deploy:hosting
   ```

5. Local preview (optional):
   ```bash
   npm run serve:hosting
   ```

Firebase config added:
- `firebase.json` serves `dist/`, caches `/assets/**`, SPA fallback to `/index.html`.
- `.firebaserc` sets default project to `brok`.
