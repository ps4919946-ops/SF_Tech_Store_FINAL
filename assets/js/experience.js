/* SF Tech Store — ambient experience layer
 * Ko Kyi Phyu Aung · kyiphyuaung@strategyfirst.edu.mm
 * Decorative SVG icons are accessible-safe, pointer-events-free, and motion-sensitive.
 * No authentication or network dependencies.
 */
(() => {
    'use strict';
    const d = document;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const icons = {
        cpu: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9" y="9" width="6" height="6" rx=".5"/><path d="M9 2v4m6-4v4M9 18v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
        laptop: '<rect x="4" y="4" width="16" height="12" rx="1.6"/><path d="m2 20 2-4h16l2 4H2Z"/><path d="M10 18h4"/>',
        headphones: '<path d="M3 14v-3a9 9 0 0 1 18 0v3"/><rect x="3" y="12" width="4" height="8" rx="2"/><rect x="17" y="12" width="4" height="8" rx="2"/>',
        keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M5 9h1m3 0h1m3 0h1m3 0h1M5 12h1m3 0h1m3 0h1m3 0h1M5 15h1m3 0h8"/>',
        mouse: '<rect x="6" y="2" width="12" height="20" rx="6"/><path d="M12 2v7M6 10h12"/>',
        monitor: '<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/>',
        code: '<path d="m8 5-6 7 6 7m8-14 6 7-6 7m-3-17-2 20"/>',
        wifi: '<path d="M2 9a15 15 0 0 1 20 0M5.3 12.6a10 10 0 0 1 13.4 0m-10 3.8a5 5 0 0 1 6.6 0"/><circle cx="12" cy="20" r="1"/>',
        gamepad: '<path d="M7 7h10c2.3 0 3.7 1.3 4.2 3.6l1 5.6a3 3 0 0 1-4.7 3l-3.2-2.6H9.7l-3.2 2.6a3 3 0 0 1-4.7-3l1-5.6C3.3 8.3 4.7 7 7 7Z"/><path d="M6 12h6m-3-3v6"/><circle cx="17" cy="11" r=".8"/><circle cx="19" cy="14" r=".8"/>',
        phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4m-3 14h2"/>',
        drive: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h6m-6 4h2"/><circle cx="18" cy="12" r="1"/>',
        sparkle: '<path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2Z"/>',
        bolt: '<path d="m13.4 2-9.2 11h7.4L10.6 22l9.2-11h-7.4L13.4 2Z"/>',
        slider: '<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="16" cy="17" r="3"/>',
        camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3V7Z"/><circle cx="12" cy="13" r="4"/>',
        speaker: '<rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="15" r="4"/><circle cx="12" cy="7" r="1"/>',
    };
    // Deterministic positions make every load consistent and predictable.
    const presets = {
        hero: [
            ['cpu', 77, 12, 49, 0, 8, .64],
            ['headphones', 95, 23, 43, -2, 10, .4],
            ['code', 56, 9, 40, -4, 9, .36],
            ['gamepad', 90, 69, 42, -1, 12, .48],
            ['keyboard', 62, 82, 50, -5, 11, .5],
            ['wifi', 49, 64, 33, -2, 8, .36],
            ['mouse', 42, 18, 35, -4, 10, .33],
            ['monitor', 98, 51, 36, -3, 7, .45],
            ['phone', 27, 82, 29, -2, 9, .3],
            ['sparkle', 72, 54, 23, -2, 6, .5],
            ['bolt', 39, 41, 23, -1, 8, .31],
            ['drive', 11, 86, 28, -3, 11, .3],
        ],
        collection: [
            ['keyboard', 4, 10, 37, -2, 12, .18],
            ['headphones', 96, 22, 40, -5, 10, .18],
            ['cpu', 88, 79, 34, -1, 11, .16],
            ['mouse', 8, 78, 29, -2, 9, .18],
            ['sparkle', 48, 6, 25, -4, 9, .12]
        ],
        feature: [
            ['cpu', 3, 24, 35, -2, 9, .14],
            ['code', 94, 12, 38, -5, 11, .14],
            ['gamepad', 96, 80, 36, -1, 12, .13],
            ['monitor', 4, 87, 35, -4, 10, .12]
        ],
        spotlight: [
            ['wifi', 11, 20, 48, -2, 11, .38],
            ['gamepad', 90, 9, 43, -3, 12, .34],
            ['headphones', 94, 76, 44, -1, 9, .4],
            ['cpu', 41, 87, 35, -5, 8, .3],
            ['sparkle', 63, 11, 29, -3, 7, .41],
            ['code', 16, 74, 37, -4, 10, .32],
        ],
        mast: [
            ['laptop', 89, 33, 37, -3, 10, .19],
            ['headphones', 72, 80, 33, -4, 11, .17],
            ['cpu', 98, 77, 34, -1, 8, .17],
            ['sparkle', 49, 20, 25, -2, 8, .15],
        ],
        cta: [
            ['code', 7, 45, 37, -5, 10, .23],
            ['sparkle', 77, 27, 32, -2, 7, .32],
            ['keyboard', 96, 57, 45, -4, 11, .23],
            ['bolt', 34, 84, 24, -3, 9, .21]
        ],
    };
    const scenes = [
        ['.hero', 'hero'],
        ['.category-section', 'collection'],
        ['.featured-section', 'feature'],
        ['.spotlight', 'spotlight'],
        ['.last-cta', 'cta'],
        ['.page-mast', 'mast'],
    ];
    function makeField(host, name) {
        const field = d.createElement('div');
        field.className = `ambient-field ambient-${name}`;
        field.setAttribute('aria-hidden', 'true');
        for (const [id, x, y, size, delay, duration, alpha] of presets[name]) {
            const el = d.createElement('span');
            el.className = 'ambient-icon';
            el.style.cssText = `--x:${x}%;--y:${y}%;--size:${size}px;--delay:${delay}s;--duration:${duration}s;--alpha:${alpha};--twist:${Math.round((x - 50) / 9)}deg;`;
            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[id]}</svg>`;
            field.appendChild(el);
        }
        host.insertBefore(field, host.firstChild);
        host.classList.add('has-ambient');
        return field;
    }
    const active = [];
    for (const [selector, name] of scenes) {
        const host = d.querySelector(selector);
        if (host)
            active.push({ host, field: makeField(host, name), name });
    }
    const bar = d.createElement('div');
    bar.className = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    d.body.appendChild(bar);
    let queued = false;
    function updateScroll() {
        const max = d.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? Math.max(0, Math.min(1, window.scrollY / max)) : 0})`;
        queued = false;
    }
    window.addEventListener('scroll', () => { if (!queued) {
        queued = true;
        requestAnimationFrame(updateScroll);
    } }, { passive: true });
    window.addEventListener('resize', updateScroll, { passive: true });
    updateScroll();
    // Pointer parallax is intentionally small and runs only over the hero.
    if (!reduced.matches && window.matchMedia('(pointer:fine)').matches) {
        const hero = active.find(s => s.name === 'hero');
        if (hero) {
            let req = 0, px = 0, py = 0;
            hero.host.addEventListener('pointermove', ev => {
                const b = hero.host.getBoundingClientRect();
                px = ((ev.clientX - b.left) / b.width - .5) * 14;
                py = ((ev.clientY - b.top) / b.height - .5) * 12;
                if (!req)
                    req = requestAnimationFrame(() => {
                        hero.field.style.setProperty('--pointer-x', `${px.toFixed(1)}px`);
                        hero.field.style.setProperty('--pointer-y', `${py.toFixed(1)}px`);
                        req = 0;
                    });
            }, { passive: true });
            hero.host.addEventListener('pointerleave', () => {
                hero.field.style.setProperty('--pointer-x', '0px');
                hero.field.style.setProperty('--pointer-y', '0px');
            });
        }
    }
})();
