# Frontend Agent Guidelines & Anti-AI-Slop Component Manifesto

This directory contains the **Next.js 16 + Tailwind CSS + shadcn/ui** frontend application.
Any coding agent working in this directory **MUST STRICTLY COMPLY** with the following anti-slop design rules.

---

## 🚫 1. What is "AI Slop" & What is STRICTLY PROHIBITED

Do NOT produce generic, low-effort designs that look like an LLM generated them. Specifically:

1. **NO Cheap Neon / Rainbow Gradients**:
   - ❌ BANNED: `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500` or random cyan-to-purple backgrounds.
   - ❌ BANNED: Giant oversaturated blurred circular blobs behind every section.
   - ✅ DO USE: Deep, disciplined, architectural palettes (Obsidian `#090a0b`, Carbon `#111215`, Zinc-900/950, or Stone/Neutral).
   - ✅ DO USE: Purposeful, restrained accent colors (e.g., Precision Emerald `#10b981`, Deep Cobalt `#2563eb`, International Klein Blue, or Warm Ochre).

2. **NO Emoji Pollution**:
   - ❌ BANNED: Decorating badges, buttons, and headers with emojis (`🔥`, `🚀`, `✨`, `💡`, `☕`, `⚡`).
   - ✅ DO USE: Crisp, monochrome Lucide SVG icons with `strokeWidth={1.5}` or `strokeWidth={1.75}`, properly aligned with baseline text.

3. **NO Fluffy Marketing Non-Words**:
   - ❌ BANNED: "Unlock your limitless potential", "Supercharge your digital journey", "Revolutionary masterclass".
   - ✅ DO USE: Concrete, credible, grounded commerce language with real specifications, tangible benefits, and clear pricing breakdowns.

4. **NO Uniform Bubble-Card Layouts**:
   - ❌ BANNED: Every card having `rounded-3xl` with thick glowing 2px borders.
   - ✅ DO USE: Precise border radiuses (`rounded-xl` or `rounded-2xl`), hair-line borders (`border border-white/[0.08]` or `border-neutral-800`), and subtle tactile inner borders (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]`).

---

## 🎨 2. The High-Craft Design Standard (Linear / Stripe / Hydrogen Caliber)

### Typography
- **Headings**: Tight tracking (`tracking-tight` or `-tracking-[0.025em]`), heavy contrast between bold title and lighter explanatory text.
- **Micro-labels**: Small, crisp uppercase tracking (`text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-neutral-400`).
- **Numbers & Metrics**: Tabular figures (`tabular-nums font-mono`) for prices, currency, inventory, and order IDs.
- **Copy Contrast**: High-contrast text hierarchy. `text-white` for primary headers, `text-neutral-300` for body copy, `text-neutral-500` for secondary metadata. Never use low-contrast unreadable gray-on-dark.

### Surface & Depth System
- **Layer 0 (Canvas)**: `#090a0f` or `#0a0b0d`.
- **Layer 1 (Card/Panel)**: `#12131a` or `rgba(18, 19, 26, 0.75)` with `backdrop-blur-md` and `border border-white/[0.07]`.
- **Layer 2 (Inputs/Nested wells)**: `#0c0d12` with `border border-white/[0.08]`.
- **Micro-Interactions**:
  - Buttons have subtle top-edge highlights: `shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]`.
  - Active states scale deliberately (`active:scale-[0.99]`).
  - Hover states subtly brighten surfaces rather than radically changing colors.

### Form & Checkout Craft
- Field labels must be explicit, readable, with required indicators.
- Payment method chips should look like real fintech cards (BCA, Mandiri, QRIS, GoPay, OVO) with clean badge tags, not generic colored blocks.
- Real loading states, validation indicators, and clear transaction summaries.

---

## 🏗️ 3. Builder Architecture Guidelines
- All blocks in `src/components/blocks/` must conform to `../shared/types/index.ts`.
- Every block must support both live interactive editing in the builder canvas and clean standalone rendering for public storefronts / static exports.
- Never use placeholder `placeholder.com` images. Use SVG patterns, CSS illustrations, or real product photography mocks.
