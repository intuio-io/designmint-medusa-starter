# storefront

[<picture><source srcset="https://user-images.githubusercontent.com/59018053/229103275-b5e482bb-4601-46e6-8142-244f531cebdb.svg" media="(prefers-color-scheme: dark)"><img src="https://user-images.githubusercontent.com/59018053/229103726-e5b529a3-9b3f-4970-8a1f-c6af37f087bf.svg" alt="Medusa logo"></picture>](https://www.medusajs.com)

## Medusa Next.js Starter Template

Combine Medusa's modules for your commerce backend with the newest Next.js 15 features for a performant storefront.

[![PRs welcome!](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat)](https://github.com/medusajs/medusa/blob/master/CONTRIBUTING.md)[![Discord Chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg)](https://discord.gg/xpCwq3Kfn8)[![Follow @medusajs](https://img.shields.io/twitter/follow/medusajs.svg?label=Follow%20@medusajs)](https://twitter.com/intent/follow?screen_name=medusajs)

#### Prerequisites

To use the [Next.js Starter Template](https://medusajs.com/nextjs-commerce/), you should have a Medusa server running locally on port 9000.\
For a quick setup, run:

```shell
npx create-medusa-app@latest
```

Check out [create-medusa-app docs](https://docs.medusajs.com/create-medusa-app) for more details and troubleshooting.

## Overview

The Medusa Next.js Starter is built with:

* [Next.js](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Typescript](https://www.typescriptlang.org/)
* [Medusa](https://medusajs.com/)

Features include:

* Full ecommerce support:
  * Product Detail Page
  * Product Overview Page
  * Product Collections
  * Cart
  * Checkout with Stripe
  * User Accounts
  * Order Details
* Full Next.js 15 support:
  * App Router
  * Next fetching/caching
  * Server Components
  * Server Actions
  * Streaming
  * Static Pre-Rendering

## Quickstart

#### Setting up the environment variables

Navigate into your projects directory and get your environment variables ready:

```shell
cd nextjs-starter-medusa/
mv .env.template .env.local
```

#### Install dependencies

Use Yarn to install all dependencies.

```shell
yarn
```

#### Start developing

You are now ready to start up your project.

```shell
yarn dev
```

#### Open the code and start customizing

Your site is now running at http://localhost:8000!

## Payment integrations

By default this starter supports the following payment integrations

* [Stripe](https://stripe.com/)

To enable the integrations you need to add the following to your `.env.local` file:

```shell
NEXT_PUBLIC_STRIPE_KEY=<your-stripe-public-key>
```

You'll also need to setup the integrations in your Medusa server. See the [Medusa documentation](https://docs.medusajs.com) for more information on how to configure [Stripe](https://docs.medusajs.com/resources/commerce-modules/payment/payment-provider/stripe#main).

## Resources

### Learn more about Medusa

* [Website](https://www.medusajs.com/)
* [GitHub](https://github.com/medusajs)
* [Documentation](https://docs.medusajs.com/)

### Learn more about Next.js

* [Website](https://nextjs.org/)
* [GitHub](https://github.com/vercel/next.js)
* [Documentation](https://nextjs.org/docs)
