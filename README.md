# Create AMP Page Starter ⚡

> 🚧 This branch is deprecated, checkout the separate [create-page-starter repository](https://github.com/bemit/create-page-starter) for non-AMP pages.

## Feature/ESNext

This is not really AMP compatible, or harder to develop e.g. SSL for local `amp-script` debugging, max 150KB of total script sizes. Suites non-AMP pages perfectly. Use with AMP when you know what you do!

### ESNext Client Side

> beta: webpack and babel config with `wrap` on `ampCreator`

In `feature/esnext` a modern webpack & babel buildsetup is preconfigured.

Start coding in ES6+, Typescript and React, use babel plugins and more.

Embed or reference (`src`) the produced asset files directly.

Check the file level [differences between feature/esnext and master](https://github.com/bemit/create-amp-page-starter/compare/feature/esnext) starter template. Will be documented here when finalized as easy reproducible steps.

### React Static

Render your React directly at the build process, clean and rich HTML for SEO and client side speedup!

> alpha: it works, but features need optimizing / coworking-with-twig, like resizing used images
>
> template structure must be adjusted before using snap, as every dynamic thing must be rendered with react and not through twig
> or react-snap uses a different twig template for each page (seems to be hard)

Enabled in the `feature/esnext` branch, using [react-snap](https://github.com/stereobooster/react-snap) for "server side react rendering" and fixing [react-snap#493](https://github.com/stereobooster/react-snap/issues/493) through the custom `/copy.js`, adding the HTML cleaning and optimizing tasks again.

Commands:

    # use `snap-build` now instead of `build`
    npm run snap-build

## License

This project is free software distributed under the **MIT License**.

See: [LICENSE](LICENSE).

### Contributors

By committing your code/creating a pull request to this repository you agree to release the code under the MIT License attached to the repository.

## Copyright

2020 | [Michael Becker](https://mlbr.xyz), [bemit UG (haftungsbeschränkt)](https://bemit.codes)

