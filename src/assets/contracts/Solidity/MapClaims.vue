<script lang="ts">
   import { ethers } from "ethers"
   import MapClaims from '/src/assets/contracts/Solidity/MapClaims.json' 

   const provider = new ethers.BrowserProvider(window.ethereum)
  var signer

  export async function getProtocolApprovedClaimTotal()
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getProtocolApprovedClaimTotal()
  }

  export async function getUserProtocolClaimTotal(patientWalletAddress:string)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getUserProtocolClaimTotal(patientWalletAddress)
  }

  export async function submitClaim(claim:any)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.submitClaim(claim)
  }

  export async function getClaimQueue()
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getClaimQueue()
  }

  export async function getPatientClaimHistory(patientWalletAddress:string)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    var rawClaimData
    try
    {
      rawClaimData = await contract.getPatientClaimHistory(patientWalletAddress)
    } 
    catch
    {

    }
    
    var patientClaimTable = []
    
    for(var i=0; i<rawClaimData.length; i++)
    {
      var hospitalName
      var hospitalStreetAddress
      var hospitalCity
      var hospitalState
      var hospitalPhoneNumber      

      const currentStateHospitalList  = await getStateHospitalList(rawClaimData[i].usStateIndex)
      
      if((rawClaimData[i].usHospitalIndex != -1) && (parseInt(rawClaimData[i].usHospitalIndex) + 1 <= currentStateHospitalList.length))
      {
        hospitalName = currentStateHospitalList[rawClaimData[i].usHospitalIndex].hospitalName
        hospitalStreetAddress = currentStateHospitalList[rawClaimData[i].usHospitalIndex].hospitalStreetAddress
        hospitalCity = currentStateHospitalList[rawClaimData[i].usHospitalIndex].hospitalCity
        hospitalState = currentStateHospitalList[rawClaimData[i].usHospitalIndex].hospitalState
        hospitalPhoneNumber = currentStateHospitalList[rawClaimData[i].usHospitalIndex].hospitalPhoneNumber
      }
      else
      {
        hospitalName = rawClaimData[i].hospitalName
        hospitalStreetAddress = rawClaimData[i].hospitalStreetAddress
        hospitalCity = rawClaimData[i].hospitalCity
        hospitalState = rawClaimData[i].hospitalState
        hospitalPhoneNumber = rawClaimData[i].hospitalPhoneNumber
      }

      const patientClaim = 
      {
        claimNumber: i+1,
        hospitalName: hospitalName,
        hospitalState: hospitalState,
        hospitalPhoneNumber: hospitalPhoneNumber,
        claimInfo: rawClaimData[i].claimInfo,
        claimAmount: rawClaimData[i].claimAmount,
        claimStatus: rawClaimData[i].claimStatus? "Approved" : "Pending",
      } 
      
      patientClaimTable.push(patientClaim)
    } 
    
    return patientClaimTable
  }

  export async function approveClaim(approvedData:any)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    var previousProtocolApprovedClaimTotal = await contract.getProtocolApprovedClaimTotal()
    var previousApprovedClaimTotal = await contract.getUserProtocolClaimTotal(approvedData.patientWalletAddress)
    var previousHospitalClaimTotal 

    try
    {
      previousHospitalClaimTotal = await getHospitalClaimTotal(approvedData.claimDetails[0].usStateIndex, approvedData.claimDetails[0].usHospitalIndex)
    }
    catch
    {
      previousHospitalClaimTotal = ""
    }

    var previousPatientRecords = await getHospitalPatientRecords(approvedData.claimDetails[0].usStateIndex, approvedData.claimDetails[0].usHospitalIndex, approvedData.patientWalletAddress)

    //remove $ signs
    var newProtocolApprovedClaimTotal = previousProtocolApprovedClaimTotal.replace("$", "")
    var claimAmount = approvedData.claimAmount.replace("$", "")
    var newUserClaimTotal = previousApprovedClaimTotal.replace("$", "")
    var newHospitalClaimTotal = previousHospitalClaimTotal.replace("$", "")
    var newPatientClaimTotal = previousPatientRecords.claimTotal.replace("$", "")

    if(previousProtocolApprovedClaimTotal != "")
      newProtocolApprovedClaimTotal = (parseFloat(claimAmount) + parseFloat(previousProtocolApprovedClaimTotal)).toFixed(2).toString()
    else
      newProtocolApprovedClaimTotal = claimAmount

    if(previousApprovedClaimTotal != "")
      newUserClaimTotal = (parseFloat(claimAmount) + parseFloat(previousApprovedClaimTotal)).toFixed(2).toString()
    else
      newUserClaimTotal = claimAmount

    if(previousHospitalClaimTotal != "")
      newHospitalClaimTotal = (parseFloat(claimAmount) + parseFloat(previousHospitalClaimTotal)).toFixed(2).toString()
    else
      newHospitalClaimTotal = claimAmount

    if(previousPatientRecords.claimTotal != "")
      newPatientClaimTotal = (parseFloat(claimAmount) + parseFloat(previousPatientRecords.claimTotal)).toFixed(2).toString()
    else
      newPatientClaimTotal = claimAmount

    return await contract.approveClaim(approvedData.queueIndex, newProtocolApprovedClaimTotal, newUserClaimTotal, newHospitalClaimTotal, newPatientClaimTotal)
  }

  export async function denyClaim(queueIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    var currentClaimQueue = await getClaimQueue()

    return await contract.denyClaim(currentClaimQueue[queueIndex].patientWalletAddress, queueIndex)
  }

  export async function editClaim(eidtedData:any)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    var editedClaim =
    {
      patientWalletAddress: eidtedData.patientWalletAddress,
      claimNumber: eidtedData.claimNumber,
      claimAmount: eidtedData.claimAmount,
      claimInfo: eidtedData.claimDetails[0].claimInfo,
      claimStatus: false,
      hospitalName: eidtedData.claimDetails[0].hospitalName,
      hospitalStreetAddress: eidtedData.claimDetails[0].hospitalStreetAddress,
      hospitalCity: eidtedData.claimDetails[0].hospitalCity,
      hospitalState: eidtedData.claimDetails[0].hospitalState,
      hospitalZipCode: eidtedData.claimDetails[0].hospitalZipCode,
      hospitalPhoneNumber: eidtedData.claimDetails[0].hospitalPhoneNumber,
      hospitalLongitude: eidtedData.claimDetails[0].hospitalLongitude,
      hospitalLatitude: eidtedData.claimDetails[0].hospitalLatitude,
      usStateIndex: eidtedData.claimDetails[0].usStateIndex,
      usHospitalIndex: eidtedData.claimDetails[0].usHospitalIndex
    }

    return await contract.editClaim(eidtedData.queueIndex, editedClaim)
  }

  export async function banPatient(patientWalletAddress:string, queueIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.banPatient(patientWalletAddress, queueIndex)
  }

  export async function banPatientInQueue(queueIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    var currentClaimQueue = await getClaimQueue()
    
    return await contract.banPatientAndRemoveFromClaimQueue(currentClaimQueue[queueIndex].patientWalletAddress, queueIndex)
  }

  export async function unbanPatient(patientWalletAddress:string, banIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.unbanPatient(patientWalletAddress, banIndex)
  }

  export async function getBanList()
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getBanList()
  }

  export async function getStateHospitalList(stateIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    var tableRecords

    try
    {
      tableRecords = await contract.getStateHospitalList(stateIndex)
    }
    catch
    {
      //Currently no hospitals for State
      tableRecords = []
    }

    var tableData = []

    if(tableRecords.length)
    {
      for(var i=0; i<tableRecords.length; i++)
      {
        tableData.push(tableRecords[i])
      }
    }

    return tableData
  }

  async function getHospitalClaimTotal(stateIndex:number, hospitalIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getHospitalClaimTotal(stateIndex, hospitalIndex)
  }

  export async function getPatientClaimTotal(stateIndex:number, hospitalIndex:number, patientAddress:string)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getPatientClaimTotal(stateIndex, hospitalIndex, patientAddress)
  }

  export async function getHospitalPatientList(stateIndex:number, hospitalIndex:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    const tableRecords = await contract.getHospitalPatientList(stateIndex, hospitalIndex)

    var tableData = []

    if(tableRecords.length)
    {
      for(var i=0; i<tableRecords.length; i++)
      {
        tableData.push(tableRecords[i])
      }
    }

    return tableData
  }

  export async function getHospitalPatientRecords(stateIndex:number, hospitalIndex:number, patientAddress:string)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MapClaims.abi,
    signer)

    return await contract.getHospitalPatientRecords(stateIndex, hospitalIndex, patientAddress)
  }
</script>