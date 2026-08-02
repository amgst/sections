# Deployment Guide

## Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Set the framework to Node.js.
4. Add environment variables from `.env.example`.
5. Deploy.

## Supabase

Use Supabase for:
- metadata storage
- merchant sessions
- app settings
- auth or user records

## Cloudflare R2

Use R2 for:
- theme assets
- uploaded section previews
- downloadable media files

## Suggested next real app changes

- Replace the demo API with Supabase-backed data.
- Store uploaded section images in R2.
- Use Vercel serverless functions for `/api/*` endpoints.
- Add Shopify OAuth and App Bridge when moving toward a production public app.
