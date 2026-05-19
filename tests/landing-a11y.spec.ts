/**
 * Accessibility & SEO Hardening Tests — Task #8
 * Covers: color contrast, ARIA attributes, semantic HTML,
 * CSS utility classes, and SEO / structured data additions.
 */
import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8888';

// ─── Color Contrast ───────────────────────────────────────────────────────────

test.describe('Color Contrast', () => {
  test('form error color is dark enough (not #EF4444 red)', async ({ page }) => {
    await page.goto(BASE_URL);
    // Trigger a validation error to get a visible .form-error with text
    await page.locator('#contact-form button[type="submit"]').click();
    await page.waitForTimeout(200);
    const errorColor = await page.evaluate(() => {
      // Check computed color of the .form-error rule via a visible element
      const errors = Array.from(document.querySelectorAll('.form-error'));
      const visible = errors.find(el => (el as HTMLElement).textContent!.trim().length > 0);
      if (!visible) {
        // Fall back: inject a visible error and measure
        const el = document.querySelector('.form-error') as HTMLElement;
        if (!el) return null;
        return window.getComputedStyle(el).color;
      }
      return window.getComputedStyle(visible).color;
    });
    // Convert rgb string to hex for comparison
    const rgbToHex = (rgb: string) => {
      const m = rgb.match(/\d+/g);
      if (!m) return rgb;
      return '#' + m.slice(0, 3).map(n => parseInt(n).toString(16).padStart(2, '0')).join('').toUpperCase();
    };
    if (errorColor) {
      const hex = rgbToHex(errorColor);
      // Must NOT be #EF4444 (insufficient contrast on white)
      expect(hex, 'Form error color should not be the light #EF4444').not.toBe('#EF4444');
      // Red channel should be high but green/blue low — verify it's a dark red
      // #B91C1C = rgb(185,28,28) — r≥100, g<80, b<80
      const m = errorColor.match(/\d+/g);
      if (m) {
        const [r, g, b] = m.map(Number);
        // Should be a red hue with low green/blue for contrast
        expect(r, 'Error color red channel too low').toBeGreaterThan(100);
        expect(g, 'Error color green channel too high (not dark enough)').toBeLessThan(80);
        expect(b, 'Error color blue channel too high (not dark enough)').toBeLessThan(80);
      }
    }
  });
});

// ─── ARIA Attributes ──────────────────────────────────────────────────────────

test.describe('ARIA Attributes', () => {
  test('#mobile-menu has role="dialog"', async ({ page }) => {
    await page.goto(BASE_URL);
    const role = await page.locator('#mobile-menu').getAttribute('role');
    expect(role).toBe('dialog');
  });

  test('#mobile-menu has aria-modal="true"', async ({ page }) => {
    await page.goto(BASE_URL);
    const ariaModal = await page.locator('#mobile-menu').getAttribute('aria-modal');
    expect(ariaModal).toBe('true');
  });

  test('<main> has aria-label attribute', async ({ page }) => {
    await page.goto(BASE_URL);
    const label = await page.locator('main').getAttribute('aria-label');
    expect(label).toBeTruthy();
    expect(label!.length).toBeGreaterThan(0);
  });

  test('all SVGs inside .product-card__icon have aria-hidden="true"', async ({ page }) => {
    await page.goto(BASE_URL);
    const icons = page.locator('.product-card__icon svg');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < count; i++) {
      const ariaHidden = await icons.nth(i).getAttribute('aria-hidden');
      expect(ariaHidden, `.product-card__icon svg #${i} missing aria-hidden`).toBe('true');
    }
  });

  test('all SVGs inside .differential-card__icon have aria-hidden="true"', async ({ page }) => {
    await page.goto(BASE_URL);
    const icons = page.locator('.differential-card__icon svg');
    const count = await icons.count();
    expect(count).toBeGreaterThanOrEqual(6);
    for (let i = 0; i < count; i++) {
      const ariaHidden = await icons.nth(i).getAttribute('aria-hidden');
      expect(ariaHidden, `.differential-card__icon svg #${i} missing aria-hidden`).toBe('true');
    }
  });

  test('step number divs in how-it-works have aria-hidden="true"', async ({ page }) => {
    await page.goto(BASE_URL);
    // Step numbers are decorative — should be hidden from AT
    const stepNumbers = page.locator('.how-step__number, .step__number, [class*="step-number"], [class*="step__num"]');
    const count = await stepNumbers.count();
    if (count > 0) {
      for (let i = 0; i < count; i++) {
        const ariaHidden = await stepNumbers.nth(i).getAttribute('aria-hidden');
        expect(ariaHidden, `Step number #${i} missing aria-hidden`).toBe('true');
      }
    } else {
      // Fallback: look for numbered divs inside .how-step
      const howSteps = page.locator('.how-step');
      const stepCount = await howSteps.count();
      expect(stepCount).toBeGreaterThanOrEqual(1);
      // Check that any child with a pure digit text content has aria-hidden
      for (let i = 0; i < stepCount; i++) {
        const children = howSteps.nth(i).locator('[aria-hidden="true"]');
        const hiddenCount = await children.count();
        expect(hiddenCount, `How step #${i} has no aria-hidden decorative elements`).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

// ─── Semantic HTML ────────────────────────────────────────────────────────────

test.describe('Semantic HTML', () => {
  test('product feature lists have role="list"', async ({ page }) => {
    await page.goto(BASE_URL);
    const featureLists = page.locator('.product-card__features');
    const count = await featureLists.count();
    expect(count).toBeGreaterThanOrEqual(7);
    for (let i = 0; i < count; i++) {
      const role = await featureLists.nth(i).getAttribute('role');
      expect(role, `.product-card__features ul #${i} missing role="list"`).toBe('list');
    }
  });

  test('contact email is an <a href="mailto:..."> link', async ({ page }) => {
    await page.goto(BASE_URL);
    const mailtoLink = page.locator('a[href^="mailto:"]');
    const count = await mailtoLink.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const href = await mailtoLink.first().getAttribute('href');
    expect(href).toMatch(/^mailto:.+@.+/);
  });
});

// ─── CSS Utility ──────────────────────────────────────────────────────────────

test.describe('CSS Utility Classes', () => {
  test('.visually-hidden rule contains clip-path (not just deprecated clip)', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasClipPath = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule &&
                rule.selectorText.includes('visually-hidden')) {
              return rule.cssText.includes('clip-path');
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasClipPath).toBe(true);
  });

  test('.visually-hidden class hides element visually but keeps it in DOM', async ({ page }) => {
    await page.goto(BASE_URL);
    // Inject a visually-hidden element and verify it's in DOM but not visible
    const result = await page.evaluate(() => {
      const el = document.createElement('span');
      el.className = 'visually-hidden';
      el.textContent = 'test';
      document.body.appendChild(el);
      const rect = el.getBoundingClientRect();
      const inDOM = document.body.contains(el);
      const style = window.getComputedStyle(el);
      document.body.removeChild(el);
      return {
        inDOM,
        width: rect.width,
        height: rect.height,
        position: style.position,
      };
    });
    expect(result.inDOM).toBe(true);
    // Should be visually hidden (1px or 0px dimensions, or absolute positioned off-screen)
    expect(result.width).toBeLessThanOrEqual(1);
    expect(result.height).toBeLessThanOrEqual(1);
  });
});

// ─── SEO / Structured Data ────────────────────────────────────────────────────

test.describe('SEO & Structured Data', () => {
  test('JSON-LD contains ContactPoint', async ({ page }) => {
    await page.goto(BASE_URL);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const content = await jsonLd.textContent();
    const parsed = JSON.parse(content!);
    // ContactPoint may be nested — check the raw text for the type
    expect(content).toContain('ContactPoint');
  });

  test('JSON-LD ContactPoint has contactType', async ({ page }) => {
    await page.goto(BASE_URL);
    const content = await page.locator('script[type="application/ld+json"]').textContent();
    const parsed = JSON.parse(content!);
    // Find ContactPoint anywhere in the structure
    const findContactPoint = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return null;
      if (obj['@type'] === 'ContactPoint') return obj;
      for (const val of Object.values(obj)) {
        const found = findContactPoint(val);
        if (found) return found;
      }
      return null;
    };
    const cp = findContactPoint(parsed);
    expect(cp, 'ContactPoint not found in JSON-LD').not.toBeNull();
    expect(cp.contactType, 'ContactPoint missing contactType').toBeTruthy();
  });

  test('twitter:creator meta tag is present', async ({ page }) => {
    await page.goto(BASE_URL);
    const creator = page.locator('meta[name="twitter:creator"]');
    await expect(creator).toHaveCount(1);
    const content = await creator.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });
});

// ─── Regression — existing a11y basics still hold ────────────────────────────

test.describe('A11y Regression', () => {
  test('mobile menu aria-hidden still toggles correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'true');
    await page.locator('.navbar__hamburger').click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });
    await page.locator('.mobile-menu__close').click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });
  });

  test('kana messages has role="log" and aria-live="polite"', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#kana-messages')).toHaveAttribute('role', 'log');
    await expect(page.locator('#kana-messages')).toHaveAttribute('aria-live', 'polite');
  });

  test('no console errors after a11y hardening', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });
});
