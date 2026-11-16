/* SF Tech Store — interactive offline storefront
 * Developer: Ko Kyi Phyu Aung | kyiphyuaung@strategyfirst.edu.mm
 * No external network requests, no server-side authentication, no actual payments.
 */
(() => {
    'use strict';
    const PRODUCTS = window.SF_PRODUCTS || [];
    const P = id => PRODUCTS.find(p => p.id === id);
    const $ = (q, root = document) => root.querySelector(q);
    const $$ = (q, root = document) => [...root.querySelectorAll(q)];
    const money = n => 'MMK ' + Math.round(n || 0).toLocaleString('en-US');
    const pct = p => Math.max(0, Math.round((1 - p.price / p.compareAt) * 100));
    const attr = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const params = new URLSearchParams(location.search);
    const page = document.body.dataset.page || 'index';
    const KEYS = {
        cart: 'sftech_cart_v1',
        wish: 'sftech_wish_v1',
        compare: 'sftech_compare_v1',
        theme: 'sftech_theme_v1',
        coupon: 'sftech_coupon_v1',
        order: 'sftech_order_v1'
    };
    function read(key, fallback) { try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
    }
    catch {
        return fallback;
    } }
    function save(key, value) { try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch { } }
    const state = {
        cart: read(KEYS.cart, {}),
        wish: read(KEYS.wish, []),
        compare: read(KEYS.compare, []),
        coupon: read(KEYS.coupon, ''),
        theme: read(KEYS.theme, 'light')
    };
    if (!state.cart || typeof state.cart !== 'object' || Array.isArray(state.cart))
        state.cart = {};
    if (!Array.isArray(state.wish))
        state.wish = [];
    if (!Array.isArray(state.compare))
        state.compare = [];
    function cartEntries() { return Object.entries(state.cart).map(([id, qty]) => ({ product: P(id), qty: Math.max(0, Math.min(99, Number(qty) || 0)) })).filter(x => x.product && x.qty > 0); }
    function subtotal() { return cartEntries().reduce((s, { product, qty }) => s + product.price * qty, 0); }
    function cartCount() { return cartEntries().reduce((s, v) => s + v.qty, 0); }
    function discount() { return state.coupon === 'SF10' ? Math.round(subtotal() * .10) : 0; }
    function shipping() { return subtotal() >= 1000000 || subtotal() === 0 ? 0 : 25000; }
    function total() { return subtotal() - discount() + shipping(); }
    function toast(msg) { let box = $('#toast-stack'); if (!box)
        return; let node = document.createElement('div'); node.className = 'toast'; node.innerHTML = '<span>✦</span>' + attr(msg); box.appendChild(node); setTimeout(() => { node.style.opacity = '0'; node.style.transform = 'translateY(-10px)'; setTimeout(() => node.remove(), 240); }, 3000); }
    const iconHeart = (filled = false) => filled ? '♥' : '♡';
    function refreshCounters() { const cc = $('#cart-count'), wc = $('#wish-count'); if (cc)
        cc.textContent = String(cartCount()); if (wc) {
        wc.textContent = String(state.wish.length);
        wc.hidden = state.wish.length === 0;
    } const dc = $('#drawer-count'); if (dc)
        dc.textContent = '(' + cartCount() + ')'; const dt = $('#drawer-total'); if (dt)
        dt.textContent = money(subtotal()); }
    function addCart(id, qty = 1) { const p = P(id); if (!p)
        return; state.cart[id] = Math.min(99, (Number(state.cart[id]) || 0) + Math.max(1, qty)); save(KEYS.cart, state.cart); refreshCounters(); renderDrawer(); toast(p.name + ' added to your bag'); if (page === 'cart')
        renderCartPage(); if (page === 'checkout')
        renderCheckoutSummary(); }
    function updateCart(id, delta) { if (!P(id))
        return; const next = Math.min(99, (Number(state.cart[id]) || 0) + delta); if (next <= 0)
        delete state.cart[id];
    else
        state.cart[id] = next; save(KEYS.cart, state.cart); refreshCounters(); renderDrawer(); if (page === 'cart')
        renderCartPage(); if (page === 'checkout')
        renderCheckoutSummary(); }
    function removeCart(id) { delete state.cart[id]; save(KEYS.cart, state.cart); refreshCounters(); renderDrawer(); if (page === 'cart')
        renderCartPage(); if (page === 'checkout')
        renderCheckoutSummary(); toast('Item removed from your bag'); }
    function wishlistToggle(id) { if (!P(id))
        return; const index = state.wish.indexOf(id); if (index >= 0) {
        state.wish.splice(index, 1);
        toast('Removed from saved items');
    }
    else {
        state.wish.push(id);
        toast('Saved for later');
    } ; save(KEYS.wish, state.wish); refreshCounters(); syncWishButtons(); if (page === 'wishlist')
        renderWishlist(); }
    function compareToggle(id) { if (!P(id))
        return; let index = state.compare.indexOf(id); if (index >= 0) {
        state.compare.splice(index, 1);
    }
    else if (state.compare.length >= 3) {
        toast('Compare up to 3 products');
        return;
    }
    else {
        state.compare.push(id);
        toast('Added to comparison');
    } ; save(KEYS.compare, state.compare); renderCompareBar(); syncCompareButtons(); if (page === 'compare')
        renderComparePage(); }
    function syncWishButtons() { $$('[data-wish]').forEach(b => { const active = state.wish.includes(b.dataset.wish); b.classList.toggle('active', active); b.textContent = iconHeart(active) + (b.closest('.detail-secondary-actions') ? ' Save' : ''); b.setAttribute('aria-pressed', String(active)); b.title = active ? 'Remove from wishlist' : 'Add to wishlist'; }); }
    function syncCompareButtons() { $$('[data-compare]').forEach(b => { const active = state.compare.includes(b.dataset.compare); b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); b.title = active ? 'Remove comparison' : 'Compare product'; }); }
    function card(product) { const p = product; return `<article class="product-card reveal"><div class="product-media"><a class="product-image-link" href="product.html?id=${encodeURIComponent(p.id)}" aria-label="View details of ${attr(p.name)}"><img src="${p.image}" alt="Illustration of ${attr(p.name)}" loading="lazy">${p.frames ? '<span class="card-rotate-indicator">↻ 360° preview</span>' : ''}</a>${p.badge ? `<span class="product-badge ${p.badge === '360° VIEW' ? 'red-badge' : ''}">${attr(p.badge)}</span>` : ''}<div class="card-action-stack"><button class="card-icon-btn" type="button" data-wish="${p.id}" aria-pressed="false" title="Save product">♡</button><button class="card-icon-btn" type="button" data-compare="${p.id}" aria-pressed="false" title="Compare product">⇄</button></div></div><div class="card-content"><div class="card-category">${attr(p.category)}</div><h3><a href="product.html?id=${p.id}">${attr(p.name)}</a></h3><p>${attr(p.summary)}</p><div class="price-line"><span class="price-main">${money(p.price)}</span><span class="price-old">${money(p.compareAt)}</span></div><div class="card-bottom"><button class="btn btn-red" data-add="${p.id}" type="button">Add to bag <span>↗</span></button><a class="btn btn-soft" href="product.html?id=${p.id}" title="Product details" aria-label="View ${attr(p.name)} details">↗</a></div></div></article>`; }
    function injectCards(target, arr) { const el = typeof target === 'string' ? $(target) : target; if (!el)
        return; el.innerHTML = arr.map(card).join(''); syncWishButtons(); syncCompareButtons(); reveal(); }
    function reveal() { if (!('IntersectionObserver' in window)) {
        $$('.reveal').forEach(el => el.classList.add('visible'));
        return;
    } const observer = window.__sfObserver || (window.__sfObserver = new IntersectionObserver((entries) => { for (const entry of entries) {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    } }, { threshold: .075, rootMargin: '0px 0px 65px 0px' })); $$('.reveal:not(.visible)').forEach(el => observer.observe(el)); }
    function renderCompareBar() { const b = $('#compare-bar'); if (!b)
        return; b.hidden = state.compare.length === 0; const ct = $('#compare-count'); if (ct)
        ct.textContent = state.compare.length + '/3'; const chips = $('#compare-chips'); if (chips)
        chips.innerHTML = state.compare.map(id => { const p = P(id); return p ? `<span class="compare-chip">${attr(p.name)} <button type="button" data-compare="${id}" aria-label="Remove ${attr(p.name)} from comparison">✕</button></span>` : ''; }).join(''); }
    function openDrawer() { renderDrawer(); $('#cart-overlay').classList.add('open'); $('#cart-drawer').classList.add('open'); $('#cart-drawer').setAttribute('aria-hidden', 'false'); $('#cart-overlay').setAttribute('aria-hidden', 'false'); document.body.classList.add('locked'); $('#cart-close').focus(); }
    function closeDrawer() { $('#cart-overlay').classList.remove('open'); $('#cart-drawer').classList.remove('open'); $('#cart-drawer').setAttribute('aria-hidden', 'true'); $('#cart-overlay').setAttribute('aria-hidden', 'true'); document.body.classList.remove('locked'); }
    function renderDrawer() { const el = $('#drawer-items'); if (!el)
        return; const rows = cartEntries(); el.innerHTML = rows.length ? rows.map(({ product: p, qty }) => `<div class="drawer-item"><a href="product.html?id=${p.id}"><img src="${p.image}" alt="${attr(p.name)}"></a><div><h3><a href="product.html?id=${p.id}">${attr(p.name)}</a></h3><p>${qty} × ${money(p.price)}</p><div class="drawer-item-price">${money(p.price * qty)}</div></div><button type="button" data-remove="${p.id}" aria-label="Remove ${attr(p.name)}">✕</button></div>`).join('') : `<div class="empty-state" style="border:0;padding:50px 10px"><span>♧</span><h3>Your bag is empty.</h3><p>Time to discover something new.</p><a href="products.html" class="btn btn-red">Explore gear ↗</a></div>`; refreshCounters(); }
    function initializeCommon() {
        document.documentElement.dataset.theme = state.theme;
        $$('[data-nav]').forEach(a => a.classList.toggle('active', (page === 'index' && a.dataset.nav === 'home') || (page === 'products' && a.dataset.nav === 'products') || (page === 'about' && a.dataset.nav === 'about')));
        const header = $('#site-header');
        window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), { passive: true });
        $('#theme-toggle').addEventListener('click', () => { state.theme = state.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = state.theme; save(KEYS.theme, state.theme); toast((state.theme === 'dark' ? 'Dark' : 'Light') + ' mode on'); });
        $('#menu-trigger').addEventListener('click', () => { const nav = $('#main-nav'); const open = !nav.classList.contains('open'); nav.classList.toggle('open', open); $('#menu-trigger').setAttribute('aria-expanded', String(open)); });
        $('#cart-trigger').addEventListener('click', openDrawer);
        $('#cart-close').addEventListener('click', closeDrawer);
        $('#cart-overlay').addEventListener('click', closeDrawer);
        $('#search-top').addEventListener('click', () => { location.href = 'products.html?focusSearch=1'; });
        $('#compare-clear').addEventListener('click', () => { state.compare = []; save(KEYS.compare, state.compare); renderCompareBar(); syncCompareButtons(); if (page === 'compare')
            renderComparePage(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape') {
            closeDrawer();
            closeLightbox();
            $('#main-nav')?.classList.remove('open');
        } });
        document.addEventListener('click', e => {
            const a = e.target.closest('[data-add],[data-wish],[data-compare],[data-remove],[data-cart-delta]');
            if (!a)
                return;
            if (a.dataset.add) {
                e.preventDefault();
                addCart(a.dataset.add, 1);
            }
            if (a.dataset.wish) {
                e.preventDefault();
                wishlistToggle(a.dataset.wish);
            }
            if (a.dataset.compare) {
                e.preventDefault();
                compareToggle(a.dataset.compare);
            }
            if (a.dataset.remove) {
                e.preventDefault();
                removeCart(a.dataset.remove);
            }
            if (a.dataset.cartDelta) {
                e.preventDefault();
                updateCart(a.dataset.cartDelta, Number(a.dataset.step) || 1);
            }
        });
        refreshCounters();
        renderDrawer();
        renderCompareBar();
        initializeLightbox();
    }
    /* Homepage */
    function initHome() {
        let categories = [
            ['Laptops', 'Laptops', 'apex-studio-16'],
            ['Audio', 'Audio', 'orbit-anc-pro'],
            ['Peripherals', 'Peripherals', 'atlas-75-he'],
            ['Displays', 'Displays', 'prism-27-oled'],
            ['Mobile', 'Mobile', 'vertex-pro'],
            ['Gaming', 'Gaming', 'pulse-controller'],
            ['Storage', 'Storage', 'jet-ssd-2tb'],
            ['Wearables', 'Wearables', 'pulse-watch']
        ];
        const g = $('#home-category-grid');
        g.innerHTML = categories.map(([name, group, id], i) => `<a class="category-card reveal" href="products.html?category=${encodeURIComponent(group)}"><span>0${i + 1} / DISCOVER</span><h3>${name}</h3><span class="round-arrow">↗</span><img src="${P(id).image}" loading="lazy" alt="${name} gadgets"></a>`).join('');
        injectCards('#featured-grid', [P('apex-studio-16'), P('orbit-anc-pro'), P('prism-27-oled'), P('vector-x9')]);
    }
    /* Listing */
    function initCatalog() {
        const groupCounts = PRODUCTS.reduce((a, p) => (a[p.group] = (a[p.group] || 0) + 1, a), {});
        const order = [
            'Laptops',
            'Audio',
            'Peripherals',
            'Displays',
            'Mobile',
            'Gaming',
            'Storage',
            'Wearables',
            'Accessories'
        ];
        const target = $('#category-filters');
        target.innerHTML = order.filter(g => groupCounts[g]).map(g => `<label class="check-line"><input type="checkbox" value="${g}" data-category-filter><span>${g}</span><small>${groupCounts[g]}</small></label>`).join('');
        const search = $('#catalog-search'), sort = $('#sort-by'), range = $('#price-range'), stock = $('#stock-only');
        let shown = 12;
        const categoryFromUrl = params.get('category');
        if (categoryFromUrl) {
            const cb = $$('[data-category-filter]').find(x => x.value === categoryFromUrl);
            if (cb)
                cb.checked = true;
        }
        search.value = params.get('search') || '';
        if (params.get('focusSearch')) {
            setTimeout(() => { search.focus(); search.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 100);
        }
        function selectedCategories() { return $$('[data-category-filter]:checked').map(x => x.value); }
        function filtered() {
            let selected = selectedCategories();
            let q = search.value.trim().toLowerCase();
            const price = Number(range.value);
            let result = PRODUCTS.filter(p => (!selected.length || selected.includes(p.group)) && p.price <= price && (!stock.checked || p.stock > 0) && (!q || [p.name, p.group, p.category, p.summary, ...p.highlights].join(' ').toLowerCase().includes(q)));
            if (sort.value === 'price-asc')
                result.sort((a, b) => a.price - b.price);
            else if (sort.value === 'price-desc')
                result.sort((a, b) => b.price - a.price);
            else if (sort.value === 'name')
                result.sort((a, b) => a.name.localeCompare(b.name));
            return result;
        }
        function redraw(reset = false) {
            if (reset)
                shown = 12;
            const list = filtered();
            $('#price-range-value').textContent = money(Number(range.value));
            $('#results-count').textContent = list.length + ' products';
            injectCards('#catalog-grid', list.slice(0, shown));
            $('#catalog-empty').hidden = list.length > 0;
            const wrap = $('#load-more-wrap');
            wrap.innerHTML = list.length > shown ? `<button id="load-more" class="btn btn-soft">Load more products ↓</button><p>Showing ${Math.min(shown, list.length)} of ${list.length}</p>` : (list.length > 0 ? `<p>Showing all ${list.length} products</p>` : '');
            $('#load-more')?.addEventListener('click', () => { shown += 12; redraw(); });
            const chips = $('#active-chips');
            const cats = selectedCategories();
            chips.innerHTML = cats.map(c => `<span class="active-chip">${c}<button data-clear-category="${c}" aria-label="Remove ${c} filter">×</button></span>`).join('');
        }
        function clear() { search.value = ''; range.value = 7200000; stock.checked = true; $$('[data-category-filter]').forEach(el => el.checked = false); sort.value = 'featured'; redraw(true); }
        $('#clear-filters').addEventListener('click', clear);
        $('#reset-empty').addEventListener('click', clear);
        target.addEventListener('change', () => redraw(true));
        search.addEventListener('input', () => redraw(true));
        range.addEventListener('input', () => redraw(true));
        stock.addEventListener('change', () => redraw(true));
        sort.addEventListener('change', () => redraw(true));
        $('#active-chips').addEventListener('click', e => { let b = e.target.closest('[data-clear-category]'); if (!b)
            return; const box = $$('[data-category-filter]').find(x => x.value === b.dataset.clearCategory); if (box)
            box.checked = false; redraw(true); });
        $('#mobile-filters').addEventListener('click', () => { $('#filter-panel').classList.toggle('open'); $('#filter-panel').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
        redraw();
    }
    /* Detail page and 360 frame sequence */
    let currentDetail = null;
    let currentImage = null;
    function frameUrl(product, index) { return `assets/img/360/${product.id}/${String((index + 24) % 24).padStart(2, '0')}.png`; }
    function angleViewUrl(product, index) { return `assets/img/angles/${product.id}/${String(index % 3).padStart(2, '0')}.png`; }
    function productTabs(p) { return `<div class="detail-below"><div class="detail-tabs" role="tablist"><button role="tab" type="button" aria-selected="true" data-detail-tab="desc" class="active">Overview</button><button role="tab" type="button" aria-selected="false" data-detail-tab="spec">Specifications</button><button role="tab" type="button" aria-selected="false" data-detail-tab="shipping">Delivery info</button></div><div class="detail-tab-content" id="detail-tab-content">${detailTabHTML(p, 'desc')}</div></div>`; }
    function detailTabHTML(p, id) {
        if (id === 'desc')
            return `<h3>Made to move with you.</h3><p>${attr(p.description)}</p><p>Explore the details, compare your choices and see the product from a closer perspective.</p>`;
        if (id === 'spec')
            return `<h3>Technical highlights</h3><div class="spec-list">${p.specs.map(v => `<div class="spec-item"><span>${attr(v.label)}</span><strong>${attr(v.value)}</strong></div>`).join('')}</div>`;
        return '<h3>Delivery experience</h3><p>Shipping fee is calculated during the checkout simulation. For this project, orders over MMK 1,000,000 have a sample free-shipping rule; otherwise MMK 25,000 is added. No physical delivery is arranged.</p>';
    }
    function initProduct() {
        const p = P(params.get('id')) || PRODUCTS[0];
        currentDetail = p;
        document.title = p.name + ' | SF Tech Store';
        $('#detail-breadcrumbs').innerHTML = `<a href="index.html">Home</a><span>/</span><a href="products.html">Products</a><span>/</span><a href="products.html?category=${encodeURIComponent(p.group)}">${attr(p.group)}</a><span>/</span><b>${attr(p.name)}</b>`;
        const gallery = `<div class="product-gallery"><div class="main-image-frame" id="detail-view-frame" tabindex="0" role="button" aria-label="Zoom image of ${attr(p.name)}"><span class="view-badge">${p.frames ? '↻ INTERACTIVE 360° VIEW' : 'HIGH-DETAIL PRODUCT VIEW'}</span><img id="detail-main-image" src="${p.image}" alt="${attr(p.name)} illustrative 3D render" draggable="false"><span class="zoom-hint">⌕ Click to zoom</span><div class="zoom-lens" id="detail-zoom-lens" aria-hidden="true"></div></div><div class="gallery-actions"><button class="gallery-action" type="button" id="gallery-zoom">⊕ Zoom view</button>${p.frames ? '<button class="gallery-action" type="button" id="gallery-rotate">↻ Rotate 360°</button>' : '<button class="gallery-action" type="button" id="gallery-angle" >↻ Different angle</button>'}<button class="gallery-action" type="button" id="gallery-reset">↺ Reset</button></div>${p.frames ? `<div class="spin-panel" id="spin-panel" hidden><div class="spin-top"><strong>360° PRODUCT EXPLORER</strong><span class="spin-live" id="spin-live">00 / 24</span></div><div class="spin-track"><span>↺</span><input type="range" aria-label="Rotate product through 360 degrees" id="spin-slider" min="0" max="23" step="1" value="0"><span>↻</span></div><div class="spin-hint">Drag left or right directly over the product to rotate · Use slider or ← → keys</div></div>` : ''}<div class="gallery-thumbnail-row">${(p.frames ? [0, 6, 12] : [0, 1, 2]).map((f, i) => `<button class="gallery-thumb ${i === 0 ? 'active' : ''}" type="button" data-thumb="${f}" aria-label="Show product ${i + 1} view"><img src="${p.frames ? frameUrl(p, f) : angleViewUrl(p, f)}" alt="Product view ${i + 1}"></button>`).join('')}</div></div>`;
        const info = `<div class="detail-info"><div class="detail-mini-top"><span class="detail-category">${attr(p.category)} / SF COLLECTION</span><span class="detail-sku">SKU: SF-${p.id.toUpperCase()}</span></div><h1>${attr(p.name)}</h1><p>${attr(p.summary)}</p><div class="detail-price-row"><strong>${money(p.price)}</strong><del>${money(p.compareAt)}</del><span>−${pct(p)}% today</span></div><div class="availability-row"><span>Availability <strong>● In stock</strong></span><span>Product type: ${attr(p.category)}</span></div><ul class="detail-highlights">${p.highlights.map(h => `<li>${attr(h)}</li>`).join('')}</ul><div class="quantity-and-add"><div class="qty-counter"><button id="detail-minus" aria-label="Decrease quantity">−</button><span id="detail-qty">1</span><button id="detail-plus" aria-label="Increase quantity">+</button></div><button class="btn btn-red btn-large" id="detail-add" type="button">Add to shopping bag <span>↗</span></button></div><div class="detail-secondary-actions"><button class="btn btn-soft" id="detail-buy" type="button">Buy now ↗</button><button class="btn btn-soft" data-wish="${p.id}" type="button">♡ Save</button><button class="btn btn-soft" data-compare="${p.id}" type="button">⇄ Compare</button></div><div class="details-meta"><div><strong>Product view</strong><span>${attr(p.visual)}</span></div><div><strong>Delivery</strong><span>Shipping fee displayed at checkout</span></div><div><strong>Support</strong><span>Product information and UI demonstration</span></div></div></div>`;
        $('#product-detail').innerHTML = `<div class="detail-grid">${gallery}${info}</div>${productTabs(p)}`;
        let angle = 0, angleIdx = 0, spinning = false, dragging = false, dragStartX = 0, dragAngle = 0, dragMoved = false, detailQty = 1;
        const frame = $('#detail-view-frame'), img = $('#detail-main-image'), slider = $('#spin-slider'), panel = $('#spin-panel'), lens = $('#detail-zoom-lens');
        currentImage = p.image;
        if (window.matchMedia('(pointer: fine)').matches) {
            frame.addEventListener('pointermove', e => { if (spinning || dragging) {
                lens.style.opacity = '0';
                return;
            } const r = frame.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; lens.style.left = (x * 100) + '%'; lens.style.top = (y * 100) + '%'; lens.style.backgroundImage = 'url(\"' + img.src + '\")'; lens.style.backgroundPosition = (x * 100) + '% ' + (y * 100) + '%'; lens.style.opacity = '1'; });
            frame.addEventListener('pointerleave', () => lens.style.opacity = '0');
        }
        function setAngle(next) { angle = ((next % 24) + 24) % 24; if (!p.frames)
            return; img.src = frameUrl(p, angle); currentImage = img.src; if (slider)
            slider.value = angle; $('#spin-live').textContent = String(angle + 1).padStart(2, '0') + ' / 24'; $$('[data-thumb]').forEach(b => b.classList.toggle('active', Number(b.dataset.thumb) === angle)); }
        function startSpin() { if (!p.frames)
            return; spinning = true; panel.hidden = false; lens.style.opacity = '0'; frame.style.cursor = 'grab'; setAngle(angle); $('#gallery-rotate').classList.add('active'); $('#gallery-rotate').textContent = '✓ 360° mode on'; }
        function resetSpin() { spinning = false; if (panel)
            panel.hidden = true; angleIdx = 0; img.src = p.image; currentImage = p.image; frame.style.cursor = 'zoom-in'; lens.style.opacity = '0'; if ($('#gallery-rotate')) {
            $('#gallery-rotate').classList.remove('active');
            $('#gallery-rotate').textContent = '↻ Rotate 360°';
        } ; $$('[data-thumb]').forEach((t, i) => t.classList.toggle('active', i === 0)); }
        $('#gallery-rotate')?.addEventListener('click', () => spinning ? resetSpin() : startSpin());
        $('#gallery-angle')?.addEventListener('click', () => { angleIdx = (angleIdx + 1) % 3; img.src = angleViewUrl(p, angleIdx); currentImage = img.src; $$('[data-thumb]').forEach((t, i) => t.classList.toggle('active', i === angleIdx)); });
        $('#gallery-reset').addEventListener('click', resetSpin);
        $('#gallery-zoom').addEventListener('click', () => openLightbox(img.src, p.name));
        frame.addEventListener('click', () => { if (!dragMoved)
            openLightbox(img.src, p.name); dragMoved = false; });
        frame.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(img.src, p.name);
        } if (p.frames && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            e.preventDefault();
            startSpin();
            setAngle(angle + (e.key === 'ArrowRight' ? 1 : -1));
        } });
        if (p.frames) {
            frame.addEventListener('pointerdown', e => { startSpin(); dragging = true; dragMoved = false; dragStartX = e.clientX; dragAngle = angle; frame.setPointerCapture(e.pointerId); });
            frame.addEventListener('pointermove', e => { if (!dragging)
                return; const delta = e.clientX - dragStartX; if (Math.abs(delta) > 5)
                dragMoved = true; setAngle(dragAngle + Math.round(delta / 13)); });
            frame.addEventListener('pointerup', () => { dragging = false; frame.style.cursor = 'grab'; if (dragMoved) {
                setTimeout(() => { dragMoved = false; }, 140);
            } });
            frame.addEventListener('pointercancel', () => { dragging = false; });
            slider.addEventListener('input', () => { const next = Number(slider.value); startSpin(); setAngle(next); });
        }
        $$('[data-thumb]').forEach(b => b.addEventListener('click', () => { if (p.frames) {
            startSpin();
            setAngle(Number(b.dataset.thumb));
        }
        else {
            angleIdx = Number(b.dataset.thumb);
            img.src = angleViewUrl(p, angleIdx);
            currentImage = img.src;
            $$('[data-thumb]').forEach((t, i) => t.classList.toggle('active', i === angleIdx));
        } }));
        $('#detail-minus').addEventListener('click', () => { $('#detail-qty').textContent = String(detailQty = Math.max(1, detailQty - 1)); });
        $('#detail-plus').addEventListener('click', () => { $('#detail-qty').textContent = String(detailQty = Math.min(20, detailQty + 1)); });
        $('#detail-add').addEventListener('click', () => { addCart(p.id, detailQty); openDrawer(); });
        $('#detail-buy').addEventListener('click', () => { addCart(p.id, detailQty); location.href = 'checkout.html'; });
        $$('[data-detail-tab]').forEach(b => b.addEventListener('click', () => { const id = b.dataset.detailTab; $$('[data-detail-tab]').forEach(t => { t.classList.toggle('active', t === b); t.setAttribute('aria-selected', String(t === b)); }); $('#detail-tab-content').innerHTML = detailTabHTML(p, id); }));
        injectCards('#related-grid', PRODUCTS.filter(x => x.group === p.group && x.id !== p.id).slice(0, 4).concat(PRODUCTS.filter(x => x.group !== p.group).slice(0, Math.max(0, 4 - PRODUCTS.filter(x => x.group === p.group && x.id !== p.id).length))));
        syncWishButtons();
        syncCompareButtons();
    }
    /* Product image lightbox: zoom using the actual high-resolution transparent product render. */
    let zoomLevel = 1, panX = 0, panY = 0, panStart = null, zoomOpen = false;
    function updateLightbox() { $('#lightbox-image').style.transform = `translate(${panX}px,${panY}px) scale(${zoomLevel})`; $('#zoom-level').textContent = Math.round(zoomLevel * 100) + '%'; }
    function openLightbox(src, label) { zoomLevel = 1.0; panX = 0; panY = 0; zoomOpen = true; $('#lightbox-image').src = src; $('#lightbox-label').textContent = (label || 'PRODUCT VIEW').toUpperCase(); $('#image-lightbox').classList.add('open'); $('#image-lightbox').setAttribute('aria-hidden', 'false'); document.body.classList.add('locked'); updateLightbox(); $('#lightbox-close').focus(); }
    function closeLightbox() { zoomOpen = false; $('#image-lightbox')?.classList.remove('open'); $('#image-lightbox')?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('locked'); }
    function initializeLightbox() {
        const stage = $('#lightbox-stage');
        $('#lightbox-close').addEventListener('click', closeLightbox);
        $('#zoom-in').addEventListener('click', () => { zoomLevel = Math.min(4, zoomLevel + .25); updateLightbox(); });
        $('#zoom-out').addEventListener('click', () => { zoomLevel = Math.max(1, zoomLevel - .25); if (zoomLevel === 1) {
            panX = 0;
            panY = 0;
        } updateLightbox(); });
        $('#image-lightbox').addEventListener('click', e => { if (e.target === $('#image-lightbox'))
            closeLightbox(); });
        stage.addEventListener('wheel', e => { if (!zoomOpen)
            return; e.preventDefault(); zoomLevel = Math.max(1, Math.min(4, zoomLevel + (e.deltaY < 0 ? .18 : -.18))); if (zoomLevel === 1) {
            panX = 0;
            panY = 0;
        } updateLightbox(); }, { passive: false });
        stage.addEventListener('pointerdown', e => { panStart = { x: e.clientX, y: e.clientY, oldX: panX, oldY: panY }; stage.setPointerCapture(e.pointerId); stage.style.cursor = 'grabbing'; });
        stage.addEventListener('pointermove', e => { if (!panStart || zoomLevel <= 1)
            return; panX = panStart.oldX + e.clientX - panStart.x; panY = panStart.oldY + e.clientY - panStart.y; updateLightbox(); });
        stage.addEventListener('pointerup', () => { panStart = null; stage.style.cursor = 'grab'; });
        stage.addEventListener('pointercancel', () => panStart = null);
    }
    /* Shopping bag / coupons */
    function qtyHTML(id, qty) { return `<div class="qty-counter"><button data-cart-delta="${id}" data-step="-1" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-cart-delta="${id}" data-step="1" aria-label="Increase quantity">+</button></div>`; }
    function summaryHTML(checkout = false) { const sub = subtotal(), d = discount(), s = shipping(); return `<h2>Order summary</h2>${checkout ? `<div class="order-products">${cartEntries().map(({ product: p, qty }) => `<div class="order-small-product"><img src="${p.image}" alt="${attr(p.name)}"><div><strong>${attr(p.name)}</strong><small>Qty ${qty} · ${money(p.price * qty)}</small></div></div>`).join('')}</div><hr style="border:0;border-top:1px solid var(--border);margin:18px 0">` : ''}<div class="summary-line"><span>Subtotal</span><strong>${money(sub)}</strong></div><div class="summary-line"><span>Delivery</span><strong>${s === 0 ? 'Free' : money(s)}</strong></div>${d ? `<div class="summary-line"><span>Coupon SF10 (10%)</span><strong style="color:var(--brand)">−${money(d)}</strong></div>` : ''}<form class="promo-code" id="promo-form"><input id="coupon-field" value="${attr(state.coupon)}" placeholder="Coupon code (try SF10)" aria-label="Coupon code"><button class="btn btn-soft btn-sm" type="submit">Apply</button></form><div class="summary-line summary-total"><span>Total</span><strong>${money(total())}</strong></div>${checkout ? '' : `<a class="btn btn-red btn-full" href="${sub ? 'checkout.html' : 'products.html'}">${sub ? 'Proceed to checkout' : 'Browse the collection'} <span>↗</span></a>`}<p class="small-note">Illustrative product prices in MMK. Checkout is simulated.</p>`; }
    function bindCoupon(root = document) { const f = $('#promo-form', root); if (!f)
        return; f.addEventListener('submit', e => { e.preventDefault(); const value = $('#coupon-field').value.trim().toUpperCase(); if (!value) {
        state.coupon = '';
        toast('Coupon cleared');
    }
    else if (value === 'SF10') {
        state.coupon = 'SF10';
        toast('SF10 applied — 10% off');
    }
    else {
        state.coupon = '';
        toast('Coupon not recognized — try SF10');
    } ; save(KEYS.coupon, state.coupon); if (page === 'cart')
        renderCartPage(); if (page === 'checkout')
        renderCheckoutSummary(); }); }
    function renderCartPage() {
        const entries = cartEntries();
        $('#cart-page-count').textContent = '(' + cartCount() + ')';
        $('#cart-page-items').innerHTML = entries.length ? entries.map(({ product: p, qty }) => `<div class="cart-item"><a href="product.html?id=${p.id}"><img src="${p.image}" alt="${attr(p.name)}"></a><div><span class="eyebrow">${attr(p.category)}</span><h3><a href="product.html?id=${p.id}">${attr(p.name)}</a></h3><p>${attr(p.summary)}</p><div class="cart-item-actions">${qtyHTML(p.id, qty)}<button class="remove" data-remove="${p.id}">Remove</button></div></div><strong class="cart-item-price">${money(p.price * qty)}</strong></div>`).join('') : `<div class="empty-state"><span>♧</span><h3>Your bag is empty.</h3><p>Build your next setup from the collection.</p><a href="products.html" class="btn btn-red">Explore products ↗</a></div>`;
        $('#cart-summary').innerHTML = summaryHTML();
        bindCoupon($('#cart-summary'));
    }
    function renderCheckoutSummary() { const e = cartEntries(); if (!e.length) {
        $('#checkout-summary').innerHTML = '<div class="empty-state"><h3>No items in bag.</h3><a href="products.html" class="btn btn-red">Browse products ↗</a></div>';
        $('#checkout-form').querySelector('button[type="submit"]').disabled = true;
        return;
    } $('#checkout-summary').innerHTML = summaryHTML(true); bindCoupon($('#checkout-summary')); }
    function initCheckout() {
        renderCheckoutSummary();
        $('#checkout-form').addEventListener('submit', e => {
            e.preventDefault();
            const f = e.currentTarget;
            $$('.invalid', f).forEach(el => el.classList.remove('invalid'));
            const invalid = $$('input,select,textarea', f).filter(el => el.required && !el.checkValidity());
            if (!cartEntries().length) {
                $('#checkout-error').textContent = 'Your bag is empty.';
                return;
            }
            if (invalid.length) {
                invalid.forEach(el => el.classList.add('invalid'));
                $('#checkout-error').textContent = 'Please complete the required fields correctly.';
                invalid[0].focus();
                return;
            }
            const form = new FormData(f);
            const orderId = 'SF-' + Date.now().toString(36).toUpperCase().slice(-8);
            const order = {
                id: orderId,
                date: new Date().toISOString(),
                customer: String(form.get('firstName') || '').trim() + ' ' + String(form.get('lastName') || '').trim(),
                items: cartEntries().map(({ product: p, qty }) => ({ id: p.id, name: p.name, qty, price: p.price })),
                payment: String(form.get('payment') || ''),
                subtotal: subtotal(),
                discount: discount(),
                shipping: shipping(),
                total: total()
            };
            // Only save non-sensitive order summary in current tab: no contact, street address or payment details.
            try {
                sessionStorage.setItem(KEYS.order, JSON.stringify(order));
            }
            catch { }
            state.cart = {};
            state.coupon = '';
            save(KEYS.cart, state.cart);
            save(KEYS.coupon, state.coupon);
            location.href = 'order-confirmation.html';
        });
    }
    function initConfirmation() {
        let order = null;
        try {
            order = JSON.parse(sessionStorage.getItem(KEYS.order) || 'null');
        }
        catch { }
        const c = $('#confirmation-content');
        if (!order) {
            c.innerHTML = `<div class="success-icon">⌁</div><span class="eyebrow">YOUR SHOPPING JOURNEY</span><h1>READY TO <em>EXPLORE?</em></h1><p>Complete the checkout flow to see your order confirmation.</p><a class="btn btn-red btn-large" href="products.html">Explore the collection ↗</a>`;
            return;
        }
        c.innerHTML = `<div class="success-icon">✓</div><span class="eyebrow">CHECKOUT SIMULATION COMPLETE</span><h1>NICELY <em>DONE.</em></h1><p>Thanks, ${attr(order.customer)}. Your sample order was created successfully.<br>No payment was processed or physical order placed.</p><div class="confirmation-card"><div><span>Order reference</span><strong>${attr(order.id)}</strong></div><div><span>Date</span><strong>${new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div><div><span>Items</span><strong>${order.items.reduce((s, x) => s + x.qty, 0)} item(s)</strong></div><div><span>Payment selection</span><strong>${attr(order.payment)}</strong></div><div><span>Sample order total</span><strong>${money(order.total)}</strong></div></div><div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap"><a class="btn btn-red btn-large" href="products.html">Continue shopping ↗</a><button id="print-order" class="btn btn-soft btn-large" type="button">Print summary ↗</button></div>`;
        $('#print-order').addEventListener('click', () => window.print());
    }
    /* Wishlist and comparison */
    function renderWishlist() { const list = state.wish.map(P).filter(Boolean); injectCards('#wishlist-grid', list); $('#wishlist-empty').hidden = list.length > 0; }
    function renderComparePage() {
        const selected = state.compare.map(P).filter(Boolean);
        const c = $('#compare-content');
        if (!selected.length) {
            c.innerHTML = `<div class="empty-state"><span>⇄</span><h3>No products selected.</h3><p>Use the ⇄ control on product cards to compare up to three gadgets.</p><a class="btn btn-red" href="products.html">Explore products ↗</a></div>`;
            return;
        }
        let rows = [
            ['Price', p => money(p.price)],
            ['Category', p => p.category],
            ['Product summary', p => p.summary],
            ['Feature 1', p => p.specs[0]?.value || '—'],
            ['Feature 2', p => p.specs[1]?.value || '—'],
            ['Feature 3', p => p.specs[2]?.value || '—'],
            ['Feature 4', p => p.specs[3]?.value || '—']
        ];
        c.innerHTML = `<p style="color:var(--text-soft);font-size:13px">Compare product specifications side by side before making a decision.</p><div class="compare-table-wrap"><table class="compare-table"><thead><tr><th>Product</th>${selected.map(p => `<td><div class="compare-product-preview"><img src="${p.image}" alt="${attr(p.name)}"><b>${attr(p.name)}</b><button class="btn btn-red btn-sm" data-add="${p.id}">Add to bag ↗</button></div></td>`).join('')}</tr></thead><tbody>${rows.map(([name, fn]) => `<tr><th scope="row">${name}</th>${selected.map(p => `<td>${attr(fn(p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div style="margin-top:20px"><button id="compare-reset" class="btn btn-soft">Clear comparison</button></div>`;
        $('#compare-reset').addEventListener('click', () => { state.compare = []; save(KEYS.compare, state.compare); renderCompareBar(); renderComparePage(); });
    }
    /* Initialization */
    initializeCommon();
    switch (page) {
        case 'index':
            initHome();
            break;
        case 'products':
            initCatalog();
            break;
        case 'product':
            initProduct();
            break;
        case 'cart':
            renderCartPage();
            break;
        case 'checkout':
            initCheckout();
            break;
        case 'order-confirmation':
            initConfirmation();
            break;
        case 'wishlist':
            renderWishlist();
            break;
        case 'compare':
            renderComparePage();
            break;
    }
    reveal();
})();
