import path from 'path'
import {ampCreator, gulp} from 'create-amp-page'
import AmpOptimizer from '@ampproject/toolbox-optimizer'

const makePathFromFile = file => path.basename(file).replace('.twig', '').replace('.md', '')
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
    open: '/defaultPage',
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
        fm: (file) => 'src/data/' + makePathFromFile(file) + '.md',
        tpl: 'src/html/pages/*.twig',
        base: '',
        pageId: 'defaultPage',
    }, {
        fm: 'src/data/blog/*.md',
        tpl: 'src/html/blog.twig',
        base: 'blog',
        pageId: 'defaultPage',
    }],
    data: {
        cssInject: true,
        ampEnabled: true,
        injectNetlifyIdentity: false,
    },
    fmMap: async (data, files) => await import('./logic/fmMap.js?buster=' + new Date().getTime()).then(m => m.default(port, urls, pages, data, files)),
    twig: {
        logicLoader: async () => {
            const functions = await import('./logic/functions.js?buster=' + new Date().getTime()).then(m => m.default)
            return {
                functions,
            }
        },
        functions: [],
    },
    watchFolders: {
        twig: ['src/data/**/*.json', 'src/data/**/*.md', 'logic/**/*.js'],
        sass: [],
        media: [],
    },
    prettyUrlExtensions: ['html'],
})
Object.keys(tasks).forEach(taskName => gulp.task(taskName, tasks[taskName]))

