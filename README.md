# Create AMP Page Starter

[![Netlify Status](https://api.netlify.com/api/v1/badges/c2214cb4-af67-4525-a4ce-a4c68d3fa70d/deploy-status)](https://app.netlify.com/sites/create-amp-page/deploys)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

Starting point for AMP pages generated with [`create-amp-page`](https://github.com/bemit/create-amp-page) and using [`@formanta/sass`](https://formanta.bemit.codes) for styling.

    npm i
    npm start

    # or
    npm run build

Check `/build` folder for files and open [localhost:4488](http://localhost:4488) for your page!

[![Run on CodeSandbox](https://img.shields.io/badge/run%20on%20CodeSandbox-blue?labelColor=fff&logoColor=505050&style=for-the-badge&logo=codesandbox)](https://codesandbox.io/s/github/bemit/create-amp-page-starter)

Uses the default create-amp-page features and configures them with additional features.

- uses `.scss` files
- page data as `.json` and `.md` with frontmatter
- twig templates and pages
    - automatic pages by template files in `src/html/pages`
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

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

### Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the MIT License attached to the repository.

## Copyright

2020 | [Michael Becker](https://mlbr.xyz), [bemit UG (haftungsbeschränkt)](https://bemit.codes)

