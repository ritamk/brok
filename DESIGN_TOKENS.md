# Design Tokens Reference

This document provides a quick reference for using the design tokens (colors and fonts) in the Brok application.

## Color Palette

### Primary Colors
- **Primary Blue** (`#223e6f`): Main brand color, used for primary actions and key UI elements
  - Tailwind: `text-primary`, `bg-primary`, `border-primary`
  - Also available as: `text-primary-blue`, `bg-primary-blue`, etc.

- **Accent Green** (`#8ad759`): Call-to-action, success states, positive indicators
  - Tailwind: `text-accent`, `bg-accent`, `border-accent`
  - Also available as: `text-accent-green`, `bg-accent-green`, etc.

- **Highlight Cyan** (`#72cad4`): Highlights, hover states, interactive elements
  - Tailwind: `text-highlight`, `bg-highlight`, `border-highlight`
  - Also available as: `text-highlight-cyan`, `bg-highlight-cyan`, etc.

### Neutral Colors
- **Background White** (`#ffffff`): Main background color
  - Tailwind: `bg-background`, `text-background`
  - Also available as: `bg-background-white`

- **Secondary Grey** (`#c8c8c8`): Secondary text, borders, dividers
  - Tailwind: `text-secondary`, `bg-secondary`, `border-secondary`
  - Also available as: `text-secondary-grey`, `bg-secondary-grey`, etc.

## Typography

### Font Families

1. **IBM Plex Sans** (Body Text)
   - Default font for all body text and UI elements
   - Tailwind: `font-sans` (applied by default to body)
   - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

2. **Inter** (Headings)
   - Used for all headings (h1-h6)
   - Tailwind: `font-heading` (applied by default to h1-h6)
   - Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

3. **Momo Trust Display** (Branding)
   - Used for logo, hero text, and special branding elements
   - Tailwind: `font-brand`
   - Use sparingly for maximum impact

## Usage Examples

### Text Colors
```tsx
<p className="text-primary">Primary text</p>
<span className="text-accent">Accent text</span>
<div className="text-secondary">Secondary text</div>
```

### Backgrounds
```tsx
<div className="bg-background">White background</div>
<button className="bg-primary text-white">Primary button</button>
<div className="bg-highlight">Highlighted section</div>
```

### Fonts
```tsx
<p className="font-sans">Body text (default)</p>
<h1 className="font-heading">Heading (default for h1-h6)</h1>
<div className="font-brand text-4xl">BROK</div>
```

### Combined Examples
```tsx
// Primary CTA button
<button className="bg-accent text-white font-heading px-6 py-3 rounded-lg hover:bg-accent/90">
  Analyze Stock
</button>

// Card with brand styling
<div className="bg-background border border-secondary rounded-lg p-6">
  <h2 className="font-heading text-primary text-2xl mb-4">Portfolio</h2>
  <p className="font-sans text-primary">Your portfolio details...</p>
</div>

// Highlighted metric
<div className="bg-highlight/10 border border-highlight rounded p-4">
  <span className="font-heading text-highlight text-3xl">+18.5%</span>
</div>
```

## Notes

- All base styles are automatically applied via `src/index.css`
- Body text uses IBM Plex Sans by default
- All headings (h1-h6) use Inter by default
- Background is white by default
- Text color is primary blue by default
- Use `font-brand` sparingly for maximum branding impact

