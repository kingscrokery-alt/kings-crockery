# Kings Crockery

A responsive storefront inspired by https://yearandday.com/.

## Local development

Run `npm install`, then `npm run dev`.

## Ordering setup

Set `whatsappNumber` in `app/shop-config.ts` to the business number in international digits-only format. The Order Now flow prepares a WhatsApp message with cart items, colour, quantity, name, phone and delivery address. The visitor sends that message in WhatsApp. No payment is collected on this website.

Rs 250 is shown as an advance required before dispatch. Whether that amount is deducted from the final order total or is an additional charge is not assumed. Configure that policy after the owner confirms it.

## Catalogue

The 105 products in `app/catalog.json` are reference catalogue content, not verified Kings Crockery inventory. Prices intentionally display “Price on request” pending the owner's actual PKR prices. Reference names, images, colour variants and collection types are included for design review. Replace with the actual inventory before taking live orders.

## Implementation

Homepage, catalogue and product routes, collection filters, colour selectors, product galleries, category carousel, animated marquee, responsive navigation, search sheet, persisted cart, bundle selection, information pages and WhatsApp enquiry flow are implemented. Information and journal content is adapted for Kings Crockery. This is not a verified pixel-for-pixel copy of every reference page, policy or third-party integration.

## Asset sources

Reference catalogue and campaign photography: https://yearandday.com/ and its public Shopify CDN. Local reference assets are under `public/images`; catalogue images use the source CDN. The hero asset `public/images/kings-table-hero.png` was edited with the built-in imagegen tool. Prompt: Remove only the yellow “20% OFF SITEWIDE” badge, reconstruct underlying surfaces, and preserve framing, objects, colours, geometry, lighting, and textures.

## Checks

TypeScript typecheck and app-scoped lint. Production build and HTTP route smoke checks. The generated component library has pre-existing repository-wide lint findings; those vendored files have not been modified. Browser interaction tests have not been performed.
