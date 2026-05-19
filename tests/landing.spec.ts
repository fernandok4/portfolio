import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:8888';

// ─── Page Structure & SEO ────────────────────────────────────────────────────

test.describe('Page Structure & SEO', () => {
  test('has correct page title', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/KanashaWorks/i);
  });

  test('has meta description', async ({ page }) => {
    await page.goto(BASE_URL);
    const meta = page.locator('meta[name="description"]');
    await expect(meta).toHaveCount(1);
    const content = await meta.getAttribute('content');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(50);
  });

  test('has Open Graph tags', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:type"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:url"]')).toHaveCount(1);
  });

  test('has Twitter Card tags', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveCount(1);
  });

  test('has canonical URL', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  });

  test('has JSON-LD schema', async ({ page }) => {
    await page.goto(BASE_URL);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);
    const content = await jsonLd.textContent();
    expect(content).toBeTruthy();
    const parsed = JSON.parse(content!);
    expect(parsed['@context']).toBe('https://schema.org');
  });

  test('has semantic HTML structure', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#site-header')).toHaveCount(1);
    await expect(page.locator('main#main')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(1);
    await expect(page.locator('nav.navbar')).toHaveCount(1);
    const sectionCount = await page.locator('section').count();
    expect(sectionCount).toBeGreaterThanOrEqual(4);
  });

  test('has viewport meta tag', async ({ page }) => {
    await page.goto(BASE_URL);
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);
    const content = await viewport.getAttribute('content');
    expect(content).toContain('width=device-width');
  });
});

// ─── Navigation ──────────────────────────────────────────────────────────────

test.describe('Navigation', () => {
  test('header is present and visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#site-header')).toBeVisible();
  });

  test('nav links are present (at least 3)', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('nav.navbar a[href^="#"]').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('CTA button in nav is visible on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    const ctaButton = page.locator('nav.navbar .btn').first();
    await expect(ctaButton).toBeVisible();
  });

  test('mobile hamburger button is present on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await expect(page.locator('.navbar__hamburger')).toBeVisible();
  });

  test('mobile menu opens on hamburger click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.locator('.navbar__hamburger').click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });
  });

  test('mobile menu closes on close button click', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await page.locator('.navbar__hamburger').click();
    await page.locator('.mobile-menu__close').click();
    await expect(page.locator('#mobile-menu')).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });
  });

  test('nav links point to section anchors', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('nav.navbar a[href^="#"]').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });
});

// ─── Hero Section ────────────────────────────────────────────────────────────

test.describe('Hero Section', () => {
  test('H1 heading is present with text', async ({ page }) => {
    await page.goto(BASE_URL);
    const h1 = page.locator('#hero-title');
    await expect(h1).toBeVisible();
    const text = await h1.textContent();
    expect(text!.trim().length).toBeGreaterThan(0);
  });

  test('hero CTA buttons are present', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.hero__cta a, .hero__cta button').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('typewriter element is present in hero', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#typewriter')).toBeAttached();
  });

  test('hero tech badges are present', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.tech-badge').count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('hero visual / Kana SVG renders', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.hero__visual')).toBeAttached();
    await expect(page.locator('.hero__visual svg')).toBeAttached();
  });
});

// ─── Kana Chat Widget ─────────────────────────────────────────────────────────

test.describe('Kana Chat Widget', () => {
  test('kana toggle button is present', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#kana-toggle')).toBeVisible();
  });

  test('kana chat opens on toggle click', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await expect(page.locator('#kana-chat')).toHaveAttribute('aria-hidden', 'false', { timeout: 2000 });
  });

  test('quick-reply chips render inside kana chat', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    const count = await page.locator('#kana-quick-replies button').count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('clicking a quick-reply chip adds a message', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    const chip = page.locator('#kana-quick-replies button').first();
    await expect(chip).toBeVisible();
    await chip.click();
    await page.waitForTimeout(3500);
    const count = await page.locator('#kana-messages').locator('[class*="msg"]').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('chat input field accepts text', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    const input = page.locator('#kana-input');
    await expect(input).toBeVisible();
    await input.fill('autenticação');
    await expect(input).toHaveValue('autenticação');
  });

  test('submitting a known query via input shows response', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await page.locator('#kana-input').fill('auth');
    await page.locator('#kana-input').press('Enter');
    await page.waitForTimeout(3500);
    const count = await page.locator('#kana-messages').locator('[class*="msg"]').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('unmatched query shows fallback response', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await page.locator('#kana-input').fill('xyzabcqrstuvwxyz123notvalid');
    await page.locator('#kana-input').press('Enter');
    await page.waitForTimeout(3500);
    const count = await page.locator('#kana-messages').locator('[class*="msg"]').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('chat messages container is scrollable', async ({ page }) => {
    await page.goto(BASE_URL);
    const overflow = await page.locator('#kana-messages').evaluate(el => {
      return window.getComputedStyle(el).overflowY;
    });
    expect(['auto', 'scroll']).toContain(overflow);
  });

  test('kana chat closes on close button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#kana-toggle').click();
    await page.locator('.kana-chat__close').click();
    await expect(page.locator('#kana-chat')).toHaveAttribute('aria-hidden', 'true', { timeout: 2000 });
  });
});

// ─── Products Grid ────────────────────────────────────────────────────────────

test.describe('Products Grid', () => {
  test('products section exists with correct id', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#products')).toBeAttached();
  });

  test('exactly 7 product cards render', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.product-card').count();
    expect(count).toBe(7);
  });

  test('6 cards have "Disponível" badge', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.product-card__status--available').count();
    expect(count).toBe(6);
  });

  test('1 card has "Em breve" badge (AI Agents)', async ({ page }) => {
    await page.goto(BASE_URL);
    const soon = page.locator('.product-card__status--soon');
    expect(await soon.count()).toBe(1);
    await expect(soon).toHaveText('Em breve');
  });

  test('all 7 known products are named on the page', async ({ page }) => {
    await page.goto(BASE_URL);
    const pageText = await page.textContent('body');
    const products = [
      'Kanasha Authentication',
      'Kanasha Communication',
      'Kanasha Product Catalog',
      'Kanasha Payments',
      'Kanasha Realtime',
      'Kanasha Docs Portal',
      'Kanasha AI Agents',
    ];
    for (const product of products) {
      expect(pageText, `Product "${product}" not found`).toContain(product);
    }
  });

  test('product cards have name and tagline', async ({ page }) => {
    await page.goto(BASE_URL);
    const firstCard = page.locator('.product-card').first();
    await expect(firstCard.locator('.product-card__name')).toBeVisible();
    await expect(firstCard.locator('.product-card__tagline')).toBeVisible();
  });
});

// ─── Why Section ──────────────────────────────────────────────────────────────

test.describe('Why KanashaWorks Section', () => {
  test('why section exists with correct id', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#why')).toBeAttached();
  });

  test('exactly 6 differential cards render', async ({ page }) => {
    await page.goto(BASE_URL);
    expect(await page.locator('.differential-card').count()).toBe(6);
  });

  test('differential cards have titles', async ({ page }) => {
    await page.goto(BASE_URL);
    expect(await page.locator('.differential-card__title').count()).toBe(6);
  });
});

// ─── About Section ────────────────────────────────────────────────────────────

test.describe('About Section', () => {
  test('about section exists with correct id', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#about')).toBeAttached();
  });

  test('Fernando Kanashiro name is displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.about__name')).toHaveText('Fernando Kanashiro');
  });

  test('creator role is displayed', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('.about__role')).toBeVisible();
  });

  test('tech skill badges are present in about section', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.about__skills .skill-tag, .about__skills .skill-badge, .about__skills [class*="skill"]').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('about stats show 7 services and 79+ workflows', async ({ page }) => {
    await page.goto(BASE_URL);
    const text = await page.locator('#about').textContent();
    expect(text).toContain('7');
    expect(text).toContain('79+');
  });
});

// ─── Contact Form ─────────────────────────────────────────────────────────────

test.describe('Contact Form', () => {
  test('contact form is present', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#contact-form')).toBeVisible();
  });

  test('form has name, email, and message fields', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#field-name')).toBeVisible();
    await expect(page.locator('#field-email')).toBeVisible();
    await expect(page.locator('#field-message')).toBeVisible();
  });

  test('required field validation fires on empty submit', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#contact-form button[type="submit"]').click();
    // Custom JS validation: at least one .form-error should have text
    const errors = page.locator('.form-error');
    const count = await errors.count();
    let visibleErrors = 0;
    for (let i = 0; i < count; i++) {
      const text = await errors.nth(i).textContent();
      if (text && text.trim().length > 0) visibleErrors++;
    }
    expect(visibleErrors).toBeGreaterThanOrEqual(1);
  });

  test('email format validation rejects invalid email', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#field-name').fill('Test User');
    await page.locator('#field-email').fill('not-an-email');
    await page.locator('#field-message').fill('Test message content');
    await page.locator('#contact-form button[type="submit"]').click();
    const emailValid = await page.locator('#field-email').evaluate(
      el => (el as HTMLInputElement).validity.valid
    );
    expect(emailValid).toBe(false);
  });

  test('successful submit shows success message', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('#field-name').fill('João Silva');
    await page.locator('#field-email').fill('joao@empresa.com');
    await page.locator('#field-message').fill('Gostaria de saber mais sobre os serviços da plataforma.');
    await page.locator('#contact-form button[type="submit"]').click();
    await expect(page.locator('.form-success')).toBeVisible({ timeout: 3000 });
    const text = await page.locator('.form-success').textContent();
    expect(text).toContain('Message sent');
  });
});

// ─── Footer ───────────────────────────────────────────────────────────────────

test.describe('Footer', () => {
  test('footer is present and visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('footer[role="contentinfo"]')).toBeVisible();
  });

  test('footer has at least 3 column headings', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.footer__col-title').count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test('footer contains at least 5 links', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('footer .footer__links a').count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('footer bottom contains KanashaWorks copyright', async ({ page }) => {
    await page.goto(BASE_URL);
    const text = await page.locator('.footer__bottom').textContent();
    expect(text).toMatch(/kanasha/i);
  });
});

// ─── Section IDs for Anchor Navigation ────────────────────────────────────────

test.describe('Section IDs for Anchor Navigation', () => {
  test('all navbar anchor hrefs resolve to existing elements', async ({ page }) => {
    await page.goto(BASE_URL);
    const navLinks = page.locator('nav.navbar a[href^="#"]');
    const count = await navLinks.count();
    for (let i = 0; i < count; i++) {
      const href = await navLinks.nth(i).getAttribute('href');
      if (href && href !== '#') {
        const id = href.substring(1);
        const exists = await page.locator(`#${id}`).count();
        expect(exists, `Section #${id} referenced in nav does not exist`).toBeGreaterThan(0);
      }
    }
  });

  test('key sections have expected ids', async ({ page }) => {
    await page.goto(BASE_URL);
    for (const id of ['hero', 'products', 'why', 'about', 'contact']) {
      await expect(page.locator(`#${id}`), `Section #${id} missing`).toBeAttached();
    }
  });
});

// ─── Responsive Layout ────────────────────────────────────────────────────────

test.describe('Responsive Layout', () => {
  test('renders at mobile 375px — H1, header, footer visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await expect(page.locator('#hero-title')).toBeVisible();
    await expect(page.locator('#site-header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('renders at tablet 768px', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    await expect(page.locator('#hero-title')).toBeVisible();
    await expect(page.locator('#site-header')).toBeVisible();
  });

  test('renders at desktop 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE_URL);
    await expect(page.locator('#hero-title')).toBeVisible();
    await expect(page.locator('#site-header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('no horizontal overflow on mobile 375px', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    // Use documentElement.scrollWidth — body.scrollWidth can include off-screen fixed elements
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
  });
});

// ─── Animations & Scroll Reveal ───────────────────────────────────────────────

test.describe('Animations & Scroll Reveal', () => {
  test('.reveal elements exist on the page', async ({ page }) => {
    await page.goto(BASE_URL);
    const count = await page.locator('.reveal').count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('reveal elements gain .visible class after scrolling', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(800);
    const count = await page.locator('.reveal.visible').count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

// ─── Console Errors ────────────────────────────────────────────────────────────

test.describe('Console Errors', () => {
  test('no JS errors on page load', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => {
      errors.push(err.message);
    });
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    expect(errors).toHaveLength(0);
  });
});
