# Create AMP Page Starter

[![Netlify Status](https://api.netlify.com/api/v1/badges/c2214cb4-af67-4525-a4ce-a4c68d3fa70d/deploy-status)](https://app.netlify.com/sites/create-amp-page/deploys)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Starting point for [AMP](https://amp.dev) pages generated with [create-amp-page](https://github.com/bemit/create-amp-page) and using [@formanta/sass](https://formanta.bemit.codes) for styling.
Directly deploy with [netlify cms](https://www.netlifycms.org/) as git managed static site generator!

    npm i
    npm start

    # or
    npm run build

    npm run tasks
    npm run clean

Open [localhost:4488](http://localhost:4488) for your local page preview and change something in `src/*`!

[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to%20netlify-success?style=for-the-badge&logo=netlify&labelColor=0e1e25&color=00C7B7)](https://app.netlify.com/start/deploy?repository=https://github.com/bemit/create-amp-page-starter) [![Run on CodeSandbox](https://img.shields.io/badge/run%20on%20CodeSandbox-blue?labelColor=fff&logoColor=505050&style=for-the-badge&logo=codesandbox)](https://codesandbox.io/s/github/bemit/create-amp-page-starter)

Provides a basic file structure and uses the gulp build tasks of create-amp-page, with additionally: markdown and netlify cms.

- uses `.scss` files
- page data as `.json` and `.md` with frontmatter
- twig templates and pages
    - pages by template files in `src/html/pages`
    - pages with folders of frontmatter / collections
    - using page filename for
        - frontmatter files resolution
        - links generation (e.g. canonical)
- media optimizing for png, jpg, gif, svg
- markdown to HTML generation, preinstalled markdown-it plugins for extended syntax
- basic Twig template for AMP or none AMP pages
    - `ampEnabled = true` as template variable enables the needed AMP parts
    - HTML for AMP scripts
    - inline CSS parts for AMP, also where the CSS is injected by gulp task
    - `amp` attribute at `html` tag
- AMP Optimizer and removing unused CSS for production
- Headless Netlify CMS for site generation supported
    - uses also frontmatter
    - git repository management and netlify CI/CD
    - identity management by netlify, github and more
    - **easily removed** when not wanted:
        - delete `public/admin` folder and remove the netlify cms part in `src/html/_base.twig` block `foot_js`

## Default File Structure

- `build` dist folder after running `npm run build` or while `npm run start`
- `public` with general files in root like `manifest.json`
- `public/admin` config and setup files for netlify cms
- `src/api` may be used as mock api
- `src/data` contains the page frontmatter and data
- `src/html` is the base for all twig templates
- `src/html/pages` will be build to individual HTML pages
- `src/media` may contain images
- `src/styles/main.scss` is the style sheet

## Netlify CMS

This starter repository supports one click deployment on netlify, in your netlify project the identity handling must be setup you are ready! The template files, scripts and content schemas are already configured.

Setup identity management and adjust the email templates:

1. In netlify project, under identity: click `enable identity`
2. Click on "settings & usage"
3. Scroll to `Registration preferences` and change to `Invite only`
4. Add external providers with default config
5. Scroll to `Git Gateway` and click enable
6. Now the general identity handling is working
7. Change the email template paths, read why below.
    - `Invitation template` to: `/src/email/invitation.html`
    - `Confirmation template` to: `/src/email/confirmation.html`
    - `Recovery template` to: `/src/email/recovery.html`
    - `Email change template` to: `/src/email/email-change.html`
8. Invite yourself in the project's identity management
8. Ready to login under `https://<your-page-name>.netlify.app/admin/` and check your page at `https://<your-page-name>.netlify.app/`

You can edit your CMS content schemas in `public/admin/config.yml`.

This is an AMP boilerplate and can't use netlifys custom JS login redirect-handling, the login would be buggy: after login at `/admin` you will be redirected again to `/`, this triggers the login correctly (JWT exchange), but you will not be redirected to `/admin/` again. To solve this, the email templates must be changed and `/admin/` added between domain and `#` before the tokens, the templates at `src/email/` are already adjusted.

Take a look at the [authentication documentation for netlify cms](https://www.netlifycms.org/docs/add-to-your-site/#authentication), and check how to [configure the cms](https://www.netlifycms.org/docs/configuration-options/).

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

### Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the MIT License attached to the repository.

## Copyright

2020 | [Michael Becker](https://mlbr.xyz), [bemit UG (haftungsbeschränkt)](https://bemit.codes)

