'use strict'
const path = require('path')
const {ampCreator} = require('create-amp-page')
const markdownit = require('markdown-it')

const md = markdownit({
    // html: true,
    linkify: true,
    typographer: true,
})

const liveUrl = 'https://create-amp-page.netlify.app/'

const makePathFromFile = file => path.basename(file).replace('.twig', '')

// for infos check `create-amp-page` docs or typings/inline-doc!
module.exports = ampCreator({
    port: 4488,
    paths: {
        styles: 'src/styles',
        stylesInject: 'main.css',
        html: 'src/html',
        htmlPages: 'src/html/pages',
        media: 'src/media',
        copy: [
            {src: ['src/api/*'], prefix: 1},
            {src: ['public/*'], prefix: 2},
        ],
        dist: 'build',
        distMedia: 'media',
        distStyles: 'styles',
    },
    twig: {
        data: {
            ampEnabled: true,
        },
        json: (file) => 'src/data/' + makePathFromFile(file) + '.json',
        fm: (file) => 'src/data/' + makePathFromFile(file) + '.md',
        fmMap: (data, file) => ({
            head: {
                title: data.attributes.title,
                description: data.attributes.description,
                lang: data.attributes.lang,
            },
            links: {
                canonical: makePathFromFile(file) === 'index' ? liveUrl : liveUrl + makePathFromFile(file),
            },
            content: md.render(data.body),
        }),
    },
    watchFolders: {
        twig: ['src/data/**/*.json', 'src/data/**/*.md'],
        sass: [],
        media: [],
    },
    prettyUrlExtensions: ['html'],
})
