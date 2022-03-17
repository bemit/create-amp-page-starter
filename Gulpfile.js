import path from 'path'
import {ampCreator, getPageInfo, getPagesIndex, gulp} from 'create-amp-page'
import markdownit from 'markdown-it'
import {adjustHeadingLevel} from './markdown-it-headline-adjust.js'
import markdownFootnote from 'markdown-it-footnote'
import markdownAbbr from 'markdown-it-abbr'
import markdownAnchor from 'markdown-it-anchor'
import markdownToc from 'markdown-it-toc-done-right'
import markdownDeflist from 'markdown-it-deflist'
import markdownIns from 'markdown-it-ins'
import markdownMark from 'markdown-it-mark'
import AmpOptimizer from '@ampproject/toolbox-optimizer'

const makePathFromFile = file => path.basename(file).replace('.twig', '')
const port = process.env.PORT || 4488
const isDev = process.env.NODE_ENV === 'development'

const urls = {
    defaultPage: {
        local: {base: 'http://localhost:' + port + '/defaultPage/'},
        prod: {base: 'https://create-amp-page.netlify.app/'},
    },
}

const pages = {
    defaultPage: {
        paths: {
            styles: 'src/styles',
            stylesInject: 'main.css',
            style: 'main.scss',
            html: 'src/html',
            copy: [
                {src: ['src/api/*'], prefix: 1},
                {src: ['public/*'], prefix: 2},
                {src: ['src/email/*'], prefix: 1},
                {src: ['public/**/*'], prefix: 1},
            ],
            dist: 'build/defaultPage',
            distStyles: 'styles',
        },
    },
}

// for infos check `create-amp-page` docs or typings/inline-doc!
const tasks = ampCreator({
    port: port,
    dist: 'build',
    srcMedia: 'src/media',
    distMedia: 'media',
    ampOptimizer: !isDev ? AmpOptimizer.create({}) : undefined,
    cleanInlineCSS: !isDev,
    cleanInlineCSSWhitelist: [
        // headline anchors
        '#anc-*',
        // footnotes
        '#fn*',
    ],
    pages: pages,
    collections: [{
        //data: 'src/data',
        fm: (file) => 'src/data/' + makePathFromFile(file) + '.md',
        tpl: 'src/html/pages/*.twig',
        pagesByTpl: true,
        base: '',
        pageId: 'defaultPage',
    }, {
        fm: 'src/data/blog/*.md',
        tpl: 'src/html/blog.twig',
        base: 'blog',
        pageId: 'defaultPage',
    }],
    twig: {
        data: {
            cssInject: !isDev,
            ampEnabled: true,
            injectNetlifyIdentity: false,
        },
        fmMap: (data, files) => {
            const pageId = files.pageId
            const pageEnv = isDev ? 'local' : 'prod'
            const {
                pagePath, pageBase, relPath,
            } = getPageInfo(files, urls, pageId, pageEnv)
            const pagesIndex = getPagesIndex(urls, pageEnv)
            const pageData = pages[pageId]
            return {
                pageId: pageId,
                styleSheets: [
                    pageData.paths.stylesInject,
                ],
                head: {
                    title: data.attributes.title,
                    description: data.attributes.description,
                    lang: data.attributes.lang,
                },
                links: {
                    canonical: pageBase + pagePath,
                    origin: pageBase,
                    cdn: isDev ? 'http://localhost:' + port + '/' : pageBase,
                    pages: pagesIndex,
                },
                request: {
                    path: pagePath,
                    // relPath,
                },
                hero_image: data.attributes.hero_image,
                content: renderMd(data.body),
            }
        },
        logicLoader: async () => {
            const functions = await import('./twigLogic/functions.js?buster=' + new Date().getTime()).then(m => m.default)
            return {
                functions,
            }
        },
        functions: [],
    },
    watchFolders: {
        twig: ['src/data/**/*.json', 'src/data/**/*.md', 'twigLogic/**/*.js'],
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
