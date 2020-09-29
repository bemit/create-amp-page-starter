import React from 'react'
import {hydrate, render} from 'react-dom'
import {loadableReady} from '@loadable/component'

const App = () => <p>Hi from React!</p>
const rootElement = document.getElementById('root-pwa')
if(rootElement.hasChildNodes()) {
    loadableReady(() => {
        hydrate(<App/>, rootElement)
    })
} else {
    render(<App/>, rootElement)
}
