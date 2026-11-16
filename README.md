# SF Tech Store

**Premium Interactive E-commerce Website — Experience Edition**  
**Developer:** Ko Kyi Phyu Aung  
**Contact:** kyiphyuaung@strategyfirst.edu.mm  
**Visual identity:** Strategy First — red, black and white

SF Tech Store is a responsive multi-page technology storefront built with **HTML5, CSS3 and vanilla JavaScript**. It includes an interactive product viewer, searchable catalog, shopping cart, checkout flow and desktop/mobile layouts. No external JavaScript libraries, remote fonts or APIs are required.

## Start the website

### Windows

1. Extract the complete ZIP into a folder.
2. Double-click `START_WINDOWS.bat` (Python 3 is required for this shortcut).
3. Open **http://127.0.0.1:8765** if your browser does not start automatically.
4. Keep the terminal window open while using the website. Press `Ctrl+C` to stop the server.

### macOS / Linux

From a terminal inside the extracted project:

```bash
bash START_MAC_LINUX.sh
```

Open **http://127.0.0.1:8765**.

### Alternative

Opening `index.html` directly in Chrome or Edge also works for many features. For consistent cart and theme persistence across pages, use the local server method above. **No Python libraries are required**; Python is used only to serve the static files.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Animated homepage, categories, featured products and promotions |
| `products.html` | Catalog, search, filtering, sorting and browse-by-category |
| `product.html?id=apex-studio-16` | Full product detail, gallery, magnifier, zoom and 360° viewer |
| `cart.html` | Shopping bag, quantity editing, coupon and order summary |
| `checkout.html` | Validated contact and delivery forms, simulated payment method selection |
| `order-confirmation.html` | Generated order reference and confirmation summary |
| `wishlist.html` | Saved products |
| `compare.html` | Side-by-side comparison of up to three products |
| `about.html` | Store concept, brand and developer details |

## Experience Edition visual upgrade

The homepage and selected interior sections now use a layered **floating technology icon** background (CPU, headphones, keyboard, laptop, controller and more). The symbols are locally embedded SVG, not externally loaded icons. Motion runs with CSS keyframes and is intentionally subtle; on smaller screens the number of visible icons is reduced. Users who prefer reduced motion receive a stationary presentation. The homepage's ambient layer responds gently to the pointer on desktop.

The update also includes refreshed editorial copy, gradient accent typography, a subtle top-of-page scroll indicator, sheen on primary buttons, and updated hover treatments on product and category cards. Animations and marketing presentation are isolated in **`assets/css/experience.css`** and **`assets/js/experience.js`**; the original cart, catalog, zoom and checkout functionality remains in **`assets/js/app.js`**.

**Authentication is not included.** Visitors can browse and use the local shopping preview without user accounts.

## Main features

- 30 curated illustrative technology products across laptops, audio, peripherals, monitors, mobile devices, wearables, gaming, storage and accessories.
- Dedicated detail pages showing names, prices, specifications, highlights, availability and related items.
- **24-frame, 360° drag-to-rotate viewer** for the Apex Studio 16 laptop, Orbit ANC Pro headphones and Vector X9 mouse. The frame sequence is rendered from actual synthetic 3D geometry, not by rotating a single flat image.
- **Three angle views** for all other products (switch with thumbnails or the Different angle button).
- Pointer-hover circular magnifier, enlarged image viewer, zoom buttons, mouse wheel zoom and drag-to-pan.
- Catalog search, multiple category filters, price filter, in-stock selection, sorting and progressive loading.
- Add to bag, quantity updates, item removal, mini cart drawer, full cart page, subtotal and totals.
- Coupon code **SF10** applies a 10% illustrative discount.
- Checkout form validation, sample shipping logic and generated simulated order confirmation.
- Wishlist, product comparison (maximum three), theme toggle with light and dark modes.
- Floating SVG tech-icon constellations (CPU, keyboard, headphones, Wi-Fi, monitor, gaming controller), slow parallax in the hero, moving glows, hover lifts, image shine, scroll progress, animated product hero art, scroll reveals and reduced-motion support.
- Responsive desktop, tablet and mobile layouts; mobile navigation menu.

## Try the interactive product viewer

1. Go to **Shop all**.
2. Open **Orbit ANC Pro**, **Apex Studio 16** or **Vector X9 Wireless**.
3. Click **Rotate 360°** and drag left/right over the product, or move the rotation slider.
4. Click **Zoom view** to open the enlarged image; use `+`, `−`, mouse wheel and dragging.
5. On other products, use the three image thumbnails or **Different angle**.

## Try the shopping flow

1. Select a product and click **Add to bag**.
2. Open the cart from the navigation icon. Change quantities, remove products or proceed to checkout.
3. On `cart.html`, enter the optional sample coupon `SF10`.
4. On `checkout.html`, provide valid contact and delivery information and choose a simulated payment method.
5. Complete checkout to see an order summary. Use **Print summary** if needed.

**Important data note:** This is a standalone front-end prototype, not a connected commercial store. Prices, specifications, inventory and products are illustrative. Checkout **does not** charge money, transfer bank details, create a real shipment or submit an order to a server. Client-side cart, wishlist, comparison, coupon and theme preferences use browser `localStorage`; the non-sensitive last-order summary uses `sessionStorage`. Contact details entered on the checkout form are **not stored** in the order summary.

## Project structure

```text
SF_Tech_Store_Experience_Edition/
├── index.html
├── products.html
├── product.html
├── cart.html
├── checkout.html
├── order-confirmation.html
├── wishlist.html
├── compare.html
├── about.html
├── START_WINDOWS.bat
├── START_MAC_LINUX.sh
├── README.md
├── docs/
│   └── REQUIREMENTS_AND_TEST_CASES.md
└── assets/
    ├── css/
    │   ├── style.css      # Core storefront styling
    │   └── experience.css # Premium ambient effects, typography and hovers
    ├── js/
    │   ├── catalog.js      # Product records and specification data
    │   ├── app.js          # Front-end behavior and page rendering
    │   └── experience.js   # Floating icons, parallax, and scroll progress
    └── img/
        ├── brand/          # Source and optimized SF crest artwork
        ├── products/       # 30 catalog illustrations
        ├── angles/         # 3 angle views for 27 products
        └── 360/            # 24 frames each for 3 hero devices
```

## Requirements and test cases

See **[`docs/REQUIREMENTS_AND_TEST_CASES.md`](docs/REQUIREMENTS_AND_TEST_CASES.md)** for Functional Requirements, Non-functional Requirements, use-case mapping, scope boundaries and sample acceptance tests.

## Edit product content

Edit **`assets/js/catalog.js`**. Every product is an object containing `id`, `name`, `group`, `category`, `price`, `compareAt`, `summary`, `description`, `specs`, `highlights`, `stock`, `image` and `frames`. The `id` is used in detail-page URLs and image paths; change it carefully. Product visuals are pre-rendered illustrations, not dynamically produced by JavaScript at runtime.

## Compatibility and practical notes

- Designed for modern versions of Chrome, Edge, Firefox and Safari.
- No server database, user accounts, live payment integrations or real order processing.
- Product images are stylized 3D representations, not photographs of real purchasable models.
- The full 360° frame sequences load from the project folder, so the site works offline when served locally.
- Browser `localStorage` may be disabled by privacy modes and resets if site data is cleared.
- Add server-side authentication, secure payment processing, inventory checks and database storage before attempting any production deployment.
- The Strategy First emblem is included as user-supplied project artwork.

---

**Developed by Ko Kyi Phyu Aung**  
**kyiphyuaung@strategyfirst.edu.mm**


## Final teaching launcher / port isolation (2026-11-13)

- **Tech Store** opens on **http://127.0.0.1:8765/**. The other projects use separate ports (Tech Store 8765, Learning Hub 8766, Academic Command Center 8768).
- `START_WINDOWS.bat` now runs its server **in the current command window**, rather than detaching a background `cmd /k` process. Stop with Ctrl+C or close that specific server window.
- The browser opens only after the server binds successfully. If that port is occupied, the launcher prints a clear error rather than showing a different project.
- Always extract the ZIP to its own folder. Do not run batches from within the ZIP preview or overwrite another project's files.
