'use strict'
const path = require('path')
const {ampCreator} = require('create-amp-page')

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
            {src: ['./src/api/*'], prefix: 1},
            {src: ['./public/*'], prefix: 2},
        ],
        dist: 'build',
        distMedia: 'media',
        distStyles: 'styles',
    },
    twig: {
        data: {
            ampEnabled: true,
        },
        json: (file) => './src/data/' + path.basename(file).replace('.twig', '') + '.json',
        fm: (file) => './src/data/' + path.basename(file).replace('.twig', '') + '.md',
        fmMap: (data) => ({
            head: {
                title: data.attributes.title,
                description: data.attributes.description,
                lang: data.attributes.lang,
            },
        }),
    },
    prettyUrlExtensions: ['html'],
})
