# Deployment Guide

## Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Set the framework to Node.js.
4. Add environment variables from `.env.example`.
5. Deploy.

## Supabase

Used for:
- `shopify_sessions` table — offline access tokens per shop (auto-created on first use, see `lib/sessionStore.js`)
- future: metadata storage, app settings, auth or user records

Set `SUPABASE_POOLER_URL` (preferred for serverless) or `SUPABASE_DIRECT_URL` in env vars.

## Cloudflare R2

Use R2 for:
- theme assets
- uploaded section previews
- downloadable media files

## Shopify app config

After deploying, update `shopify.app.toml`'s `application_url` and `[auth].redirect_urls` to the real Vercel URL, run `shopify app deploy` to push config, and set `SHOPIFY_APP_URL` in Vercel env vars to match.

## Suggested next real app changes

- Replace the demo section catalog with Supabase-backed data.
- Store uploaded section images in R2.
- Register an `app/uninstalled` webhook to delete the shop's row from `shopify_sessions`.
