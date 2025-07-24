<template>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling winky winking face" fill="clear" @click="$emit('emojiSelected', ';) ')" title="side ways winky face">
      ;)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy excited up right upright smiling winky winking face with closed eyes" fill="clear" @click="$emit('emojiSelected', '^_~ ')" title="up right winky face">
      ^_~
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling winky winking face with nose" fill="clear" @click="$emit('emojiSelected', ';-) ')" title=" side ways winky face">
      ;-)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face" fill="clear" @click="$emit('emojiSelected', ':) ')" title="side ways smiling face">
      :)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy excited up right upright smiling face with closed eyes" fill="clear" @click="$emit('emojiSelected', '^_^ ')" title="up right happy face">
      ^_^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy excited up right upright smiling long face with closed eyes" fill="clear" @click="$emit('emojiSelected', '^_____^ ')" title="up right long ass happy face">
      ^_____^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face with nose" fill="clear" @click="$emit('emojiSelected', ':-) ')" title="side ways smiling face with nose face">
      :-)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling with opened mouth face" fill="clear" @click="$emit('emojiSelected', ':D ')" title="side ways smiling opened mouth face">
      :D
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy excited up right upright face with opened mouth and closed eyes" fill="clear" @click="$emit('emojiSelected', '^0^ ')" title="up right excited opened mouth face">
      ^0^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face with opened mouth and nose" fill="clear" @click="$emit('emojiSelected', ':-D ')" title="side ways smiling face with opened mouth and nose">
      :-D
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii silly side ways sideways tongue sticking out face" fill="clear" @click="$emit('emojiSelected', ':P ')" title="side ways tongue sticking out face">
      :P
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii silly side ways sideways tongue sticking out face with nose" fill="clear" @click="$emit('emojiSelected', ':-P ')" title="side ways tongue sticking out face with nose">
      :-P
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii silly side ways sideways tongue sticking out winky winking face" fill="clear" @click="$emit('emojiSelected', ';P ')" title="side ways winking tongue sticking out face">
      ;P
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways frowning face" fill="clear" @click="$emit('emojiSelected', ':( ')" title="side ways frowning face">
      :(
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways frowning face with nose" fill="clear" @click="$emit('emojiSelected', ':-( ')" title="side ways frowning face with nose">
      :-(
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad up right upright frowning face" fill="clear" @click="$emit('emojiSelected', 'U_U ')" title="up right frowning face">
      U_U
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad side ways sideways face" fill="clear" @click="$emit('emojiSelected', ':[ ')" title="side ways annoyed face">
      :[
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad side ways sideways face with eyebrows" fill="clear" @click="$emit('emojiSelected', '>:( ')" title="side ways annoyed face with eyebrows">
      >:(
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous up right upright face with sweat" fill="clear" @click="$emit('emojiSelected', asciiDoubleQuoteBotton)" title="up right face with sweat">
      >"<
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways frowning face reversed" fill="clear" @click="$emit('emojiSelected', '): ')" title="side ways reversed frowning face">
      ):
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised side ways sideways face with opened mouth and nose" fill="clear" @click="$emit('emojiSelected', ':-O ')" title="side ways suprised face with opened mouth and nose">
      :-O
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised up right upright wide eyed face" fill="clear" @click="$emit('emojiSelected', 'O.O ')" title="up right wide eyed face">
      O.O
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised up right upright wide eyed face with fangs scary creepy spooky halloween" fill="clear" @click="$emit('emojiSelected', 'OwO ')" title="up right wide eyed face with fangs">
      OwO
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised side ways sideways face with opened mouth and nose" fill="clear" @click="$emit('emojiSelected', ':-() ')" title="side ways suprised face with opened mouth and nose">
      :-()
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad up right upright rolling eyes face" fill="clear" @click="$emit('emojiSelected', '~_~ ')" title="up right rolling eyes face">
      ~_~
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy excited up right upright face with opened mouth and closed eyes" fill="clear" @click="$emit('emojiSelected', '^o^ ')" title="up right excited opened mouth face">
      ^o^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous side ways sideways face with nose and closed shut sealed mouth" fill="clear" @click="$emit('emojiSelected', ':-S ')" title="side ways face with closed mouth and nose">
      :-S
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii love heart" fill="clear" @click="$emit('emojiSelected', '<3 ')" title="heart">
      {{ asciiCarrotButton }}
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii love up right upright kissy face with closed eyes" fill="clear" @click="$emit('emojiSelected', '^3^ ')" title="up right kissy face with closed eyes">
      ^3^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous side ways sideways face with nose and closed shut sealed mouth" fill="clear" @click="$emit('emojiSelected', ':-x ')" title="side ways face with closed mouth and nose">
      :-x
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad side ways sideways slanted face" fill="clear" @click="$emit('emojiSelected', ':/ ')" title="side ways slanted face">
      :/
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad bummed up right upright dead eyed face scary creepy spooky halloween" fill="clear" @click="$emit('emojiSelected', 'X_X ')" title="up right dead eyed face">
      X_X
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad side ways sideways slanted face with long eyes" fill="clear" @click="$emit('emojiSelected', '=/ ')" title="side ways slanted face with long eyes">
      =/
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways winky winking face" fill="clear" @click="$emit('emojiSelected', ';( ')" title="side ways winking face">
      ;(
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad up right upright crying face" fill="clear" @click="$emit('emojiSelected', 'T_T ')" title="up right crying face">
      T_T
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad side ways sideways winky winking face" fill="clear" @click="$emit('emojiSelected', ';[ ')" title="side ways winking annoyed face">
      ;[
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii holy religous up right upright come to jesus face, he loves you" fill="clear" @click="$emit('emojiSelected', '+_+ ')" title="up right come to Jesus face">
      +_+
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised up right upright wide eyed face" fill="clear" @click="$emit('emojiSelected', 'O_O ')" title="up right wide eyed face">
      O_O
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised side ways sideways face with opened mouth" fill="clear" @click="$emit('emojiSelected', ':O ')" title="side ways suprised face">
      :O
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad up right upright rolling eyes face" fill="clear" @click="$emit('emojiSelected', '¬_¬ ')" title="up right rolling eyes face">
      ¬_¬
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad up right upright crying face" fill="clear" @click="$emit('emojiSelected', ';_; ')" title="up right crying face">
      ;_;
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad unamused tired sleepy up right upright flat eyed face" fill="clear" @click="$emit('emojiSelected', '=.= ')" title="up right flat eyed face">
      =.=
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways winky winking smiling face" fill="clear" @click="$emit('emojiSelected', ';] ')" title="side ways winking smiling face">
      ;]
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii holy religous one eye closed up right upright come to jesus face, he loves you" fill="clear" @click="$emit('emojiSelected', '^_+ ')" title="up right one eye closed come to Jesus face">
      ^_+
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised side ways sideways winky winking person with opened mouth and arms up" fill="clear" @click="$emit('emojiSelected', ';O) ')" title="side ways winking person with opened mouth and arms up">
      ;O)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face with nose" fill="clear" @click="$emit('emojiSelected', ':-] ')" title="side ways smiling face with nose">
      :-]
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy up right upright smiling face" fill="clear" @click="$emit('emojiSelected', '^.^ ')" title="up right smiling face with closed eyes">
      ^.^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face with long eyes" fill="clear" @click="$emit('emojiSelected', '=) ')" title="side ways smiling face with long eyes">
      =)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised side ways sideways person with opened mouth and arms up" fill="clear" @click="$emit('emojiSelected', ':O) ')" title="side ways person with opened mouth and arms up">
      :O)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways cat face with nose" fill="clear" @click="$emit('emojiSelected', ':-3 ')" title="side ways cat face with nose">
      :-3
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways face with nose" fill="clear" @click="$emit('emojiSelected', '=D ')" title="side ways smiling face with opened mouth">
      =D
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad side ways sideways flat face" fill="clear" @click="$emit('emojiSelected', ':| ')" title="side ways flat face">
      :|
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad up right upright flat face" fill="clear" @click="$emit('emojiSelected', '-.- ')" title="up right flat face">
      -.-
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous up right upright eye squint face" fill="clear" @click="$emit('emojiSelected', '>_< ')" title="up right eye squint face">
      >_<
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii suprised side ways sideways person with opened mouth and arms down" fill="clear" @click="$emit('emojiSelected', ':O( ')" title="side ways person with opened mouth and arms down">
      :O(
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii excited lasers up right upright starry eyed face" fill="clear" @click="$emit('emojiSelected', '*_* ')" title="up right starry eyed">
      *_*
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways frowning face with long eyes" fill="clear" @click="$emit('emojiSelected', '=[ ')" title="side ways frowning face with long eyes">
      =[
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face with nerdy glasses and nose" fill="clear" @click="$emit('emojiSelected', '8-) ')" title="side ways smiling face with glasses and nose">
      8-)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous up right upright sweating face with closed eyes and no mouth" fill="clear" @click="$emit('emojiSelected', '^^; ')" title="up right sweating face with closed eyes and no mouth">
      ^^;
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii love side ways sideways kissing face with nose" fill="clear" @click="$emit('emojiSelected', ':-* ')" title="side ways kissing face with nose">
      :-*
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face with cool shades and nose" fill="clear" @click="$emit('emojiSelected', 'B-) ')" title="side ways smiling face with shades and nose">
      B-)
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad up right upright flat eyed face" fill="clear" @click="$emit('emojiSelected', '=_= ')" title="up right flat eyed face">
      =_=
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad up right upright flat eyed face with opened mouth" fill="clear" @click="$emit('emojiSelected', '-0- ')" title="up right flat eyed face with opened mouth">
      -0-
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous side ways sideways face with closed shut sealed mouth" fill="clear" @click="$emit('emojiSelected', ':S ')" title="side ways face with closed mouth">
      :S
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii hungry up right upright money eyed face" fill="clear" @click="$emit('emojiSelected', '$_$ ')" title="up right money eyed face">
      $_$
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii hungry side ways sideways money mouth face" fill="clear" @click="$emit('emojiSelected', ':-$ ')" title="side ways money mouth face">
      :-$
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous up right upright squinting eye face" fill="clear" @click="$emit('emojiSelected', '>.< ')" title="up right squinting eye face">
      >.<
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii annoyed angry mad up right upright flat eyed face" fill="clear" @click="$emit('emojiSelected', '-_- ')" title="up right flat eyed face">
      -_-
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii nervous up right upright squinting eye face with no mouth" fill="clear" @click="$emit('emojiSelected', '> < ')" title="up right squinting eye face with no mouth">
      > <
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face" fill="clear" @click="$emit('emojiSelected', ':] ')" title="side ways face smiling">
      :]
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy up right upright smiling face with closed eyes and no mouth" fill="clear" @click="$emit('emojiSelected', '^^ ')" title="up right smiling face with closed eyes and no mouth">
      ^^
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways smiling face" fill="clear" @click="$emit('emojiSelected', '=] ')" title="side ways smiling face with long eyes">
      =]
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy side ways sideways winky winking face with opened mouth" fill="clear" @click="$emit('emojiSelected', ';D ')" title="side ways smiling winky face with opened mouth">
      ;D
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii happy annoyed angry mad up right upright winky winking face with flat eye" fill="clear" @click="$emit('emojiSelected', '^_- ')" title="up right smiling winking face?">
      ^_-
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii silly side ways sideways face with tongue out and long eyes" fill="clear" @click="$emit('emojiSelected', '=P ')" title="side ways face with tongue out and long eyes">
      =P
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways crying face" fill="clear" @click="$emit('emojiSelected', asciiSingleQuoteBotton)" title="side ways crying face">
      :'(
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad up right upright crying face" fill="clear" @click="$emit('emojiSelected', 'Y.Y ')" title="up right crying face">
      Y.Y
    </ion-button>
    <ion-button color="dark" class="emojiFilter ascii sad side ways sideways crying face with long eyes" fill="clear" @click="$emit('emojiSelected', '=( ')" title="side ways crying face with long eyes">
      =(
    </ion-button>
</template>

<script setup lang="ts">
  import { IonButton } from '@ionic/vue'

  defineEmits(['emojiSelected'])

  const asciiDoubleQuoteBotton = ">\"< "
  const asciiSingleQuoteBotton = ":'( "
  const asciiCarrotButton = "<3 "
</script>