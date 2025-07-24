<template>
  <div>
    <h1>Centralized Engineering Organizer....Guy</h1>
    <PrevPageButton/>
    <div class="ceoInfoContainer">
      <DarkModeStarWolfSignal class="ceoStarWolf" v-if="darkTheme.value"/>
      <LightModeStarWolfSignal class="ceoStarWolf" v-if="!darkTheme.value"/>
      <div class="stats thickBorder">
        <h1>CEO Profile</h1>
        <div class="standardFontSize">
          <p>CEO Name: fdr3</p>
          <p>Ideology: <a href="https://youtu.be/J5LidElyknY?list=PLKRByY3ha6Vx9kb7GT8TQ3CuoaxMt7KIk&t=625"  target="_blank">Social Capitalist</a></p>
          <p>Other CEOs I would slap with that ideology label I just pulled out of my ass: </p>
          <a href="https://www.youtube.com/watch?v=ikA9KkiTH-c" target="_blank"><p>Louis Rossman 1</p></a>
          <a href="https://www.youtube.com/watch?v=apMYh0a4qXo" target="_blank"><p>Louis Rossman 2</p></a>
          <a href="https://www.youtube.com/watch?v=dibEZ9-Psss" target="_blank"><p>Louis Rossman 3</p></a>
          <a href="https://www.youtube.com/watch?v=qw2nx-I-jAA" target="_blank"><p>Mark Cuban</p></a>
          <a href="https://youtu.be/1SjhXC43Pwk?t=718" target="_blank"><p>Okay, signing up for a nazi party is a bad look Mark<br>I'M A NEED YOU TO LOCK THE FUCK IN!!!!</p></a>

          <a href="https://www.youtube.com/watch?v=uvHwyrem24M" target="_blank">
            <p>Dude literally looks like white Jesus<br>
              That gift aged so well though, lmao XD<br>
              And to think....I used to really want one<br>
              But instead I sold all my shares for BYD shares<br>
              <span class="emojiText">😃</span>
            </p>
          </a>
          <p>The left is reappropriating the term C.E.O. as certain people have made the term dirty and unclean</p>
          <p>Best Anime Arc of All Time: Chimera Ants<br>(Hunter x Hunter 2011)</p>
          <p>Don't even have to watch the previous arcs to appreciate it ^_^</p>
          <p>(Starts at episode 
            <a href="https://hianimez.to/watch/hunter-x-hunter-2?ep=140" target="_blank">76</a>, Dub for English)
            <br>(popups are worse on this site on the phone, it's better on the computer)
          </p>
        </div>
        <h1>Unhonorable Mentions</h1>
        <div class="standardFontSize">
          <p>Ideology: Anarcho Capitalist</p>
          <a href="https://www.youtube.com/shorts/efzQQBrSQqY" target="_blank"><p>Bitch Made nazi elon musk</p></a>
          <a href="https://www.youtube.com/watch?v=7KhR38MHCv0" target="_blank"><p>elon Does More Bitch Made nazi Shit</p></a>
          <a href="https://www.youtube.com/watch?v=-E9o9hT0PQk" target="_blank"><p>elon Murders At Least 27 People</p></a>
          <a href="https://www.youtube.com/watch?v=q7wo9ooM6CI" target="_blank"><p>d.o.g.e. Brings In The Guns</p></a>
          <a href="https://www.youtube.com/watch?v=3VJT2JeDCyw" target="_blank"><p>elon Poisons An Entire City<br>(Bitch Made nazi Move My Guy)</p></a>
        </div>
      </div>
    </div>
    <NextPageButton/>
    <IdeasTable/>
    <FEDsTable/>
    <PriorityList/>
    <KnownBugList/>
  </div>
</template>

<script setup lang="ts">
  import NextPageButton from '/src/components/pages/NextPageButton.vue'
  import PrevPageButton from '/src/components/pages/PrevPageButton.vue'
  import DarkModeStarWolfSignal from '/src/components/fancy/DarkModeStarWolfSignal.vue' 
  import LightModeStarWolfSignal from '/src/components/fancy/LightModeStarWolfSignal.vue'
  import IdeasTable from '/src/components/tables/chat/IdeasTable.vue'
  import FEDsTable from '/src/components/tables/chat/FEDsTable.vue'
  import PriorityList from './PriorityList.vue'
  import KnownBugList from './KnownBugList.vue'
  import { darkTheme } from '/src/assets/globalStates/DarkTheme.vue'
</script>

<style scoped>
  .ceoStarWolf
  {
    width: min(70vw, 500px);
    height: min(90vw, 500px)
  }

  .stats
  {
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 20px;
    width: min(60vw, 500px)
  }

  @media screen and (min-width: 1001px) 
  { 
    .ceoInfoContainer
    {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px
    }
  }

  @media screen and (max-width: 1000px) 
  { 
    .ceoInfoContainer
    {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 40px;
    }
  }
</style>
