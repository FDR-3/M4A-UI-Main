<script lang="ts">
  import SmileyPage from './emoji/SmileyPage.vue'
  import PeoplePageSelector from './emoji/people/PeoplePageSelector.vue'
  import ObjectPage from './emoji/ObjectPage.vue'
  import FoodAndPlantPage from './emoji/FoodAndPlantPage.vue'
  import CarsAndSuchPage from './emoji/CarsAndSuchPage.vue'
  import SymbolsPage from './emoji/SymbolsPage.vue'

  import ClassicPage from './ascii art/ClassicPage.vue'
  import KaomojiHappyPage from './ascii art/KaomojiHappyPage.vue'
  import KaomojiGreetingsPage from './ascii art/KaomojiGreetingsPage.vue'
  import KaomojiActingCutePage from './ascii art/KaomojiActingCutePage.vue'
  import KaomojiSadPage from './ascii art/KaomojiSadPage.vue'
  import KaomojiAngryPage from './ascii art/KaomojiAngryPage.vue'
  import KaomojiSuprisedPage from './ascii art/KaomojiSuprisedPage.vue'

  import GeneralPage from './symbols/GeneralPage.vue'
  import CurrencyPage from './symbols/CurrencyPage.vue'
  import LatinPage from './symbols/LatinPage.vue'
  import GeometricPage from './symbols/GeometricPage.vue'
  import MathSymbolsPage from './symbols/MathSymbolsPage.vue'
  import SupplementalPage from './symbols/SupplementalPage.vue'
  import LanguagePage from './symbols/LanguagePage.vue'

  export const emojiPages = 
  [
    SmileyPage, 
    PeoplePageSelector, 
    ObjectPage, 
    FoodAndPlantPage,
    CarsAndSuchPage,
    SymbolsPage
  ]

  export const asciiArtPages = 
  [
    ClassicPage, 
    KaomojiHappyPage,
    KaomojiGreetingsPage,
    KaomojiActingCutePage,
    KaomojiSadPage,
    KaomojiAngryPage,
    KaomojiSuprisedPage,
  ]

  export const symbolsPages = 
  [
    GeneralPage, 
    CurrencyPage,
    LatinPage,
    GeometricPage,
    MathSymbolsPage,
    SupplementalPage,
    LanguagePage
  ]

  export default emojiPages
</script>