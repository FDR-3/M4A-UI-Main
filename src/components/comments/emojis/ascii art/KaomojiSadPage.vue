<template>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying waving bye" fill="clear" @click="$emit('emojiSelected', '(ToT)/~~~ ')" title="person crying waving bye">
    (ToT)/~~~
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person frowning" fill="clear" @click="$emit('emojiSelected', '/_ \\ ')" title="person frowning">
    /_ \
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person frowning" fill="clear" @click="$emit('emojiSelected', '╯︿╰ ')" title="person frowning">
    ╯︿╰
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person squinting eyes" fill="clear" @click="$emit('emojiSelected', '＞﹏＜ ')" title="person squinting eyes">
    ＞﹏＜
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person squinting eyes" fill="clear" @click="$emit('emojiSelected', '＞︿＜ ')" title="person squinting eyes">
    ＞︿＜
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person pouting frowning" fill="clear" @click="$emit('emojiSelected', '（︶^︶） ')" title="person pouting">
    （︶^︶）
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person frowning" fill="clear" @click="$emit('emojiSelected', '( ˘︹˘ ) ')" title="person frowning">
    ( ˘︹˘ )
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person squinting eyes" fill="clear" @click="$emit('emojiSelected', '≧ ﹏ ≦ ')" title="person squinting eyes">
    ≧ ﹏ ≦
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad crying person reaching out" fill="clear" @click="$emit('emojiSelected', '(っ °Д °;)っ ')" title="crying person reaching out">
    (っ °Д °;)っ
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person being comforted" fill="clear" @click="$emit('emojiSelected', '( *^-^)ρ(*╯^╰) ')" title="sad person being comforted">
    ( *^-^)ρ(*╯^╰)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad nervous person sweating" fill="clear" @click="$emit('emojiSelected', '⊙﹏⊙∥ ')" title="sad nervous person sweating">
    ⊙﹏⊙∥
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '≡(▔﹏▔)≡ ')" title="person crying">
    ≡(▔﹏▔)≡
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '.·´¯`(>▂<)´¯`·. ')" title="person crying">
    .·´¯`(>▂<)´¯`·. 
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '(┬┬﹏┬┬) ')" title="person crying">
    (┬┬﹏┬┬)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '〒▽〒 ')" title="person crying">
    〒▽〒
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '(T_T) ')" title="person crying">
    (T_T)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad bummed person" fill="clear" @click="$emit('emojiSelected', '(´。＿。｀) ')" title="bummed person">
    (´。＿。｀)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad bummed person" fill="clear" @click="$emit('emojiSelected', '(˘･_･˘) ')" title="bummed person">
    (˘･_･˘)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad bummed person" fill="clear" @click="$emit('emojiSelected', '(。﹏。*) ')" title="bummed person">
    (。﹏。*)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person sweating" fill="clear" @click="$emit('emojiSelected', '(￣﹏￣；) ')" title="sad person sweating">
    (￣﹏￣；)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', 'o(TヘTo) ')" title="sad person crying">
    o(TヘTo)
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '~~>_<~~ ')" title="sad person crying">
    ~~>_<~~
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '┗( T﹏T )┛ ')" title="sad person crying">
    ┗( T﹏T )┛
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad dead person crying" fill="clear" @click="$emit('emojiSelected', 'X﹏X ')" title="sad dead person crying">
    X﹏X
  </ion-button>
  <ion-button color="dark" class="emojiFilter kaomoji sad person crying" fill="clear" @click="$emit('emojiSelected', '(ಥ _ ಥ) ')" title="sad person crying">
    (ಥ _ ಥ)
  </ion-button>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'

  defineEmits(['emojiSelected'])
</script>