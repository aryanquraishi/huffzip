---
name: HuffZip Utility
colors:
  surface: '#fcf9f5'
  surface-dim: '#dcdad6'
  surface-bright: '#fcf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ef'
  surface-container: '#f0ede9'
  surface-container-high: '#ebe8e4'
  surface-container-highest: '#e5e2de'
  on-surface: '#1c1c19'
  on-surface-variant: '#3e494a'
  inverse-surface: '#31302e'
  inverse-on-surface: '#f3f0ec'
  outline: '#6e797b'
  outline-variant: '#bdc8cb'
  surface-tint: '#006874'
  primary: '#005f6a'
  on-primary: '#ffffff'
  primary-container: '#007a87'
  on-primary-container: '#d5f9ff'
  inverse-primary: '#7ad4e2'
  secondary: '#5e5d66'
  on-secondary: '#ffffff'
  secondary-container: '#e3e1ec'
  on-secondary-container: '#64636c'
  tertiary: '#b00010'
  on-tertiary: '#ffffff'
  tertiary-container: '#d52625'
  on-tertiary-container: '#ffefed'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#97f0ff'
  primary-fixed-dim: '#7ad4e2'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f57'
  secondary-fixed: '#e3e1ec'
  secondary-fixed-dim: '#c7c5cf'
  on-secondary-fixed: '#1b1b22'
  on-secondary-fixed-variant: '#46464e'
  tertiary-fixed: '#ffdad6'
  tertiary-fixed-dim: '#ffb4ab'
  on-tertiary-fixed: '#410002'
  on-tertiary-fixed-variant: '#93000b'
  background: '#fcf9f5'
  on-background: '#1c1c19'
  surface-variant: '#e5e2de'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
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
    lineHeight: '1.6'
  label-mono:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-page: 40px
  section-gap: 80px
---

## Brand & Style

The brand personality is rooted in **technical precision and effortless utility**. It aims to evoke a sense of reliability and speed, transforming a complex algorithmic process (Huffman coding) into a seamless, user-friendly experience. The target audience includes developers, data-conscious professionals, and students who require a dependable tool for file optimization.

The chosen design style is **Corporate / Modern**, leaning heavily into **Minimalism**. By prioritizing high-contrast functional areas against vast white space, the design system ensures that the technical nature of compression feels approachable. It avoids unnecessary decoration, focusing instead on clear paths to action and legible data visualizations.

## Colors

The palette is anchored by a professional **Compression Teal**, replacing the aggressive red of traditional PDF tools with a color that suggests efficiency and technical stability. 

- **Primary**: A deep, focused Teal used for primary actions, progress indicators, and active states.
- **Secondary**: A charcoal gray used for high-contrast typography and deep structural elements.
- **Tertiary**: Retained from the inspiration palette as a high-visibility accent for destructive actions (e.g., "Clear All") or critical error states.
- **Neutral**: A soft, warm light gray/beige used for background fills and secondary container areas to reduce eye strain and provide depth without using harsh borders.
- **White**: The base for the primary workspace and cards to maintain a clean, "airy" feel.

## Typography

This design system utilizes **Inter** for its neutral, highly legible characteristics, ensuring that technical data remains the focus. To complement the technical nature of file compression, **Space Grotesk** is introduced for labels and terminal-style logs, adding a subtle geometric, "engineered" feel to secondary information.

Clear hierarchy is established through significant weight changes and generous line heights. Headlines are tightly tracked and bold to anchor the page sections, while body text remains spacious for maximum readability.

## Layout & Spacing

The layout follows a **fixed grid** model for the central workspace, ensuring that the utility remains focused and does not become overly stretched on ultra-wide displays. A 12-column system is used for the landing page tool cards, while the main compression interface uses a single-column focused layout.

A 8px spacing scale governs the rhythm. Large sections are separated by significant gaps (80px) to maintain the "clean" aesthetic, while related interface elements (like a file name and its size) are kept within tight 8px-16px proximity.

## Elevation & Depth

Visual hierarchy is achieved primarily through **Tonal Layers** and **Low-contrast outlines**. 

- **Level 0 (Background)**: The neutral `#F3F0EC` color acts as the canvas.
- **Level 1 (Cards/Work Area)**: Pure white surfaces with a subtle 1px border in a slightly darker neutral tint.
- **Level 2 (Active Drag-and-Drop)**: When a file is hovered over the drop zone, the area gains a soft, ambient shadow (15% opacity primary color) to indicate receptivity.
- **Terminal Logs**: Inset depth is used for the log area to simulate a "carved out" technical space within the flat UI.

## Shapes

The shape language is **Rounded**, striking a balance between friendly modern software and professional precision. 

- **Primary Buttons & Cards**: Use a 0.5rem (8px) radius for a solid, modern feel.
- **Tool Selection Icons**: Use a 1rem (16px) radius to distinguish them from functional utility buttons.
- **Input Fields**: Match the button radius for consistency across the form-heavy compression flow.

## Components

- **Drag-and-Drop Zone**: Large, dashed-border containers using the primary teal for the border. It should feature a prominent "Upload" icon and clear, large typography.
- **Action Buttons**: Primary buttons are solid Teal with White text. Secondary buttons use a Teal outline with a transparent background.
- **Compression Cards**: Large cards on the home screen that highlight specific tools (Compress, Decompress, Visualize). These feature large centered icons and minimal descriptive text.
- **Progress Bars**: Thick, horizontal bars with a smooth animation. The background of the bar is a light tint of the primary color, while the fill is the solid primary color.
- **Terminal Logs**: A secondary area with a dark `#33333B` background and `#FFFFFF` monospace text (Space Grotesk). Used for displaying the Huffman tree generation steps.
- **Tree Visualizer**: A specialized component for the Huffman Tree. Nodes should be white circles with teal borders, connected by clean gray lines, ensuring the technical visualization fits the overall aesthetic.
- **Status Chips**: Small, pill-shaped indicators for "Success," "Pending," or "Optimized," using low-saturation versions of the brand colors.