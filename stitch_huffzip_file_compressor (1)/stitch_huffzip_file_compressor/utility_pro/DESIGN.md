---
name: Utility Pro
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  display:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  h3:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px
---

## Brand & Style

The visual identity of this design system is rooted in **Corporate Modernism** with a heavy emphasis on utility and functional clarity. It is designed to feel like a high-performance tool: dependable, transparent, and academically rigorous. The aesthetic prioritizes the user's task above all else, using generous whitespace and a structured hierarchy to reduce cognitive load during complex document processing workflows.

The design should evoke a sense of "digital infrastructure"—quietly powerful, highly organized, and universally accessible. By balancing vibrant interactive elements against a sober, neutral backdrop, the system guides users toward action without unnecessary visual noise.

## Colors

The color palette is anchored by **Trustworthy Blue**, a high-visibility primary hue that signals interactivity and reliability. 

- **Primary:** Use for main action buttons, progress indicators, and active states.
- **Secondary (Navy):** Reserved for primary headings and text to ensure high contrast and an academic, authoritative feel.
- **Neutrals:** A range of cool grays (from `#f8fafc` to `#64748b`) is used to define the UI shell and secondary metadata.
- **Surface:** Pure white is used for cards and containers to pop against the subtle off-white background, creating a clear "layered" effect for tools.

## Typography

This design system utilizes **Inter** for its exceptional readability in data-heavy environments. The typographic scale is built to handle complex instructions and tool labels with ease.

- **Headlines:** Use Navy (`#1e293b`) with tighter letter-spacing for a modern, compact look.
- **Body Text:** Use a slightly softened dark gray (`#334155`) for long-form reading to prevent eye strain.
- **Labels:** Use uppercase for small labels (like file formats or status tags) to differentiate them from interactive text.
- **Line Heights:** Generous line heights are maintained to ensure that even dense academic text remains approachable.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. While the content containers expand to a maximum width of 1280px for desktop viewing, the internal components utilize a strict 8px grid system to maintain rhythm.

- **Tool Grids:** Use a 12-column grid. Tool cards should typically span 3 columns on desktop, 6 on tablets, and 12 on mobile.
- **Vertical Rhythm:** Use `spacing.xl` (32px) between major UI blocks to allow the design to breathe.
- **Mobile First:** On small screens, margins are reduced to 16px, and all cards become full-width to maximize the touch target area for document uploads.

## Elevation & Depth

This design system uses **Ambient Shadows** and **Tonal Layering** to create a structured hierarchy. The goal is to make the "Work Area" feel physically present above the navigation and background.

- **Low Elevation (Level 1):** Subtle 1px borders (`#e2e8f0`) for cards in a grid. This keeps the interface feeling flat and organized.
- **Mid Elevation (Level 2):** Used for hover states on tool cards. A soft, diffused shadow (`0 10px 15px -3px rgba(0, 0, 0, 0.1)`) indicates interactivity.
- **High Elevation (Level 3):** Used for modals and dropdown menus. These include a slightly darker shadow to pull the element significantly forward from the utility grid.
- **No Glassmorphism:** Avoid blurs or transparency; surfaces should be solid and opaque to reinforce the feeling of stability and trust.

## Shapes

The shape language is **Rounded (Level 2)**, striking a balance between the precision of sharp corners and the friendliness of fully rounded elements.

- **Cards & Inputs:** Use a 0.5rem (8px) border radius.
- **Action Buttons:** Use a slightly larger 0.75rem radius or full pill-shape for specific "Call to Action" buttons to make them more inviting.
- **Icons:** Should be contained within square-rounded bounding boxes when used as tool descriptors, ensuring a uniform grid appearance.

## Components

### Buttons
- **Primary:** Solid Blue (`#2563eb`) with white text. High-contrast, bold, and center-aligned.
- **Secondary:** White background with Navy border and text. Used for "Cancel" or "Back" actions.
- **Icon Buttons:** Used for tool-specific actions (e.g., rotate, delete page). These should have clear hover tooltips.

### Tool Cards
Large, uniform blocks containing an icon, a bold title, and a short description. 
- **States:** Hovering should lift the card slightly using Level 2 elevation and change the border color to Primary Blue.

### File Upload Zone
A large, dashed-border area (`#cbd5e1`). It should occupy the primary visual real estate of the page when a tool is selected. Use a large "Drag & Drop" icon and a primary CTA.

### Lists
For file management, use clean horizontal rows with subtle dividers. Each row should display file name, size, and a "Remove" button.

### Inputs & Selects
High-contrast borders with 16px internal padding. Focus states must use a 2px Primary Blue outline to meet high accessibility standards.

### Navigation
A clean, white top-bar with Navy text. Include a "Mega Menu" style dropdown for accessing the full suite of tools quickly without leaving the current workflow.