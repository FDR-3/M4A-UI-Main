import { createApp } from 'vue'
import App from '/src/App.vue'
import router from './router'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/float-elements.css'
import '@ionic/vue/css/text-alignment.css'
import '@ionic/vue/css/text-transformation.css'
import '@ionic/vue/css/flex-utils.css'
import '@ionic/vue/css/display.css'

import '/src/assets/css/behavior.css'
import '/src/assets/css/colors.css'
import '/src/assets/css/fontsAndSizes.css'
import '/src/assets/css/ionic.css'
import '/src/assets/css/layout.css'
import '/src/assets/css/poopText.css'
import '/src/assets/css/primeVue.css'
import '/src/assets/css/rainbowText.css'
import '/src/assets/css/style.css'

//import 'primevue/resources/themes/saga-blue/theme.css'       //theme
//import 'primevue/resources/primevue.min.css'                 //core css
import 'primeicons/primeicons.css'                           //icons

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/*@import '@ionic/vue/css/palettes/dark.always.css' */
import 'vidstack/player/styles/base.css'
import 'vidstack/player/styles/plyr/theme.css'
import 'vidstack/player'
import 'vidstack/player/layouts/plyr'
import 'vidstack/player/ui'
import 'media-captions/styles/captions.css'
import 'media-captions/styles/regions.css'
import '@ionic/vue/css/palettes/dark.class.css'
//import '@ionic/vue/css/palettes/dark.system.css'
import PrimeVue from "primevue/config"
//import ConfirmationService from 'primevue/confirmationservice'
//import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import { Noir  }   from '/src/assets/styling/AuraNoir.vue'
import "solana-wallets-vue/styles.css"
import { initWallet } from "solana-wallets-vue"
import SolanaWallets from "solana-wallets-vue"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter,  TrezorWalletAdapter, CloverWalletAdapter, Coin98WalletAdapter, CoinbaseWalletAdapter, KeystoneWalletAdapter } from "@solana/wallet-adapter-wallets"
import { initM4AWorkspace, useM4AWorkspace } from '/src/assets/contracts/Solana/AnchorM4AWorkSpace.vue'
import { initChatWorkspace, useChatWorkspace } from '/src/assets/contracts/Solana/AnchorChatWorkSpace.vue'
import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

const walletOptions = 
{
  wallets: 
  [
    new TrezorWalletAdapter(),
    new KeystoneWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new Coin98WalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new CloverWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new CoinbaseWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new PhantomWalletAdapter({ network: WalletAdapterNetwork.Devnet }),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Devnet })
  ],
  autoConnect: true
}

initWallet(walletOptions)

const selectedM4AContractIndex = parseInt(localStorage.getItem("ContractSelectM4A") || "0")
const selectedChatContractIndex = parseInt(localStorage.getItem("ContractSelectChat") || "0")

initM4AWorkspace(selectedM4AContractIndex)
anchorPrograms.m4a = useM4AWorkspace()

initChatWorkspace(selectedChatContractIndex)
anchorPrograms.chat = useChatWorkspace()

const app = createApp(App)
  .use(IonicVue,
  {
    rippleEffect: false,
    mode: 'md',
  })
    
app.use(PrimeVue,
{
  theme: 
  {
    preset: Noir,
    options:
    {
      prefix: 'p',
      darkModeSelector: '.ion-palette-dark'
    }
  }
})

//app.use(AppState)
app.use(router)
//app.use(ConfirmationService)
app.use(ToastService)
//app.use(DialogService)
app.use(SolanaWallets, walletOptions)

//app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith('media-')

router.isReady().then(() =>
{
  app.mount('#app')
})