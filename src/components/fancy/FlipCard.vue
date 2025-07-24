<template>
  <div class="mainContainer">

    <div class="theCard">

      <div class="theFront">
        
        <h1>Front of Card</h1><p>This is the front of the card. It contains important information. Please see overleaf for more details.</p></div>

      <div class="theBack"><h1>Back of Card</h1><p>Your use of this site is subject to the terms and conditions governing this and all transactions.</p>
      <button>Submit</button></div>

    </div>
  </div>
</template>

<style>
  .mainContainer
  {
    position: relative;
    width: 250px;
    height: 320px
  }

  .theCard
  {
    position: absolute;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease;
    background: yellow
  }

  .theCard:hover
  {
    transform: rotateY(180deg)
  }

  .theFront
  {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background: #ffc728;
    color: #333
  }

  .theBack
  {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    background: #fafafa;
    color: #333;
    transform: rotateY(180deg)
  }
</style>