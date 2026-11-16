# SF Tech Store — Requirements and Test Cases

**Project:** Interactive Technology E-commerce Frontend  
**Developer:** Ko Kyi Phyu Aung  
**Contact:** kyiphyuaung@strategyfirst.edu.mm

## 1. Project overview

The project presents a collection of technology products through a multi-page e-commerce user interface. It supports product discovery, inspection, saved items, comparison, cart management and simulated checkout. The primary audience is an interested technology shopper using a desktop, tablet or mobile browser.

### Problem statement

Catalog-only interfaces often lack detailed visual exploration, clear filtering and a cohesive purchase journey. The proposed interface demonstrates how richer product media and user-centered interactions help customers evaluate alternatives.

### Aims and objectives

- Produce a professional, responsive technology storefront.
- Make product search and comparison straightforward.
- Demonstrate high-detail inspection with zoom and multi-angle/360° interaction.
- Model a working shopping cart and simulated checkout flow.
- Maintain consistent interaction patterns and accessible controls across pages.

### Scope boundaries

**Included:** Static frontend, 30 example products, generated product artwork, product details, client-side shopping functions, form validation, simulation-based checkout and order confirmation.

**Excluded:** Real merchant inventory, payment collection, courier fulfillment, server-side accounts, password login, real product reviews, customer database and production backend API.

**Constraints/assumptions:** A modern JavaScript-enabled browser is available. The project uses local browser storage and sample catalog data. The 360° viewer applies to three specified showcase products.

## 2. Functional requirements

| ID | Requirement | Acceptance criterion |
|---|---|---|
| FR-01 | Homepage navigation | User can open all main site areas from the header/footer. |
| FR-02 | Responsive menu | Mobile menu opens, exposes navigation links and can be closed. |
| FR-03 | Product catalog | Catalog lists all 30 example products with title, image, category and price. |
| FR-04 | Text search | Search filters products by title, category and descriptive keywords. |
| FR-05 | Category filters | User can select multiple catalog groups and remove/reset filters. |
| FR-06 | Price range | Products exceeding the selected price ceiling are hidden. |
| FR-07 | Sorting | User can sort by price and product name. |
| FR-08 | Product detail | Selecting a product opens its dedicated description and specifications. |
| FR-09 | Multi-angle gallery | All products provide alternate thumbnail-controlled product views. |
| FR-10 | 360° rotation | Three featured products allow drag/slider selection across 24 angle frames. |
| FR-11 | Zoom and pan | User can enlarge product media, zoom in/out and pan the enlarged image. |
| FR-12 | Cart add/update/remove | User can add items, change quantities and remove items. |
| FR-13 | Cart calculations | Item totals, subtotal, sample delivery charge and final total update correctly. |
| FR-14 | Cart persistence | Cart state persists across pages using browser storage. |
| FR-15 | Wishlist | User can save products and view/remove them from the wishlist. |
| FR-16 | Product comparison | User can compare up to three selected products side by side. |
| FR-17 | Theme switch | Light/dark preference can be toggled and remembered. |
| FR-18 | Coupon | Entering SF10 applies a 10% simulated cart discount; other codes are rejected. |
| FR-19 | Checkout validation | Required fields prevent progression until valid. |
| FR-20 | Payment choice | User can choose a sample cash-on-delivery or bank-transfer payment method. |
| FR-21 | Order confirmation | Completed simulation displays an order reference and summary without collecting payment. |
| FR-22 | Reduced motion | Users who request reduced motion receive minimal transitions/animations. |
| FR-23 | Clear feedback | Cart and wishlist actions present confirmation feedback. |
| FR-24 | Browsing by group | Homepage category links open catalog pre-filtered for the group. |
| FR-25 | Ambient visual effects | Home, collection, spotlight and selected page headers display decorative animated tech SVG icons without obstructing interaction. |
| FR-26 | Scroll feedback | Top scroll progress indicator reflects current vertical reading position. |

## 3. Non-functional requirements

| ID | Requirement | Expected quality target |
|---|---|---|
| NFR-01 | Usability | Consistent navigation, understandable labels, visible CTAs and states. |
| NFR-02 | Responsiveness | Layout adapts to desktop, tablet and mobile without horizontal overflow at common viewport widths. |
| NFR-03 | Browser compatibility | Basic browsing works in current Chromium and mainstream browsers. |
| NFR-04 | Offline operation | Frontend assets and visual content are local; no external CDN is needed. |
| NFR-05 | Performance | Responsive UI interactions, lazy-loaded catalog illustrations and lightweight client-side state. |
| NFR-06 | Accessibility | Semantic landmarks, accessible input labels, visible focus states and keyboard-operable primary controls. |
| NFR-07 | Motion accessibility | Respect the `prefers-reduced-motion` setting. |
| NFR-08 | Maintainability | Separate catalog data, application logic, shared styling and visual assets. |
| NFR-09 | Data minimization | Do not store entered phone numbers or street addresses in order summaries. |
| NFR-10 | Reliability | Invalid coupon codes and empty carts do not produce incorrect totals or complete orders. |
| NFR-11 | Consistency | SF-inspired red, black and neutral design tokens across every page. |
| NFR-12 | Error handling | Missing/unknown product IDs and unsupported coupon values have safe fallbacks. |
| NFR-13 | Animation efficiency | Prefer CSS transforms and opacity; decorative motion never blocks input or primary product information. |

## 4. Example actors and use cases

| Actor | Use case | UI screens |
|---|---|---|
| Visitor | Browse products | Home / Catalog |
| Visitor | Filter products | Catalog |
| Visitor | Inspect product / rotate model | Product details |
| Visitor | Save item / compare products | Product details / Wishlist / Compare |
| Visitor | Add product to cart | Catalog / Product details / Cart drawer |
| Visitor | Update cart quantity | Cart |
| Visitor | Apply sample coupon | Cart / Checkout |
| Visitor | Submit sample checkout | Checkout |
| Visitor | View order summary | Order confirmation |

For a system design assignment, a possible domain model would contain `Product`, `Catalog`, `Cart`, `CartItem`, `Order` and `OrderItem`. The current code is a frontend prototype, not an object-oriented server-side implementation of these classes.

## 5. Example test cases

| Test ID | Scenario | Action | Expected result |
|---|---|---|---|
| TC-01 | Open homepage | Load `index.html` | Hero, navigation, categories and featured products render. |
| TC-02 | Open catalog | Click Shop all | Product grid displays, with working filter controls. |
| TC-03 | Search | Enter `headphones` | Only matching catalog items are shown. |
| TC-04 | Category | Check `Audio` | Only products belonging to Audio group appear. |
| TC-05 | Price filter | Lower range below an item's price | Item is excluded. |
| TC-06 | Sorting | Select lowest price | Listed prices ascend. |
| TC-07 | Product detail | Click a product | Detail page shows matching name, price and specs. |
| TC-08 | 360 viewer | Open Apex Studio 16, enable 360°, move slider | Product view changes to a different camera angle. |
| TC-09 | Zoom | Open image viewer, click + | Zoom percentage increases and image grows. |
| TC-10 | Cart add | Click Add to bag | Cart count increases and line item appears. |
| TC-11 | Cart remove | Remove an item | Item disappears and totals decrease. |
| TC-12 | Coupon success | Apply `SF10` | Subtotal receives a 10% illustrative discount. |
| TC-13 | Coupon failure | Apply `INVALID` | No coupon discount is applied. |
| TC-14 | Wishlist | Click heart icon | Product appears in Saved items. |
| TC-15 | Compare limit | Add four products for comparison | Fourth product is rejected; maximum remains three. |
| TC-16 | Theme toggle | Switch to dark theme | Colors update; selection persists after navigation. |
| TC-17 | Empty checkout | Try to checkout without items | Order cannot be submitted. |
| TC-18 | Invalid checkout | Submit blank required fields | Validation message appears and confirmation is blocked. |
| TC-19 | Valid checkout | Complete fields with products in bag | Sample confirmation includes order reference and total. |
| TC-20 | Mobile | View at narrow viewport | Menu is usable and no horizontal page overflow. |
| TC-21 | Reduced motion | Enable OS reduced-motion preference | Floating loops and long transitions stop. |
| TC-22 | No network | Serve local project without internet | All static pages and local illustrations remain available. |
| TC-23 | Floating icons | Open homepage and scroll through highlighted sections | Decorative SVG icons render in the background and do not intercept clicks or obscure buttons. |
| TC-24 | Scroll progress | Scroll halfway down a page | Thin top indicator progresses proportionally. |
| TC-25 | Reduced motion: ambient | Enable OS reduced-motion preference | Floating icon movement, glow loops and pointer parallax are disabled. |

## 6. Suggested follow-up improvements

- If a production storefront is ever required, consider an inventory/order backend while keeping public browsing account-free.
- Store product inventory and order records in a managed database.
- Add real payment processing only with a compliant payment provider.
- Consider optional verified product reviews and merchant fulfillment integration only for a real storefront.
- Conduct usability testing, device testing and a WCAG audit before public deployment.

---

**Document owner:** Ko Kyi Phyu Aung · kyiphyuaung@strategyfirst.edu.mm
