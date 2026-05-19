/**
 * Performance & Final Polish Tests — Task #9
 * Covers: CSS performance (transition, will-change, pointer-events, outline),
 * Chat UX (Escape closes, chips hidden after click, input focus after submit),
 * Form UX (aria-busy, "Sending…" text), and GitHub Pages readiness.
 */
import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:8888';

// ─── CSS Performance ──────────────────────────────────────────────────────────

test.describe('CSS Performance', () => {
  test('.btn transition does not contain "all" — lists explicit properties', async ({ page }) => {
    await page.goto(BASE_URL);
    const transition = await page.evaluate(() => {
      const el = document.querySelector('.btn') as HTMLElement;
      if (!el) return null;
      return window.getComputedStyle(el).transition;
    });
    expect(transition, '.btn transition should exist').toBeTruthy();
    // Must not use "all" (catches both "all" and "all 0.3s ease")
    expect(transition, '.btn transition must not use "all"').not.toContain('all');
    // Should list at least one explicit property (background-color, color, etc.)
    const hasExplicit = /background|color|box-shadow|transform|border/.test(transition!);
    expect(hasExplicit, '.btn transition should list explicit properties').toBe(true);
  });

  test('.product-card CSS rule includes will-change: transform', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasWillChange = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule &&
                rule.selectorText === '.product-card' &&
                rule.style.willChange === 'transform') {
              return true;
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasWillChange, '.product-card CSS rule must have will-change: transform').toBe(true);
  });

  test('.differential-card CSS rule includes will-change: transform', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasWillChange = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule &&
                rule.selectorText === '.differential-card' &&
                rule.style.willChange === 'transform') {
              return true;
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasWillChange, '.differential-card CSS rule must have will-change: transform').toBe(true);
  });

  test('.tech-item CSS rule includes will-change: transform', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasWillChange = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule &&
                rule.selectorText === '.tech-item' &&
                rule.style.willChange === 'transform') {
              return true;
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasWillChange, '.tech-item CSS rule must have will-change: transform').toBe(true);
  });

  test('.kana-chat.is-open has pointer-events: auto (not "all")', async ({ page }) => {
    await page.goto(BASE_URL);
    // Open the chat first to get the is-open class applied
    await page.locator('#kana-toggle').click();
    await page.waitForTimeout(300);
    const pointerEvents = await page.evaluate(() => {
      const chat = document.querySelector('#kana-chat') as HTMLElement;
      if (!chat) return null;
      return window.getComputedStyle(chat).pointerEvents;
    });
    expect(pointerEvents, '#kana-chat.is-open pointer-events should be "auto"').toBe('auto');
    // Also verify via CSS rule text — must not be "all"
    const hasAutoNotAll = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule &&
                rule.selectorText.includes('kana-chat') &&
                rule.selectorText.includes('is-open')) {
              const pe = rule.style.pointerEvents;
              if (pe) return pe === 'auto';
            }
          }
        } catch {}
      }
      return null;
    });
    expect(hasAutoNotAll, '.kana-chat.is-open pointer-events must be "auto" not "all" in CSS').toBe(true);
  });

  test('.btn base rule does NOT contain outline: none', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasOutlineNone = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      for (const sheet of sheets) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          for (const rule of rules) {
            if (rule instanceof CSSStyleRule && rule.selectorText === '.btn') {
              // outline: none or outline: 0 in the base .btn rule is an a11y violation
              const outline = rule.style.outline;
              return outline === 'none' || outline === '0' || outline === '0px';
            }
          }
        } catch {}
      }
      return false;
    });
    expect(hasOutlineNone, '.btn base rule must not set outline: none').toBe(false);
  });

  test('contact form fields have no inline style attributes with margin-bottom', async ({ page }) => {
    await page.goto(BASE_URL);
    const hasInlineMargin = await page.evaluate(() => {
      const form = document.querySelector('#contact-form');
      if (!form) return false;
      const allEls = Array.from(form.querySelectorAll('*'));
      return allEls.some(el => {
        const style = (el as HTMLElement).getAttribute('style') || '';
        return style.includes('margin-bottom');
      });
    });
    expect(hasInlineMargin, 'Contact form elements must not use inline style margin-bottom').toBe(false);
  });
});

// ─── Chat UX ─────────────────────────────────────────────────────────────────

test.describe('Chat UX', () => {
  test('pressing Escape when Kana chat is open closes it', async ({ page }) => {
    await page.goto(BASE_URL);
    // Open the chat
    await page.locator('#kana-toggle').click();
    await page.waitForTimeout(300);
    await expect(page.locator('#kana-chat')).toHaveClass(/is-open/);
    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    // Chat should be closed: aria-hidden true, no is-open class
    const ariaHidden = await page.locator('#kana-chat').getAttribute('aria-hidden');
    expect(ariaHidden, '#kana-chat should have aria-hidden="true" after Escape').toBe('true');
    const hasIsOpen = await page.locator('#kana-chat').evaluate(el => el.classList.contains('is-open'));
    expect(hasIsOpen, '#kana-chat should not have is-open class after Escape').toBe(false);
  });

  test('clicking a quick-reply chip hides the chips container', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await page.waitForTimeout(300);
    // Chips should be visible before clicking
    const chip = page.locator('#kana-quick-replies button').first();
    await expect(chip).toBeVisible();
    // Click first chip
    await chip.click();
    await page.waitForTimeout(300);
    // Quick-replies container should now be hidden
    const display = await page.locator('#kana-quick-replies').evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    expect(display, '#kana-quick-replies should be display:none after chip click').toBe('none');
  });

  test('after chip click, chips do not re-appear', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await page.waitForTimeout(300);
    await page.locator('#kana-quick-replies button').first().click();
    // Wait for the bot response to arrive
    await page.waitForTimeout(4500);
    // Chips still hidden
    const display = await page.locator('#kana-quick-replies').evaluate(el => {
      return window.getComputedStyle(el).display;
    });
    expect(display, '#kana-quick-replies should remain hidden after bot response').toBe('none');
  });

  test('after submitting a message via kana form, input is focused', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await page.waitForTimeout(300);
    await page.locator('#kana-input').fill('hello');
    await page.locator('#kana-input').press('Enter');
    await page.waitForTimeout(300);
    const isFocused = await page.evaluate(() => {
      return document.activeElement?.id === 'kana-input';
    });
    expect(isFocused, '#kana-input should be focused after form submit').toBe(true);
  });
});

// ─── Form UX ─────────────────────────────────────────────────────────────────

test.describe('Form UX', () => {
  test('submit button gets aria-busy="true" when submitted with valid data', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#field-name').fill('Test User');
    await page.locator('#field-email').fill('test@example.com');
    // Fill subject if present
    const subjectField = page.locator('#field-subject');
    if (await subjectField.count() > 0) {
      await subjectField.fill('Test subject');
    }
    await page.locator('#field-message').fill('This is a test message for aria-busy validation.');
    // Click submit and immediately check aria-busy
    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await submitBtn.click();
    // aria-busy should be set during submission
    const ariaBusy = await submitBtn.getAttribute('aria-busy');
    expect(ariaBusy, 'Submit button should have aria-busy="true" during submission').toBe('true');
  });

  test('submit button text changes to "Sending…" (Unicode ellipsis U+2026)', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#field-name').fill('Test User');
    await page.locator('#field-email').fill('test@example.com');
    const subjectField = page.locator('#field-subject');
    if (await subjectField.count() > 0) {
      await subjectField.fill('Test subject');
    }
    await page.locator('#field-message').fill('This is a test message for button text validation.');
    const submitBtn = page.locator('#contact-form button[type="submit"]');
    await submitBtn.click();
    const btnText = await submitBtn.textContent();
    // Must contain Unicode ellipsis (U+2026), not three separate dots
    expect(btnText, 'Submit button text should be "Sending\u2026"').toContain('Sending\u2026');
    // Must NOT be three separate dots
    expect(btnText, 'Submit button must use Unicode ellipsis, not "..."').not.toContain('Sending...');
  });
});

// ─── GitHub Pages Readiness ───────────────────────────────────────────────────

test.describe('GitHub Pages Readiness', () => {
  test('.nojekyll file exists at repo root', async () => {
    const repoRoot = path.join(process.cwd());
    const nojekyllPath = path.join(repoRoot, '.nojekyll');
    const exists = fs.existsSync(nojekyllPath);
    expect(exists, '.nojekyll file must exist at repo root').toBe(true);
  });

  test('README.md exists at repo root', async () => {
    const repoRoot = path.join(process.cwd());
    const readmePath = path.join(repoRoot, 'README.md');
    const exists = fs.existsSync(readmePath);
    expect(exists, 'README.md must exist at repo root').toBe(true);
  });

  test('README.md contains deployment instructions mentioning "GitHub Pages"', async () => {
    const repoRoot = path.join(process.cwd());
    const readmePath = path.join(repoRoot, 'README.md');
    const content = fs.readFileSync(readmePath, 'utf-8');
    expect(content, 'README.md must mention "GitHub Pages"').toContain('GitHub Pages');
  });
});

// ─── Regression — full golden path ───────────────────────────────────────────

test.describe('V4 Regression', () => {
  test('no console errors after all Task 9 changes', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });

  test('kana chat still opens and closes after Task 9 changes', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await expect(page.locator('#kana-chat')).toHaveClass(/is-open/);
    await page.locator('.kana-chat__close').click();
    await expect(page.locator('#kana-chat')).not.toHaveClass(/is-open/);
  });

  test('contact form still submits successfully after Task 9 changes', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#field-name').fill('Test User');
    await page.locator('#field-email').fill('test@example.com');
    const subjectField = page.locator('#field-subject');
    if (await subjectField.count() > 0) {
      await subjectField.fill('Test subject');
    }
    await page.locator('#field-message').fill('Final regression test message.');
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator('.form-success')).toBeVisible({ timeout: 6000 });
  });

  test('mobile menu still opens and closes after Task 9 changes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.locator('.navbar__hamburger').click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });
    await page.locator('.mobile-menu__close').click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });
  });
});
