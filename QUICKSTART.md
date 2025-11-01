# Quick Start Guide

Get Brok up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your RapidAPI key
# Get your key from: https://rapidapi.com/apidojo/api/yahoo-finance1
```

Your `.env` should look like:
```env
VITE_RAPIDAPI_KEY=your_actual_key_here
VITE_YAHOO_BASE_URL=https://yh-finance.p.rapidapi.com
VITE_BACKEND_URL=http://0.0.0.0:8080
```

## 3. Start Backend (Required)

Make sure your FastAPI backend is running on `http://0.0.0.0:8080` with:
- CORS enabled for `http://localhost:5173`
- `/v1/tickers/data` endpoint implemented

## 4. Start Frontend

```bash
npm run dev
```

Visit `http://localhost:5173` and start analyzing stocks!

## First Analysis

1. Search for "Apollo Tyres" or "Infosys"
2. Select one or more stocks
3. Choose timeframes (15m and 1D are selected by default)
4. Click "Analyze Stocks"
5. Wait for results (usually 10-30 seconds)

## Troubleshooting

### "Configuration Required" message
- Your `.env` file is missing or `VITE_RAPIDAPI_KEY` is not set
- Make sure to restart the dev server after creating/editing `.env`

### CORS errors
- Your backend needs CORS middleware configured
- Add `http://localhost:5173` to allowed origins

### Backend connection failed
- Verify backend is running on the configured URL
- Check `VITE_BACKEND_URL` in `.env`

### Rate limit errors
- You've hit the RapidAPI free tier limit
- Wait or upgrade your plan

## What's Next?

- Read the full [README.md](./README.md) for detailed documentation
- Explore the codebase in `src/`
- Customize the UI in components
- Add new features or indicators

Happy analyzing! 📊

