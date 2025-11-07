import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faSun,
  faMoon,
  faLeaf,
  faMeteor,
  faChevronDown,
  faHouse,
  faTableCellsLarge,
  faTableList,
  faMobileScreenButton,
  faFolder,
  faCloudArrowDown,
  faSatelliteDish,
  faGears,
  faFloppyDisk,
  faPalette,
  faLayerGroup,
  faTableColumns,
  faArrowsUpDownLeftRight,
  faRocket,
  faEllipsis,
  faPuzzlePiece,
  faLanguage,
  faFlagCheckered,
  faImages,
  faCirclePlay,
  faBars,
  faXmark,
  faDiagramProject,
  faLink,
  faSitemap,
  faTableCells,
  faCalendar,
  faBell,
  faWifi,
  faPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faSun,
  faMoon,
  faLeaf,
  faMeteor,
  faChevronDown,
  faHouse,
  faTableCellsLarge,
  faTableList,
  faMobileScreenButton,
  faFolder,
  faCloudArrowDown,
  faSatelliteDish,
  faGears,
  faFloppyDisk,
  faPalette,
  faLayerGroup,
  faTableColumns,
  faArrowsUpDownLeftRight,
  faRocket,
  faEllipsis,
  faPuzzlePiece,
  faLanguage,
  faFlagCheckered,
  faImages,
  faCirclePlay,
  faBars,
  faXmark,
  faDiagramProject,
  faLink,
  faSitemap,
  faTableCells,
  faCalendar,
  faBell,
  faWifi,
  faPen,
)

createApp(App)
  .component('FontAwesomeIcon', FontAwesomeIcon)
  .use(router)
  .mount('#app')
