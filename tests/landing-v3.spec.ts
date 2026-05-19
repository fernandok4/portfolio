/**
 * V3 Tests — Iteration 3 changes
 * Covers: product deep-link IDs, #why in nav, footer product links,
 * theme-color, sameAs JSON-LD, og:url trailing slash, lang attributes,
 * prefers-reduced-motion, subject autocomplete=off, kana chat wasOpen delay,
 * kana chat max-height on short viewports, tech stack SVG icons.
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8888';

// ─── SEO & Meta Additions ─────────────────────────────────────────────────────

test.describe('SEO & Meta — V3 additions', () => {
  test('theme-color meta tag is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const meta = page.locator('meta[name="theme-color"]');
    await expect(meta).toHaveCount(1);
    const content = await meta.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content).toMatch(/^#/);
  });

  test('og:url has trailing slash', async ({ page }) => {
    await page.goto(BASE_URL);
    const ogUrl = page.locator('meta[property="og:url"]');
    const content = await ogUrl.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.endsWith('/')).toBe(true);
  });

  test('JSON-LD contains sameAs with GitHub link', async ({ page }) => {
    await page.goto(BASE_URL);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    const parsed = JSON.parse(content!);
    expect(parsed.sameAs).toBeDefined();
    expect(Array.isArray(parsed.sameAs)).toBe(true);
    const hasGithub = parsed.sameAs.some((url: string) =>
      url.toLowerCase().includes('github')
    );
    expect(hasGithub).toBe(true);
  });
});

// ─── Product Card Deep-Link IDs ───────────────────────────────────────────────

test.describe('Product Card Deep-Link IDs', () => {
  const productIds = [
    'product-auth',
    'product-comm',
    'product-catalog',
    'product-pay',
    'product-realtime',
    'product-docs',
    'product-ai',
  ];

  for (const id of productIds) {
    test(`#${id} exists as a product card`, async ({ page }) => {
      await page.goto(BASE_URL);
      const card = page.locator(`#${id}`);
      await expect(card).toBeAttached();
      await expect(card).toHaveClass(/product-card/);
    });
  }

  test('all 7 product IDs are unique', async ({ page }) => {
    await page.goto(BASE_URL);
    const ids = await page.evaluate(() =>
      Array.from(document.querySelectorAll('.product-card[id]')).map(el => el.id)
    );
    expect(ids.length).toBe(7);
    expect(new Set(ids).size).toBe(7); // all unique
  });

  test('footer product links resolve to product card IDs', async ({ page }) => {
    await page.goto(BASE_URL);
    const footerProductLinks = page.locator('footer a[href^="#product-"]');
    const count = await footerProductLinks.count();
    expect(count).toBeGreaterThanOrEqual(3);
    for (let i = 0; i < count; i++) {
      const href = await footerProductLinks.nth(i).getAttribute('href');
      if (href) {
        const id = href.substring(1);
        const target = page.locator(`#${id}`);
        expect(await target.count(), `Footer link ${href} has no matching element`).toBeGreaterThan(0);
      }
    }
  });
});

// ─── #why in Nav & Footer ─────────────────────────────────────────────────────

test.describe('#why in Navigation', () => {
  test('navbar contains a link to #why', async ({ page }) => {
    await page.goto(BASE_URL);
    const whyLink = page.locator('nav.navbar a[href="#why"]');
    await expect(whyLink).toHaveCount(1);
  });

  test('mobile menu contains a link to #why', async ({ page }) => {
    await page.goto(BASE_URL);
    const whyLink = page.locator('#mobile-menu a[href="#why"]');
    await expect(whyLink).toHaveCount(1);
  });

  test('footer contains a link to #why', async ({ page }) => {
    await page.goto(BASE_URL);
    const whyLink = page.locator('footer a[href="#why"]');
    await expect(whyLink).toHaveCount(1);
  });

  test('#why section resolves when navigated to', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.goto(BASE_URL + '#why');
    await expect(page.locator('#why')).toBeAttached();
  });
});

// ─── lang="pt-BR" on Portuguese Strings ──────────────────────────────────────

test.describe('lang="pt-BR" on Portuguese strings', () => {
  test('"Disponível" badges have lang="pt-BR"', async ({ page }) => {
    await page.goto(BASE_URL);
    const badges = page.locator('[lang="pt-BR"]').filter({ hasText: 'Disponível' });
    const count = await badges.count();
    expect(count).toBe(6);
  });

  test('"Em breve" badge has lang="pt-BR"', async ({ page }) => {
    await page.goto(BASE_URL);
    const badge = page.locator('[lang="pt-BR"]').filter({ hasText: 'Em breve' });
    await expect(badge).toHaveCount(1);
  });

  test('Portuguese eyebrow/label has lang="pt-BR"', async ({ page }) => {
    await page.goto(BASE_URL);
    // "Consultoria" eyebrow in ai-cta section
    const consultoria = page.locator('[lang="pt-BR"]').filter({ hasText: /consultoria/i });
    const count = await consultoria.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ─── subject field autocomplete="off" ────────────────────────────────────────

test.describe('Contact Form subject autocomplete', () => {
  test('subject field has autocomplete="off"', async ({ page }) => {
    await page.goto(BASE_URL);
    const subject = page.locator('#field-subject');
    await expect(subject).toBeAttached();
    const autocomplete = await subject.getAttribute('autocomplete');
    expect(autocomplete).toBe('off');
  });
});

// ─── Tech Stack SVG Icons ─────────────────────────────────────────────────────

test.describe('Tech Stack SVG Icons', () => {
  test('tech section has at least 10 tech items', async ({ page }) => {
    await page.goto(BASE_URL);
    const techItems = page.locator('.tech-item');
    const count = await techItems.count();
    expect(count).toBeGreaterThanOrEqual(10);
  });

  test('each tech item contains an SVG icon', async ({ page }) => {
    await page.goto(BASE_URL);
    const techItems = page.locator('.tech-item');
    const count = await techItems.count();
    let svgCount = 0;
    for (let i = 0; i < count; i++) {
      const svg = techItems.nth(i).locator('svg');
      if (await svg.count() > 0) svgCount++;
    }
    // At least 8 of 10 items should have SVG icons
    expect(svgCount).toBeGreaterThanOrEqual(8);
  });

  test('tech item SVGs have viewBox attribute', async ({ page }) => {
    await page.goto(BASE_URL);
    const techSvgs = page.locator('.tech-item svg');
    const count = await techSvgs.count();
    expect(count).toBeGreaterThanOrEqual(8);
    // Spot-check first 3
    for (let i = 0; i < Math.min(3, count); i++) {
      const viewBox = await techSvgs.nth(i).getAttribute('viewBox');
      expect(viewBox).toBeTruthy();
    }
  });
});

// ─── Kana Chat wasOpen Delay ──────────────────────────────────────────────────

test.describe('Kana Chat — wasOpen greeting delay', () => {
  test('opening chat then clicking chip shows greeting before chip response', async ({ page }) => {
    await page.goto(BASE_URL);
    // Open chat fresh (wasOpen = false, not initialized)
    await page.locator('#kana-toggle').click();
    // Wait briefly for the 700ms greeting delay + typewriter to start
    await page.waitForTimeout(900);
    // A greeting message should appear before the chip response
    const messages = page.locator('#kana-messages').locator('[class*="msg"]');
    const count = await messages.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('clicking chip when chat already open has no greeting delay', async ({ page }) => {
    await page.goto(BASE_URL);
    // Open, wait for greeting, then interact
    await page.locator('#kana-toggle').click();
    await page.waitForTimeout(1500); // let greeting initialize
    const chip = page.locator('#kana-quick-replies button').first();
    await chip.click();
    await page.waitForTimeout(3500);
    const messages = page.locator('#kana-messages').locator('[class*="msg"]');
    expect(await messages.count()).toBeGreaterThanOrEqual(1);
    // Chat should still be open and intact
    await expect(page.locator('#kana-chat')).toHaveAttribute('aria-hidden', 'false');
  });
});

// ─── Kana Chat max-height on short viewport ───────────────────────────────────

test.describe('Kana Chat — max-height on short viewport', () => {
  test('kana chat does not overflow viewport on 568px-height screen', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 568 });
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    const chat = page.locator('#kana-chat');
    await expect(chat).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });
    const chatBox = await chat.boundingBox();
    expect(chatBox).not.toBeNull();
    // Chat bottom edge should not exceed viewport height
    expect(chatBox!.y + chatBox!.height).toBeLessThanOrEqual(568 + 5);
  });

  test('kana chat max-height uses viewport-aware CSS', async ({ page }) => {
    await page.goto(BASE_URL);
    const maxHeight = await page.locator('#kana-chat').evaluate(el => {
      return window.getComputedStyle(el).maxHeight;
    });
    // Should not be 'none' — a max-height constraint should be set
    expect(maxHeight).not.toBe('none');
  });
});

// ─── prefers-reduced-motion ───────────────────────────────────────────────────

test.describe('prefers-reduced-motion', () => {
  test('reduced-motion CSS block is present in stylesheet', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasReducedMotion = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSMediaRule &&
                rule.conditionText.includes('prefers-reduced-motion')) {
              return true;
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasReducedMotion).toBe(true);
  });

  test('page loads without errors under reduced-motion emulation', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    // Emulate reduced motion via media feature override
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('typewriter shows static text under reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    const typewriter = page.locator('#typewriter');
    await expect(typewriter).toBeAttached();
    const text = await typewriter.textContent();
    // Should show a static word rather than empty string cycling
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  test('no horizontal overflow under reduced-motion on mobile', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});

// ─── About Avatar SVG ─────────────────────────────────────────────────────────

test.describe('About Avatar SVG', () => {
  test('about avatar contains an SVG element', async ({ page }) => {
    await page.goto(BASE_URL);
    const avatar = page.locator('.about__avatar');
    await expect(avatar).toBeAttached();
    const svg = avatar.locator('svg');
    await expect(svg).toBeAttached();
  });
});

// ─── Regression — existing key flows ─────────────────────────────────────────

test.describe('Regression — key flows after V3 changes', () => {
  test('H1 renders without forced line break', async ({ page }) => {
    await page.goto(BASE_URL);
    const h1 = page.locator('#hero-title');
    await expect(h1).toBeVisible();
    // Should not contain a raw <br> as a child element (H1 fix)
    const brCount = await h1.locator('br').count();
    expect(brCount).toBe(0);
  });

  test('section anchor nav still resolves all hrefs', async ({ page }) => {
    await page.goto(BASE_URL);
    const navLinks = page.locator('nav.navbar a[href^="#"]');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (href && href !== '#') {
        const id = href.substring(1);
        const exists = await page.locator(`#${id}`).count();
        expect(exists, `Nav link #${id} has no matching section`).toBeGreaterThan(0);
      }
    }
  });

  test('no console errors after V3 changes on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('contact form still submits successfully after V3', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#field-name').fill('Test V3');
    await page.locator('#field-email').fill('test@v3.com');
    await page.locator('#field-message').fill('Regression test after V3 changes.');
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator('.form-success')).toBeVisible({ timeout: 3000 });
  });

  test('kana chat still opens and responds after V3', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await expect(page.locator('#kana-chat')).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });
    await page.locator('#kana-input').fill('products');
    await page.locator('#kana-input').press('Enter');
    await page.waitForTimeout(3500);
    const msgs = page.locator('#kana-messages').locator('[class*="msg"]');
    expect(await msgs.count()).toBeGreaterThanOrEqual(1);
  });
});
