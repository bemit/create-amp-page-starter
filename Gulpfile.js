import path from 'path'
import {ampCreator, gulp} from 'create-amp-page'
import markdownit from 'markdown-it'
import {adjustHeadingLevel} from './markdown-it-headline-adjust.js'
import markdownFootnote from 'markdown-it-footnote'
import markdownAbbr from 'markdown-it-abbr'
import markdownAnchor from 'markdown-it-anchor'
import markdownToc from 'markdown-it-toc-done-right'
import markdownDeflist from 'markdown-it-deflist'
import markdownIns from 'markdown-it-ins'
import markdownMark from 'markdown-it-mark'

const liveUrl = 'https://create-amp-page.netlify.app/'

const makePathFromFile = file => path.basename(file).replace('.twig', '')
const port = process.env.PORT || 4488

// for infos check `create-amp-page` docs or typings/inline-doc!
const tasks = ampCreator({
    port: port,
    paths: {
        styles: 'src/styles',
        stylesInject: 'main.css',
        html: 'src/html',
        htmlPages: 'src/html/pages',
        media: 'src/media',
        copy: [
            {src: ['src/api/*'], prefix: 1},
            {src: ['public/*'], prefix: 2},
            {src: ['src/email/*'], prefix: 1},
            {src: ['public/**/*'], prefix: 1},
        ],
        dist: 'build',
        distMedia: 'media',
        distStyles: 'styles',
    },
    ampOptimize: process.env.NODE_ENV === 'production',
    cleanInlineCSS: process.env.NODE_ENV === 'production',
    cleanInlineCSSWhitelist: [
        // headline anchors
        '#anc-*',
        // footnotes
        '#fn*',
    ],
    collections: [{
        data: 'src/data/blog/*.md',
        tpl: 'src/html/blog.twig',
        base: 'blog/',
    }],
    twig: {
        data: {
            ampEnabled: true,
        },
        json: (file) => 'src/data/' + makePathFromFile(file) + '.json',
        fm: (file) => {
            return 'src/data/' + makePathFromFile(file) + '.md'
        },
        fmMap: (data, file) => ({
            head: {
                title: data.attributes.title,
                description: data.attributes.description,
                lang: data.attributes.lang,
            },
            links: {
                canonical: makePathFromFile(file.path) === 'index' ? liveUrl : liveUrl + makePathFromFile(file.path),
                origin: process.env.NODE_ENV === 'development' ? 'http://localhost:' + port : liveUrl,
            },
            hero_image: data.attributes.hero_image,
            content: renderMd(data.body),
        }),
    },
    watchFolders: {
        twig: ['src/data/**/*.json', 'src/data/**/*.md'],
        sass: [],
        media: [],
    },
    prettyUrlExtensions: ['html'],
})
Object.keys(tasks).forEach(taskName => gulp.task(taskName, tasks[taskName]))

const slugify = s => 'anc-' + encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-').replace(/&/g, ''))
const md = markdownit({
    // html: true,
    xhtmlOut: true,
    linkify: true,
    typographer: true,
})
    .use(adjustHeadingLevel, {firstLevel: 2})
    .use(markdownFootnote)
    .use(markdownAbbr)
    .use(markdownAnchor, {
        permalink: true, permalinkBefore: true, permalinkSymbol: '#',
        level: 3,
        slugify,
    })
    .use(markdownToc, {
        slugify,
        level: 3,
    })
    .use(markdownDeflist)
    .use(markdownIns)
    .use(markdownMark)


const defaultLinkRenderer = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
}
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    const hrefRaw = tokens[idx].attrs && tokens[idx].attrs.reduce((v, prev) => prev || v[0] === 'href')
    const href = hrefRaw ? hrefRaw[1] : ''
    if(
        href.indexOf('http://') === 0 ||
        href.indexOf('https://') === 0 ||
        href.indexOf('ftp://') === 0 ||
        href.indexOf('ftps://') === 0
    ) {
        // add target blank and security attrs to any external/full url
        tokens[idx].attrPush(['target', '_blank'])
        tokens[idx].attrPush(['rel', 'noreferrer noopener'])
    }

    return defaultLinkRenderer(tokens, idx, options, env, self)
}

// plugin for advanced use cases:
// https://github.com/markdown-it/markdown-it-container

const renderMd = (text) => {
    return md.render(text)
}
const renderInlineMd = (text) => {
    return md.renderInline(text)
}
