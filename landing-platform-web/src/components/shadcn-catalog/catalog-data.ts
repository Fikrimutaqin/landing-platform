import { ShadcnComponentType } from '../../../../shared/types';

export interface CatalogItem {
  type: ShadcnComponentType;
  title: string;
  category: 'Layout' | 'Typography' | 'Forms & Inputs' | 'Navigation' | 'Feedback & Data' | 'Overlays';
  description: string;
  defaultProps: Record<string, any>;
}

export const SHADCN_CATALOG: CatalogItem[] = [
  {
    "type": "Card",
    "title": "Card",
    "category": "Layout",
    "description": "Structured container with header, title, content and subtle border.",
    "defaultProps": {
      "title": "Card Title",
      "description": "Card description and details."
    }
  },
  {
    "type": "Separator",
    "title": "Separator",
    "category": "Layout",
    "description": "Visual divider line between elements.",
    "defaultProps": {
      "orientation": "horizontal"
    }
  },
  {
    "type": "AspectRatio",
    "title": "Aspect Ratio",
    "category": "Layout",
    "description": "Maintains fixed aspect ratio for media and banners (16:9, 4:3, 1:1).",
    "defaultProps": {
      "ratio": "16:9",
      "imageUrl": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1200&q=80"
    }
  },
  {
    "type": "ScrollArea",
    "title": "Scroll Area",
    "category": "Layout",
    "description": "Custom styled scrollable view with hidden native scrollbars.",
    "defaultProps": {
      "height": 160
    }
  },
  {
    "type": "Resizable",
    "title": "Resizable",
    "category": "Layout",
    "description": "Resizable split panels with a draggable resize divider handle.",
    "defaultProps": {
      "leftLabel": "Navigation Pane",
      "rightLabel": "Editor Canvas",
      "ratio": "50:50"
    }
  },
  {
    "type": "Empty",
    "title": "Empty",
    "category": "Layout",
    "description": "Empty state placeholder with icon, message and call-to-action.",
    "defaultProps": {
      "title": "No Items Found",
      "description": "Add your first product to get started."
    }
  },
  {
    "type": "Typography",
    "title": "Typography",
    "category": "Typography",
    "description": "Headings (H1-H4), Lead, Paragraph, Blockquote, and Inline Code.",
    "defaultProps": {
      "variant": "h2",
      "text": "Crafted with Uncompromising Precision"
    }
  },
  {
    "type": "Badge",
    "title": "Badge",
    "category": "Typography",
    "description": "Small status indicator pill (default, secondary, outline, destructive).",
    "defaultProps": {
      "label": "Verified Merchant",
      "variant": "default"
    }
  },
  {
    "type": "Avatar",
    "title": "Avatar",
    "category": "Typography",
    "description": "User or merchant profile image with fallback initials and status ring.",
    "defaultProps": {
      "name": "Studio Apex",
      "initials": "SA"
    }
  },
  {
    "type": "Kbd",
    "title": "Kbd",
    "category": "Typography",
    "description": "Keyboard shortcut badge indicator (e.g., ⌘K, Shift+S).",
    "defaultProps": {
      "keys": [
        "⌘",
        "K"
      ]
    }
  },
  {
    "type": "Label",
    "title": "Label",
    "category": "Typography",
    "description": "Accessible form field title label with optional required indicator.",
    "defaultProps": {
      "text": "Direct Shipping Address",
      "required": true
    }
  },
  {
    "type": "Marker",
    "title": "Marker",
    "category": "Typography",
    "description": "Pulsing live status beacon indicator dot with animated ping effect.",
    "defaultProps": {
      "text": "Live Inventory Drop",
      "color": "emerald"
    }
  },
  {
    "type": "Direction",
    "title": "Direction",
    "category": "Typography",
    "description": "Text and layout direction switcher (LTR / RTL toggle pill).",
    "defaultProps": {
      "direction": "ltr"
    }
  },
  {
    "type": "Button",
    "title": "Button",
    "category": "Forms & Inputs",
    "description": "Interactive button trigger (primary, secondary, outline, ghost, link).",
    "defaultProps": {
      "label": "Proceed to Checkout",
      "variant": "default"
    }
  },
  {
    "type": "ButtonGroup",
    "title": "Button Group",
    "category": "Forms & Inputs",
    "description": "Segmented button control for switching options or views.",
    "defaultProps": {
      "options": [
        "Standard",
        "Express",
        "Overnight"
      ]
    }
  },
  {
    "type": "Field",
    "title": "Field",
    "category": "Forms & Inputs",
    "description": "Complete form field unit: Label + Input + Hint + Validation feedback.",
    "defaultProps": {
      "label": "Company VAT / Tax ID",
      "placeholder": "e.g. ID-998234-X",
      "helperText": "Used for verified commercial invoice",
      "required": true
    }
  },
  {
    "type": "Input",
    "title": "Input",
    "category": "Forms & Inputs",
    "description": "Text, email, number or tel input field.",
    "defaultProps": {
      "placeholder": "Enter your email address...",
      "inputType": "text"
    }
  },
  {
    "type": "InputGroup",
    "title": "Input Group",
    "category": "Forms & Inputs",
    "description": "Input with prepended/appended icons, currency symbols, or action buttons.",
    "defaultProps": {
      "prefix": "Rp",
      "placeholder": "1,450,000",
      "actionLabel": "Apply"
    }
  },
  {
    "type": "InputOTP",
    "title": "Input OTP",
    "category": "Forms & Inputs",
    "description": "Split one-time password / PIN code verification input cells.",
    "defaultProps": {
      "length": 6
    }
  },
  {
    "type": "Textarea",
    "title": "Textarea",
    "category": "Forms & Inputs",
    "description": "Multi-line text input for courier notes or custom specifications.",
    "defaultProps": {
      "placeholder": "Delivery instructions, apartment code, or gate details..."
    }
  },
  {
    "type": "Checkbox",
    "title": "Checkbox",
    "category": "Forms & Inputs",
    "description": "Toggle selection checkbox with label and sub-description.",
    "defaultProps": {
      "label": "Include Expedited Shipping Insurance (Rp 15.000)",
      "checked": true
    }
  },
  {
    "type": "Switch",
    "title": "Switch",
    "category": "Forms & Inputs",
    "description": "Modern toggle switch for enabling instant WhatsApp updates.",
    "defaultProps": {
      "label": "Real-time Order Updates via WhatsApp",
      "checked": true
    }
  },
  {
    "type": "RadioGroup",
    "title": "Radio Group",
    "category": "Forms & Inputs",
    "description": "Single-choice radio list for courier or variant selection.",
    "defaultProps": {
      "options": [
        {
          "label": "BCA Virtual Account",
          "desc": "Instant automated 24/7 confirmation"
        },
        {
          "label": "QRIS Instant",
          "desc": "All e-wallets and mobile banking"
        },
        {
          "label": "Mandiri Virtual Account",
          "desc": "Direct clearing"
        }
      ]
    }
  },
  {
    "type": "Select",
    "title": "Select",
    "category": "Forms & Inputs",
    "description": "Dropdown selector for courier options and destination provinces.",
    "defaultProps": {
      "label": "Delivery Courier",
      "options": [
        "JNE Express (1-2 Days)",
        "SiCepat REG (2-3 Days)",
        "J&T Cargo (3-5 Days)"
      ]
    }
  },
  {
    "type": "NativeSelect",
    "title": "Native Select",
    "category": "Forms & Inputs",
    "description": "Clean styled native select dropdown optimized for mobile device keyboards.",
    "defaultProps": {
      "label": "Payment Method",
      "options": [
        "QRIS Instant (GoPay / OVO / Dana)",
        "BCA Virtual Account",
        "Mandiri Virtual Account",
        "Credit Card (Visa / Mastercard)"
      ]
    }
  },
  {
    "type": "Slider",
    "title": "Slider",
    "category": "Forms & Inputs",
    "description": "Interactive numerical slider for quantity or donation amounts.",
    "defaultProps": {
      "min": 1,
      "max": 10,
      "step": 1,
      "defaultValue": 1
    }
  },
  {
    "type": "Toggle",
    "title": "Toggle",
    "category": "Forms & Inputs",
    "description": "Two-state toggle button for quick filter activation.",
    "defaultProps": {
      "label": "Dark Mode Preview",
      "pressed": true
    }
  },
  {
    "type": "ToggleGroup",
    "title": "Toggle Group",
    "category": "Forms & Inputs",
    "description": "Multi-item toggle group for selecting size, format, or layout.",
    "defaultProps": {
      "options": [
        "Small",
        "Medium",
        "Large"
      ]
    }
  },
  {
    "type": "Calendar",
    "title": "Calendar",
    "category": "Forms & Inputs",
    "description": "Interactive date picker calendar grid with month navigation.",
    "defaultProps": {
      "selectedDate": "2026-10-15"
    }
  },
  {
    "type": "DatePicker",
    "title": "Date Picker",
    "category": "Forms & Inputs",
    "description": "Single-input trigger that expands into calendar popover.",
    "defaultProps": {
      "placeholder": "Pick preferred delivery date"
    }
  },
  {
    "type": "Attachment",
    "title": "Attachment",
    "category": "Forms & Inputs",
    "description": "File attachment upload card with progress indicator, file size and delete trigger.",
    "defaultProps": {
      "fileName": "payment_proof_receipt.pdf",
      "fileSize": "1.4 MB",
      "uploadProgress": 100
    }
  },
  {
    "type": "NavigationMenu",
    "title": "Navigation Menu",
    "category": "Navigation",
    "description": "Top-level responsive navigation menu with links and dropdowns.",
    "defaultProps": {
      "links": [
        "Overview",
        "Specifications",
        "Proof",
        "Checkout"
      ]
    }
  },
  {
    "type": "Menubar",
    "title": "Menubar",
    "category": "Navigation",
    "description": "Desktop-grade horizontal application menu bar.",
    "defaultProps": {
      "menus": [
        "File",
        "Edit",
        "View",
        "Help"
      ]
    }
  },
  {
    "type": "Breadcrumb",
    "title": "Breadcrumb",
    "category": "Navigation",
    "description": "Hierarchical trail showing location inside funnel.",
    "defaultProps": {
      "items": [
        "Home",
        "Hardware Store",
        "Series 04",
        "Checkout"
      ]
    }
  },
  {
    "type": "Tabs",
    "title": "Tabs",
    "category": "Navigation",
    "description": "Organize content into selectable panels.",
    "defaultProps": {
      "tabs": [
        "Overview",
        "Technical Specs",
        "Reviews",
        "Warranty"
      ]
    }
  },
  {
    "type": "Pagination",
    "title": "Pagination",
    "category": "Navigation",
    "description": "Clean page navigation controls with previous, numbers, next.",
    "defaultProps": {
      "currentPage": 1,
      "totalPages": 5
    }
  },
  {
    "type": "Sidebar",
    "title": "Sidebar",
    "category": "Navigation",
    "description": "Collapsible sidebar navigation rail with icons, titles, and active state.",
    "defaultProps": {
      "activeItem": "Orders",
      "items": [
        "Dashboard",
        "Orders",
        "Products",
        "Analytics",
        "Settings"
      ]
    }
  },
  {
    "type": "Item",
    "title": "Item",
    "category": "Navigation",
    "description": "Rich list or menu item row with icon, title, description, badge, and trailing arrow.",
    "defaultProps": {
      "title": "Priority Warehouse Express",
      "subtitle": "Dispatched within 2 hours",
      "badge": "Fastest",
      "icon": "Truck"
    }
  },
  {
    "type": "Alert",
    "title": "Alert",
    "category": "Feedback & Data",
    "description": "Informative notice callout banner (default, destructive, success).",
    "defaultProps": {
      "title": "Official Launch Notice",
      "message": "All orders qualify for direct zero-fee settlement.",
      "variant": "default"
    }
  },
  {
    "type": "Message",
    "title": "Message",
    "category": "Feedback & Data",
    "description": "Direct callout message notification banner with sender icon and dismiss button.",
    "defaultProps": {
      "author": "Apex Concierge",
      "message": "Your batch is currently in thermal testing before dispatch."
    }
  },
  {
    "type": "Bubble",
    "title": "Bubble",
    "category": "Feedback & Data",
    "description": "Chat or speech bubble with avatar, author name, timestamp, and message text.",
    "defaultProps": {
      "author": "Support Lead",
      "message": "Hello! We have reserved 1 unit of Batch 04 for your cart.",
      "time": "10:42 AM",
      "isIncoming": true
    }
  },
  {
    "type": "MessageScroller",
    "title": "Message Scroller",
    "category": "Feedback & Data",
    "description": "Scrollable chat / conversation thread scroller with auto-scroll and stream bubble list.",
    "defaultProps": {
      "messages": [
        {
          "author": "Courier Support",
          "text": "Package has cleared customs checkpoint.",
          "time": "09:15 AM",
          "isIncoming": true
        },
        {
          "author": "You",
          "text": "Understood, will be home to sign for receipt.",
          "time": "09:20 AM",
          "isIncoming": false
        },
        {
          "author": "Courier Support",
          "text": "Driver assigned: Ahmad (B 9821 TZX).",
          "time": "09:22 AM",
          "isIncoming": true
        }
      ]
    }
  },
  {
    "type": "QuestionnaireNew",
    "title": "QuestionnaireNew",
    "category": "Feedback & Data",
    "description": "Interactive multi-choice survey or questionnaire step card with selectable answers.",
    "defaultProps": {
      "question": "Which switch type do you prefer for your build?",
      "options": [
        {
          "label": "Linear Silent (Alpaca V2)",
          "tag": "Recommended for Office"
        },
        {
          "label": "Tactile Holy Panda",
          "tag": "Crisp Bump Feedback"
        },
        {
          "label": "Clicky Box Jade",
          "tag": "Acoustic Loud Clack"
        }
      ]
    }
  },
  {
    "type": "Accordion",
    "title": "Accordion",
    "category": "Feedback & Data",
    "description": "Expandable content panels for FAQs and details.",
    "defaultProps": {
      "items": [
        {
          "q": "How long does local express shipping take?",
          "a": "Orders placed before 15:00 WIB are dispatched the same day via JNE / SiCepat."
        },
        {
          "q": "What payment methods are supported?",
          "a": "Direct Bank Virtual Account (BCA, Mandiri, BNI, BRI), QRIS, and GoPay."
        }
      ]
    }
  },
  {
    "type": "Collapsible",
    "title": "Collapsible",
    "category": "Feedback & Data",
    "description": "Single expandable trigger and hidden panel.",
    "defaultProps": {
      "triggerText": "View Full Material Specifications",
      "contentText": "CNC Machined 6063 Anodized Aluminum with brass internal weight bar."
    }
  },
  {
    "type": "Progress",
    "title": "Progress",
    "category": "Feedback & Data",
    "description": "Numerical percentage progress bar.",
    "defaultProps": {
      "value": 78,
      "label": "Batch 04 Allocation"
    }
  },
  {
    "type": "Spinner",
    "title": "Spinner",
    "category": "Feedback & Data",
    "description": "Minimalist rotating loading spinner.",
    "defaultProps": {
      "size": "md"
    }
  },
  {
    "type": "Skeleton",
    "title": "Skeleton",
    "category": "Feedback & Data",
    "description": "Animated placeholder skeleton for loading states.",
    "defaultProps": {
      "lines": 3
    }
  },
  {
    "type": "Table",
    "title": "Table",
    "category": "Feedback & Data",
    "description": "Data table with header, rows, and borders.",
    "defaultProps": {
      "headers": [
        "Order ID",
        "Customer",
        "Method",
        "Amount",
        "Status"
      ],
      "rows": [
        [
          "#98214",
          "Budi Santoso",
          "QRIS",
          "Rp 1.450.000",
          "Settled"
        ],
        [
          "#98215",
          "Dewi Lestari",
          "BCA VA",
          "Rp 2.900.000",
          "Settled"
        ]
      ]
    }
  },
  {
    "type": "DataTable",
    "title": "Data Table",
    "category": "Feedback & Data",
    "description": "Rich interactive table with column sorting and status pills.",
    "defaultProps": {
      "title": "Order Shipments"
    }
  },
  {
    "type": "Carousel",
    "title": "Carousel",
    "category": "Feedback & Data",
    "description": "Multi-slide image or review showcase with left/right navigation.",
    "defaultProps": {
      "slides": [
        {
          "title": "Matte Black Anodized",
          "image": "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=800&q=80"
        },
        {
          "title": "Raw E-White Finish",
          "image": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
        }
      ]
    }
  },
  {
    "type": "Chart",
    "title": "Chart",
    "category": "Feedback & Data",
    "description": "Minimalist visual sparkline / conversion chart with growth trend.",
    "defaultProps": {
      "title": "Weekly Conversion Volume",
      "trend": "+24.5%"
    }
  },
  {
    "type": "Dialog",
    "title": "Dialog",
    "category": "Overlays",
    "description": "Modal dialog overlay requiring user attention or confirmation.",
    "defaultProps": {
      "triggerText": "Open Dialog",
      "title": "Payment Confirmation",
      "description": "Proceed to invoice gateway."
    }
  },
  {
    "type": "AlertDialog",
    "title": "Alert Dialog",
    "category": "Overlays",
    "description": "High-priority modal interrupt for destructive or irreversible actions.",
    "defaultProps": {
      "triggerText": "Cancel Order",
      "title": "Are you sure?",
      "description": "This action cannot be undone."
    }
  },
  {
    "type": "Sheet",
    "title": "Sheet",
    "category": "Overlays",
    "description": "Slide-over drawer panel anchored to edge (e.g. Shopping Bag cart).",
    "defaultProps": {
      "triggerText": "View Cart Drawer",
      "title": "Your Shopping Bag"
    }
  },
  {
    "type": "Drawer",
    "title": "Drawer",
    "category": "Overlays",
    "description": "Bottom sheet drawer common in mobile web experiences.",
    "defaultProps": {
      "triggerText": "Order Summary",
      "title": "Invoice #98214"
    }
  },
  {
    "type": "Popover",
    "title": "Popover",
    "category": "Overlays",
    "description": "Floating popover card with custom interactive content.",
    "defaultProps": {
      "triggerText": "Courier Info",
      "title": "Expedited Fulfillment"
    }
  },
  {
    "type": "Tooltip",
    "title": "Tooltip",
    "category": "Overlays",
    "description": "Subtle informational hover label for icons or buttons.",
    "defaultProps": {
      "text": "AES-256 Encrypted Settlement",
      "triggerText": "Bank Vault"
    }
  },
  {
    "type": "HoverCard",
    "title": "Hover Card",
    "category": "Overlays",
    "description": "Rich preview card displayed when hovering over an author or brand.",
    "defaultProps": {
      "name": "Vanguard Hardware Lab",
      "handle": "@vanguard_lab",
      "desc": "Precision hardware design studio based in Bandung & Jakarta."
    }
  },
  {
    "type": "DropdownMenu",
    "title": "Dropdown Menu",
    "category": "Overlays",
    "description": "Action menu listing actions like Edit, Duplicate, Archive.",
    "defaultProps": {
      "triggerText": "Actions Menu",
      "items": [
        "Download Invoice PDF",
        "Track Resi Courier",
        "Request Return"
      ]
    }
  },
  {
    "type": "ContextMenu",
    "title": "Context Menu",
    "category": "Overlays",
    "description": "Right-click or contextual menu mockup.",
    "defaultProps": {
      "triggerText": "Right-click Area",
      "items": [
        "Inspect Element",
        "Copy Link",
        "Save Image As"
      ]
    }
  },
  {
    "type": "Command",
    "title": "Command",
    "category": "Overlays",
    "description": "Command palette interface with search and shortcut triggers.",
    "defaultProps": {
      "placeholder": "Type a command or search funnels..."
    }
  },
  {
    "type": "Combobox",
    "title": "Combobox",
    "category": "Overlays",
    "description": "Searchable autocomplete dropdown for choosing provinces/cities.",
    "defaultProps": {
      "placeholder": "Select destination city...",
      "options": [
        "Jakarta Selatan",
        "Bandung",
        "Surabaya",
        "Medan"
      ]
    }
  },
  {
    "type": "Toast",
    "title": "Toast",
    "category": "Overlays",
    "description": "Temporary floating notification alert badge with automatic dismissal.",
    "defaultProps": {
      "title": "Transaction Settled",
      "description": "Order #98214 paid via QRIS."
    }
  }
];
