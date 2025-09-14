<script lang="ts">
  import {  PublicKey } from "@solana/web3.js"
  import { countryNameArray, countryStateNameArray } from '/src/components/mapclaims/arrays/CountryStateArrays.ts'
  import { submitterHashMap, submitterPatientListHashMap, submitterActivePatientListHashMap, patientHashMap } from '/src/assets/globalStates/m4a/SubmittersAndPatients.vue'
  import { claimHashMap, processedClaimHashMap } from '/src/assets/globalStates/m4a/Claims.vue'
  import { processorHashMap } from '/src/assets/globalStates/m4a/Processors.vue'
  import { stateAccountReadyHashMap, stateHospitalListHashMap } from '/src/assets/globalStates/m4a/States.vue'
  import type { State } from '/src/assets/globalStates/m4a/States.vue'
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AFeeTokenAccounts()
  {
    console.log("Getting M4A Protocol Fee Token Accounts")

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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AProtocolCEOAccount()
  {
    console.log("Getting M4A Protocol CEO Account")

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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getM4AProtocolTreasurerAccount()
  {
    console.log("Getting M4A Protocol Treasurer Account")

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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function isSubmitterAccountInitialized(submitterAddress: string)
  {
    if(submitterHashMap.map)
    {
      const submitter = submitterHashMap.map.get(submitterAddress)
      if(submitter)
        return true
      else
        return false
    }
    else
      return false 
  }

  export async function getAllSubmitters()
  {
    console.log("Getting Submitters")

    var tempHashMap = new Map<string, any>()

    const submitters = await getAllSubmittersWrapper()

    for(var i=0; i<submitters.length; i++)
    {
      const submitter = submitters[i].account
      tempHashMap.set(submitter.address.toString(), submitter)
    }

    submitterHashMap.map = tempHashMap
  }

  async function getAllSubmittersWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.submitterAccount.all()
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getAllPatients()
  {
    console.log("Getting Patients")

    var tempPatientMap = new Map<string, any>()
    var tempSubmitterPatientListMap = new Map<string, any>()
    var tempSubmitterActivePatientListMap = new Map<string, any>()

    const patients = await getAllPatientsWrapper()

    for(var i=0; i<patients.length; i++)
    {
      const patient = patients[i].account

      //Populate Patient HashMap
      tempPatientMap.set(patient.submitterAddress.toString() + patient.submitterPatientIndex.toString(), patient)

      //Populate Submitter Patient List HashMap
      const previousList = tempSubmitterPatientListMap.get(patient.submitterAddress.toString())
      if(previousList)
      {
        patient.name = patient.patientFirstName + " " + patient.patientLastName
        previousList.push(patient)
        tempSubmitterPatientListMap.set(patient.submitterAddress.toString(), previousList)
      }
      else
      {
        patient.name = patient.patientFirstName + " " + patient.patientLastName
        tempSubmitterPatientListMap.set(patient.submitterAddress.toString(), [patient])
      }

      //Populate Submitter Active Patient List HashMap
      if(patient.isActive)
      {
        const previousListOnlyActive = tempSubmitterActivePatientListMap.get(patient.submitterAddress.toString())
        if(previousListOnlyActive)
        {
          patient.name = patient.patientFirstName + " " + patient.patientLastName
          previousListOnlyActive.push(patient)
          tempSubmitterActivePatientListMap.set(patient.submitterAddress.toString(), previousListOnlyActive)
        }
        else
        {
          patient.name = patient.patientFirstName + " " + patient.patientLastName
          tempSubmitterActivePatientListMap.set(patient.submitterAddress.toString(), [patient])
        }
      }
    }

    patientHashMap.map = tempPatientMap
    submitterPatientListHashMap.map = tempSubmitterPatientListMap
    submitterActivePatientListHashMap.map = tempSubmitterActivePatientListMap
  }

  export function getSubmitterPatientList(submitterAddress: string)
  {
    if(submitterPatientListHashMap.map)
    {
      const list = submitterPatientListHashMap.map.get(submitterAddress)
      if(list)
        return list
      else
        return []
    }
    else
      return []
  }

  export function getSubmitterActivePatientList(submitterAddress: string)
  {
    if(submitterActivePatientListHashMap.map)
    {
      const list = submitterActivePatientListHashMap.map.get(submitterAddress)
      if(list)
        return list
      else
        return []
    }
    else
      return []
  }

  async function getAllPatientsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.patientAccount.all()
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  //This is used on the stats page
  export function getPatientList(submitterAddress: string)
  {
    var patientList: any = []
    
    try
    {
      var submitterAccount = submitterHashMap.map.get(submitterAddress)
      
      for(var i=0; i<submitterAccount.patientCount; i++)
      {
        var patientAccount = patientHashMap.map.get(submitterAddress + i.toString())

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

  export function getNewPatient(submitterAddress: string)
  {
    try
    {
      var submitterAccount = submitterHashMap.map.get(submitterAddress)
      
      submitterAccount.patientCount
      var patientAccount = patientHashMap.map.get(submitterAddress + (submitterAccount.patientCount-1).toString())

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

  export function getNextSubmitterPatientIndex(submitterAddress: string)
  {
    const submitterPatientList = submitterPatientListHashMap.map.get(submitterAddress)

    if(submitterPatientList)
      return submitterPatientList.length
    else
      return 0
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function getProcessorAccount(processorAddress: PublicKey)
  {
    if(processorHashMap.map)
      return processorHashMap.map.get(processorAddress.toString())
    else
      return undefined 
  }

  export async function getProcessors()
  {
    console.log("Getting Processors")

    var processorList = []
    var hashMap = new Map<string, any>()

    const processors = await getProcessorsWrapper()
    
    for(var i=0; i<processors.length; i++)
    {
      //Get processor display name
      processors[i].account.processorDisplayName = getCustomOrTrimmedUserDisplayName(processors[i].account.address)

      hashMap.set(processors[i].account.address.toString(), processors[i].account)
      processorList.push(processors[i].account)
    }

    processorHashMap.map = hashMap
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function setPatientRecordsHashMap()
  {
    var hashMap = new Map<string, any>()

    const patientRecords = await getPatientRecordsWrapper()

    patientRecords.sort((a: any, b: any) => a.account.recordId - b.account.recordId)

    for(var i=0; i<patientRecords.length; i++)
    {
      const patientRecord = patientRecords[i].account

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

      const previousList = hashMap.get(patientRecord.submitterAddress.toString() + patientRecord.patientIndex.toString())
      if(previousList)
      {
        previousList.push(patientRecord)
        hashMap.set(patientRecord.submitterAddress.toString() + patientRecord.patientIndex.toString(), previousList)
      }
      else
        hashMap.set(patientRecord.submitterAddress.toString() + patientRecord.patientIndex.toString(), [patientRecord])
    }

    return hashMap
  }

  async function getPatientRecordsWrapper()
  {  
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.patientRecord.all()
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function setHospitalRecordsHashMap()
  {
    var hashMap = new Map<string, any>()

    const hospitalRecords = await getHospitalRecordsWrapper()

    hospitalRecords.sort((a: any, b: any) => a.account.recordId - b.account.recordId)

    for(var i=0; i<hospitalRecords.length; i++)
    {
      const hospitalRecord = hospitalRecords[i].account

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
      const submitter = submitterHashMap.map.get(hospitalRecord.submitterAddress.toString())
      hospitalRecord.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitter.approvedClaimAmount)
      //Get submitter display name
      hospitalRecord.submitterAddress = hospitalRecord.submitterAddress.toBase58()
      hospitalRecord.submitterDisplayName = getCustomOrTrimmedUserDisplayName(hospitalRecord.submitterAddress)

      //Get patient info
      const patient = patientHashMap.map.get(hospitalRecord.submitterAddress.toString() + hospitalRecord.patientIndex.toString())
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

      const hospitalRecordKey = hospitalRecord.countryIndex.toString() + hospitalRecord.stateIndex.toString() + hospitalRecord.hospitalIndex.toString()
      const previousList = hashMap.get(hospitalRecordKey)
      if(previousList)
      {
        previousList.push(hospitalRecord)
        hashMap.set(hospitalRecordKey, previousList)
      }
      else
        hashMap.set(hospitalRecordKey, [hospitalRecord])
    }

    return hashMap
  }

  async function getHospitalRecordsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.hospitalRecord.all()
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function setInsuranceCompanyRecordsHashMap()
  {
    var hashMap = new Map<string, any>()

    const insuranceCompanyRecords = await getInsuranceCompanyRecordsWrapper()

    insuranceCompanyRecords.sort((a: any, b: any) => a.account.recordId - b.account.recordId)

    for(var i=0; i<insuranceCompanyRecords.length; i++)
    {
      const insuranceCompanyRecord = insuranceCompanyRecords[i].account

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
      const submitter = submitterHashMap.map.get(insuranceCompanyRecord.submitterAddress.toString())
      insuranceCompanyRecord.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitter.approvedClaimAmount)
      insuranceCompanyRecord.insuranceCompanyName = submitter.insuranceCompanyName
      //Get submitter display name
      insuranceCompanyRecord.submitterAddress = insuranceCompanyRecord.submitterAddress.toBase58()
      insuranceCompanyRecord.submitterDisplayName = getCustomOrTrimmedUserDisplayName(insuranceCompanyRecord.submitterAddress)

      //Get patient info
      const patient = patientHashMap.map.get(insuranceCompanyRecord.submitterAddress.toString() + insuranceCompanyRecord.patientIndex.toString())
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

      const previousList = hashMap.get(insuranceCompanyRecord.insuranceCompanyIndex.toString())
      if(previousList)
      {
        previousList.push(insuranceCompanyRecord)
        hashMap.set(insuranceCompanyRecord.insuranceCompanyIndex.toString(), previousList)
      }
      else
        hashMap.set(insuranceCompanyRecord.insuranceCompanyIndex.toString(), [insuranceCompanyRecord])
    }

    return hashMap
  }

  async function getInsuranceCompanyRecordsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.insuranceCompanyRecord.all()
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  function getNextHospitalIndex(countryIndex: string, stateIndex: string)
  {
    const state = stateHospitalListHashMap.map.get(countryIndex + stateIndex)

    if(state)
      return state.hospitalCount
    else
      return 0  
  }

  export async function getClaimQueue()
  {
    console.log("Getting Claim Queue")

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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export function isClaimSubmitted(submitterAddress: PublicKey)
  {
    const claim = claimHashMap.map.get(submitterAddress.toString())

    if(claim)
      return true
    else
      return false
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
    console.log("Getting Claims")

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
      const state = stateAccountReadyHashMap.map.get(claim.countryIndex.toString() + claim.stateIndex.toString())
      if(state)
        claim.isStateReady = true
      else
        claim.isStateReady = false

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
      const submitterAccount = submitterHashMap.map.get(claim.submitterAddress.toString())
      claim.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitterAccount.approvedClaimAmount)
      //Get submitter display name
      claim.submitterDisplayName = getCustomOrTrimmedUserDisplayName(claim.submitterAddress)

      //Set patient full name
      const patient = patientHashMap.map.get(claim.submitterAddress.toString() + claim.patientIndex.toString())
      claim.patientFullName = patient.patientFirstName + " " + patient.patientLastName

      //Set patient approved claim total amount
      claim.patientApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(patient.approvedClaimAmount)

      //Set next available hospital index
      const nextAvailableHospitalIndex = getNextHospitalIndex(claim.countryIndex.toString(), claim.stateIndex.toString())
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getStateAccounts()
  {
    var hashMap = new Map<string, any>()

    const states = await getStateAccountsWrapper()

    for(var i=0; i<states.length; i++)
    {
      hashMap.set(states[i].account.countryIndex.toString() + states[i].account.stateIndex.toString(), states[i].account)
    }

    stateAccountReadyHashMap.map = hashMap
  }

  async function getStateAccountsWrapper()
  {
    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.stateAccount.all()
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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

  export async function getAllHospitalsAndUpdateStateMap()
  {
    console.log("Getting Hospitals")

    var hospitalList: any = []
    var hospitalTempHashMap = new Map<string, any>()
    var stateTempHashMap = new Map<string, any>()

    const hospitals = await getAllHospitalsWrapper()

    for(var i=0; i<hospitals.length; i++)
    {
      const hospital = hospitals[i].account
      const state = stateTempHashMap.get(hospital.countryIndex.toString() + hospital.stateIndex.toString())

      if(state)
      {
        //Update State Hash Map Entry
        state.hospitalList.push(hospital)
        state.approvedClaimAmount = state.approvedClaimAmount.add(hospital.approvedClaimAmount)
        state.approvedClaimCount = state.approvedClaimCount.add(hospital.approvedClaimCount)
        state.deniedClaimCount = state.deniedClaimCount.add(hospital.deniedClaimCount)
        state.undeniedClaimCount = state.undeniedClaimCount.add(hospital.undeniedClaimCount)
        state.submittedAppealCount = state.submittedAppealCount.add(hospital.submittedAppealCount)
        state.deniedAppealCount = state.deniedAppealCount.add(hospital.deniedAppealCount)
        state.revokedApprovalCount = state.revokedApprovalCount.add(hospital.revokedApprovalCount)
        state.hospitalCount += 1

        state.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(state.approvedClaimAmount)

        //Set hospital type name and hospital count
        if(hospital.hospitalType == HospitalTypes.General)
        {
          hospital.hospitalTypeName = "General"
          state.generalHospitalCount += 1
        }
        else if(hospital.hospitalType == HospitalTypes.Dental)
        {
          hospital.hospitalTypeName = "Dental"
          state.dentalHospitalCount += 1
        }
        else if(hospital.hospitalType == HospitalTypes.Vision)
        {
          hospital.hospitalTypeName = "Vision"
          state.visionHospitalCount += 1
        }
        else if(hospital.hospitalType == HospitalTypes.Mental)
        {
          hospital.hospitalTypeName = "Mental"
          state.mentalHospitalCount += 1
        }

        stateTempHashMap.set(hospital.countryIndex.toString() + hospital.stateIndex.toString(), state)
      }
      else
      {
        //Create New State Hash Map Entry
        var newStateEntry: State = 
        {
          hospitalList: [hospital],
          approvedClaimAmountString: parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount),
          approvedClaimAmount: hospital.approvedClaimAmount,
          approvedClaimCount: hospital.approvedClaimCount,
          deniedClaimCount: hospital.deniedClaimCount,
          undeniedClaimCount: hospital.undeniedClaimCount,
          submittedAppealCount: hospital.submittedAppealCount,
          deniedAppealCount: hospital.deniedAppealCount,
          revokedApprovalCount: hospital.revokedApprovalCount,
          hospitalCount: 1,
          generalHospitalCount: 0,
          dentalHospitalCount: 0,
          visionHospitalCount: 0,
          mentalHospitalCount: 0
        }

        //Set hospital type name and hospital count
        if(hospital.hospitalType == HospitalTypes.General)
        {
          hospital.hospitalTypeName = "General"
          newStateEntry.generalHospitalCount += 1
        }
        else if(hospital.hospitalType == HospitalTypes.Dental)
        {
          hospital.hospitalTypeName = "Dental"
          newStateEntry.dentalHospitalCount += 1
        }
        else if(hospital.hospitalType == HospitalTypes.Vision)
        {
          hospital.hospitalTypeName = "Vision"
          newStateEntry.visionHospitalCount += 1
        }
        else if(hospital.hospitalType == HospitalTypes.Mental)
        {
          hospital.hospitalTypeName = "Mental"
          newStateEntry.mentalHospitalCount += 1
        }

        stateTempHashMap.set(hospital.countryIndex.toString() + hospital.stateIndex.toString(), newStateEntry)
      }

      //Set hospital phone number, approved claim total, country name, and state name
      hospital.hospitalPhoneNumber = parsePhoneNumberString(hospital.hospitalPhoneNumber)
      hospital.approvedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(hospital.approvedClaimAmount)
      hospital.hospitalCountryName = countryNameArray[hospital.countryIndex]
      hospital.hospitalStateName = countryStateNameArray[hospital.countryIndex][ hospital.stateIndex]

      hospital.isEditingRow = false
      hospital.isDataEdited = false

      hospitalTempHashMap.set(hospital.countryIndex.toString()+
      hospital.stateIndex.toString()+
      hospital.hospitalIndex.toString(), hospital)

      hospitalList.push(hospital)
    }

    stateHospitalListHashMap.map = stateTempHashMap
    hospitalHashMap.map = hospitalTempHashMap

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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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
    console.log("Getting Insurance Companies")

    var insuranceCompanies = []
    var hashMap = new Map<string, any>()

    var rawInsuranceCompanies: any[] = await getAllInsuranceCompaniesWrapper()

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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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

  export async function getProcessedClaimStats()
  {
    console.log("Getting ProcessedClaimStats")

    for(var i=1; i<=MAX_RETRY_FETCH; i++)
    {
      try
      {
        return await anchorPrograms.m4a.m4aProgram.account.processedClaimStats.fetch(getProcessedClaimStatsPDA())
      }
      catch(error: any)
      {
        if(!error.message.includes(ERROR_429))
        {
          console.log("Processed Claim Stats Not Initialized")
          return undefined
        }
        else
        {
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
          await sleep(RETRY_TIME_OUT*i*2)
        }
      }
    }
  }

  export async function getProcessedClaims()
  {
    console.log("Getting Processed Claims")

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
      const submitterAccount = submitterHashMap.map.get(processedClaim.submitterAddress.toString())
      processedClaim.submitterApprovedClaimAmountString = parseDollarAmountStringFromFixed2PointNotation(submitterAccount.approvedClaimAmount)
      //Get submitter display name
      processedClaim.submitterDisplayName = getCustomOrTrimmedUserDisplayName(processedClaim.submitterAddress)

      //Set patient first and last name and set claim total decimals from fixed point
      const patient = patientHashMap.map.get(processedClaim.submitterAddress.toString() + processedClaim.patientIndex.toString())
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
          console.log(RETRY_MESSAGE + RETRY_TIME_OUT*i*2/1000)
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

  export function getSubmitterStatsPDA()
  {
    const [submitterStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("submitterStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return submitterStatsPDA
  }

  export function getPatientStatsPDA()
  {
    const [patientStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("patientStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return patientStatsPDA
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

  export function getPatientRecordStatsPDA()
  {
    const [patientRecordStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("patientRecordStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return patientRecordStatsPDA
  }

  export function getHospitalAndInsuranceRecordStatsPDA()
  {
    const [hospitalAndInsuranceRecordStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("hospitalAndInsuranceRecordStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return hospitalAndInsuranceRecordStatsPDA
  }

  export function getProcessedClaimStatsPDA()
  {
    const [processedClaimStatsPDA] = anchor.web3.PublicKey.findProgramAddressSync
    (
      [
        new TextEncoder().encode("processedClaimStats")
      ],
      anchorPrograms.m4a.m4aProgram.programId
    )
    return processedClaimStatsPDA
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