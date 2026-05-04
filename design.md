# Project Design System

This document outlines the design system used in this project, which can be reused in other projects to maintain a consistent aesthetic. The design is a **Minimalist Tech / Dev Portfolio** with a **Neo-Brutalist** influence, characterized by clean lines, pastel accents, and strong typography.

## 1. Typography

The project uses a mix of three primary font families to create a structured and readable interface:

- **Headings**: [Outfit](https://fonts.google.com/specimen/Outfit) (Sans-serif)
  - Used for section titles and names.
  - Characteristics: Bold/Extra-bold, high-impact.
- **Body Text**: [Inter](https://fonts.google.com/specimen/Inter) (Sans-serif)
  - Used for descriptions, bios, and general content.
  - Characteristics: Highly readable, clean.
- **Labels & Tags**: [Space Mono](https://fonts.google.com/specimen/Space+Mono) (Monospace)
  - Used for status tags, terminal outputs, and small meta information.
  - Characteristics: Technical, uppercase by default.
- **Decorative**: [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue)
  - Used for specific high-impact decorative elements.

## 2. Color Palette

The color system is built around a core set of neutral colors and a collection of "Customizable Pastel" accent variables.

### Core Colors
| Variable | Hex Code | Usage |
| :--- | :--- | :--- |
| `--ink` | `#0f172a` | Primary text color, dark elements, borders. |
| `--bg` | `#f4f4f5` | Main page background. |
| `--border` | `1px solid #e4e4e7` | Card borders, dividers. |

### Accent Variables (Pastels)
These variables are defined in the `:root` and are used for card backgrounds, hover effects, and badges. They are currently set to `#ffffff` but are intended to be replaced with pastel hex codes for specific accents:

| Variable | Suggested Pastel Hex | Usage |
| :--- | :--- | :--- |
| `--pink` | `#fecdd3` | Stats, social links, achievements. |
| `--lav` | `#ddd6fe` | Navigation, stats, skills. |
| `--mint` | `#bbf7d0` | Hireable tags, stats, success states. |
| `--peach` | `#ffedd5` | Achievements, badges. |
| `--sky` | `#bae6fd` | Social links, badges, charts. |
| `--yellow` | `#fef08a` | Stars count, achievements. |

## 3. UI Components

### Cards (`.bb`)
Standard container with a rounded, lifted look.
- **Border Radius**: `12px`
- **Border**: `var(--border)`
- **Shadow**: `0 4px 12px rgba(0, 0, 0, 0.03)`
- **Hover State**: `transform: translateY(-2px)`, `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06)`

### Tags (`.tag`)
Small, technical labels.
- **Font**: `Space Mono`
- **Size**: `0.65rem`
- **Padding**: `4px 10px`
- **Text Transform**: `uppercase`
- **Border Radius**: `12px` (Capsule)

### Tabs (`.tab-btn`)
Highly interactive buttons with a "rolling" text effect.
- **Rolling Animation**: On hover, text shifts upwards to reveal a secondary label.
- **Active State**: Inverts background and text color (`--ink` background, `--bg` text).

### Skeleton Loading (`.sk`)
Animated gradient used for loading states.
- **Animation**: `shimmer 1.5s infinite`
- **Gradient**: `linear-gradient(90deg, #ecdfe8 25%, #ddd2da 50%, #ecdfe8 75%)`

## 4. Key Animations

| Name | Effect | Trigger |
| :--- | :--- | :--- |
| `fadeUp` | Elements slide up and fade in. | On page load / section visibility. |
| `shimmer` | Shifting gradient for placeholders. | While data is fetching. |
| `mq` | Infinite horizontal scrolling marquee. | Continuous. |
| `eq` | Animated equalizer bars. | During music playback. |
| `spin` | Infinite rotation. | Active music vinyl. |

## 5. Background Accents
The project uses a subtle grid pattern on the `body` to enhance the "technical" feel:
```css
background-image: radial-gradient(circle, #c9b8f033 1px, transparent 1px);
background-size: 24px 24px;
```

## 6. Implementation Notes
- **Utility Framework**: Tailwind CSS is used for rapid layout and spacing.
- **Static Assets**: Icons are primarily sourced from [Simple Icons](https://simpleicons.org/) via `cdn.simpleicons.org`.
- **Dynamic Data**: The design handles empty states with "Ghost" animations or skeleton loaders.
