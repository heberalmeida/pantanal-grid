import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { PantanalGrid } from '@pantanal/grid'
import PantanalLogo from '../components/PantanalLogo.vue'
import '@pantanal/grid/styles.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register PantanalGrid globally
    app.component('PantanalGrid', PantanalGrid)
    // Register PantanalLogo globally
    app.component('PantanalLogo', PantanalLogo)
  }
}
