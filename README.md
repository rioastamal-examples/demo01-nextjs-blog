# About

Take a look at branch `journey-2.3` for a working version of a full-stack app built with AWS Amplify.

# How to Deploy

Steps to deploy to AWS Amplify.

1. Create new AWS Amplify App
1. Choose GitHub as Git provider
1. Connect to this repository
1. Choose `main` branch
1. Enter `journey-1.0` for the application name
1. Enter `npm run build` for Frontend build command
1. Enter `.next` for Build output directory
1. Save and Deploy

# Portfolio Starter Kit

This portfolio is built with **Next.js** and a library called [Nextra](https://nextra.vercel.app/). It allows you to write Markdown and focus on the _content_ of your portfolio. This starter includes:

- Automatically configured to handle Markdown/MDX
- Generates an RSS feed based on your posts
- A beautiful theme included out of the box
- Easily categorize posts with tags
- Fast, optimized web font loading

https://demo.vercel.blog

## Configuration

1. Update your name in `theme.config.js` or change the footer.
1. Update your name and site URL for the RSS feed in `scripts/gen-rss.js`.
1. Update the meta tags in `pages/_document.tsx`.
1. Update the posts inside `pages/posts/*.md` with your own content.

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example blog my-blog
# or
yarn create next-app --example blog my-blog
# or
pnpm create next-app --example blog my-blog
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
