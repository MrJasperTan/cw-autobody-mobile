# Mobile Autobody Website

A standalone Next.js website for a mobile auto body and repair business.

## Editable Content

Most business information is centralized in `lib/site-data.ts`:

- Business name, service area, phone, email, address, and hours
- CTA labels and quote links
- Services, process steps, reviews, FAQ, warranty, and SEO keywords
- Hero and section image URLs

## Development

```bash
npm install
npm run dev
```

## Owner CMS

Owner dashboard:

```text
/cms
```

Local development defaults to `cw-demo-owner` when `CMS_OWNER_PASSWORD` is not set. Production requires `CMS_OWNER_PASSWORD`; also set a separate, long `CMS_SESSION_SECRET`.

## Storage and Database

- R2 stores estimate images and CMS media uploads.
- Turso stores editable CMS JSON, estimate requests, estimate image URLs, and lead status.
- The app auto-creates the required Turso tables on first API use.

Required deployment variables are listed in `.env.example`.

## Vercel

This repository is Vercel-ready. Use the repository root as the project root:

```text
/
```

Set all variables from `.env.example` in Vercel Project Settings before production deployment.

## GitHub

Commit this folder normally with the generated `package-lock.json`. Do not commit `.env.local`, `.next`, or `node_modules`.

## SEO

The site includes metadata, Open Graph/Twitter tags, sitemap, robots.txt, manifest, and JSON-LD structured data for an `AutoBodyShop`.
