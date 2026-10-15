# Cloudflare setup

You do these steps once, in the Cloudflare dashboard. Every service stays on the free plan.

> [!WARNING]
> These steps put the docs site on the apex domain `givingtuesday.org` and gate it behind Access. If `givingtuesday.org` also serves the public website, this replaces that site with a login page. To avoid this, use a subdomain such as `docs.givingtuesday.org` in steps 3 and 4.

## 1. Move DNS to Cloudflare

1. In the Cloudflare dashboard, click **Add a domain** and enter `givingtuesday.org`. Select the **Free** plan.
2. Review the DNS records that Cloudflare imports. Compare them with the records at your current DNS provider. Add any missing record, especially `MX`, `TXT` (SPF, DKIM, DMARC), and verification records. A missing `MX` record stops email delivery.
3. At your domain registrar, replace the nameservers with the two that Cloudflare shows.
4. Wait until the domain status changes to **Active**.

## 2. Create the Pages project

1. Go to **Workers & Pages** and click **Create** > **Pages** > **Connect to Git**.
2. Select the `giving-tuesday/gt-docs` repository.
3. Set the build settings:

   | Setting                | Value           |
   | ---------------------- | --------------- |
   | Production branch      | `main`          |
   | Framework preset       | Astro           |
   | Build command          | `npm run build` |
   | Build output directory | `dist`          |

   The `.node-version` file in the repository sets the Node.js version.
4. Click **Save and Deploy**.

Every push to `main` now deploys to production. Pushes to other branches create preview deployments.

## 3. Add the custom domain

1. Open the Pages project and go to **Custom domains**.
2. Click **Set up a custom domain** and enter `givingtuesday.org`.
3. Confirm the DNS record that Cloudflare proposes.

## 4. Gate the site with Access

1. Open **Zero Trust**. If prompted, create a team name and choose the **Free** plan (up to 50 users).
2. Go to **Settings** > **Authentication** > **Login methods**. Confirm that **One-time PIN** is enabled. Do not add other identity providers.
3. Go to **Access** > **Applications** and click **Add an application** > **Self-hosted**.
4. Add these public hostnames to the application:
   - `givingtuesday.org`
   - `<project>.pages.dev`
   - `*.<project>.pages.dev` (preview deployments)

   Replace `<project>` with the Pages project name. Without the `pages.dev` hostnames, anyone can read the site at its default Pages URL.
5. Add a policy:

   | Setting  | Value                                |
   | -------- | ------------------------------------ |
   | Action   | Allow                                |
   | Include  | **Emails ending in** `@givingtuesday.org` |

6. Under login methods for the application, select **One-time PIN** only.
7. Save the application.

## 5. Verify

1. Open `https://givingtuesday.org` in a private browser window. The Access login page appears.
2. Enter an `@givingtuesday.org` address. Enter the code from the email. The site loads.
3. Enter an address from another domain. Access does not send a code, and the site stays blocked.
4. Repeat step 1 with `https://<project>.pages.dev`. The Access login page appears.
