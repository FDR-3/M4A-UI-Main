<script setup lang="ts">
  import { onUnmounted } from 'vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'

  var intervalId: any;
  
  runDeadMansBreakDetector()

  onUnmounted(() =>
  {
    if(intervalId != undefined)
    {
      clearInterval(intervalId);
      intervalId = undefined
    }
  })

  function runDeadMansBreakDetector()
  {
    intervalId = setInterval(() => 
    {
      const newDate = new Date()/1000 //divide by 1000 since typescript/javascript time stamp is in mili seconds, but Solana time stamp is in seconds

      if(anchorPrograms.deadMansBreakTimeStamp == 0)
        adminAccounts.ceoIsDead = false
      else if((anchorPrograms.deadMansBreakTimeStamp.toNumber() + anchorPrograms.secondsUntilDeadMansBreakTrips) > newDate)
        adminAccounts.ceoIsDead = false
      else
        adminAccounts.ceoIsDead = true

    }, 500)
  }
</script>