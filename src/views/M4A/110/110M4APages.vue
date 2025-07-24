<script lang="ts">
  import Overview from "/src/views/M4A/110/0_Overview.vue"
  import OpSys from "/src/views/M4A/110/1_OpSys.vue"
  import FrameWork from "/src/views/M4A/110/2_FrameWork.vue"
  import Language  from "/src/views/M4A/110/3_Language.vue"
  import { M4A110WindowsIonicVuePages } from "/src/views/M4A/110/0_Windows/0_Ionic/0_Vue/WindowsIonicVueData.vue"

  export const M4A110PathSelectionPages = 
  [
    Overview, 
    OpSys, 
    FrameWork, 
    Language
  ]

  const M4A110WindowsIonicReactPages: never[] = 
  [

  ]
  const M4A110WindowsIonicAngularPages: never[] = 
  [

  ]


  const M4A110AppleIonicVuePages: never[] = 
  [

  ]
  const M4A110AppleIonicReactPages: never[] = 
  [

  ]
  const M4A110AppleIonicAngularPages: never[] = 
  [

  ]


  const M4A110LinuxIonicVuePages: never[] = 
  [

  ]
  const M4A110LinuxIonicReactPages: never[] = 
  [

  ]
  const M4A110LinuxIonicAngularPages: never[] = 
  [

  ]


  const M4A110WindowsSvelteVuePages: never[] = 
  [

  ]
  const M4A110WindowsSvelteReactPages: never[] = 
  [

  ]
  const M4A110WindowsSvelteAngularPages: never[] = 
  [

  ]


  const M4A110AppleSvelteVuePages: never[] = 
  [

  ]
  const M4A110AppleSvelteReactPages: never[] = 
  [

  ]
  const M4A110AppleSvelteAngularPages: never[] = 
  [

  ]


  const M4A110LinuxSvelteVuePages: never[] = 
  [

  ]
  const M4A110LinuxSvelteReactPages: never[] = 
  [

  ]
  const M4A110LinuxSvelteAngularPages: never[] = 
  [

  ]

  //Svelte is basically it's own language, just keeping these here as a place holder.
  export const M4A110PagesAfterPathSelection = 
  [
    [
      [
        M4A110WindowsIonicVuePages,
        M4A110WindowsIonicReactPages,
        M4A110WindowsIonicAngularPages
      ],
      [
        M4A110WindowsSvelteVuePages,
        M4A110WindowsSvelteReactPages,
        M4A110WindowsSvelteAngularPages
      ]
    ],
    [
      [
        M4A110AppleIonicVuePages,
        M4A110AppleIonicReactPages,
        M4A110AppleIonicAngularPages
      ],
      [
        M4A110AppleSvelteVuePages,
        M4A110AppleSvelteReactPages,
        M4A110AppleSvelteAngularPages
      ]
    ],
    [
      [
        M4A110LinuxIonicVuePages,
        M4A110LinuxIonicReactPages,
        M4A110LinuxIonicAngularPages
      ],
      [
        M4A110LinuxSvelteVuePages,
        M4A110LinuxSvelteReactPages,
        M4A110LinuxSvelteAngularPages
      ]
    ]
  ]

  export default M4A110PathSelectionPages
</script>