import {
  ElementStyles,
  BlockStyles,
  StyleClass,
  DesignTokens,
  DeviceViewport,
  ResponsiveStyleOverrides,
} from '../../../shared/types';
import { DEFAULT_DESIGN_TOKENS } from './design-tokens';

export interface StyleSourceInfo {
  value: any;
  source: 'override' | 'element' | 'class' | 'token' | 'default';
  sourceName?: string; // e.g. "hero-heading" or "tablet"
  isOverriddenOnDevice: boolean;
  inheritedValue?: any;
}

/**
 * Normalizes class name input (e.g., '.hero-heading' -> 'hero-heading', 'Hero Title' -> 'hero-title')
 */
export function normalizeClassName(input: string): string {
  return input
    .trim()
    .replace(/^\.+/, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-');
}

/**
 * Resolves the full cascade of styles for an element:
 * 1. Global Design Tokens (Defaults)
 * 2. Shared Class Styles (merged in order of classNames)
 * 3. Element Base Styles (Desktop)
 * 4. Responsive Breakpoint Overrides (Tablet -> Mobile inheritance)
 */
export function resolveEffectiveStyles({
  elementStyles = {},
  classNames = [],
  styleClasses = [],
  tokens = DEFAULT_DESIGN_TOKENS,
  viewport = 'desktop',
}: {
  elementStyles?: ElementStyles | BlockStyles;
  classNames?: string[];
  styleClasses?: StyleClass[];
  tokens?: DesignTokens;
  viewport?: DeviceViewport;
}): ElementStyles {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';

  // 1. Layer 1: Token Defaults
  const tokenDefaults: Partial<ElementStyles> = {
    fontFamily: tokens.fonts?.body,
    borderRadius: tokens.borderRadius,
    shadow: tokens.shadow,
  };

  // 2. Layer 2: Styles from assigned classes in order
  let aggregatedClassStyles: Record<string, any> = {};
  if (classNames && classNames.length > 0 && styleClasses && styleClasses.length > 0) {
    const classMap = new Map(styleClasses.map((c) => [c.name, c.styles]));
    for (const name of classNames) {
      const clsStyles = classMap.get(name);
      if (clsStyles) {
        aggregatedClassStyles = {
          ...aggregatedClassStyles,
          ...clsStyles,
        };
      }
    }
  }

  // 3. Layer 3: Element desktop styles
  const rawElement = (elementStyles || {}) as Record<string, any>;

  // 4. Layer 4 & 5: Responsive overrides (Desktop -> Tablet -> Mobile cascade)
  const tabletOverrides = isTablet || isMobile ? (rawElement.tablet || {}) : {};
  const mobileOverrides = isMobile ? (rawElement.mobile || {}) : {};

  // Merge everything following CSS precedence rules:
  // Base desktop = tokens -> classes -> element
  const baseMerged: Record<string, any> = {
    ...tokenDefaults,
    ...aggregatedClassStyles,
    ...rawElement,
  };

  // Apply responsive cascade
  const effective: Record<string, any> = {
    ...baseMerged,
    ...tabletOverrides,
    ...mobileOverrides,
  };

  // Clean out nested device override objects from top-level properties
  delete effective.tablet;
  delete effective.mobile;

  return effective as ElementStyles;
}

/**
 * Inspects where a specific style property is coming from,
 * allowing the Inspector UI to display Webflow-style inheritance indicators.
 */
export function inspectStyleProperty({
  propertyKey,
  elementStyles = {},
  classNames = [],
  styleClasses = [],
  tokens = DEFAULT_DESIGN_TOKENS,
  viewport = 'desktop',
}: {
  propertyKey: keyof ElementStyles;
  elementStyles?: ElementStyles | BlockStyles;
  classNames?: string[];
  styleClasses?: StyleClass[];
  tokens?: DesignTokens;
  viewport?: DeviceViewport;
}): StyleSourceInfo {
  const isTablet = viewport === 'tablet';
  const isMobile = viewport === 'mobile';
  const rawElement = (elementStyles || {}) as Record<string, any>;

  const mobileVal = rawElement.mobile?.[propertyKey];
  const tabletVal = rawElement.tablet?.[propertyKey];
  const elementVal = rawElement[propertyKey];

  // Check class value
  let classVal: any = undefined;
  let matchedClassName: string | undefined = undefined;
  if (classNames && classNames.length > 0 && styleClasses && styleClasses.length > 0) {
    const classMap = new Map(styleClasses.map((c) => [c.name, c.styles]));
    for (const name of classNames) {
      const clsStyles = classMap.get(name) as Record<string, any> | undefined;
      if (clsStyles && clsStyles[propertyKey] !== undefined) {
        classVal = clsStyles[propertyKey];
        matchedClassName = name;
      }
    }
  }

  // Check token value
  let tokenVal: any = undefined;
  if (propertyKey === 'fontFamily') tokenVal = tokens.fonts?.body;
  if (propertyKey === 'borderRadius') tokenVal = tokens.borderRadius;
  if (propertyKey === 'shadow') tokenVal = tokens.shadow;

  // Active value on current viewport
  if (isMobile && mobileVal !== undefined) {
    return {
      value: mobileVal,
      source: 'override',
      sourceName: 'mobile',
      isOverriddenOnDevice: true,
      inheritedValue: tabletVal ?? elementVal ?? classVal ?? tokenVal,
    };
  }

  if (isTablet && tabletVal !== undefined) {
    return {
      value: tabletVal,
      source: 'override',
      sourceName: 'tablet',
      isOverriddenOnDevice: true,
      inheritedValue: elementVal ?? classVal ?? tokenVal,
    };
  }

  if (elementVal !== undefined) {
    return {
      value: elementVal,
      source: 'element',
      sourceName: 'Inline Element',
      isOverriddenOnDevice: false,
      inheritedValue: classVal ?? tokenVal,
    };
  }

  if (classVal !== undefined) {
    return {
      value: classVal,
      source: 'class',
      sourceName: `.${matchedClassName}`,
      isOverriddenOnDevice: false,
      inheritedValue: tokenVal,
    };
  }

  if (tokenVal !== undefined) {
    return {
      value: tokenVal,
      source: 'token',
      sourceName: 'Design Token',
      isOverriddenOnDevice: false,
    };
  }

  return {
    value: undefined,
    source: 'default',
    isOverriddenOnDevice: false,
  };
}
