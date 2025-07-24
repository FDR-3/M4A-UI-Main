<script lang="ts">
  import {  PublicKey } from "@solana/web3.js"
  import { countryNameArray, countryStateNameArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { claimHashMap, processedClaimHashMap } from '/src/assets/globalStates/m4a/Claims.vue'
  import { HospitalTypes } from '/src/types/HospitalTypes.ts'
  import { hospitalHashMap } from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { initialInsuranceCompanies } from '/src/types/InitialInsuranceCompanyTypes.ts'
  import { insuranceCompanyStats, insuranceCompanies } from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import { statusTypes } from '/src/types/statusTypes.ts'
  import { getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
  import { parsePhoneNumberString,
    parseDollarAmountStringFromFixed2PointNotation,
    parseDollarAmountStringFromFixed2PointNotationNoDollarSign,
    convertFromFixed2PointNotationToDecimal } from '/src/assets/contracts/WalletHelper.vue'
  import { convertUnixTimeToLocalDate, convertUnixTimeToLocalTime } from '/src/assets/helperFunctions/UnixTimeStampHelper.ts'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms } from '/src/assets/globalStates/AnchorPrograms.vue'
  import { sleep, MAX_RETRY_FETCH, RETRY_TIME_OUT, RETRY_MESSAGE, ERROR_429 } from '/src/assets/helperFunctions/sleep.ts'
  import cloneDeep from 'lodash/cloneDeep'

  export const M4A_MAX_NOTE_LENGTH = 144

  export const INITIAL_INSURANCE_COMPANY_COUNT = 10
  export const INITIAL_NEXT_COMPANY_INDEX = 11

  export async function getM4AProtocol()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.m4AProtocol.fetch(getM4AProtocolPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("M4A Protocol Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AFeeTokenAccounts()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.feeTokenEntry.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AProtocolCEOAccount()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.m4AProtocolCeo.fetch(getM4AProtocolCEOAccountPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("M4A CEO Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AProtocolTreasurerAccount()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.m4AProtocolTreasurer.fetch(getM4AProtocolTreasurerAccountPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("M4A Treasurer Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function areM4AProtocolStatsInitialized()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        await anchorPrograms.m4a.m4aProgram.account.processorStats.fetch(getProcessorStatsPDA()) //Only have to fetch one of the stats to know they are all initialized
        return true
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("M4A Protocol Stats Not Initialized")
          return false
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function isSubmitterAccountInitialized(submitterAddress: string)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        await anchorPrograms.m4a.m4aProgram.account.submitterAccount.fetch(getSubmitterAccountPDA(submitterAddress))
        return true
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Submitter Account Not Initialized")
          return false
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  async function isStateInitialized(countryIndex: number, stateIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        await anchorPrograms.m4a.m4aProgram.account.stateAccount.fetch(getStateAccountPDA(countryIndex, stateIndex))
        return true
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(`State Account at Country Index ${countryIndex} and State Index ${stateIndex} is Not Initialized`)
          return false
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getProcessorStats()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.processorStats.fetch(getProcessorStatsPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Processor Stats Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getHospitalStats()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.hospitalStats.fetch(getHospitalStatsPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Hospital Stats Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getInsuranceCompanyStats()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.insuranceCompanyStats.fetch(getInsuranceCompanyStatsPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Insurance Company Stats Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getProcessorAccount(processorAddress: PublicKey)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.processorAccount.fetch(getProcessorAccountPDA(processorAddress))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Processor Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getProcessors()
  {
    const processors = await getProcessorsWrapper()
    var processorList = []

    for(var i=0; i<processors.length; i++)
    {
      //Get processor display name
      processors[i].account.address = processors[i].account.address
      processors[i].account.processorDisplayName = getCustomOrTrimmedUserDisplayName(processors[i].account.address)
      processorList.push(processors[i].account)
    }

    return processorList
  }

  async function getProcessorsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.processorAccount.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getStateAccount(countryIndex: number, stateIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.stateAccount.fetch(getStateAccountPDA(countryIndex, stateIndex))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(`State Not Initialized. Country Index: ${countryIndex} StateIndex: ${stateIndex}`)
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getNextHospitalIndex(countryIndex: number, stateIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        const stateAccount = await anchorPrograms.m4a.m4aProgram.account.stateAccount.fetch(getStateAccountPDA(countryIndex, stateIndex))
        return stateAccount.hospitalCount
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(`State Not Initialized. Country Index: ${countryIndex} StateIndex: ${stateIndex}`)
          return 0
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getSubmitterAccount(searchAddress: string)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.submitterAccount.fetch(getSubmitterAccountPDA(searchAddress))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Submitter Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getPatientAccount(submitterAddress: string, patientIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.patientAccount.fetch(getPatientAccountPDA(submitterAddress, patientIndex))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Patient Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  //This is used on the stats page
  export async function getPatientList(submitterAddress: string)
  {
    var patientList: any = []
    
    try
    {
      var submitterAccount = await getSubmitterAccount(submitterAddress)
      
      for(var i=0; i<submitterAccount.patientCount; i++)
      {
        var patientAccount = await getPatientAccount(submitterAddress, i)

        patientAccount.name = patientAccount.patientFirstName + " " + patientAccount.patientLastName
        patientAccount.index = i
        patientList.push(patientAccount)
      }

      patientList = patientList.sort((a: any, b: any) => a.patientFirstName.localeCompare(b.patientFirstName))
    }
    catch
    {
      console.log("Submitter Account Not Initialized")
      patientList = []
    }

    return patientList
  }

  //This is used on the submit claim page
  export async function getPatientLists(submitterAddress: string)
  {
    var patientList: any = []
    var activePatientList: any = []
    
    try
    {
      var submitterAccount = await getSubmitterAccount(submitterAddress)
      
      for(var i=0; i<submitterAccount.patientCount; i++)
      {
        var patientAccount = await getPatientAccount(submitterAddress, i)

        patientAccount.name = patientAccount.patientFirstName + " " + patientAccount.patientLastName
        patientAccount.index = i
        patientList.push(patientAccount)

        if(patientAccount.isActive)
          activePatientList.push(patientAccount)
      }

      patientList = patientList.sort((a: any, b: any) => a.patientFirstName.localeCompare(b.patientFirstName))
      activePatientList = activePatientList.sort((a: any, b: any) => a.patientFirstName.localeCompare(b.patientFirstName))
    }
    catch
    {
      console.log("Submitter Account Not Initialized")
      patientList = []
      activePatientList = []
    }

    return [patientList, activePatientList]
  }

  export async function getNewPatient(submitterAddress: string)
  {
    try
    {
      var submitterAccount = await getSubmitterAccount(submitterAddress)
      
      submitterAccount.patientCount
      var patientAccount = await getPatientAccount(submitterAddress, submitterAccount.patientCount-1)

      patientAccount.name = patientAccount.patientFirstName + " " + patientAccount.patientLastName
      patientAccount.index = submitterAccount.patientCount-1
    }
    catch(error)
    {
      console.log(error) //Submitter account should exist at this point, must be a different error
      return undefined
    }

    return patientAccount
  }

  export async function getClaimQueue()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.claimQueue.fetch(getClaimQueuePDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Claim Queue Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function isClaimSubmitted(submitterAddress: PublicKey)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        await anchorPrograms.m4a.m4aProgram.account.claim.fetch(getClaimPDA(submitterAddress))
      return true
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Claim Not Initialized")
          return false
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getClaim(submitterAddress: PublicKey | string)
  {
    if(typeof(submitterAddress) === "string")
    {
      if(claimHashMap.map)
        return claimHashMap.map.get(submitterAddress)
      else
        return undefined
    }
    else
    {
      if(claimHashMap.map)
        return claimHashMap.map.get(submitterAddress.toBase58())
      else
        return undefined
    }
  }

  export async function getQueueClaims()
  {
    var claimQueueTableData: any = []
    var hashMap = new Map<string, any>()
    
    const claims = await getClaimsWrapper()

    for(var i=0; i<claims.length; i++)
    {
      var claim = claims[i].account

      //Set time strings
      claim.submittedTimeString = convertUnixTimeToLocalTime(claim.submittedTime)
      claim.submittedDateString = convertUnixTimeToLocalDate(claim.submittedTime)

      //Set country name
      claim.countryName = countryNameArray[claim.countryIndex]

      //Set state name
      claim.stateName = countryStateNameArray[claim.countryIndex][claim.stateIndex]

      //Set is state ready
      claim.isStateReady = await isStateInitialized(claim.countryIndex, claim.stateIndex)

      //Set hospital type name
      if(claim.hospitalType == HospitalTypes.General)
        claim.hospitalTypeName = "General"
      else if(claim.hospitalType == HospitalTypes.Dental)
        claim.hospitalTypeName = "Dental"
      else if(claim.hospitalType == HospitalTypes.Vision)
        claim.hospitalTypeName = "Vision"
      else if(claim.hospitalType == HospitalTypes.Mental)
        claim.hospitalTypeName = "Mental"

      //Set submitter approved claim total amount
      const submitterAccount = await anchorPrograms.m4a.m4aProgram.account.submitterAccount.fetch(getSubmitterAccountPDA(claim.submitterAddress))
      claim.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitterAccount.approvedClaimAmount)
      //Get submitter display name
      claim.submitterDisplayName = getCustomOrTrimmedUserDisplayName(claim.submitterAddress)

      //Set patient full name
      const patient = await anchorPrograms.m4a.m4aProgram.account.patientAccount.fetch(getPatientAccountPDA(claim.submitterAddress, claim.patientIndex))
      claim.patientFullName = patient.patientFirstName + " " + patient.patientLastName

      //Set patient approved claim total amount
      claim.patientApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(patient.approvedClaimAmount)

      //Set next available hospital index
      const nextAvailableHospitalIndex = await getNextHospitalIndex(claim.countryIndex, claim.stateIndex)
      claim.nextHospitalIndex = nextAvailableHospitalIndex

      //Set next available insurance company index for new insurance companies outside of initial list
      if(insuranceCompanyStats.data)
        claim.nextInsuranceCompanyIndex = insuranceCompanyStats.data.additionalInsuranceCompanyCount + INITIAL_NEXT_COMPANY_INDEX

      //Set hospital index and note
      if(claim.hospitalIndex != -1)
      {
        const hospital =  hospitalHashMap.map.get(claim.countryIndex.toString()+claim.stateIndex.toString()+claim.hospitalIndex.toString())
        if(hospital)
        {
          //Set is hospital ready, claim total amount, phone number, longitude, and latitude
          claim.isHospitalReady = true
          claim.hospitalApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount)
          claim.hospitalPhoneNumber = hospital.hospitalPhoneNumber
          claim.hospitalLongitude = hospital.hospitalLongitude
          claim.hospitalLatitude = hospital.hospitalLatitude
      
          //Set hospital note
          claim.hospitalNote = hospital.note
        }
        else
        {
          claim.isHospitalReady = false
          claim.hospitalApprovedClaimAmountString = "$0.00"
          claim.hospitalPhoneNumber = "(000) 000-0000"
          claim.hospitalNote = "None"
        }
      }
      else
      {
        claim.isHospitalReady = false
        claim.hospitalApprovedClaimAmountString = "$0.00"
        claim.hospitalPhoneNumber = parsePhoneNumberString(claim.hospitalPhoneNumber)
        claim.hospitalIndex  = claim.nextHospitalIndex
        claim.hospitalNote = "None"
        claim.hospitalLongitude = 0.0
        claim.hospitalLatitude = 0.0
      }

      //Set isInsuranceCompanyReady, claim total amount, name, and note
      if(claim.insuranceCompanyIndex != -1)
      {
        const insuranceCompany = insuranceCompanies.data[claim.insuranceCompanyIndex]

        if(insuranceCompany)
          if(insuranceCompany.isActive)
          {
            claim.isInsuranceCompanyReady = true

            //Set insurance company claim total decimals from fixed point
            claim.insuranceCompanyApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(insuranceCompany.approvedClaimAmount)

            //Set existing insurance company name
            claim.insuranceCompanyName = insuranceCompany.insuranceCompanyName

            //Set insurance company note
            claim.insuranceCompanyNote = insuranceCompany.note
          }
          else
          {
            claim.isInsuranceCompanyReady = false
            claim.insuranceCompanyApprovedClaimAmountString = "$0.00"
            //if(claim.insuranceCompanyIndex >= 0 && claim.insuranceCompanyIndex <= INITIAL_INSURANCE_COMPANY_COUNT) //There are 11 built in insurance company names in the InsuranceCompanyTypes.ts file 
              //claim.insuranceCompanyName = initialInsuranceCompanies[claim.insuranceCompanyIndex].insuranceCompanyName //And it keeps but holes from causing an error with a -2 or something
            claim.insuranceCompanyNote = "None"
          }
        else
        {
          claim.isInsuranceCompanyReady = false
          claim.insuranceCompanyApprovedClaimAmountString = "$0.00"
          //if(claim.insuranceCompanyIndex >= 0 && claim.insuranceCompanyIndex <= INITIAL_INSURANCE_COMPANY_COUNT) //There are 11 built in insurance company names in the InsuranceCompanyTypes.ts file 
            //claim.insuranceCompanyName = initialInsuranceCompanies[claim.insuranceCompanyIndex].insuranceCompanyName //And it keeps but holes from causing an error with a -2 or something
          claim.insuranceCompanyNote = "None"
        }
      }
      else
      {
        claim.isInsuranceCompanyReady = false
        claim.insuranceCompanyApprovedClaimAmountString = "$0.00"
        claim.insuranceCompanyIndex = claim.nextInsuranceCompanyIndex
        claim.insuranceCompanyNote = "None"
      }

      claim.claimAmountString = parseDollarAmountStringFromFixed2PointNotation(claim.claimAmount)
      claim.claimAmount = convertFromFixed2PointNotationToDecimal(claim.claimAmount)

      //Set claim status
      if(claim.status == statusTypes.Pending)
        claim.statusMessage  = "Pending"
      else if(claim.status == statusTypes.Processing)
        claim.statusMessage  = "Processing"

      claim.pda = claims[i].publicKey

      hashMap.set(claim.submitterAddress.toBase58(), claim)

      claimQueueTableData.push(claim)
    }

    claimHashMap.map = hashMap
    claimQueueTableData.sort((a: any, b: any) => a.id - b.id)
    return claimQueueTableData
  }

  async function getClaimsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.claim.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getHospital(countryIndex: number, stateIndex: number, hospitalIndex: number)
  {
    try
    {
      const hospital = hospitalHashMap.map.get(countryIndex.toString()+stateIndex.toString()+hospitalIndex.toString())
      hospital.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotationNoDollarSign(hospital.approvedClaimAmount)

      //Set hospital type name
      if(hospital.hospitalType == HospitalTypes.General)
        hospital.hospitalTypeName = "General"
      else if(hospital.hospitalType == HospitalTypes.Dental)
        hospital.hospitalTypeName = "Dental"
      else if(hospital.hospitalType == HospitalTypes.Vision)
        hospital.hospitalTypeName = "Vision"
      else if(hospital.hospitalType == HospitalTypes.Mental)
        hospital.hospitalTypeName = "Mental"

      return hospital
    }
    catch
    {
      console.log(`Hospital Not Initialized. Country Index: ${countryIndex} StateIndex: ${stateIndex} HospitalIndex: ${hospitalIndex}`)

      const hospital = 
      {
        hospitalName: "hospital not found",
        hospitalType: 0, 
        hospitalTypeName: "General",
        approvedClaimAmount: 0,
        approvedClaimCount: 0,
        deniedClaimCount: 0,
        undeniedClaimCount: 0,
        submittedAppealCount : 0,
        deniedAppealCount: 0,
        revokedApprovalCount: 0
      } 

      return hospital
    }
  }

  export function getStateHospitalList(countryIndex: number, stateIndex: number, statHospitalCount: number)
  {
    var hospitalList: any = []

    try
    {
      for(var i=0; i<statHospitalCount; i++)
      {
        const hospital = cloneDeep(hospitalHashMap.map.get(countryIndex.toString()+stateIndex.toString()+i.toString()))
        hospital.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount)

        //Set hospital type name
        if(hospital.hospitalType == HospitalTypes.General)
          hospital.hospitalTypeName = "General"
        else if(hospital.hospitalType == HospitalTypes.Dental)
          hospital.hospitalTypeName = "Dental"
        else if(hospital.hospitalType == HospitalTypes.Vision)
          hospital.hospitalTypeName = "Vision"
        else if(hospital.hospitalType == HospitalTypes.Mental)
          hospital.hospitalTypeName = "Mental"

        hospital.hospitalPhoneNumber = hospital.hospitalPhoneNumber

        hospitalList.push(hospital)
      }

      return hospitalList
    }
    catch
    {
      console.log(`State Not Initialized. Country Index: ${countryIndex} StateIndex: ${stateIndex}`)
      return []
    }
  }

  export async function getAllHospitals()
  {
    var hospitalList: any = []
    var hashMap = new Map<string, any>()

    const hospitals = await getAllHospitalsWrapper()

    for(var i=0; i<hospitals.length; i++)
    {
      hospitals[i].account.hospitalPhoneNumber = parsePhoneNumberString(hospitals[i].account.hospitalPhoneNumber)

      //Set hospital approved claim total, country name, and state name
      hospitals[i].account.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospitals[i].account.approvedClaimAmount)
      hospitals[i].account.hospitalCountryName = countryNameArray[hospitals[i].account.countryIndex]
      hospitals[i].account.hospitalStateName = countryStateNameArray[hospitals[i].account.countryIndex][ hospitals[i].account.stateIndex]

      //Set hospital type name
      if(hospitals[i].account.hospitalType == HospitalTypes.General)
        hospitals[i].account.hospitalTypeName = "General"
      else if(hospitals[i].account.hospitalType == HospitalTypes.Dental)
        hospitals[i].account.hospitalTypeName = "Dental"
      else if(hospitals[i].account.hospitalType == HospitalTypes.Vision)
        hospitals[i].account.hospitalTypeName = "Vision"
      else if(hospitals[i].account.hospitalType == HospitalTypes.Mental)
        hospitals[i].account.hospitalTypeName = "Mental"

      hospitals[i].account.isEditingRow = false
      hospitals[i].account.isDataEdited = false

      hashMap.set(hospitals[i].account.countryIndex.toString()+
      hospitals[i].account.stateIndex.toString()+
      hospitals[i].account.hospitalIndex.toString(), hospitals[i].account)

      hospitalList.push(hospitals[i].account)
    }

    hospitalHashMap.map = hashMap
    hospitalList.sort((a: any, b: any) => b.id - a.id)
    return hospitalList
  }

  async function getAllHospitalsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.hospital.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getInsuranceCompany(insuranceCompanyIndex: number)
  {
    if(insuranceCompanies.data)
      return insuranceCompanies.data[insuranceCompanyIndex]
    else
    {
      if(insuranceCompanyIndex < initialInsuranceCompanies.length)
      {
        const insuranceCompany = 
        {
          insuranceCompanyName: initialInsuranceCompanies[insuranceCompanyIndex].insuranceCompanyName,
          approvedClaimAmount: "0.00",
          approvedClaimCount: 0,
          deniedClaimCount: 0,
          undeniedClaimCount: 0,
          submittedAppealCount: 0,
          deniedAppealCount: 0,
          revokedApprovalCount: 0
        }
        return insuranceCompany
      }
      else
        return undefined
    }
  }

  export async function getAllInsuranceCompanies()
  {
    var insuranceCompanies = []
    var hashMap = new Map<string, any>()

    var rawInsuranceCompanies = await getAllInsuranceCompaniesWrapper()

    //Create insurance company hashmap
    for(var i=0; i<rawInsuranceCompanies.length; i++)
    {
      hashMap.set(rawInsuranceCompanies[i].account.insuranceCompanyIndex.toString(), rawInsuranceCompanies[i].account)
    }
    
    //Get starter Insurance Company Data
    for(var i=0; i<initialInsuranceCompanies.length; i++)
    {
      const existingInsuranceCompany = hashMap.get(i.toString())

      if(existingInsuranceCompany)
      {
        existingInsuranceCompany.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(existingInsuranceCompany.approvedClaimAmount)
        existingInsuranceCompany.isInsuranceCompanyReady = true

        insuranceCompanies.push(existingInsuranceCompany)
      }
      else
      {
        console.log(initialInsuranceCompanies[i].insuranceCompanyName, "Has Not Been Initialized Yet")
        initialInsuranceCompanies[i].isActive = false
        initialInsuranceCompanies[i].approvedClaimAmount = 0
        initialInsuranceCompanies[i].approvedClaimAmountString = "$0.00"
        initialInsuranceCompanies[i].note = "None"
        initialInsuranceCompanies[i].recordCount = 0
        initialInsuranceCompanies[i].isInsuranceCompanyReady = false
        initialInsuranceCompanies[i].isEditingRow = false
        initialInsuranceCompanies[i].isDataEdited = false

        initialInsuranceCompanies[i].approvedClaimCount = 0
        initialInsuranceCompanies[i].deniedClaimCount = 0
        initialInsuranceCompanies[i].undeniedClaimCount = 0
        initialInsuranceCompanies[i].submittedAppealCount = 0
        initialInsuranceCompanies[i].deniedAppealCount = 0
        initialInsuranceCompanies[i].revokedApprovalCount = 0

        insuranceCompanies.push(initialInsuranceCompanies[i])
      }
    }

    //Get additional Insurance Company Data 
    if(insuranceCompanyStats.data)
      for(var i=INITIAL_NEXT_COMPANY_INDEX; i<insuranceCompanyStats.data.additionalInsuranceCompanyCount+INITIAL_NEXT_COMPANY_INDEX; i++)
      {
        const additionalInsuranceCompany = hashMap.get(i.toString())

        if(additionalInsuranceCompany)
        {
          additionalInsuranceCompany.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(additionalInsuranceCompany.approvedClaimAmount)
          
          if(additionalInsuranceCompany.note == "")
            additionalInsuranceCompany.note = "None"

          additionalInsuranceCompany.isInsuranceCompanyReady = true

          insuranceCompanies.push(additionalInsuranceCompany)
        }
      }

    return insuranceCompanies
  }

  async function getAllInsuranceCompaniesWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.insuranceCompany.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getPatientRecords(searchAddress: string, patientIndex: number)
  {
    if(!hospitalHashMap.map || !insuranceCompanies.data)
      return

    var patientRecords = []

    const patient = await getPatientAccount(searchAddress, patientIndex)
    if(patient)
      for(var i=0; i<patient.recordCount; i++)
      {
        const patientRecord = await getPatientRecordsWrapper(searchAddress, patientIndex, i)

        //Parse Int from anchor BN for sorting
        patientRecord.recordId = parseInt(patientRecord.recordId)
        patientRecord.claimId = parseInt(patientRecord.claimId)
        patientRecord.claimAmountString = parseDollarAmountStringFromFixed2PointNotation(patientRecord.claimAmount)
        patientRecord.claimAmount = convertFromFixed2PointNotationToDecimal(patientRecord.claimAmount)
        patientRecord.submittedTimeString = convertUnixTimeToLocalTime(patientRecord.submittedTime)
        patientRecord.submittedDateString = convertUnixTimeToLocalDate(patientRecord.submittedTime)
        if(patientRecord.processedTime != 0)
        {
          patientRecord.processedTimeString = convertUnixTimeToLocalTime(patientRecord.processedTime)
          patientRecord.processedDateString = convertUnixTimeToLocalDate(patientRecord.processedTime)
        }
        
        const hospital = hospitalHashMap.map.get(patientRecord.countryIndex.toString()+patientRecord.stateIndex.toString()+patientRecord.hospitalIndex.toString())
        patientRecord.hospitalApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount)
        patientRecord.hospitalType = hospital.hospitalType
        patientRecord.hospitalName = hospital.hospitalName
        patientRecord.hospitalAddress = hospital.hospitalAddress
        patientRecord.hospitalCity = hospital.hospitalCity
        patientRecord.hospitalZipCode = hospital.hospitalZipCode
        patientRecord.hospitalPhoneNumber = hospital.hospitalPhoneNumber
        patientRecord.hospitalNote = hospital.note

        //Set hospital type name
        if(hospital.hospitalType == HospitalTypes.General)
          patientRecord.hospitalTypeName = "General"
        else if(hospital.hospitalType == HospitalTypes.Dental)
          patientRecord.hospitalTypeName = "Dental"
        else if(hospital.hospitalType == HospitalTypes.Vision)
          patientRecord.hospitalTypeName = "Vision"
        else if(hospital.hospitalType == HospitalTypes.Mental)
          patientRecord.hospitalTypeName = "Mental"

        const insuranceCompany = insuranceCompanies.data[patientRecord.insuranceCompanyIndex]
        patientRecord.insuranceCompanyApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(insuranceCompany.approvedClaimAmount)
        patientRecord.insuranceCompanyName = insuranceCompany.insuranceCompanyName
        patientRecord.insuranceCompanyNote = insuranceCompany.note

        //Set country name
        patientRecord.countryName= countryNameArray[patientRecord.countryIndex]

        //Set state name
        patientRecord.stateName= countryStateNameArray[patientRecord.countryIndex][patientRecord.stateIndex]
        
        //Set record status
        if(patientRecord.status == statusTypes.Processing)
          patientRecord.statusMessage  = "Processing"
        else if(patientRecord.status == statusTypes.Approved)
          patientRecord.statusMessage  = "Approved"
        else if(patientRecord.status == statusTypes.Denied)
        {
          if(patientRecord.appealReason.length != 0)
          {
            patientRecord.denialMessage  = "Denied Appeal: " + patientRecord.denialReason
            patientRecord.appealMessage  = "Previous Appeal Reason: " + patientRecord.appealReason
          }
          else
          {
            patientRecord.denialMessage  = "Denied: " + patientRecord.denialReason
            patientRecord.appealMessage  = ""
          }
        }
        else if(patientRecord.status == statusTypes.Appealed)
        {
          patientRecord.appealMessage  = "Appealed: " + patientRecord.appealReason
          patientRecord.denialMessage  = "Previous Denial Reason: " + patientRecord.denialReason
        }

        patientRecords.push(patientRecord)
      }
    
    patientRecords = patientRecords.reverse()
    return patientRecords
  }

  async function getPatientRecordsWrapper(submitterAddress: PublicKey | string, patientIndex: number, recordIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.patientRecord.fetch(getPatientRecordPDA(submitterAddress, patientIndex, recordIndex))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Patient Account Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getHospitalRecords(countryIndex: number, stateIndex: number, hospitalIndex: number)
  {
    if(!insuranceCompanies.data)
      return

    const hospital =  hospitalHashMap.map.get(countryIndex.toString()+stateIndex.toString()+hospitalIndex.toString())

    if(!hospital)
      return

    const recordCount = hospital.recordCount
    var hospitalRecords = []

    for(var i=0; i<recordCount; i++)
    { 
      //Get hospital record
      const hospitalRecord =  await getHospitalRecordsWrapper(countryIndex, stateIndex, hospitalIndex, i)
      //Parse Int from anchor BN for sorting
      hospitalRecord.recordId = parseInt(hospitalRecord.recordId)
      hospitalRecord.claimId = parseInt(hospitalRecord.claimId)
      hospitalRecord.claimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospitalRecord.claimAmount)
      hospitalRecord.claimAmount = convertFromFixed2PointNotationToDecimal(hospitalRecord.claimAmount)
      hospitalRecord.submittedTimeString = convertUnixTimeToLocalTime(hospitalRecord.submittedTime)
      hospitalRecord.submittedDateString = convertUnixTimeToLocalDate(hospitalRecord.submittedTime)
      if(hospitalRecord.processedTime != 0)
      {
        hospitalRecord.processedTimeString = convertUnixTimeToLocalTime(hospitalRecord.processedTime)
        hospitalRecord.processedDateString = convertUnixTimeToLocalDate(hospitalRecord.processedTime)
      }

      //Get submitter info
      const submitter = await getSubmitterAccount(hospitalRecord.submitterAddress)
      hospitalRecord.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitter.approvedClaimAmount)
      //Get submitter display name
      hospitalRecord.submitterAddress = hospitalRecord.submitterAddress.toBase58()
      hospitalRecord.submitterDisplayName = getCustomOrTrimmedUserDisplayName(hospitalRecord.submitterAddress)

      //Get patient info
      const patient = await getPatientAccount(hospitalRecord.submitterAddress, hospitalRecord.patientIndex)
      hospitalRecord.patientApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(patient.approvedClaimAmount)
      hospitalRecord.patientFullName = patient.patientFirstName + " " + patient.patientLastName

      //Get insurance company info
      const insuranceCompany = insuranceCompanies.data[hospitalRecord.insuranceCompanyIndex]
      hospitalRecord.insuranceCompanyApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(insuranceCompany.approvedClaimAmount)
      hospitalRecord.insuranceCompanyName = insuranceCompany.insuranceCompanyName
      hospitalRecord.insuranceCompanyNote = insuranceCompany.note

      //Set record status
      if(hospitalRecord.status == statusTypes.Processing)
        hospitalRecord.statusMessage  = "Processing"
      else if(hospitalRecord.status == statusTypes.Approved)
        hospitalRecord.statusMessage  = "Approved"
      else if(hospitalRecord.status == statusTypes.Denied)
      {
        if(hospitalRecord.appealReason.length != 0)
        {
          hospitalRecord.denialMessage  = "Denied Appeal: " + hospitalRecord.denialReason
          hospitalRecord.appealMessage  = "Previous Appeal Reason: " + hospitalRecord.appealReason
        }
        else
        {
          hospitalRecord.denialMessage  = "Denied: " + hospitalRecord.denialReason
          hospitalRecord.appealMessage  = ""
        }
      }
      else if(hospitalRecord.status == statusTypes.Appealed)
      {
        hospitalRecord.appealMessage  = "Appealed: " + hospitalRecord.appealReason
        hospitalRecord.denialMessage  = "Previous Denial Reason: " + hospitalRecord.denialReason
      }

      hospitalRecords.push(hospitalRecord)
    }

    hospitalRecords = hospitalRecords.reverse()
    return hospitalRecords
  }

  async function getHospitalRecordsWrapper(countryIndex: number, stateIndex: number, hospitalIndex: number, recordIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.hospitalRecord.fetch(getHospitalRecordPDA(countryIndex, stateIndex, hospitalIndex, recordIndex))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(`Hospital Not Initialized. Country Index: ${countryIndex} StateIndex: ${stateIndex} HospitalIndex: ${hospitalIndex}`)
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getInsuranceCompanyRecords(insuranceCompanyIndex: number)
  {
    if(!hospitalHashMap.map)
      return

    var insuranceCompanyRecords = []
    
    if(!insuranceCompanies.data)
      return

    const insuranceCompany =  insuranceCompanies.data[insuranceCompanyIndex]
    const recordCount = insuranceCompany.recordCount
    
    for(var i=0; i<recordCount; i++)
    { 
      //Get insurance company record
      const insuranceCompanyRecord =  await getInsuranceCompanyRecordsWrapper(insuranceCompanyIndex, i)
      //Parse Int from anchor BN for sorting
      insuranceCompanyRecord.recordId = parseInt(insuranceCompanyRecord.recordId)
      insuranceCompanyRecord.claimId = parseInt(insuranceCompanyRecord.claimId)
      insuranceCompanyRecord.claimAmountString = parseDollarAmountStringFromFixed2PointNotation(insuranceCompanyRecord.claimAmount)
      insuranceCompanyRecord.claimAmount = convertFromFixed2PointNotationToDecimal(insuranceCompanyRecord.claimAmount)
      insuranceCompanyRecord.submittedTimeString = convertUnixTimeToLocalTime(insuranceCompanyRecord.submittedTime)
      insuranceCompanyRecord.submittedDateString = convertUnixTimeToLocalDate(insuranceCompanyRecord.submittedTime)
      if(insuranceCompanyRecord.processedTime != 0)
      {
        insuranceCompanyRecord.processedTimeString = convertUnixTimeToLocalTime(insuranceCompanyRecord.processedTime)
        insuranceCompanyRecord.processedDateString = convertUnixTimeToLocalDate(insuranceCompanyRecord.processedTime)
      }

      //Get submitter info
      const submitter = await getSubmitterAccount(insuranceCompanyRecord.submitterAddress)
      insuranceCompanyRecord.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitter.approvedClaimAmount)
      insuranceCompanyRecord.insuranceCompanyName = submitter.insuranceCompanyName
      //Get submitter display name
      insuranceCompanyRecord.submitterAddress = insuranceCompanyRecord.submitterAddress.toBase58()
      insuranceCompanyRecord.submitterDisplayName = getCustomOrTrimmedUserDisplayName(insuranceCompanyRecord.submitterAddress)

      //Get patient info
      const patient = await getPatientAccount(insuranceCompanyRecord.submitterAddress, insuranceCompanyRecord.patientIndex)
      insuranceCompanyRecord.patientApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(patient.approvedClaimAmount)
      insuranceCompanyRecord.patientFullName = patient.patientFirstName + " " + patient.patientLastName

      //Get hospital info
      const hospital =  hospitalHashMap.map.get(insuranceCompanyRecord.countryIndex.toString()+insuranceCompanyRecord.stateIndex.toString()+insuranceCompanyRecord.hospitalIndex.toString())
      insuranceCompanyRecord.hospitalApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount)
      insuranceCompanyRecord.hospitalType = hospital.hospitalType
      insuranceCompanyRecord.hospitalName = hospital.hospitalName
      insuranceCompanyRecord.hospitalCountryName = countryNameArray[hospital.countryIndex]
      insuranceCompanyRecord.hospitalStateName = countryStateNameArray[hospital.countryIndex][hospital.stateIndex]
      insuranceCompanyRecord.hospitalCity = hospital.hospitalCity
      insuranceCompanyRecord.hospitalAddress = hospital.hospitalAddress
      insuranceCompanyRecord.hospitalZipCode = hospital.hospitalZipCode
      insuranceCompanyRecord.hospitalPhoneNumber = hospital.hospitalPhoneNumber
      insuranceCompanyRecord.hospitalNote = hospital.note

      //Set hospital type name
      if(hospital.hospitalType == HospitalTypes.General)
        insuranceCompanyRecord.hospitalTypeName = "General"
      else if(hospital.hospitalType == HospitalTypes.Dental)
        insuranceCompanyRecord.hospitalTypeName = "Dental"
      else if(hospital.hospitalType == HospitalTypes.Vision)
        insuranceCompanyRecord.hospitalTypeName = "Vision"
      else if(hospital.hospitalType == HospitalTypes.Mental)
        insuranceCompanyRecord.hospitalTypeName = "Mental"

      //Set record status
      if(insuranceCompanyRecord.status == statusTypes.Processing)
        insuranceCompanyRecord.statusMessage  = "Processing"
      else if(insuranceCompanyRecord.status == statusTypes.Approved)
        insuranceCompanyRecord.statusMessage  = "Approved"
      else if(insuranceCompanyRecord.status == statusTypes.Denied)
      {
        if(insuranceCompanyRecord.appealReason.length != 0)
        {
          insuranceCompanyRecord.denialMessage  = "Denied Appeal: " + insuranceCompanyRecord.denialReason
          insuranceCompanyRecord.appealMessage  = "Previous Appeal Reason: " + insuranceCompanyRecord.appealReason
        }
        else
        {
          insuranceCompanyRecord.denialMessage  = "Denied: " + insuranceCompanyRecord.denialReason
          insuranceCompanyRecord.appealMessage  = ""
        }
      }
      else if(insuranceCompanyRecord.status == statusTypes.Appealed)
      {
        insuranceCompanyRecord.appealMessage  = "Appealed: " + insuranceCompanyRecord.appealReason
        insuranceCompanyRecord.denialMessage  = "Previous Denial Reason: " + insuranceCompanyRecord.denialReason
      }

      insuranceCompanyRecords.push(insuranceCompanyRecord)
    }

    insuranceCompanyRecords = insuranceCompanyRecords.reverse()
    return insuranceCompanyRecords
  }

  async function getInsuranceCompanyRecordsWrapper(insuranceCompanyIndex: number, recordIndex: number)
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.insuranceCompanyRecord.fetch(getInsuranceCompanyRecordPDA(insuranceCompanyIndex, recordIndex))
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(`Insurance Company Not Initialized. InsuranceCompanyIndex: ${insuranceCompanyIndex}`)
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getProcessedClaim(submitterAddress: PublicKey | string, processorCountIndex: anchor.BN)
  {
    if(typeof(submitterAddress) === "string")
    {
      if(processedClaimHashMap.map)
        return processedClaimHashMap.map.get(submitterAddress+processorCountIndex.toNumber().toString())
      else
        return undefined
    }
    else
    {
      if(processedClaimHashMap.map)
        return processedClaimHashMap.map.get(submitterAddress.toBase58()+processorCountIndex.toNumber().toString())
      else
        return undefined
    }
  }

  export async function getProcessedClaims()
  {
    var processedClaimsTableData: any = []
    var hashMap = new Map<string, any>()
    
    const processedClaims = await getProcessedClaimsWrapper()

    for(var i=0; i<processedClaims.length; i++)
    {
      const processedClaim = processedClaims[i].account
      //Parse Int from anchor BN for sorting
      processedClaim.processedClaimId = parseInt(processedClaim.processedClaimId)
      processedClaim.claimId = parseInt(processedClaim.claimId)
      processedClaim.submittedTimeString = convertUnixTimeToLocalTime(processedClaim.submittedTime)
      processedClaim.submittedDateString = convertUnixTimeToLocalDate(processedClaim.submittedTime)
      if(processedClaim.processedTime != 0)
      {
        processedClaim.processedTimeString = convertUnixTimeToLocalTime(processedClaim.processedTime)
        processedClaim.processedDateString = convertUnixTimeToLocalDate(processedClaim.processedTime)
      }

      //Set country name
      processedClaim.countryName = countryNameArray[processedClaim.countryIndex]

      //Set state name
      processedClaim.stateName = countryStateNameArray[processedClaim.countryIndex][processedClaim.stateIndex]

      //Set hospital type name
      if(processedClaim.hospitalType == HospitalTypes.General)
        processedClaim.hospitalTypeName = "General"
      else if(processedClaim.hospitalType == HospitalTypes.Dental)
        processedClaim.hospitalTypeName = "Dental"
      else if(processedClaim.hospitalType == HospitalTypes.Vision)
        processedClaim.hospitalTypeName = "Vision"
      else if(processedClaim.hospitalType == HospitalTypes.Mental)
        processedClaim.hospitalTypeName = "Mental"

      //Set hospital Phone Number
      processedClaim.hospitalPhoneNumber = parsePhoneNumberString(processedClaim.hospitalPhoneNumber)

      //Set submitter claim total decimals from fixed point
      const submitterAccount = await getSubmitterAccount(processedClaim.submitterAddress)
      processedClaim.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitterAccount.approvedClaimAmount)
      //Get submitter display name
      processedClaim.submitterDisplayName = getCustomOrTrimmedUserDisplayName(processedClaim.submitterAddress)

      //Set patient first and last name and set claim total decimals from fixed point
      const patient = await getPatientAccount(processedClaim.submitterAddress, processedClaim.patientIndex)
      processedClaim.patientApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(patient.approvedClaimAmount)
      processedClaim.patientFullName = patient.patientFirstName + " " + patient.patientLastName 

      //Set claim amount decimals from fixed point
      processedClaim.claimAmountString = parseDollarAmountStringFromFixed2PointNotation(processedClaim.claimAmount)
      processedClaim.claimAmount = convertFromFixed2PointNotationToDecimal(processedClaim.claimAmount)

      //Get hospital info
      const hospital =  hospitalHashMap.map.get(processedClaim.countryIndex.toString()+processedClaim.stateIndex.toString()+processedClaim.hospitalIndex.toString())
      if(hospital)
      {
        processedClaim.hospitalApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount)
        processedClaim.hospitalType = hospital.hospitalType
        processedClaim.hospitalName = hospital.hospitalName
        processedClaim.hospitalCountryName = countryNameArray[hospital.countryIndex]
        processedClaim.hospitalStateName = countryStateNameArray[hospital.countryIndex][hospital.stateIndex]
        processedClaim.hospitalCity = hospital.hospitalCity
        processedClaim.hospitalAddress = hospital.hospitalAddress
        processedClaim.hospitalZipCode = hospital.hospitalZipCode
        processedClaim.hospitalPhoneNumber = hospital.hospitalPhoneNumber
        processedClaim.hospitalNote = hospital.note
        processedClaim.isHospitalReady = true

        //Set hospital type name
        if(hospital.hospitalType == HospitalTypes.General)
          processedClaim.hospitalTypeName = "General"
        else if(hospital.hospitalType == HospitalTypes.Dental)
          processedClaim.hospitalTypeName = "Dental"
        else if(hospital.hospitalType == HospitalTypes.Vision)
          processedClaim.hospitalTypeName = "Vision"
        else if(hospital.hospitalType == HospitalTypes.Mental)
          processedClaim.hospitalTypeName = "Mental"
      }
      else
      {
        processedClaim.hospitalApprovedClaimAmountString = "$0.00"
        processedClaim.hospitalNote = "None"
      }

      //Set insurance company claim total decimals from fixed point and name
      const insuranceCompany = insuranceCompanies.data[processedClaim.insuranceCompanyIndex]
      if(insuranceCompany)
      {
        processedClaim.insuranceCompanyApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(insuranceCompany.approvedClaimAmount)
        processedClaim.insuranceCompanyName = insuranceCompany.insuranceCompanyName
        processedClaim.insuranceCompanyNote = insuranceCompany.note
        processedClaim.isInsuranceCompanyReady = true
      }
      else
        processedClaim.insuranceCompanyApprovedClaimAmountString = "$0.00"

      //Set new insurance company name incase of denied claims with new Insurance Company names
      if(processedClaim.insuranceCompanyIndex == -1)
      {
        if(processedClaim.newInsuranceCompanyName != "")
          processedClaim.insuranceCompanyName = processedClaims[i].newInsuranceCompanyName
      }
    
      //Set claim status
      if(processedClaim.status == statusTypes.Approved)
        processedClaim.statusMessage  = "Approved"
      else if(processedClaim.status == statusTypes.Denied)
      {
        if(processedClaim.appealReason.length != 0)
        {
          processedClaim.denialMessage  = "Denied Appeal: " + processedClaim.denialReason
          processedClaim.appealMessage  = "Previous Appeal Reason: " + processedClaim.appealReason
          processedClaim.statusMessage  = processedClaim.denialMessage + processedClaim.appealMessage 
        }
        else
        {
          processedClaim.denialMessage  = "Denied: " + processedClaim.denialReason
          processedClaim.appealMessage  = ""
          processedClaim.statusMessage  = processedClaim.denialMessage + processedClaim.appealMessage 
        }
      }
      else if(processedClaim.status == statusTypes.Appealed)
      {
        processedClaim.appealMessage  = "Appealed: " + processedClaim.appealReason
        processedClaim.denialMessage  = "Previous Denial Reason: " + processedClaim.denialReason
        processedClaim.statusMessage  = processedClaim.appealMessage + processedClaim.denialMessage 
      }

      processedClaim.isEditingRow = false
      processedClaim.isDataEdited = false

      hashMap.set(processedClaim.processorAddress.toBase58()+processedClaim.processorCountIndex.toNumber().toString(), processedClaim)

      processedClaimsTableData.push(processedClaim)
    }

    processedClaimHashMap.map = hashMap
    processedClaimsTableData.sort((a: any, b: any) => b.processedClaimId - a.processedClaimId)
    return processedClaimsTableData
  }

  async function getProcessedClaimsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.processedClaim.all()
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log(error)
          return []
        }
        else
        {
          console.log(RETRY_MESSAGE)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getM4AProtocolCEOAccountPDA()
  {
    const [m4aProtocolCEOPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("m4aProtocolCEO")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return m4aProtocolCEOPDA
  }

  export function getM4AProtocolTreasurerAccountPDA()
  {
    const [m4aProtocolTreasurerPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("m4aProtocolTreasurer")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return m4aProtocolTreasurerPDA
  }

  export function getM4AProtocolPDA()
  {
    const [m4aProtocolPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("m4aProtocol")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return m4aProtocolPDA
  }

  export function getM4ATokenFeePDA(tokenMintAddress: PublicKey)
  {
    const [m4aTokenFeePDA] = PublicKey.findProgramAddressSync(
      [
        new TextEncoder().encode("feeTokenEntry"),
        tokenMintAddress.toBuffer()
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return m4aTokenFeePDA
  }

  export function getClaimQueuePDA()
  {
    const [claimQueuePDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("claimQueue")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return claimQueuePDA
  }

  export function getProcessorStatsPDA()
  {
    const [processorStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("processorStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return processorStatsPDA
  }

  export function getHospitalStatsPDA()
  {
    const [hospitalStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("hospitalStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return hospitalStatsPDA
  }

  export function getInsuranceCompanyStatsPDA()
  {
    const [insuranceCompanyStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("insuranceCompanyStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return insuranceCompanyStatsPDA
  }

  export function getClaimPDA(submitterAddress: PublicKey)
  {
    const [claimPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("claim"),
        submitterAddress.toBuffer()
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return claimPDA
  }

  export function getSubmitterAccountPDA(submitterAddress: PublicKey | string )
  {
    if(typeof(submitterAddress) === "string")
    {
      const publicKey = new PublicKey(submitterAddress)
      const [submitterAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("submitter"),
          publicKey.toBuffer()
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return submitterAccountPDA
    }
    else
    {
      const [submitterAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("submitter"),
          submitterAddress.toBuffer()
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return submitterAccountPDA
    }
  }

  export function getPatientAccountPDA(submitterAddress: PublicKey | string, index: number)
  {
    if(typeof(submitterAddress) === "string")
    {
      const publicKey = new PublicKey(submitterAddress)
      const [patientAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("patient"),
          publicKey.toBuffer(),
          new anchor.BN(index).toArrayLike(Uint8Array, "le", 1)
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return patientAccountPDA
    }
    else
    {
      const [patientAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("patient"),
          submitterAddress.toBuffer(),
          new anchor.BN(index).toArrayLike(Uint8Array, "le", 1)
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return patientAccountPDA
    }
  }

  export function getProcessorAccountPDA(processorAddress: PublicKey | string )
  {
    if(typeof(processorAddress) === "string")
    {
      const publicKey = new PublicKey(processorAddress)
      const [processorAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("processor"),
          publicKey.toBuffer()
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return processorAccountPDA
    }
    else
    {
      const [processorAccountPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("processor"),
          processorAddress.toBuffer()
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return processorAccountPDA
    }
  }

  export function getProcessedClaimPDA(processorAddress: PublicKey, processedClaimIndex: number)
  {
    const [processedClaimPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        //new TextEncoder().encode("processedClaim"),
        //new TextEncoder().encode(ceoAddress),
        //test.toBuffer(),
        //new anchor.web3.PublicKey(ceoAddress).toBuffer(),
        //utf8.encode("processedClaim"),
        //new TextEncoder().encode("processedClaim"),
        new TextEncoder().encode("processedClaim"),
        processorAddress.toBuffer(),
        new anchor.BN(processedClaimIndex).toArrayLike(Uint8Array, "le", 8) 
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return processedClaimPDA
  }

  export function getStateAccountPDA(countryIndex: number, stateIndex: number)
  {
    const [statePDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("state"),
        new anchor.BN(countryIndex).toArrayLike(Uint8Array, "le", 2),
        new anchor.BN(stateIndex).toArrayLike(Uint8Array, "le", 4)
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return statePDA
  }

  export function getHospitalPDA(countryIndex: number, stateIndex: number, hospitalIndex: number)
  {
    const [hospitalPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("hospital"),
        new anchor.BN(countryIndex).toArrayLike(Uint8Array, "le", 2),
        new anchor.BN(stateIndex).toArrayLike(Uint8Array, "le", 4),
        new anchor.BN(hospitalIndex).toArrayLike(Uint8Array, "le", 4)
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return hospitalPDA
  }

  export function getInsuranceCompanyPDA(insuranceCompanyIndex: number)
  {
    const [insuranceCompanyPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("insuranceCompany"),
        new anchor.BN(insuranceCompanyIndex).toArrayLike(Uint8Array, "le", 2)
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return insuranceCompanyPDA
  }

  export function getPatientRecordPDA(submitterAddress: PublicKey | string, patientIndex: number, recordIndex: number)
  {
    if(typeof(submitterAddress) === "string")
    {
      const publicKey = new PublicKey(submitterAddress)
      const [patientRecordPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("patientRecord"),
          publicKey.toBuffer(),
          new anchor.BN(patientIndex).toArrayLike(Uint8Array, "le", 1),
          new anchor.BN(recordIndex).toArrayLike(Uint8Array, "le", 4)
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return patientRecordPDA
    }
    else
    {
      const [patientRecordPDA] = anchor.web3.PublicKey.findProgramAddressSync
      (
        [
          new TextEncoder().encode("patientRecord"),
          submitterAddress.toBuffer(),
          new anchor.BN(patientIndex).toArrayLike(Uint8Array, "le", 1),
          new anchor.BN(recordIndex).toArrayLike(Uint8Array, "le", 4)
        ],
        anchorPrograms.m4a.m4aProgram.programId
      )
      return patientRecordPDA
    }
  }

  export function getHospitalRecordPDA(countryIndex: number, stateIndex: number, hospitalIndex: number, recordIndex: number)
  {
    const [hospitalPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("hospitalRecord"),
        new anchor.BN(countryIndex).toArrayLike(Uint8Array, "le", 2),
        new anchor.BN(stateIndex).toArrayLike(Uint8Array, "le", 4),
        new anchor.BN(hospitalIndex).toArrayLike(Uint8Array, "le", 4),
        new anchor.BN(recordIndex).toArrayLike(Uint8Array, "le", 8)
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return hospitalPDA
  }

  export function getInsuranceCompanyRecordPDA(insuranceCompanyIndex: number, recordIndex: number)
  {
    const [hospitalPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("insuranceCompanyRecord"),
        new anchor.BN(insuranceCompanyIndex).toArrayLike(Uint8Array, "le", 2),
        new anchor.BN(recordIndex).toArrayLike(Uint8Array, "le", 8)
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return hospitalPDA
  }

  export default getM4AProtocolCEOAccount
</script>