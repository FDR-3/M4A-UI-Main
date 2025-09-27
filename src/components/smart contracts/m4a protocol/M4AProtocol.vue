<template></template>
<script setup lang="ts">
  import { onMounted, onUnmounted, watch } from 'vue'
  import { getM4AProtocol,
  getM4AFeeTokenAccounts,
  areM4AProtocolStatsInitialized,
  getProcessors,
  getAllSubmitters,
  getAllPatients,
  getClaimQueue,
  getClaimStats,
  getQueueClaims,
  getStateAccounts,
  getProcessedClaims,
  getProcessedClaimStats,
  getHospitalStats,
  getAllHospitalsAndUpdateStateMap,
  getInsuranceCompanyStats,
  getAllInsuranceCompanies,
  getM4AProtocolCEOAccount,
  getM4AProtocolTreasurerAccount,
  setPatientRecordsHashMap,
  setHospitalRecordsHashMap,
  setInsuranceCompanyRecordsHashMap,
  refreshClaimData,
  refreshProcessedClaimData,
  refreshProcessorsData,
  refreshHospitalRecordsHashMaps,
  refreshInsuranceCompanyRecordsHashMaps,
  getM4AProtocolPDA,
  getM4ATokenFeePDA,
  getSubmitterStatsPDA,
  getPatientStatsPDA,
  getClaimQueuePDA,
  getClaimStatsPDA,
  getClaimAndProcessorStatsPDA,
  getHospitalStatsPDA,
  getInsuranceCompanyStatsPDA,
  getProcessorStatsPDA,
  getPatientRecordStatsPDA,
  getHospitalAndInsuranceRecordStatsPDA,
  getProcessedClaimStatsPDA,
  getUnfinishedClaimStatsPDA,
  getM4AProtocolCEOAccountPDA,
  getM4AProtocolTreasurerAccountPDA } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { claimQueue, claimStats, processedClaimStats, claims, processedClaims } from '/src/assets/globalStates/m4a/Claims.vue'
  import { hospitalStats, hospitals } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanyStats, insuranceCompanies } from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { processors } from '/src/assets/globalStates/m4a/Processors.vue'
  import { patientRecordsHashMap, hospitalRecordsHashMap, insuranceCompanyRecordsHashMap } from '/src/assets/globalStates/m4a/Records.vue'
  import { customUserNameHashMap } from '/src/assets/globalStates/chat/ChatAccounts.vue'
  import { adminAccounts } from '/src/assets/globalStates/AdminAccounts.vue'
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'

  var claimQueueWatchId: any
  var claimStatsWatchId: any
  var claimAndProcessorStatsWatchId: any
  var submitterStatsWatchId: any
  var patientStatsWatchId: any
  var hospitalStatsWatchId: any
  var insuranceCompanyStatsWatchId: any
  var processorStatsWatchId: any
  var patientRecordStatsWatchId: any 
  var hospitalAndInsuranceRecordStatsWatchId: any
  var processedClaimStatsWatchId: any
  var unfinishedClaimStatsWatchId: any

  var areM4AProtocolStatsReadyWatchId: any
  var isM4AProtocolReadyWatchId: any
  var isM4AFeeTokenAccountReadyWatchId: any
  var m4aProtocolCEOAccountWatcherId: any
  var m4aProtocolTreasurerAccountWatcherId: any

  onMounted(async() =>
  {
    //M4A Protocol Account
    const m4aProtocol = await getM4AProtocol()
    await listenForM4AProtocolChanges()
    if(m4aProtocol)
    {
      anchorPrograms.m4aProtocolInitiatorAddress = m4aProtocol.m4AProtocolInitiatorAddress.toBase58()  //note the .m4A weird anchor capitialization
      anchorPrograms.isM4AProtocolReady = true
    }
    else
      anchorPrograms.isM4AProtocolReady = false

    //M4A Processor/Protocol Stat Accounts
    processors.data = await getProcessors()
    if(await areM4AProtocolStatsInitialized())
      anchorPrograms.areM4AProtocolStatsReady = true
    else
      anchorPrograms.areM4AProtocolStatsReady = false
    await listenForProcessorStatChanges()

    //M4A Submitters
    await getAllSubmitters()
    await listenForSubmitterStatChanges()

    //M4A Patients
    await getAllPatients()
    await listenForPatientStatChanges()

    //M4A Hospitals
    hospitalStats.data = await getHospitalStats()
    hospitals.data = await getAllHospitalsAndUpdateStateMap() 
    await listenForHospitalStatChanges()
    
    //M4A Insurance Company Stats
    insuranceCompanyStats.data = await getInsuranceCompanyStats()
    insuranceCompanies.data = await getAllInsuranceCompanies()
    await listenForInsuranceCompanyStatChanges()

    //Claims and Processed Claims have submitters, patients, hospital and insurance companies on them, so best to fetch them first above, just making a note of it
    //M4A Claim Queue
    claimQueue.data = await getClaimQueue()
    getStateAccounts()
    claims.data = await getQueueClaims()
    claimStats.data = await getClaimStats()
    await listenForClaimQueueChanges()
    await listenForClaimStatChanges()

    //M4A Processor is assigned or unassigned from a claim
    await listenForClaimAndProcessorStatChanges()

    //M4A Processed Claims
    processedClaims.data = await getProcessedClaims()
    processedClaimStats.data = await getProcessedClaimStats()
    await listenForProcessedClaimStatChanges()

    //M4AFeeTokenAccount
    const m4aFeeTokenAccounts = await getM4AFeeTokenAccounts()
    if(m4aFeeTokenAccounts.length > 0)
      anchorPrograms.isM4AFeeTokenAccountReady = true
    else
      listenForM4AFeeTokenAccount()

    //M4A Protocol CEO Account
    const m4aCEOAccount = await getM4AProtocolCEOAccount()
    if(m4aCEOAccount)
    {
      adminAccounts.isM4ACEOAccountReady = true
      adminAccounts.m4aCEOAddress = m4aCEOAccount.address.toBase58()
    }
    else
    {
      adminAccounts.isM4ACEOAccountReady = false
      await listenForM4ACEOAccountInitialization()
    }

    //M4A Patient Records
    patientRecordsHashMap.map = await setPatientRecordsHashMap()
    await listenForPatientRecordStatChanges()

    //M4A Hospital And Insurance Company Records
    hospitalRecordsHashMap.map = await setHospitalRecordsHashMap()
    insuranceCompanyRecordsHashMap.map = await setInsuranceCompanyRecordsHashMap()
    await listenForHospitalAndInsuranceRecordStatChanges()

    //M4A Protocol Treasurer Account
    const m4aTreasurerAccount = await getM4AProtocolTreasurerAccount()
    if(m4aTreasurerAccount)
      adminAccounts.m4aTreasurerAddress = m4aTreasurerAccount.address.toBase58()
    else
      await listenForM4ATreasurerAccountInitialization()

    //M4A Paritially Denied Claim Edits Listner
    await listenForUnfinishedClaimStatChanges()
  })

  onUnmounted(() => 
  {
    if(isM4AProtocolReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(isM4AProtocolReadyWatchId)
      isM4AProtocolReadyWatchId = undefined
    }
    if(isM4AFeeTokenAccountReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(isM4AFeeTokenAccountReadyWatchId)
      isM4AFeeTokenAccountReadyWatchId = undefined
    } 
    if(areM4AProtocolStatsReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(areM4AProtocolStatsReadyWatchId)
      areM4AProtocolStatsReadyWatchId = undefined
    }
    if(claimQueueWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(claimQueueWatchId)
      claimQueueWatchId = undefined
    }
    if(claimStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(claimStatsWatchId)
      claimStatsWatchId = undefined
    }
    if(claimAndProcessorStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(claimAndProcessorStatsWatchId)
      claimAndProcessorStatsWatchId = undefined
    }
    if(submitterStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(submitterStatsWatchId)
      submitterStatsWatchId = undefined
    }
    if(patientStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientStatsWatchId)
      patientStatsWatchId = undefined
    }
    if(hospitalStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(hospitalStatsWatchId)
      hospitalStatsWatchId = undefined
    }
    if(insuranceCompanyStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(insuranceCompanyStatsWatchId)
      insuranceCompanyStatsWatchId = undefined
    }
    if(processorStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(processorStatsWatchId)
      processorStatsWatchId = undefined
    }
    if(patientRecordStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(patientRecordStatsWatchId)
      patientRecordStatsWatchId = undefined
    }
    if(hospitalAndInsuranceRecordStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(hospitalAndInsuranceRecordStatsWatchId)
      hospitalAndInsuranceRecordStatsWatchId = undefined
    }
    if(processedClaimStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(processedClaimStatsWatchId)
      processedClaimStatsWatchId = undefined
    }
    if(unfinishedClaimStatsWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(unfinishedClaimStatsWatchId)
      unfinishedClaimStatsWatchId = undefined
    }
    if(m4aProtocolCEOAccountWatcherId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(m4aProtocolCEOAccountWatcherId)
      m4aProtocolCEOAccountWatcherId = undefined
    } 
    if(m4aProtocolTreasurerAccountWatcherId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(m4aProtocolTreasurerAccountWatcherId)
      m4aProtocolTreasurerAccountWatcherId = undefined
    }
  })

  //Have to refresh new custom names outside of hospital and insurance company records tables
  watch(customUserNameHashMap, () =>
  {
    refreshClaimData()
    refreshProcessedClaimData()
    refreshHospitalRecordsHashMaps()
    refreshInsuranceCompanyRecordsHashMaps()
    refreshProcessorsData()
  })

  async function listenForM4AFeeTokenAccount()
  {
    try
    {
      //Subscribe to account changes
      isM4AFeeTokenAccountReadyWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4ATokenFeePDA(anchorPrograms.usdcFeeTokenAddress), async() => 
      {
        //Handle account change...
        anchorPrograms.isM4AFeeTokenAccountReady = true
        anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(isM4AFeeTokenAccountReadyWatchId)
        isM4AFeeTokenAccountReadyWatchId = undefined
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForM4AProtocolChanges()
  {
    try
    {
      //Subscribe to account changes
      isM4AProtocolReadyWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4AProtocolPDA(), async() => 
      {
        //Handle account change...
        if(!anchorPrograms.isM4AProtocolReady)
        {
          const m4aProtocol = await getM4AProtocol()
          anchorPrograms.m4aProtocolInitiatorAddress = m4aProtocol.m4AProtocolInitiatorAddress.toBase58() //note the .m4A weird anchor capitialization
          anchorPrograms.isM4AProtocolReady = true
        }

        await getStateAccounts()
        claims.data = await getQueueClaims()//Todo refresh data instead of fetching again
      })
    }
    catch(error)
    {
      console.log(error)
      anchorPrograms.isM4AProtocolReady = false
    }
  }

  async function listenForClaimQueueChanges()
  {
    try
    {
      //Subscribe to account changes
      claimQueueWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getClaimQueuePDA(), async() => 
      {
        //Handle account change...
        claimQueue.data = await getClaimQueue()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForClaimStatChanges()
  {
    try
    {
      //Subscribe to account changes
      claimStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getClaimStatsPDA(), async() => 
      {
        //Handle account change...
        claims.data = await getQueueClaims()
        claimStats.data = await getClaimStats()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForClaimAndProcessorStatChanges()
  {
    try
    {
      //Subscribe to account changes
      claimAndProcessorStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getClaimAndProcessorStatsPDA(), async() => 
      {
        //Handle account change...
        claims.data = await getQueueClaims()
        processors.data = await getProcessors()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForProcessorStatChanges()
  {
    try
    {
      //Subscribe to account changes
      processorStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getProcessorStatsPDA(), async() => 
      {
        //Handle account change...
        anchorPrograms.areM4AProtocolStatsReady = true
        processors.data = await getProcessors()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForSubmitterStatChanges()
  {
    try
    {
      //Subscribe to account changes
      submitterStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getSubmitterStatsPDA(), async() => 
      {
        //Handle account change...
        await getAllSubmitters()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForPatientStatChanges()
  {
    try
    {
      //Subscribe to account changes
      patientStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getPatientStatsPDA(), async() => 
      {
        //Handle account change...
        await getAllPatients()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForHospitalStatChanges()
  {
    try
    {
      //Subscribe to account changes
      hospitalStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getHospitalStatsPDA(), async() => 
      {
        //Handle account change...
        hospitalStats.data = await getHospitalStats()
        hospitals.data = await getAllHospitalsAndUpdateStateMap()

        //Get claims with updated hospitals
        claims.data = await getQueueClaims()

        //Get insurance company record table data with updated hospitals
        insuranceCompanies.data = await getAllInsuranceCompanies()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
    
  async function listenForInsuranceCompanyStatChanges()
  {
    try
    {
      //Subscribe to account changes
      insuranceCompanyStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getInsuranceCompanyStatsPDA(), async() => 
      {
        //Handle account change...
        insuranceCompanyStats.data = await getInsuranceCompanyStats()
        insuranceCompanies.data = await getAllInsuranceCompanies()

        //Get claim que table data with updated insurance companies
        claims.data = await getQueueClaims()

        //Get insurance company record table data with updated hospitals
        hospitals.data = await getAllHospitalsAndUpdateStateMap()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForPatientRecordStatChanges()
  {
    try
    {
      //Subscribe to account changes
      patientRecordStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getPatientRecordStatsPDA(), async() => 
      {
        //Handle account change...
        patientRecordsHashMap.map = await setPatientRecordsHashMap()
        claims.data = await getQueueClaims()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForHospitalAndInsuranceRecordStatChanges()
  {
    try
    {
      //Subscribe to account changes
      hospitalAndInsuranceRecordStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getHospitalAndInsuranceRecordStatsPDA(), async() => 
      {
        //Handle account change...
        insuranceCompanies.data = await getAllInsuranceCompanies()//Needed to update show records number
        hospitals.data = await getAllHospitalsAndUpdateStateMap()//Needed to update show records number

        hospitalRecordsHashMap.map = await setHospitalRecordsHashMap()
        insuranceCompanyRecordsHashMap.map = await setInsuranceCompanyRecordsHashMap()
        claims.data = await getQueueClaims()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForProcessedClaimStatChanges()
  {
    try
    {
      //Subscribe to account changes
      processedClaimStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getProcessedClaimStatsPDA(), async() => 
      {
        //Handle account change...
        await getAllSubmitters()
        await getAllPatients()
        processedClaimStats.data = await getProcessedClaimStats()
        hospitals.data = await getAllHospitalsAndUpdateStateMap()
        insuranceCompanies.data = await getAllInsuranceCompanies()
        processedClaims.data = await getProcessedClaims()
        patientRecordsHashMap.map = await setPatientRecordsHashMap()
        hospitalRecordsHashMap.map = await setHospitalRecordsHashMap()
        insuranceCompanyRecordsHashMap.map = await setInsuranceCompanyRecordsHashMap()
        processors.data = await getProcessors()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForUnfinishedClaimStatChanges()
  {
    try
    {
      //Subscribe to account changes
      unfinishedClaimStatsWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getUnfinishedClaimStatsPDA(), async() => 
      {
        //Handle account change...
        patientRecordsHashMap.map = await setPatientRecordsHashMap()
        processedClaims.data = await getProcessedClaims()
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForM4ACEOAccountInitialization()
  {
    //Subscribe to account changes
    m4aProtocolCEOAccountWatcherId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4AProtocolCEOAccountPDA(), async() => 
    {
      //Handle account change..
      const m4aCEOAccount = await getM4AProtocolCEOAccount()
      adminAccounts.isM4ACEOAccountReady = true
      adminAccounts.m4aCEOAddress = m4aCEOAccount.address.toBase58()
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(m4aProtocolCEOAccountWatcherId)
      m4aProtocolCEOAccountWatcherId = undefined
    })
  }

  async function listenForM4ATreasurerAccountInitialization()
  {
    //Subscribe to account changes
    m4aProtocolTreasurerAccountWatcherId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getM4AProtocolTreasurerAccountPDA(), async() => 
    {
      //Handle account change..
      const m4aTreasurerAccount = await getM4AProtocolTreasurerAccount()
      adminAccounts.m4aTreasurerAddress = m4aTreasurerAccount.address.toBase58()
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(m4aProtocolTreasurerAccountWatcherId)
      m4aProtocolTreasurerAccountWatcherId = undefined
    })
  }
</script>


