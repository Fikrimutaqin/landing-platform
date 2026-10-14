'use client';

import React, { useState } from 'react';
import { ShadcnComponentInstance, ShadcnComponentType } from '../../../../shared/types';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  ExternalLink,
  Search,
  Sliders,
  Calendar as CalendarIcon,
  CreditCard,
  Layers,
  ArrowRight,
  Shield,
  Star,
  Copy,
  ChevronRight,
  HelpCircle,
  Paperclip,
  FileText,
  X,
  MessageSquare,
  Send,
  Radio,
  Split,
  Menu,
  MoreVertical,
  Maximize2,
  Minimize2,
  Folder,
  User,
  Inbox,
  AlertTriangle,
  Bell,
  Component,
  Tag,
  Command as CommandIcon,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCw,
  Trash2,
  Type as TypeIcon,
  Plus,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from 'lucide-react';
import { DynamicIcon } from '../builder/IconPicker';

export interface ShadcnRendererProps {
  component: ShadcnComponentInstance;
  isSelected?: boolean;
  selectedComponentId?: string | null;
  isPreviewMode?: boolean;
  onSelect?: () => void;
  onSelectChild?: (childId: string) => void;
  onUpdateProps?: (updatedProps: Record<string, any>) => void;
  onDelete?: () => void;
  onAddChild?: (parentId: string, type: ShadcnComponentType, defaultProps: Record<string, any>) => void;
  onMoveChild?: (parentId: string, fromIndex: number, toIndex: number) => void;
  onDeleteChild?: (parentId: string, childId: string) => void;
  onUpdateChildProps?: (childId: string, updatedProps: Record<string, any>) => void;
}

export function ShadcnRenderer({
  component,
  isSelected,
  selectedComponentId,
  isPreviewMode = false,
  onSelect,
  onSelectChild,
  onUpdateProps,
  onDelete,
  onAddChild,
  onMoveChild,
  onDeleteChild,
  onUpdateChildProps,
}: ShadcnRendererProps) {
  const { type, props, styles } = component;

  // Local interactive states
  const [switchChecked, setSwitchChecked] = useState(props.checked ?? true);
  const [checkboxChecked, setCheckboxChecked] = useState(props.checked ?? true);
  const [radioSelected, setRadioSelected] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [sliderVal, setSliderVal] = useState(props.defaultValue ?? props.value ?? 60);
  const [togglePressed, setTogglePressed] = useState(props.pressed ?? true);
  const [toggleGroupIdx, setToggleGroupIdx] = useState(0);
  const [questionnaireIdx, setQuestionnaireIdx] = useState(0);
  const [directionMode, setDirectionMode] = useState<"ltr" | "rtl">(props.direction || "ltr");
  const [carouselSlide, setCarouselSlide] = useState(0);

  // Helper to update component props directly from canvas
  const handlePropChange = (key: string, value: any) => {
    if (onUpdateProps) {
      onUpdateProps({ [key]: value });
    }
  };

  // Inline Editable Text Component Helper (Click and type directly on canvas!)
  const renderInlineEditable = (
    text: string,
    propKey: string,
    className: string,
    Tag: any = "span",
    placeholder: string = "Click to type...",
    style?: React.CSSProperties
  ) => {
    if (isPreviewMode) {
      return (
        <Tag className={className} style={style}>
          {text || ""}
        </Tag>
      );
    }
    return (
      <Tag
        contentEditable
        suppressContentEditableWarning
        spellCheck={false}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          if (onSelect) onSelect();
        }}
        onKeyDown={(e: React.KeyboardEvent) => {
          e.stopPropagation();
        }}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          const newText = e.currentTarget.textContent?.trim() || "";
          if (newText && newText !== text) {
            handlePropChange(propKey, newText);
          }
        }}
        style={style}
        className={`${className} outline-none focus:ring-1 focus:ring-blue-400 focus:bg-blue-950/20 rounded cursor-text transition-all hover:bg-neutral-800/30`}
        title="Click to edit text directly in canvas"
      >
        {text || placeholder}
      </Tag>
    );
  };

  const elementStyles = (component.styles || {}) as Record<string, any>;

  const radiusMap: Record<string, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    full: 'rounded-full',
  };
  const radiusClass = (elementStyles.borderRadius && radiusMap[elementStyles.borderRadius]) || '';

  const paddingMap: Record<string, string> = {
    none: 'p-0',
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-3.5',
    lg: 'p-5',
    xl: 'p-7',
    '2xl': 'p-9',
  };
  const paddingClass = (elementStyles.padding && paddingMap[elementStyles.padding]) || '';

  const marginMap: Record<string, string> = {
    none: 'm-0',
    xs: 'my-0.5',
    sm: 'my-1.5',
    md: 'my-2.5',
    lg: 'my-4',
    xl: 'my-6',
  };
  const marginClass = (elementStyles.margin && marginMap[elementStyles.margin]) || '';

  const shadowMap: Record<string, string> = {
    none: 'shadow-none',
    sm: 'shadow-sm dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
    md: 'shadow-md dark:shadow-[0_4px_16px_rgba(0,0,0,0.65)]',
    lg: 'shadow-lg dark:shadow-[0_10px_30px_rgba(0,0,0,0.8)]',
    xl: 'shadow-xl dark:shadow-[0_20px_45px_rgba(0,0,0,0.9)]',
    '2xl': 'shadow-2xl dark:shadow-[0_25px_65px_rgba(0,0,0,0.95)]',
  };
  const shadowClass = (elementStyles.shadow && shadowMap[elementStyles.shadow]) || '';

  const textAlignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  const textAlignClass = (elementStyles.textAlign && textAlignMap[elementStyles.textAlign]) || '';

  const fontSizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };
  const fontSizeClass = (elementStyles.fontSize && fontSizeMap[elementStyles.fontSize]) || '';

  const fontWeightMap: Record<string, string> = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  };
  const fontWeightClass = (elementStyles.fontWeight && fontWeightMap[elementStyles.fontWeight]) || '';

  const customStyle: React.CSSProperties = {
    ...(elementStyles.backgroundColor ? { backgroundColor: elementStyles.backgroundColor } : {}),
    ...(elementStyles.textColor ? { color: elementStyles.textColor } : {}),
    ...(elementStyles.backgroundImage
      ? {
        backgroundImage: `url(${elementStyles.backgroundImage})`,
        backgroundSize: elementStyles.backgroundSize || 'cover',
        backgroundPosition: elementStyles.backgroundPosition || 'center',
      }
      : {}),
    ...(elementStyles.borderWidth !== undefined
      ? {
        borderWidth: `${elementStyles.borderWidth}px`,
        borderStyle: elementStyles.borderStyle || 'solid',
        borderColor: elementStyles.borderColor || 'rgba(150, 150, 150, 0.4)',
      }
      : {}),
    ...(elementStyles.borderColor && elementStyles.borderWidth === undefined
      ? {
        borderWidth: '1px',
        borderColor: elementStyles.borderColor,
        borderStyle: elementStyles.borderStyle || 'solid',
      }
      : {}),
    ...(elementStyles.opacity !== undefined ? { opacity: elementStyles.opacity / 100 } : {}),
  };

  const isCard = type === "Card";
  const cardDefaultClass = isCard
    ? [
      !elementStyles.backgroundColor && !elementStyles.backgroundImage
        ? "bg-white dark:bg-neutral-950/80 text-slate-900 dark:text-white"
        : "",
      elementStyles.borderWidth === undefined && !elementStyles.borderColor
        ? "border border-slate-200 dark:border-neutral-800"
        : "",
      !elementStyles.borderRadius ? "rounded-2xl" : "",
      !elementStyles.padding ? "p-5" : "",
      !elementStyles.shadow ? "shadow-md" : "",
    ]
      .filter(Boolean)
      .join(" ")
    : "";

  const wrapperClass = `relative group/comp transition-all ${marginClass} ${isSelected
      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#08090c]"
      : "hover:ring-1 hover:ring-blue-400/50"
    }`;

  return (
    <div
      onClick={(e) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        if (onSelect) onSelect();
      }}
      className={wrapperClass}
    >
      {/* ============================================================ */}
      {/* FLOATING INLINE ELEMENT TOOLBAR (ELEMENTOR / WEBFLOW STYLE)   */}
      {/* ============================================================ */}
      {!isPreviewMode && isSelected && (
        <div className="absolute -top-7 left-0 z-40 flex items-center gap-1 bg-[#0c0d14] border border-blue-500 shadow-2xl rounded-lg px-2 py-0.5 text-[10px] font-sans select-none animate-in fade-in duration-100">
          <span className="font-mono font-bold text-blue-400 mr-1 flex items-center gap-1">
            <Component className="w-2.5 h-2.5" />
            {type}
          </span>

          {/* Typography Variant Quick Switcher */}
          {type === "Typography" && (
            <div className="flex items-center gap-0.5 border-l border-neutral-800 pl-1">
              {(["h1", "h2", "h3", "p", "lead"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropChange("variant", v);
                  }}
                  className={`px-1.5 py-0.5 rounded font-mono font-bold uppercase text-[9px] ${(props.variant || "h2") === v
                      ? "bg-blue-600 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* Button Variant Quick Switcher */}
          {type === "Button" && (
            <div className="flex items-center gap-0.5 border-l border-neutral-800 pl-1">
              {(["default", "secondary", "outline", "destructive"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropChange("variant", v);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[9px] capitalize ${(props.variant || "default") === v
                      ? "bg-blue-600 text-white font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* Badge Variant Quick Switcher */}
          {type === "Badge" && (
            <div className="flex items-center gap-0.5 border-l border-neutral-800 pl-1">
              {(["default", "success", "secondary", "destructive"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropChange("variant", v);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[9px] capitalize ${(props.variant || "default") === v
                      ? "bg-blue-600 text-white font-bold"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}

          {/* Field Required Toggle */}
          {type === "Field" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePropChange("required", !props.required);
              }}
              className={`px-1.5 py-0.5 rounded text-[9px] border-l border-neutral-800 pl-1 ${props.required ? "text-red-400 font-bold" : "text-neutral-400 hover:text-white"
                }`}
            >
              {props.required ? "Required *" : "Optional"}
            </button>
          )}

          {/* Delete Element Button */}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="ml-1 p-0.5 rounded text-neutral-400 hover:text-red-400 hover:bg-red-950/40"
              title="Delete element"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
      {/* Component content container with live user-defined styling */}
      <div
        data-has-custom-bg={!!(elementStyles.backgroundColor || elementStyles.backgroundImage)}
        data-has-custom-border={elementStyles.borderWidth !== undefined || !!elementStyles.borderColor}
        data-has-custom-text={!!elementStyles.textColor}
        className={`w-full transition-all ${cardDefaultClass} ${radiusClass} ${paddingClass} ${shadowClass} ${textAlignClass} ${fontSizeClass} ${fontWeightClass} ${elementStyles.customClasses || ''}`}
        style={customStyle}
      >
        {/* ============================================================ */}
        {/* 1. BUTTON & BUTTON GROUP                                     */}
        {/* ============================================================ */}
        {type === "Button" && (
          <button
            type="button"
            style={{
              ...(elementStyles.backgroundColor ? { backgroundColor: elementStyles.backgroundColor } : {}),
              ...(elementStyles.textColor ? { color: elementStyles.textColor } : {}),
              ...(elementStyles.borderColor ? { borderColor: elementStyles.borderColor } : {}),
              ...(elementStyles.borderWidth !== undefined ? { borderWidth: `${elementStyles.borderWidth}px`, borderStyle: elementStyles.borderStyle || 'solid' } : {}),
            }}
            className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98] ${elementStyles.backgroundColor ? '' : (
                props.variant === "secondary"
                  ? "bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-900 dark:text-white"
                  : props.variant === "outline"
                    ? "border border-slate-300 dark:border-neutral-700 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-800 dark:text-neutral-200 bg-transparent"
                    : props.variant === "destructive"
                      ? "bg-red-600 hover:bg-red-500 text-white"
                      : "bg-blue-600 hover:bg-blue-500 text-white"
              )
              }`}
          >
            {renderInlineEditable(
              props.label || props.text || "Action Button",
              props.text ? "text" : "label",
              "truncate font-semibold",
              "span",
              "Action Button",
              elementStyles.textColor ? { color: elementStyles.textColor } : undefined
            )}
            <DynamicIcon
              name={props.icon || "ArrowRight"}
              className="w-3.5 h-3.5 shrink-0"
              fallback={<ArrowRight className="w-3.5 h-3.5 shrink-0" />}
            />
          </button>
        )}

        {type === "ButtonGroup" && (
          <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-900/80 p-0.5 shadow-sm">
            {(props.options || ["Option 1", "Option 2"]).map((opt: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setRadioSelected(i);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${radioSelected === i
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* ============================================================ */}
        {/* 2. FORMS & INPUTS                                            */}
        {/* ============================================================ */}
        {type === "Field" && (
          <div className="w-full space-y-1.5 text-left">
            <label className="block text-xs font-medium text-neutral-300">
              {renderInlineEditable(props.label || "Field Label", "label", "font-medium", "span", "Field Label")}
              {props.required && <span className="text-red-400 ml-1 font-bold">*</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                value={props.value ?? ""}
                placeholder={props.placeholder || "Enter customer details..."}
                onChange={(e) => handlePropChange("placeholder", e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-800 bg-neutral-950/80 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            {props.helperText && (
              <p className="text-[11px] text-neutral-400">
                {renderInlineEditable(props.helperText, "helperText", "", "span", "Add helper text...")}
              </p>
            )}
          </div>
        )}

        {type === "Input" && (
          <input
            type={props.inputType || "text"}
            value={props.value ?? ""}
            placeholder={props.placeholder || "Enter text..."}
            onChange={(e) => handlePropChange("placeholder", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-800 bg-neutral-950/80 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
          />
        )}

        {type === "InputGroup" && (
          <div className="flex rounded-lg border border-neutral-800 bg-neutral-950/80 overflow-hidden shadow-sm">
            <span className="px-3 py-2 text-xs font-mono font-medium text-neutral-400 bg-neutral-900/60 border-r border-neutral-800 flex items-center">
              {renderInlineEditable(props.prefix || "Rp", "prefix", "font-mono", "span", "Rp")}
            </span>
            <input
              type="text"
              placeholder={props.placeholder || "1,450,000"}
              onChange={(e) => handlePropChange("placeholder", e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-transparent text-white placeholder-neutral-500 focus:outline-none"
            />
            {props.actionLabel && (
              <button
                type="button"
                className="px-3 py-2 text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border-l border-neutral-800"
              >
                {renderInlineEditable(props.actionLabel, "actionLabel", "", "span", "Apply")}
              </button>
            )}
          </div>
        )}

        {type === "InputOTP" && (
          <div className="flex items-center gap-2 justify-center py-2">
            {Array.from({ length: props.length || 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-9 h-11 rounded-lg border flex items-center justify-center font-mono text-sm font-semibold ${i === 0
                    ? "border-blue-500 bg-blue-950/20 text-blue-300 ring-2 ring-blue-500/20"
                    : "border-neutral-800 bg-neutral-950 text-neutral-400"
                  }`}
              >
                {i === 0 ? "8" : i === 1 ? "4" : ""}
              </div>
            ))}
          </div>
        )}

        {type === "NativeSelect" && (
          <div className="w-full text-left space-y-1">
            {props.label && (
              <label className="text-xs font-medium text-neutral-300 block">
                {renderInlineEditable(props.label, "label", "font-medium", "span", "Select Channel")}
              </label>
            )}
            <div className="relative">
              <select
                aria-label={props.label || "Select option"}
                className="w-full appearance-none px-3 py-2 text-xs rounded-lg border border-neutral-800 bg-neutral-950 text-white pr-8 focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                {(props.options || ["QRIS Instant", "BCA Virtual Account", "Mandiri Virtual Account"]).map((opt: string, i: number) => (
                  <option key={i} value={opt} className="bg-neutral-900 text-white">
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        )}

        {type === "Textarea" && (
          <textarea
            rows={3}
            placeholder={props.placeholder || "Enter notes..."}
            onChange={(e) => handlePropChange("placeholder", e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-800 bg-neutral-950/80 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        )}

        {type === "Checkbox" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setCheckboxChecked(!checkboxChecked);
            }}
            className="flex items-start gap-2.5 cursor-pointer py-1"
          >
            <div
              className={`w-4 h-4 rounded border mt-0.5 flex items-center justify-center transition-colors ${checkboxChecked
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-neutral-700 bg-neutral-900"
                }`}
            >
              {checkboxChecked && <Check className="w-3 h-3 stroke-3" />}
            </div>
            <div className="text-xs text-left">
              <div className="font-medium text-neutral-200">
                {renderInlineEditable(props.label || "Checkbox Label", "label", "", "span", "Checkbox Label")}
              </div>
              {props.description && (
                <p className="text-[11px] text-neutral-400">
                  {renderInlineEditable(props.description, "description", "", "span", "Description")}
                </p>
              )}
            </div>
          </div>
        )}

        {type === "Switch" && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setSwitchChecked(!switchChecked);
            }}
            className="flex items-center justify-between gap-4 cursor-pointer py-1"
          >
            <span className="text-xs font-medium text-neutral-200 text-left">
              {renderInlineEditable(props.label || "Switch Option", "label", "", "span", "Switch Option")}
            </span>
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative shrink-0 ${switchChecked ? "bg-blue-600" : "bg-neutral-800"
                }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${switchChecked ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </div>
          </div>
        )}

        {type === "RadioGroup" && (
          <div className="space-y-2 text-left">
            {(props.options || []).map((opt: any, i: number) => {
              const isOptSelected = radioSelected === i;
              return (
                <div
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setRadioSelected(i);
                  }}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${isOptSelected
                      ? "border-blue-500/80 bg-blue-950/20 text-white"
                      : "border-neutral-800/80 bg-neutral-950/40 hover:bg-neutral-900/60 text-neutral-300"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${isOptSelected ? "border-blue-500" : "border-neutral-700"
                      }`}
                  >
                    {isOptSelected && <div className="w-2 h-2 rounded-full bg-blue-500" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{opt.label || opt}</div>
                    {opt.desc && <div className="text-[11px] text-neutral-400 mt-0.5">{opt.desc}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {type === "Select" && (
          <div className="w-full text-left space-y-1">
            {props.label && (
              <label className="text-xs font-medium text-neutral-300 block">
                {renderInlineEditable(props.label, "label", "font-medium", "span", "Select")}
              </label>
            )}
            <div className="flex items-center justify-between px-3 py-2 text-xs rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-200">
              <span>{props.options?.[0] || "Select option..."}</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </div>
          </div>
        )}

        {type === "Slider" && (
          <div className="space-y-2 py-1 text-left">
            <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
              <span>Quantity / Units</span>
              <span className="font-mono text-blue-400 font-semibold">{sliderVal}</span>
            </div>
            <input
              type="range"
              aria-label="Slider control"
              min={props.min ?? 1}
              max={props.max ?? 100}
              value={sliderVal}
              onChange={(e) => setSliderVal(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-neutral-800 rounded-lg"
            />
          </div>
        )}

        {type === "Toggle" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTogglePressed(!togglePressed);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${togglePressed
                ? "bg-neutral-800 border-neutral-700 text-white"
                : "border-neutral-800/80 text-neutral-400 hover:text-neutral-200"
              }`}
          >
            {renderInlineEditable(props.label || "Toggle State", "label", "", "span", "Toggle State")}
          </button>
        )}

        {type === "ToggleGroup" && (
          <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-950 p-0.5">
            {(props.options || ["Small", "Medium", "Large"]).map((opt: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setToggleGroupIdx(i);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${toggleGroupIdx === i
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-400 hover:text-neutral-200"
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {type === "Calendar" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/90 text-neutral-200 max-w-65 text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800/60 font-medium">
              <span>October 2026</span>
              <div className="flex gap-1">
                <button aria-label="Previous month" className="p-1 hover:bg-neutral-800 rounded"><ChevronDown className="w-3 h-3 rotate-90" /></button>
                <button aria-label="Next month" className="p-1 hover:bg-neutral-800 rounded"><ChevronDown className="w-3 h-3 -rotate-90" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] text-neutral-500 mb-1">
              <span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[11px]">
              {Array.from({ length: 31 }).map((_, i) => (
                <span
                  key={i}
                  className={`py-1 rounded ${i + 1 === 15
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-neutral-800 text-neutral-300"
                    }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        )}

        {type === "DatePicker" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-neutral-300">
            <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
            <span>{props.placeholder || "Pick delivery date..."}</span>
          </div>
        )}

        {type === "Attachment" && (
          <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-800 bg-neutral-950/80 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div className="min-w-0 truncate">
                <div className="text-xs font-medium text-neutral-200 truncate">
                  {renderInlineEditable(props.fileName || "proof_of_payment.pdf", "fileName", "", "span", "filename.pdf")}
                </div>
                <div className="text-[10px] text-neutral-400">
                  {renderInlineEditable(props.fileSize || "1.4 MB", "fileSize", "", "span", "1.4 MB")} • Verified
                </div>
              </div>
            </div>
            <button aria-label="Remove attachment" className="p-1 text-neutral-400 hover:text-red-400 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. TYPOGRAPHY & PRIMITIVES                                   */}
        {/* ============================================================ */}
        {type === "Typography" && (
          <div className="text-left w-full">
            {props.variant === "h1" && (
              renderInlineEditable(
                props.text || "Heading Level 1",
                "text",
                "text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white block leading-tight",
                "h1",
                "Heading Level 1",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
            {(!props.variant || props.variant === "h2") && (
              renderInlineEditable(
                props.text || "Heading Level 2",
                "text",
                "text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white block",
                "h2",
                "Heading Level 2",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
            {props.variant === "h3" && (
              renderInlineEditable(
                props.text || "Heading Level 3",
                "text",
                "text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white block",
                "h3",
                "Heading Level 3",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
            {props.variant === "h4" && (
              renderInlineEditable(
                props.text || "Heading Level 4",
                "text",
                "text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white block",
                "h4",
                "Heading Level 4",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
            {props.variant === "p" && (
              renderInlineEditable(
                props.text || "Paragraph typography text.",
                "text",
                "text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed block",
                "p",
                "Paragraph text...",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
            {props.variant === "lead" && (
              renderInlineEditable(
                props.text || "Lead narrative paragraph highlighting key product values.",
                "text",
                "text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed block",
                "p",
                "Lead narrative paragraph...",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
            {props.variant === "code" && (
              renderInlineEditable(
                props.text || "npm i @shadcn/ui",
                "text",
                "px-2 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-xs text-blue-300 inline-block",
                "code",
                "code snippet",
                elementStyles.textColor ? { color: elementStyles.textColor } : undefined
              )
            )}
          </div>
        )}

        {type === "Badge" && (
          <span
            style={{
              ...(elementStyles.backgroundColor ? { backgroundColor: elementStyles.backgroundColor } : {}),
              ...(elementStyles.textColor ? { color: elementStyles.textColor } : {}),
              ...(elementStyles.borderColor ? { borderColor: elementStyles.borderColor } : {}),
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${elementStyles.backgroundColor ? '' : (
                props.variant === "success"
                  ? "bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-300"
                  : props.variant === "warning"
                    ? "bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-300"
                    : props.variant === "destructive"
                      ? "bg-red-100 border-red-300 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-300"
                      : props.variant === "secondary"
                        ? "bg-slate-100 border-slate-300 text-slate-800 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
                        : "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-300"
              )
              }`}
          >
            {props.icon && (
              <DynamicIcon name={props.icon} className="w-3 h-3 shrink-0" />
            )}
            {renderInlineEditable(
              props.label || props.text || "Badge Label",
              props.text ? "text" : "label",
              "",
              "span",
              "Badge Label",
              elementStyles.textColor ? { color: elementStyles.textColor } : undefined
            )}
          </span>
        )}

        {type === "Avatar" && (
          <div className="w-full flex items-center justify-center">
            {props.src ? (
              <img
                src={props.src}
                alt={props.alt || "Avatar"}
                className="w-full max-h-72 object-cover rounded-2xl shadow-md border border-slate-200 dark:border-neutral-800"
              />
            ) : (
              <div className="inline-flex items-center gap-2.5">
                <div className="w-12 h-12 rounded-full bg-linear-to-tr from-blue-600 to-indigo-500 border border-neutral-700 flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0">
                  {renderInlineEditable(props.initials || "VS", "initials", "font-bold", "span", "VS")}
                </div>
                {props.name && (
                  <span className="text-xs font-semibold text-slate-800 dark:text-neutral-200">
                    {renderInlineEditable(props.name, "name", "font-semibold", "span", "Brand Name")}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {type === "Kbd" && (
          <div className="inline-flex items-center gap-1">
            {(props.keys || ["⌘", "K"]).map((k: string, i: number) => (
              <kbd
                key={i}
                className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-neutral-900 border border-neutral-700 text-neutral-300 shadow-sm"
              >
                {k}
              </kbd>
            ))}
          </div>
        )}

        {type === "Label" && (
          <label
            style={{
              ...(elementStyles.textColor ? { color: elementStyles.textColor } : {}),
            }}
            className="text-xs font-medium text-slate-600 dark:text-neutral-300 flex items-center gap-1 text-left"
          >
            {renderInlineEditable(
              props.text || props.label || "Form Label",
              props.text ? "text" : "label",
              "font-medium",
              "span",
              "Form Label",
              elementStyles.textColor ? { color: elementStyles.textColor } : undefined
            )}
            {props.required && <span className="text-red-400 font-bold">*</span>}
          </label>
        )}

        {type === "Marker" && (
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900/90 border border-neutral-800 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-neutral-200">
              {renderInlineEditable(props.text || "Live Inventory", "text", "", "span", "Live Inventory")}
            </span>
          </div>
        )}

        {type === "Direction" && (
          <div className="inline-flex items-center gap-1 p-0.5 rounded-lg border border-neutral-800 bg-neutral-950 text-xs font-mono">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDirectionMode("ltr");
              }}
              className={`px-2 py-0.5 rounded ${directionMode === "ltr" ? "bg-neutral-800 text-white font-bold" : "text-neutral-400"
                }`}
            >
              LTR
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDirectionMode("rtl");
              }}
              className={`px-2 py-0.5 rounded ${directionMode === "rtl" ? "bg-neutral-800 text-white font-bold" : "text-neutral-400"
                }`}
            >
              RTL
            </button>
          </div>
        )}

        {type === "Separator" && (
          <div className="w-full my-2 border-t border-neutral-800/80" />
        )}

        {/* ============================================================ */}
        {/* 4. NAVIGATION                                                */}
        {/* ============================================================ */}
        {type === "NavigationMenu" && (
          <nav className="flex items-center gap-4 text-xs font-medium text-neutral-300">
            {(props.links || ["Overview", "Specs", "FAQ"]).map((l: string, i: number) => (
              <span key={i} className="hover:text-white cursor-pointer transition-colors">
                {l}
              </span>
            ))}
          </nav>
        )}

        {type === "Menubar" && (
          <div className="flex items-center gap-1 p-1 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-neutral-300">
            {(props.menus || ["File", "Edit", "View"]).map((m: string, i: number) => (
              <span key={i} className="px-2.5 py-1 rounded hover:bg-neutral-900 cursor-pointer">
                {m}
              </span>
            ))}
          </div>
        )}

        {type === "Breadcrumb" && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            {(props.items || ["Home", "Products", "Checkout"]).map((item: string, i: number, arr: string[]) => (
              <React.Fragment key={i}>
                <span className={i === arr.length - 1 ? "text-white font-medium" : "hover:text-neutral-200"}>
                  {item}
                </span>
                {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-neutral-600" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {type === "Tabs" && (
          <div className="w-full space-y-3">
            <div className="flex border-b border-neutral-800 gap-4 text-xs font-medium">
              {(props.tabs || ["Tab 1", "Tab 2"]).map((t: string, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(i);
                  }}
                  className={`pb-2 border-b-2 transition-colors ${activeTab === i
                      ? "border-blue-500 text-white font-semibold"
                      : "border-transparent text-neutral-400 hover:text-neutral-200"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-3 rounded-lg bg-neutral-950/60 border border-neutral-800/60 text-xs text-neutral-300 text-left">
              Active view: <span className="text-white font-semibold">{props.tabs?.[activeTab] || "Tab 1"}</span> content panel.
            </div>
          </div>
        )}

        {type === "Pagination" && (
          <div className="flex items-center justify-center gap-1 text-xs">
            <button className="px-2 py-1 rounded border border-neutral-800 text-neutral-400 hover:text-white">
              Prev
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-7 h-7 rounded border font-medium ${p === 1
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-neutral-800 text-neutral-400 hover:bg-neutral-900"
                  }`}
              >
                {p}
              </button>
            ))}
            <button className="px-2 py-1 rounded border border-neutral-800 text-neutral-400 hover:text-white">
              Next
            </button>
          </div>
        )}

        {type === "Sidebar" && (
          <div className="w-48 p-2 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Navigation Rail
            </div>
            {(props.items || ["Dashboard", "Orders", "Products"]).map((item: string, i: number) => (
              <div
                key={i}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${i === 1 ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                  }`}
              >
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {type === "Item" && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950/80 hover:bg-neutral-900/50 transition-all text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
                <DynamicIcon
                  name={props.icon || "Truck"}
                  className="w-4 h-4"
                  fallback={<Truck className="w-4 h-4" />}
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">
                  {renderInlineEditable(props.title || "Express Delivery", "title", "", "span", "Express Delivery")}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {renderInlineEditable(props.subtitle || "Dispatched within 2 hours", "subtitle", "", "span", "Delivery note")}
                </div>
              </div>
            </div>
            {props.badge && (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
                {renderInlineEditable(props.badge, "badge", "", "span", "Badge")}
              </span>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. FEEDBACK, DATA & CHAT                                     */}
        {/* ============================================================ */}
        {type === "Alert" && (
          <div
            style={{
              ...(elementStyles.backgroundColor ? { backgroundColor: elementStyles.backgroundColor } : {}),
              ...(elementStyles.textColor ? { color: elementStyles.textColor } : {}),
              ...(elementStyles.borderColor ? { borderColor: elementStyles.borderColor } : {}),
            }}
            className={`p-3 rounded-xl border flex items-start gap-3 text-left ${elementStyles.backgroundColor ? '' : (
                props.variant === "destructive"
                  ? "bg-red-950/30 border-red-900/60 text-red-200"
                  : "bg-blue-950/30 border-blue-900/60 text-blue-200"
              )
              }`}
          >
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
            <div className="flex-1">
              <div className="text-xs font-semibold text-white">
                {renderInlineEditable(props.title || "Notice", "title", "font-semibold", "span", "Notice Title")}
              </div>
              <div className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                {renderInlineEditable(props.message || "Alert message text.", "message", "", "span", "Alert message...")}
              </div>
            </div>
          </div>
        )}

        {type === "Message" && (
          <div className="flex items-start justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left">
            <div className="flex items-start gap-2.5 flex-1">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                A
              </div>
              <div className="flex-1">
                <span className="text-[11px] font-bold text-blue-400">
                  {renderInlineEditable(props.author || "Concierge", "author", "font-bold", "span", "Author")}
                </span>
                <p className="text-xs text-neutral-200 mt-0.5 leading-relaxed">
                  {renderInlineEditable(props.message || "Direct message content.", "message", "", "span", "Message...")}
                </p>
              </div>
            </div>
            <button aria-label="Dismiss message" className="text-neutral-500 hover:text-neutral-300">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {type === "Bubble" && (
          <div className="flex items-end gap-2 text-left">
            <div className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-300 shrink-0">
              SL
            </div>
            <div className="max-w-[80%] p-2.5 rounded-2xl rounded-bl-sm bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs">
              <div className="text-[10px] font-semibold text-neutral-400 mb-0.5">
                {props.author || "Support Lead"} • {props.time || "10:42 AM"}
              </div>
              <p>{renderInlineEditable(props.message || "Hello!", "message", "", "span", "Type message...")}</p>
            </div>
          </div>
        )}

        {type === "MessageScroller" && (
          <div className="w-full max-h-48 overflow-y-auto p-3 rounded-xl border border-neutral-800 bg-neutral-950 space-y-2 text-left">
            {(props.messages || [
              { author: "Courier", text: "Package dispatched.", time: "10:00 AM", isIncoming: true },
              { author: "You", text: "Received resi tracking.", time: "10:05 AM", isIncoming: false },
            ]).map((msg: any, i: number) => (
              <div
                key={i}
                className={`flex flex-col ${msg.isIncoming ? "items-start" : "items-end"}`}
              >
                <div
                  className={`px-3 py-1.5 rounded-xl text-xs max-w-[85%] ${msg.isIncoming
                      ? "bg-neutral-900 border border-neutral-800 text-neutral-200"
                      : "bg-blue-600 text-white"
                    }`}
                >
                  <div className="text-[9px] opacity-70 mb-0.5">{msg.author} • {msg.time}</div>
                  <div>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {type === "QuestionnaireNew" && (
          <div className="w-full p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-3">
            <div className="text-xs font-semibold text-white">
              {renderInlineEditable(props.question || "Which switch type do you prefer?", "question", "font-semibold", "span", "Survey question...")}
            </div>
            <div className="space-y-2">
              {(props.options || [
                { label: "Linear Silent (Alpaca V2)", tag: "Quiet Office" },
                { label: "Tactile Holy Panda", tag: "Crisp Bump" },
              ]).map((opt: any, i: number) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuestionnaireIdx(i);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-medium transition-all ${questionnaireIdx === i
                      ? "border-blue-500 bg-blue-950/30 text-white"
                      : "border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900 text-neutral-300"
                    }`}
                >
                  <span>{opt.label}</span>
                  {opt.tag && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {opt.tag}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {type === "Accordion" && (
          <div className="border border-neutral-800 rounded-xl overflow-hidden text-left bg-neutral-950/80">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setAccordionOpen(!accordionOpen);
              }}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-neutral-900/60"
            >
              <span className="text-xs font-semibold text-white">
                {props.items?.[0]?.q || "Frequently Asked Question"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-neutral-400 transition-transform ${accordionOpen ? "rotate-180" : ""
                  }`}
              />
            </div>
            {accordionOpen && (
              <div className="px-3 pb-3 pt-1 text-xs text-neutral-400 border-t border-neutral-800/40 leading-relaxed">
                {props.items?.[0]?.a || "Detailed response provided here."}
              </div>
            )}
          </div>
        )}

        {type === "Collapsible" && (
          <div className="space-y-2 text-left">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCollapsibleOpen(!collapsibleOpen);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300"
            >
              <span>{props.triggerText || "View Technical Specs"}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsibleOpen ? "rotate-180" : ""}`} />
            </button>
            {collapsibleOpen && (
              <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-neutral-300 leading-relaxed">
                {props.contentText || "CNC Machined 6063 Anodized Aluminum with brass internal weight bar."}
              </div>
            )}
          </div>
        )}

        {type === "Progress" && (
          <div className="space-y-1.5 text-left">
            <div className="flex justify-between text-xs font-medium text-neutral-300">
              <span>{renderInlineEditable(props.label || "Allocation Progress", "label", "", "span", "Progress Label")}</span>
              <span className="font-mono text-blue-400 font-bold">{props.value || 78}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${props.value || 78}%` }}
              />
            </div>
          </div>
        )}

        {type === "Spinner" && (
          <div className="flex items-center justify-center p-3">
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {type === "Skeleton" && (
          <div className="space-y-2 py-1">
            <div className="h-4 bg-neutral-800/80 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-neutral-800/50 rounded animate-pulse w-full" />
            <div className="h-3 bg-neutral-800/50 rounded animate-pulse w-5/6" />
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. LAYOUT CONTAINERS & ADVANCED WIDGETS                      */}
        {/* ============================================================ */}
        {type === "Card" && (
          <div className="space-y-3 text-left w-full">
            {/* Optional Header title & description (only show if non-empty or if no children) */}
            {((props.title && props.title.trim()) || (props.description && props.description.trim()) || (!component.children || component.children.length === 0)) && (
              <div className="space-y-1">
                {(props.title && props.title.trim()) || (!component.children || component.children.length === 0) ? (
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {renderInlineEditable(props.title || "Card Title", "title", "font-semibold block", "span", "Card Title")}
                  </h3>
                ) : null}
                {(props.description && props.description.trim()) || (!component.children || component.children.length === 0) ? (
                  <p className="text-xs text-slate-500 dark:text-neutral-400">
                    {renderInlineEditable(props.description || "Card description content.", "description", "block", "span", "Card description...")}
                  </p>
                ) : null}
              </div>
            )}

            {/* Nested Stack Elements */}
            {component.children && component.children.length > 0 && (
              <div className="space-y-2.5 pt-1 w-full">
                {component.children.map((child, idx) => {
                  const isChildSelected = !isPreviewMode && selectedComponentId === child.id;
                  return (
                    <div
                      key={child.id || idx}
                      onClick={(e) => {
                        if (isPreviewMode) return;
                        e.stopPropagation();
                        if (onSelectChild) onSelectChild(child.id);
                        else if (onSelect) onSelect();
                      }}
                      className={`relative group/child transition-all rounded-lg ${
                        isChildSelected
                          ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-white dark:ring-offset-[#08090c]"
                          : "hover:ring-1 hover:ring-blue-400/50"
                      }`}
                    >
                      {/* Floating child action toolbar in builder mode */}
                      {!isPreviewMode && (
                        <div className="absolute -top-3 right-2 opacity-0 group-hover/child:opacity-100 transition-opacity z-30 flex items-center gap-0.5 bg-neutral-900 border border-neutral-700 rounded-md px-1 py-0.5 shadow-md text-[10px]">
                          <span className="text-[9px] font-mono text-blue-400 font-bold px-1 uppercase">
                            {child.type}
                          </span>
                          {idx > 0 && onMoveChild && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveChild(component.id, idx, idx - 1);
                              }}
                              className="p-0.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                              title="Move Up in Stack"
                            >
                              <ArrowUp className="w-2.5 h-2.5" />
                            </button>
                          )}
                          {idx < (component.children?.length || 0) - 1 && onMoveChild && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMoveChild(component.id, idx, idx + 1);
                              }}
                              className="p-0.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                              title="Move Down in Stack"
                            >
                              <ArrowDown className="w-2.5 h-2.5" />
                            </button>
                          )}
                          {onDeleteChild && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteChild(component.id, child.id);
                              }}
                              className="p-0.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800"
                              title="Remove from Stack"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Render Child Component */}
                      <ShadcnRenderer
                        component={child}
                        isSelected={isChildSelected}
                        selectedComponentId={selectedComponentId}
                        isPreviewMode={isPreviewMode}
                        onSelect={() => onSelectChild && onSelectChild(child.id)}
                        onSelectChild={onSelectChild}
                        onUpdateProps={(newProps) =>
                          onUpdateChildProps && onUpdateChildProps(child.id, newProps)
                        }
                        onDelete={() => onDeleteChild && onDeleteChild(component.id, child.id)}
                        onAddChild={onAddChild}
                        onMoveChild={onMoveChild}
                        onDeleteChild={onDeleteChild}
                        onUpdateChildProps={onUpdateChildProps}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            {/* In-Card Quick "+ Add to Stack" Button */}
            {!isPreviewMode && onAddChild && (
              <div className="pt-1">
                <CardAddElementMenu
                  onAddElement={(childType, defaultProps) =>
                    onAddChild(component.id, childType, defaultProps)
                  }
                />
              </div>
            )}
          </div>
        )}

        {type === "AspectRatio" && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
            <img
              src={props.imageUrl || "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"}
              alt="Aspect ratio preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono bg-black/75 text-white backdrop-blur">
              {props.ratio || "16:9"}
            </div>
          </div>
        )}

        {type === "Resizable" && (
          <div className="flex rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden text-xs text-left h-24">
            <div className="flex-1 p-3 bg-neutral-900/40 text-neutral-300">
              <span className="font-semibold text-white">{props.leftLabel || "Panel A"}</span>
              <p className="text-[10px] text-neutral-400 mt-1">Primary component area</p>
            </div>
            <div className="w-1.5 bg-neutral-800 hover:bg-blue-500 cursor-col-resize flex items-center justify-center">
              <div className="w-0.5 h-4 bg-neutral-600 rounded" />
            </div>
            <div className="flex-1 p-3 bg-neutral-900/60 text-neutral-300">
              <span className="font-semibold text-white">{props.rightLabel || "Panel B"}</span>
              <p className="text-[10px] text-neutral-400 mt-1">Secondary canvas area</p>
            </div>
          </div>
        )}

        {type === "ScrollArea" && (
          <div className="h-28 overflow-y-auto p-2.5 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-300 space-y-2 text-left">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-1.5 rounded bg-neutral-900/60 border border-neutral-800/40">
                Scroll item #{i + 1} • High-velocity log
              </div>
            ))}
          </div>
        )}

        {type === "Empty" && (
          <div className="p-6 rounded-xl border border-dashed border-neutral-800 bg-neutral-950/40 text-center space-y-2">
            <Inbox className="w-6 h-6 mx-auto text-neutral-500" />
            <div className="text-xs font-semibold text-neutral-300">
              {renderInlineEditable(props.title || "No Items Found", "title", "font-semibold", "span", "Empty Title")}
            </div>
            <p className="text-[11px] text-neutral-400">
              {renderInlineEditable(props.description || "Add components to populate this area.", "description", "", "span", "Description...")}
            </p>
          </div>
        )}

        {type === "Table" && (
          <div className="overflow-x-auto rounded-xl border border-neutral-800 text-xs text-left">
            <table className="w-full">
              <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400 font-mono text-[10px]">
                <tr>
                  {(props.headers || ["Order", "Customer", "Amount", "Status"]).map((h: string, i: number) => (
                    <th key={i} className="p-2.5">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {(props.rows || [
                  ["#98214", "Budi Santoso", "Rp 1.450.000", "Settled"],
                  ["#98215", "Dewi Lestari", "Rp 2.900.000", "Settled"],
                ]).map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-neutral-900/40">
                    {row.map((cell: any, j: number) => (
                      <td key={j} className="p-2.5 font-mono text-[11px]">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {type === "DataTable" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-white">{props.title || "Shipments Table"}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-900">
                2 Active
              </span>
            </div>
            <div className="h-14 rounded-lg bg-neutral-900/40 border border-neutral-800/60 flex items-center justify-center text-xs text-neutral-400">
              Interactive table with sorting & filtering enabled
            </div>
          </div>
        )}

        {type === "Carousel" && (
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 text-left">
            <div className="p-4 space-y-1">
              <div className="text-xs font-semibold text-white">
                {props.slides?.[carouselSlide]?.title || "Showcase Slide"}
              </div>
              <div className="text-[11px] text-neutral-400">Interactive hardware gallery preview</div>
            </div>
            <div className="flex justify-between items-center px-4 py-2 bg-neutral-900/60 border-t border-neutral-800/60 text-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselSlide(Math.max(0, carouselSlide - 1));
                }}
                className="text-neutral-400 hover:text-white"
              >
                Prev
              </button>
              <span className="font-mono text-[10px] text-neutral-500">
                {carouselSlide + 1} / {props.slides?.length || 2}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCarouselSlide(Math.min((props.slides?.length || 2) - 1, carouselSlide + 1));
                }}
                className="text-neutral-400 hover:text-white"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {type === "Chart" && (
          <div className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-white">
                {renderInlineEditable(props.title || "Weekly Conversions", "title", "", "span", "Chart Title")}
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                {props.trend || "+24.5%"}
              </span>
            </div>
            <div className="flex items-end gap-1.5 h-16 pt-2">
              {[40, 65, 50, 85, 95, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-neutral-900 rounded-t flex flex-col justify-end h-full">
                  <div
                    className="bg-blue-600 rounded-t hover:bg-blue-500 transition-all"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. OVERLAYS & MODALS                                         */}
        {/* ============================================================ */}
        {type === "Dialog" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-2">
            <div className="text-xs font-semibold text-white">{props.title || "Payment Confirmation"}</div>
            <p className="text-[11px] text-neutral-400">{props.description || "Proceed to checkout."}</p>
            <button className="px-3 py-1 text-xs rounded bg-blue-600 text-white font-medium">
              {props.triggerText || "Open Dialog"}
            </button>
          </div>
        )}

        {type === "AlertDialog" && (
          <div className="p-3 rounded-xl border border-red-900/50 bg-neutral-950 text-left space-y-2">
            <div className="flex items-center gap-1.5 text-red-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{props.title || "Are you sure?"}</span>
            </div>
            <p className="text-[11px] text-neutral-400">{props.description || "Action cannot be undone."}</p>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs rounded bg-neutral-800 text-neutral-300">Cancel</button>
              <button className="px-2 py-1 text-xs rounded bg-red-600 text-white font-medium">Confirm</button>
            </div>
          </div>
        )}

        {type === "Sheet" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-1">
            <div className="text-xs font-semibold text-white">{props.title || "Shopping Cart Drawer"}</div>
            <p className="text-[11px] text-neutral-400">Right-side slide drawer panel.</p>
          </div>
        )}

        {type === "Drawer" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-1">
            <div className="text-xs font-semibold text-white">{props.title || "Mobile Drawer"}</div>
            <p className="text-[11px] text-neutral-400">Bottom sliding sheet view.</p>
          </div>
        )}

        {type === "Popover" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-1">
            <div className="text-xs font-semibold text-white">{props.title || "Popover Card"}</div>
            <p className="text-[11px] text-neutral-400">Anchored floating overlay.</p>
          </div>
        )}

        {type === "Tooltip" && (
          <div className="inline-flex items-center gap-2 p-1.5 rounded-lg border border-neutral-800 bg-neutral-950 text-xs">
            <span className="text-neutral-400">{props.triggerText || "Hover Icon"}</span>
            <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-mono text-blue-300">
              {props.text || "Tooltip Info"}
            </span>
          </div>
        )}

        {type === "HoverCard" && (
          <div className="p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                V
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{props.name || "Vanguard Studio"}</div>
                <div className="text-[10px] text-neutral-500">{props.handle || "@vanguard"}</div>
              </div>
            </div>
            <p className="text-[11px] text-neutral-400 leading-tight">{props.desc || "Precision hardware lab."}</p>
          </div>
        )}

        {type === "DropdownMenu" && (
          <div className="w-44 p-1.5 rounded-xl border border-neutral-800 bg-neutral-950 text-left text-xs space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-500 font-bold">Actions</div>
            {(props.items || ["Download PDF", "Track Resi"]).map((item: string, i: number) => (
              <div key={i} className="px-2 py-1 rounded hover:bg-neutral-900 text-neutral-300 cursor-pointer">
                {item}
              </div>
            ))}
          </div>
        )}

        {type === "ContextMenu" && (
          <div className="w-40 p-1.5 rounded-xl border border-neutral-800 bg-neutral-950 text-left text-xs space-y-0.5 shadow-lg">
            {(props.items || ["Inspect Element", "Copy Link"]).map((item: string, i: number) => (
              <div key={i} className="px-2 py-1 rounded hover:bg-blue-600 hover:text-white text-neutral-300 cursor-pointer">
                {item}
              </div>
            ))}
          </div>
        )}

        {type === "Command" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-400">
            <CommandIcon className="w-3.5 h-3.5" />
            <span className="flex-1">{props.placeholder || "Search funnels or actions..."}</span>
            <kbd className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
              ⌘K
            </kbd>
          </div>
        )}

        {type === "Combobox" && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-neutral-800 bg-neutral-950 text-xs text-neutral-300">
            <span>{props.placeholder || "Select destination city..."}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        )}

        {type === "Toast" && (
          <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-800 bg-neutral-950 text-left shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-white">
                  {renderInlineEditable(props.title || "Transaction Settled", "title", "font-semibold", "span", "Toast Title")}
                </div>
                <div className="text-[11px] text-neutral-400">
                  {renderInlineEditable(props.description || "Order confirmed.", "description", "", "span", "Description")}
                </div>
              </div>
            </div>
            <button aria-label="Dismiss toast" className="text-neutral-500 hover:text-neutral-300 ml-2">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CardAddElementMenu({
  onAddElement,
}: {
  onAddElement: (type: ShadcnComponentType, defaultProps: Record<string, any>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const availableElements: Array<{
    type: ShadcnComponentType;
    label: string;
    icon: any;
    defaultProps: Record<string, any>;
  }> = [
    { type: 'Typography', label: 'Typography Text', icon: TypeIcon, defaultProps: { variant: 'h4', text: 'Card Section Heading' } },
    { type: 'Label', label: 'Label / Description', icon: FileText, defaultProps: { text: 'Description text inside card.' } },
    { type: 'Button', label: 'Action Button', icon: ArrowRight, defaultProps: { label: 'Click Action', variant: 'default' } },
    { type: 'Badge', label: 'Badge Pill', icon: Tag, defaultProps: { label: 'Special Offer', variant: 'success' } },
    { type: 'Input', label: 'Text Input', icon: Sliders, defaultProps: { placeholder: 'Enter email...' } },
    { type: 'Field', label: 'Form Field', icon: Check, defaultProps: { label: 'Customer Full Name', placeholder: 'e.g. Budi Santoso' } },
    { type: 'Separator', label: 'Divider Line', icon: Split, defaultProps: {} },
    { type: 'Avatar', label: 'Avatar Profile', icon: User, defaultProps: { name: 'Customer Review', initials: 'CR' } },
    { type: 'Switch', label: 'Switch Toggle', icon: Radio, defaultProps: { label: 'Enable Notification' } },
    { type: 'Checkbox', label: 'Checkbox', icon: Check, defaultProps: { label: 'I accept terms and conditions' } },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full py-1.5 px-3 rounded-lg border border-dashed border-slate-300 dark:border-neutral-800 hover:border-blue-500/80 bg-slate-50/50 dark:bg-neutral-900/40 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 text-slate-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
      >
        <Plus className="w-3 h-3" />
        <span>Add Element to Card Stack</span>
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 p-2 rounded-xl bg-white dark:bg-[#0c0d14] border border-slate-200 dark:border-neutral-800 shadow-2xl grid grid-cols-2 gap-1 animate-in fade-in duration-100"
        >
          {availableElements.map((el) => {
            const IconComp = el.icon;
            return (
              <button
                key={el.type}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddElement(el.type, el.defaultProps);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg text-left text-xs hover:bg-slate-100 dark:hover:bg-neutral-900 text-slate-700 dark:text-neutral-200 transition-colors"
              >
                <div className="w-5 h-5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <IconComp className="w-3 h-3" />
                </div>
                <span className="truncate text-[11px] font-medium">{el.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
