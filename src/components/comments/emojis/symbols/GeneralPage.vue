<template>
  <ion-button color="dark" class="emojiButton emojiFilter left parenthesis" fill="clear" @click="$emit('emojiSelected', '(')" title="left parenthesis">
    (
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter right parenthesis" fill="clear" @click="$emit('emojiSelected', ')')" title="right parenthesis">
    )
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁽')" title="⁽">
    ⁽
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁾')" title="⁾">
    ⁾
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '<')" title="<">
    <
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '>')" title=">">
    >
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‹')" title="‹">
    ‹
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '›')" title="›">
    ›
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁅')" title="⁅">
    ⁅
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁆')" title="⁆">
    ⁆
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '|')" title="|">
    |
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¦')" title="¦">
    ¦
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '+')" title="+">
    +
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '—')" title="—">
    —
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '–')" title="–">
    –
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '-')" title="-">
    -
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '[')" title="[">
    [
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', ']')" title="]">
    ]
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter left bracket" fill="clear" @click="$emit('emojiSelected', '{')" title="left bracket">
    {
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter right bracket" fill="clear" @click="$emit('emojiSelected', '}')" title="right bracket">
    }
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '«')" title="«">
    «
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '»')" title="»">
    »
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter copy left" fill="clear" @click="$emit('emojiSelected', '©')" title="copy left">
    ©
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter registered trade mark" fill="clear" @click="$emit('emojiSelected', '®')" title="registered trade mark">
    ®
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter sound recording copy left (phonogram)" fill="clear" @click="$emit('emojiSelected', '℗')" title="sound recording copy left (phonogram)">
    ℗
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter trade mark" fill="clear" @click="$emit('emojiSelected', '™')" title="trade mark">
    ™
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '×')" title="×">
    ×
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '=')" title="=">
    =
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', symbolSingleQuoteBotton)" title="'">
    '
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‘')" title="‘">
    ‘
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '’')" title="’">
    ’
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‚')" title="‚">
    ‚
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‛')" title="‛">
    ‛
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¬')" title="¬">
    ¬
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '÷')" title="÷">
    ÷
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '“')" title="“">
    “
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '”')" title="”">
    ”
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '„')" title="„">
    „
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‟')" title="‟">
    ‟
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁄')" title="⁄">
    ⁄
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '°')" title="°">
    °
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter celsius" fill="clear" @click="$emit('emojiSelected', '℃')" title="celsius">
    ℃
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter fahrenheit" fill="clear" @click="$emit('emojiSelected', '℉')" title="fahrenheit">
    ℉
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '*')" title="*">
    *
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁕')" title="⁕">
    ⁕
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '§')" title="§">
    §
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter cross" fill="clear" @click="$emit('emojiSelected', '†')" title="cross">
    †
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‡')" title="‡">
    ‡
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁎')" title="⁎">
    ⁎
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁑')" title="⁑">
    ⁑
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁂')" title="⁂">
    ⁂
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '′')" title="′">
    ′
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‵')" title="‵">
    ‵
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '•')" title="•">
    •
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '·')" title="·">
    ·
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '․')" title="․">
    ․
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁞')" title="⁞">
    ⁞
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁛')" title="⁛">
    ⁛
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '″')" title="″">
    ″
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‶')" title="‶">
    ‶
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‣')" title="‣">
    ‣
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‥')" title="‥">
    ‥
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁚')" title="⁚">
    ⁚
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁖')" title="⁖">
    ⁖
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁙')" title="⁙">
    ⁙
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‴')" title="‴">
    ‴
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‷')" title="‷">
    ‷
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁗')" title="⁗">
    ⁗
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '…')" title="…">
    …
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁝')" title="⁝">
    ⁝
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁘')" title="⁘">
    ⁘
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁏')" title="⁏">
    ⁏
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', ';')" title=";">
    ;
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '!')" title="!">
   !
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¡')" title="¡">
   ¡
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‼')" title="‼">
   ‼
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '%')" title="%">
   %
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁔')" title="⁔">
   ⁔
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁀')" title="⁀">
   ⁀
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¨')" title="¨">
   ¨
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', ':')" title=":">
   :
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '?')" title="?">
   ?
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¿')" title="¿">
   ¿
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁈')" title="⁈">
   ⁈
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‰')" title="‰">
   ‰
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‿')" title="‿">
   ‿
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁐')" title="⁐">
   ⁐
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¶')" title="¶">
   ¶
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '_')" title="_">
   _
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '&')" title="&">
   &
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‽')" title="‽">
   ‽
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁇')" title="⁇">
   ⁇
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‱')" title="‱">
   ‱
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁒')" title="⁒">
   ⁒
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁁')" title="⁁">
   ⁁
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‸')" title="‸">
   ‸
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '`')" title="`">
   `
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '´')" title="´">
   ´
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '^')" title="^">
   ^
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁊')" title="⁊">
   ⁊
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', 'ª')" title="ª">
   ª
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁌')" title="⁌">
   ⁌
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁍')" title="⁍">
   ⁍
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁋')" title="⁋">
   ⁋
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¯')" title="¯">
   ¯
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '~')" title="~">
   ~
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁓')" title="⁓">
   ⁓
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', 'º')" title="º">
   º
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‖')" title="‖">
   ‖
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '⁜')" title="⁜">
   ⁜
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '¸')" title="¸">
   ¸
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‾')" title="‾">
   ‾
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '±')" title="±">
   ±
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', 'µ')" title="µ">
   µ
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter music note" fill="clear" @click="$emit('emojiSelected', '♪')" title="music note">
   ♪
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '‗')" title="‗">
   ‗
  </ion-button>
  <ion-button color="dark" class="emojiButton emojiFilter" fill="clear" @click="$emit('emojiSelected', '※')" title="※">
   ※
  </ion-button>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'

  defineEmits(['emojiSelected'])

  const symbolSingleQuoteBotton = "' '"
</script>