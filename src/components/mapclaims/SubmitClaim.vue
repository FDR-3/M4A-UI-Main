<template>
  <br>
  <!--Ion Alert has to be here to work with add patient button in select, as well as the no active patients button-->
  <ion-alert 
    :is-open="addPatientAlertIsOpen"
    @didDismiss="addPatientAlertIsOpen=false"
    header="Enter Patient's Real First And Last Name"
    sub-header="Can't call and pay their bill without it. Also the name can't be updated later so don't fuck up this part (✿◠‿◠) If the patient's name is ever legally changed (or misspelled), you will need to add a new patient. (The patient and the submitter don't have to be the same person)"
    :buttons="alertButtons"
    :inputs="alertInputs">
  </ion-alert>

  <!--Edit Patient List Visibility Modal-->
  <div v-if="isEditingPatientList"
    id="editPatientListModal"
    class="thickBorder"
    @blur="isEditingPatientList=false"
  >
    <div class="editPatientListModalHeader tinyMarginTop">
      <ion-text class="noClickEvent">Visibile</ion-text>
      <ion-text class="noClickEvent" style="margin-left: -20px">Name</ion-text>
      <ion-text class="noClickEvent" style="margin-right: -2px">Toggle</ion-text>
    </div>
    <div v-for="patient in patientList" class="editPatientListModalRow">
        <div class="editPatientListRowItem">
          <div v-if="patient.isActive" class="visiblePatientCircle noClickEvent"></div>
          <div v-else class="invisiblePatientCircle noClickEvent"></div>
        </div>
        <ion-text class="editPatientListRowItem">{{patient.name}}</ion-text>
        <ion-button class="editPatientListRowItem" color="dark" @click="setPatientFlag(patient.index, !patient.isActive)">
          Toggle<br>{{ patient.isActive ? 'Off' : "On" }}
        </ion-button>
    </div>
  </div>

  <h1 >Submit {{stateName}} Claims</h1>
  <SubmitClaimProgressBar
    v-if="!anchorPrograms.areM4AProtocolStatsReady ||
    !anchorPrograms.isM4AProtocolReady ||
    !connectedWallet.isSubmitterAccountReady ||
    !(patientList?.length>0)"
    :colorHexValue="colorHexValue"
    :areM4AProtocolStatsReady="anchorPrograms.areM4AProtocolStatsReady"
    :isM4AProtocolReady="anchorPrograms.isM4AProtocolReady"
    :isSubmitterAccountReady="connectedWallet.isSubmitterAccountReady"
    :hasPatientList="patientList?.length>0"
  />
  <div v-if="!anchorPrograms.areM4AProtocolStatsReady" class="mediumSmallMarginTop mediumSmallMarginBottom">
    <ion-text color="dark">South Carolina BETA hasn't started yet</ion-text>
  </div>
  <ion-label v-else-if="connectedWallet.addressString == SYSTEM_PROGRAM_ADDRESS_STRING">
    Connect wallet to submit claim for $0.04
  </ion-label>
  <ion-button v-else-if="!anchorPrograms.isM4AProtocolReady" @click="initializeM4AProtocolAndClaimQueue()" color="green">
    <ion-label color="dark">Init M4A Protocol</ion-label>
  </ion-button>
  <div v-else-if="!isClaimQueueOn">
    <ion-text color="dark">Claim Queue is currently disabled</ion-text>
  </div>
  <ion-button v-else-if="!connectedWallet.isSubmitterAccountReady" @click="initSubmitterAccount()" color="green">
    <ion-label color="dark">Init Submitter Account</ion-label>
  </ion-button>

  <div v-else-if="patientList?.length==0">
    <ion-button @click="addPatientAlertIsOpen=true" color="green">
      <ion-label color="dark">No Patients Detected, Add Patient</ion-label>
    </ion-button> 
  </div>

  <div v-else-if="isClaimAlreadySubmitted">
    <ion-label color="dark">Your Claim Is In The Queue</ion-label>
  </div>

  <div v-else>
    <ion-button color="dark" @click="clearInputs()">Clear</ion-button>
    <div>
      <Select 
        ref="patientSelectRef"
        id="patientSelect"
        class="standardFontSize mediumMarginTop"
        v-model="patientSelect" 
        :options="activePatientList" 
        optionLabel="name" 
        optionValue="index" 
        placeholder="Select Patient"
        appendTo="self"
        :invalid="patientSelectInvalid"
      >
        <template #footer>
          <div class="flexCenterColumn">
            <div>
              <ion-button id="editPatientVisibilityButton" @click="isEditingPatientList=true; patientSelectRef.hide()" color="dark">
                <ion-label class="noClickEvent" color="light">Edit Visibility</ion-label>
              </ion-button>
            </div>
            <div>
              <ion-button @click="addPatientAlertIsOpen=true" color="dark">
                <ion-label color="light">Add Patient</ion-label>
              </ion-button>
            </div>
          </div>
        </template>
      </Select>
    </div>
    <Select 
      id="hospitalTypeSelect"
      class="standardFontSize mediumMarginTop"
      v-model="hospitalTypeSelect" 
      :options="hospitalTypeOptions" 
      optionLabel="hospitalTypeName" 
      optionValue="index" 
      placeholder="Hospital Type"
      appendTo="self"
      :invalid="hospitalTypeSelectInvalid"
      :disabled="preFillInputs">
    </Select>
    <div class="flexCenterRow row1">
      <FloatLabel>
        <InputText v-model="hospitalName" class="formInput" id="hospitalName" :invalid="hospitalNameInvalid" :disabled="preFillInputs" maxlength="100"/>
        <label id="hospitalNameLabel" for="hospitalName">Hospital Name</label>
      </FloatLabel>

      <FloatLabel>
        <InputText v-model="hospitalAddress" class="formInput" id="hospitalAddress" :invalid="hospitalAddressInvalid" :disabled="preFillInputs" maxlength="100"/>
        <label id="hospitalAddressLabel" for="hospitalAddress">Hospital Street Address</label>
      </FloatLabel>

      <FloatLabel>
        <InputText v-model="hospitalCity" class="formInput" id="hospitalCity" :invalid="hospitalCityInvalid" :disabled="preFillInputs" maxlength="40"/>
        <label id="hospitalCityLabel" for="hospitalCity">Hospital City</label>
      </FloatLabel>

      <FloatLabel>
        <InputText v-model="hospitalState" class="formInput" id="hospitalState" disabled/>
        <label id="hospitalStateLabel" for="hospitalState">Hospital State</label>
      </FloatLabel> 
    </div>

    <div class="flexCenterRow row2">
      <FloatLabel>
        <InputMask v-model="hospitalZipCode" class="formInput" id="hospitalZipCode" :invalid="hospitalZipCodeInvalid" mask="99999" fluid :disabled="preFillInputs"/>
        <label id="hospitalZipCodeLabel" for="hospitalZipCode">Hospital Zip Code</label>
      </FloatLabel>  

      <FloatLabel>
        <InputMask v-model="hospitalPhoneNumber" class="formInput" id="hospitalPhoneNumber" :invalid="hospitalPhoneNumberInvalid" mask="(999) 999-9999" fluid :disabled="preFillInputs"/>
        <label id="hospitalPhoneNumberLabel" for="hospitalPhoneNumber">Hospital Phone Number</label>
      </FloatLabel>

      <FloatLabel>
        <InputText v-model="billInvoiceNumber" class="formInput" id="billInvoiceNumber" maxlength="20"/>
        <label id="billInvoiceNumberLabel" for="billInvoiceNumber">Bill Invoice Number?</label>
      </FloatLabel>
      
      <FloatLabel>
        <InputNumber v-model="claimAmount" :inputStyle="{'text-align': 'center'}" class="formInput" id="claimAmount" :invalid="claimAmountInvalid" inputId="currency-us" mode="currency" currency="USD" locale="en-US" fluid/>
        <label id="claimAmountLabel" for="claimAmount">Claim Amount</label>
      </FloatLabel>
    </div>

    <div class="flexCenterRow row2">
    <FloatLabel>
      <InputText v-model="ailment" class="formInput" id="ailment" :invalid="ailmentInvalid" maxlength="45"/>
      <label id="ailmentLabel" for="ailment">Ailment or Procedure</label>
    </FloatLabel>
    </div>

    <div v-if="!newInsuranceToggle" class="flexCenterRow">
      <Select 
          id="insuranceSelect"
          class="standardFontSize"
          v-model="insuranceSelect" 
          :options="insuranceCompanyList" 
          optionLabel="insuranceCompanyName" 
          optionValue="insuranceCompanyIndex" 
          placeholder="Have Insurance?"
          appendTo="self"
          :invalid="insuranceSelectInvalid"
      >
        <template #footer>
          <div class="flexCenterRow">
            <ion-button @click="newInsuranceToggle=true" color="dark">
              <ion-label color="light">Other Insurance</ion-label>
            </ion-button>
          </div>
        </template>
      </Select>
    </div>

    <div v-if="newInsuranceToggle" class="flexCenterRow">
      <FloatLabel>
        <InputText v-model="newInsuranceCompany" class="formInput" id="newInsuranceCompany" :invalid="newInsuranceCompanyInvalid" maxlength="35" :counter="true"/>
        <label id="newInsuranceCompanyButtonLabel" for="newInsuranceCompany">New Insurance Company</label>
      </FloatLabel>
    </div>
    <div v-if="newInsuranceToggle" class="flexCenterRow">
      <ion-button id="insuranceReturnButton" @click="newInsuranceToggle=false" fill="clear">
        <ion-label color="dark">Return To<br>Insurance Select</ion-label>
      </ion-button>
    </div>

    <ion-textarea 
    ref="addClaimNoteTextArea" 
    class="emojiTextSmaller"
    label-placement="stacked"
    v-model="note"
    placeholder="  Optional Note" 
    :maxlength=M4A_MAX_NOTE_LENGTH 
    :counter="true" 
    :spellcheck="true"
    :counter-formatter="customFormatter"> 
      <EmojiButton 
        :colorHexValue="colorHexValue"
        @emojiSelected="(emoji: String) => insertEmoji(emoji)"
      /> 
    </ion-textarea>
    <div class="flexCenterColumn">
      <ion-label v-if="invalidInputs" color="red" >Fill in required inputs</ion-label>
    </div>  
      <ion-button id="claimSubmitButton" color="green" @click="submitClaimToQueue()" :disabled=overCommentByteSizeLimit>
        <span class="flexCenterRow">
          <ion-text color="dark" >Submit a Claim for just $0.04</ion-text>
          <USDCSVG class="svgSize tinyMarginLeft"/>
        </span>
      </ion-button> 
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted, computed, watch, onUpdated, inject } from 'vue'
  import { IonButton, IonLabel, IonAlert, IonTextarea, IonText } from '@ionic/vue'
  import InputText from 'primevue/inputtext'
  import InputMask from 'primevue/inputmask'
  import InputNumber from 'primevue/inputnumber'
  import FloatLabel from 'primevue/floatlabel'
  import Select from 'primevue/select'
  import { mapSelection } from '/src/assets/globalStates/MapSelection.vue'
  import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
  import { claimQueue } from '/src/assets/globalStates/m4a/Claims.vue'
  import { hospitalHashMap} from '/src/assets/globalStates/m4a/Hospitals.vue'
  import { insuranceCompanies} from '/src/assets/globalStates/m4a/InsuranceCompanies.vue'
  import SubmitClaimProgressBar from '/src/components/mapclaims/SubmitClaimProgressBar.vue'
  import EmojiButton from '/src/components/comments/emojis/EmojiButton.vue'
  import USDCSVG from '/src/assets/cryptoIcons/usdc-svg.vue'
  import { PublicKey } from "@solana/web3.js"
  import { M4A_MAX_NOTE_LENGTH,
    isClaimSubmitted,
    getPatientLists,
    getInsuranceCompany,
    getSubmitterAccountPDA,
    getClaimPDA } from '/src/assets/contracts/Solana/M4AProtocol.vue'
  import { hospitalTypeOptions } from '/src/types/HospitalTypes.ts'
  import { confirmM4ATransaction, toastPreTransactionError } from '/src/assets/contracts/WalletHelper.vue'
  import * as anchor from "@coral-xyz/anchor"
  import { anchorPrograms, SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'

  const props = defineProps(['stateName', 'countryIndex', 'stateIndex', 'colorHexValue'])

  const toast = inject('toast')

  var isEditingPatientList = ref()
  var addPatientAlertIsOpen = ref()
  
  var patientSelect = ref()
  var hospitalTypeSelect = ref()
  var hospitalName = ref()
  var hospitalAddress = ref()
  var hospitalCity = ref()
  var hospitalState = ref(props.stateName)
  var hospitalZipCode = ref()
  var hospitalPhoneNumber = ref()
  var billInvoiceNumber = ref()
  var claimAmount = ref()
  var ailment = ref()
  var insuranceSelect = ref()
  var newInsuranceCompany = ref()
  var note = ref("")//Set as string initially for length to insert emoji
  var addClaimNoteTextArea = ref()
  var savedEmojiCursorPosition: any
  var overCommentByteSizeLimit = ref()
  var preFillInputs = ref()
  var newInsuranceToggle = ref()

  var isClaimQueueOn = ref()
  var patientSelectInvalid = ref()
  var hospitalTypeSelectInvalid = ref()
  var hospitalNameInvalid = ref()
  var hospitalAddressInvalid = ref()
  var hospitalCityInvalid = ref()
  var hospitalZipCodeInvalid = ref()
  var hospitalPhoneNumberInvalid = ref()
  var claimAmountInvalid = ref()
  var ailmentInvalid = ref()
  var insuranceSelectInvalid = ref()
  var newInsuranceCompanyInvalid = ref()

  var patientSelectRef = ref()
  var patientList = ref()
  var activePatientList = ref()
  var insuranceCompanyList = ref()

  var isClaimAlreadySubmitted = ref()

  var isPatientAccountReadyWatchId: any
  var additionalInsuranceCompanyWatchId: any
  var claimWatchId: any

  onMounted(async () => 
  {
    if(mapSelection.preSelectedHospitalIndex != -1)
    {
      preFillClaimInputs(mapSelection.preSelectedHospitalIndex)
      setTimeout(() => 
      {
        document.getElementById("submitClaimsHeader")?.scrollIntoView()
      }, 1000) // 2000 milliseconds = 2 seconds
    }

    //Get Claim Queue data
    if(claimQueue.data)
      isClaimQueueOn.value = claimQueue.data.enabled
    else
      isClaimQueueOn.value = false; //Semicolon needed because tuple line follows after this one

    //Get Patients
    /*[patientList.value, activePatientList.value] = await getPatientLists(connectedWallet.publicKey)
    await listenForAdditionalPatients(connectedWallet.publicKey)*/

    //Get Insurance Companies
    if(insuranceCompanies.data)
      insuranceCompanyList.value = insuranceCompanies.data

    //Get Claim
    /*isClaimAlreadySubmitted.value = await isClaimSubmitted(connectedWallet.publicKey)
    await listenForClaimChanges()*/
  })

  onUnmounted(() =>
  {
    mapSelection.preSelectedHospitalIndex = -1

    if(isPatientAccountReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(isPatientAccountReadyWatchId)
      isPatientAccountReadyWatchId = undefined
    }
    if(additionalInsuranceCompanyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(additionalInsuranceCompanyWatchId)
      additionalInsuranceCompanyWatchId = undefined
    }
    if(claimWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(claimWatchId)
      claimWatchId = undefined
    }
  })

  //Json string of wallet to detect object property changes
  const walletWatch = computed(() =>
  {
    return JSON.stringify(connectedWallet)
  })

  watch(walletWatch, async (newJSONObjectString, oldJSONObjectString) =>
  {
    let newWallet = JSON.parse(newJSONObjectString)
    let oldWallet= JSON.parse(oldJSONObjectString)

    if(newWallet.addressString == oldWallet.addressString)
      return

    //Patient Account
    if(isPatientAccountReadyWatchId != undefined)
    {
      anchorPrograms.m4a.m4aProgram.provider.connection.removeAccountChangeListener(isPatientAccountReadyWatchId)
      isPatientAccountReadyWatchId = undefined
    }

    patientList.value = []
    activePatientList.value = []
    
    /*if(connectedWallet.isSubmitterAccountReady)
      [patientList.value, activePatientList.value] = await getPatientLists(connectedWallet.publicKey)

    console.log(patientList.value)
    await listenForAdditionalPatients(connectedWallet.publicKey)*/
  })

  watch(claimQueue, async() => 
  {
    isClaimQueueOn.value = claimQueue.data.enabled
  })

  watch(insuranceCompanies, () => 
  {
    insuranceCompanyList.value = insuranceCompanies.data
  })

  // When the user clicks anywhere outside of the edit patient list modal, close it, not when closing toast alert though
  window.onclick = function(event: any) 
  {
    if(isEditingPatientList.value)
      if((event?.target?.id != "editPatientVisibilityButton") &&
      (event?.target?.id != "editPatientListModal") &&
      !event?.target?.classList.contains("editPatientListModalHeader") &&
      !event?.target?.classList.contains("editPatientListModalRow") &&
      !event?.target?.classList.contains("editPatientListRowItem") &&
      !event?.target?.classList.contains("p-toast-summary") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-detail") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-message-content") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-message-text") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-message-icon") && //Keep transaction toast from closing modal
      !event?.target?.classList.contains("p-toast-close-icon") && //Keep transaction toast from closing modal
      !event?.target?.closest('path')) //Keep transaction toast from closing modal
        isEditingPatientList.value = false
  }

  function insertEmoji(emoji: String)
  {
    var textAreaElement = addClaimNoteTextArea.value.$el.querySelector(".native-textarea")
    if(textAreaElement) 
    {
      const start = textAreaElement.selectionStart
      const end = textAreaElement.selectionEnd
      const newValue = 
      note.value.substring(0, start) + 
      emoji + 
      note.value.substring(end)

      note.value = newValue

      savedEmojiCursorPosition = textAreaElement.selectionStart + emoji.length
    }
  }

  const customFormatter = (inputLength: number, maxLength: number) => 
  {
    const blob = new Blob([note.value])
    const sizeInBytes = blob.size

    inputLength = sizeInBytes

    if(inputLength > maxLength)
    {
      overCommentByteSizeLimit.value = true
    }
    else
      overCommentByteSizeLimit.value = false

    return `${inputLength}/${maxLength}`
  }

  //Move cursor back after emoji insert
  onUpdated(() => 
  {
    var textAreaElement = addClaimNoteTextArea.value?.$el.querySelector(".native-textarea")

    if(savedEmojiCursorPosition != undefined)
      if(textAreaElement)
      {
        textAreaElement.setSelectionRange(savedEmojiCursorPosition, savedEmojiCursorPosition)
        textAreaElement.focus()
        savedEmojiCursorPosition = undefined
      }
  })

  async function preFillClaimInputs(hospitalIndex:number)
  {
    const existingHospital = hospitalHashMap.map.get(props.countryIndex.toString()+props.stateIndex.toString()+hospitalIndex.toString())

    hospitalTypeSelect.value = existingHospital.hospitalType
    hospitalName.value = existingHospital.hospitalName
    hospitalAddress.value = existingHospital.hospitalAddress
    hospitalCity.value = existingHospital.hospitalCity
    hospitalZipCode.value = existingHospital.hospitalZipCode
    hospitalPhoneNumber.value = existingHospital.hospitalPhoneNumber
    
    preFillInputs.value = true
    mapSelection.preSelectedHospitalIndex = hospitalIndex
  }

  defineExpose(
  {
    preFillClaimInputs
  })

  const invalidInputs = computed(() => 
  {
    return (patientSelectInvalid.value ||
      hospitalTypeSelectInvalid.value ||
      hospitalNameInvalid.value || 
      hospitalAddressInvalid.value || 
      hospitalCityInvalid.value ||
      hospitalZipCodeInvalid.value ||
      hospitalPhoneNumberInvalid.value ||
      claimAmountInvalid.value ||
      ailmentInvalid.value ||
      insuranceSelectInvalid.value ||
      newInsuranceCompanyInvalid.value)
  })

  function checkIfInputsValid()
  { 
    if(patientSelect.value === undefined || patientSelect.value === null)
      patientSelectInvalid.value = true
    else
      patientSelectInvalid.value = false

    if(hospitalTypeSelect.value === undefined || hospitalTypeSelect.value === null)
      hospitalTypeSelectInvalid.value = true
    else
      hospitalTypeSelectInvalid.value = false

    if(hospitalName.value === undefined || hospitalName.value === null || hospitalName.value.length === 0)
      hospitalNameInvalid.value = true
    else
      hospitalNameInvalid.value = false

    if(hospitalAddress.value === undefined || hospitalAddress.value === null || hospitalAddress.value.length === 0)
      hospitalAddressInvalid.value = true
    else
      hospitalAddressInvalid.value = false

    if(hospitalCity.value === undefined || hospitalCity.value === null || hospitalCity.value.length === 0)
      hospitalCityInvalid.value = true
    else
      hospitalCityInvalid.value = false

    if(hospitalZipCode.value === undefined || hospitalZipCode.value === null || hospitalZipCode.value.length === 0)
      hospitalZipCodeInvalid.value = true
    else
      hospitalZipCodeInvalid.value = false

    if(hospitalPhoneNumber.value === undefined || hospitalPhoneNumber.value === null || hospitalPhoneNumber.value.length === 0)
      hospitalPhoneNumberInvalid.value = true
    else
      hospitalPhoneNumberInvalid.value = false

    if(claimAmount.value === undefined || claimAmount.value === null)
    {
        claimAmountInvalid.value = true
        const claimAmountLabelElement = document.getElementById("claimAmountLabel")
        claimAmountLabelElement?.classList.add("invalid")
    }
    else
    {
      claimAmountInvalid.value = false
      const claimAmountLabelElement = document.getElementById("claimAmountLabel")
        claimAmountLabelElement?.classList.remove("invalid")
    }

    if(ailment.value === undefined || ailment.value === null || ailment.value.length === 0)
      ailmentInvalid.value = true
    else
      ailmentInvalid.value = false

    if(newInsuranceToggle.value)
    {
      if(newInsuranceCompany.value === undefined || newInsuranceCompany.value === null  || newInsuranceCompany.value.length === 0)
        newInsuranceCompanyInvalid.value = true
      else
        newInsuranceCompanyInvalid.value = false

      insuranceSelectInvalid.value = false
    }
    else
    {
      if(insuranceSelect.value === undefined || insuranceSelect.value === null)
        insuranceSelectInvalid.value = true
      else
        insuranceSelectInvalid.value = false

      newInsuranceCompanyInvalid.value = false
    }
  }

  function clearInputs()
  {
    patientSelect.value = null
    hospitalTypeSelect.value = null
    hospitalName.value = ""
    hospitalAddress.value = ""
    hospitalCity.value = ""
    hospitalZipCode.value = ""
    hospitalPhoneNumber.value = ""
    billInvoiceNumber.value = ""
    claimAmount.value = null
    ailment.value = ""
    insuranceSelect.value = null
    newInsuranceCompany.value = "" 
    note.value = ""
    preFillInputs.value = false
  }

  const alertButtons = 
  [
    {
      text: 'Cancel',
      role: 'cancel'
    },
    {
      text: 'Submit',
      role: 'confirm',
      handler: async (alertData: any) => 
      {
        try
        {
          const tx = await anchorPrograms.m4a.m4aProgram.methods.createPatientAccount(alertData.firstName, alertData.lastName).rpc()
          await confirmM4ATransaction(tx, toast, "create_patient_account")
        }
        catch(error)
        {
          toastPreTransactionError(error, toast, "create_patient_account")
        }
      }
    },
  ]

  var inputFirstName = ref("")
  var inputLastName = ref("")

  const alertInputs = 
  [
    {
      placeholder: 'First Name',
      name: 'firstName',
      value: inputFirstName.value,
      attributes: 
      {
        maxlength: 52
      },
      handler: (e: { detail: { value: any } }) => inputFirstName.value = e.detail.value
    },
    {
      placeholder: 'Last Name',
      name: 'lastName',
      value: inputLastName.value,
      attributes: 
      {
        maxlength: 52
      },
      handler: (e: { detail: { value: any } }) => inputLastName.value = e.detail.value
    }
  ]

  async function setPatientFlag(patientIndex: number, flag: boolean)
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.setPatientFlag(patientIndex, flag).rpc()
      await confirmM4ATransaction(tx, toast, "set_patient_flag")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "set_patient_flag")
    }
  }

  async function initializeM4AProtocolAndClaimQueue()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.initializeM4AProtocolAndClaimQueue().rpc()
      await confirmM4ATransaction(tx, toast, "initialize_m4a_protocol_and_claim_queue")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "initialize_m4a_protocol_and_claim_queue")
    }
  }

  async function initSubmitterAccount()
  {
    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.createSubmitterAccount().rpc()
      await confirmM4ATransaction(tx, toast, "create_submitter_account")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "create_submitter_account")
    }
  }

  async function submitClaimToQueue()
  {
    if(billInvoiceNumber.value == "")
      billInvoiceNumber.value = "N/A"

    checkIfInputsValid()

    if(invalidInputs.value)
      return
    
    var hospitalIndex

    if(preFillInputs.value)
      hospitalIndex = mapSelection.preSelectedHospitalIndex
    else
    {
      hospitalIndex = -1
    }

    if(insuranceSelect.value == null)
      insuranceSelect.value = 0

    var insuranceCompanyName

    if(newInsuranceToggle.value)
    {
      insuranceSelect.value = -1
      insuranceCompanyName = newInsuranceCompany.value
    }
    else
    {
      const insuranceCompany = getInsuranceCompany(insuranceSelect.value)
      insuranceCompanyName = insuranceCompany.insuranceCompanyName

      newInsuranceCompany.value = ""
    }

    try
    {
      const tx = await anchorPrograms.m4a.m4aProgram.methods.submitClaimToQueue(
        patientSelect.value,
        anchorPrograms.usdcFeeTokenAddress,
        mapSelection.countryIndex,
        mapSelection.stateIndex,
        hospitalIndex,
        hospitalTypeSelect.value,
        hospitalName.value,
        hospitalAddress.value,
        hospitalCity.value,
        hospitalZipCode.value,
        new anchor.BN(hospitalPhoneNumber.value.replace(/\D/g, "")),
        billInvoiceNumber.value,
        note.value == "" ? "None" : note.value,
        new anchor.BN(claimAmount.value * 100), //Convert from decimal to fixed 2 point notation
        ailment.value,
        insuranceSelect.value,
        insuranceCompanyName
      ).rpc() 

      mapSelection.preSelectedHospitalIndex = -1

      patientSelect.value = null
      hospitalTypeSelect.value = null
      hospitalName.value = ""
      hospitalAddress.value = ""
      hospitalCity.value = ""
      hospitalZipCode.value = ""
      hospitalPhoneNumber.value = ""
      billInvoiceNumber.value = ""
      claimAmount.value = null
      ailment.value = ""
      insuranceSelect.value = null
      newInsuranceCompany.value = "" 
      note.value = ""
      preFillInputs.value = false

      await confirmM4ATransaction(tx, toast, "submit_claim_to_queue")
    }
    catch(error)
    {
      toastPreTransactionError(error, toast, "submit_claim_to_queue")
    }
  }

  async function listenForAdditionalPatients(submitterAddress: PublicKey)
  {
    try
    {
      //Subscribe to account changes
      isPatientAccountReadyWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getSubmitterAccountPDA(submitterAddress), async() => 
      {
        //Handle account change...
        [patientList.value, activePatientList.value] = await getPatientLists(submitterAddress)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }

  async function listenForClaimChanges()
  {
    try
    {
      //Subscribe to account changes
      claimWatchId = anchorPrograms.m4a.m4aProgram.provider.connection.onAccountChange(getClaimPDA(connectedWallet.publicKey), async() => 
      {
        //Handle account change...
        isClaimAlreadySubmitted.value = await isClaimSubmitted(connectedWallet.publicKey)
      })
    }
    catch(error)
    {
      console.log(error)
    }
  }
</script>

<style scoped>
  #editPatientListModal
  {
    position: fixed; /* Makes sure the modal is fixed in place on the screen */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    min-height: 50px;
    z-index: 4000; /* Makes sure the modal is on top */
    background-color: var(--ion-background-color);
  }

  .editPatientListModalHeader
  {
    display: flex;
    justify-content: space-around;
  }

  .editPatientListModalRow
  {
    display: flex;
    align-items: center;
    justify-content:space-around
  }

  .invisiblePatientCircle 
  {
    margin-left: 42px;
    width: 20px;
    height: 20px;
    border: thin solid v-bind(colorHexValue);
  }

  .visiblePatientCircle 
  {
    margin-left: 42px;
    width: 20px;
    height: 20px;
    background-color: v-bind(colorHexValue);
  }

  .editPatientListRowItem
  {
    width: 82px
  }
  
  .row1
  {
    gap: 20px;
    margin-top: 25px
  }

  .row2
  {
    gap: 20px;
    margin-top: 25px;
    margin-bottom:25px
  }

  ion-textarea
  {
    --highlight-color: v-bind(colorHexValue)
  }

  .native-textarea::placeholder
  {
  padding-left: 50px
  }

  /* In your global styles or component-specific styles */
  .custom-select-panel .p-dropdown-items 
  {
    text-align: center
  }

  #patientSelect
  {
    width: min(90vw, 310px);
    padding-left: 40px
  }

  #hospitalTypeSelect
  {
    width: min(90vw, 275px);
    padding-left: 40px
  }

  .p-select.p-invalid 
  {
    border-color: var(--ion-color-red) !important
  }

  #hospitalNameLabel
  {
    left: 57px
  }

  #hospitalAddressLabel
  {
    left: 12px
  }

  #hospitalCityLabel
  {
    left: 55px
  }

  #hospitalStateLabel
  {
    left: 50px
  }

  #hospitalPhoneNumberLabel
  {
    left: 20px
  }

  #hospitalZipCodeLabel
  {
    left: 39px
  }

  #billInvoiceNumberLabel
  {
    left: 26px
  }

  #claimAmountLabel
  {
    left: 60px
  }

  #ailmentLabel
  {
    left: 27px
  }

  #insuranceSelect
  {
    width: min(90vw, 430px);
    margin-bottom: 20px;
    padding-left: 40px
  }

  #newInsuranceCompanyButtonLabel
  {
    left: 20px
  }

  #claimSubmitButton
  {
    margin-top: 10px;
    margin-bottom: 10px
  }

  /*This centers the place holder labels inside of ion-textareas*/
  .sc-ion-textarea-md-h
  {
    --padding-bottom: 0px
  }

  @media screen and (min-width: 1230px) 
  { 
    .formInput
    {
      text-align: center;
      font-size: min(2vw, 15px)!important;
      width: min(230px);
      height: 80px
    }

    .p-floatlabel
    {
      left: 0px
    }

    .p-floatlabel label
    {
      font-size: min(2vw, 15px)!important
    }

    .row1, .row2
    {
      display: flex;
      flex-direction: row
    }
  }

  @media screen and (max-width: 1229px) 
  { 
    .formInput
    {
      text-align: center;
      font-size: 17px;
      width: min(230px);
      height: 80px
    }

    .p-floatlabel label
    {
      font-size: 15px!important
    }
    
    .row1, .row2
    {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px
    }
  }
</style>
