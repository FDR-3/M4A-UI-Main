<script lang="ts">
   import { ethers } from "ethers"
   import { getNewTime, getNewDate } from '/src/assets/contracts/WalletHelper.vue'
   import Vote from '/src/assets/contracts/Solidity/Vote.json' 
  
    type Record = 
    {
        record: String
    }

    type VoterRecordTable = 
    {
        voter: 
        {
            address: String,
            contributions: number,
            image: String
        },
        records: Record[],
    }

  const provider = new ethers.BrowserProvider(window.ethereum)
  var signer

  export async function updateVoteContract(address:string, amount:number)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    Vote.abi,
    signer)

    var voteData:string = "Amount: " + amount + " Date: " + getNewTime() + ", " + getNewDate()

    if(amount === 1)
      await contract.upVote(address, voteData)
    else
      await contract.downVote(address, voteData)
  }

  export async function getVotes(address: String)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    Vote.abi,
    signer)

    return await contract.getCanidataTotalVotes(address)
  }

  export async function getTableRecords(searchAddress: String)
  {
    signer = await provider.getSigner()
    const contract = new ethers.Contract(
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    Vote.abi,
    signer)

    const voterAddresses = await contract.getAddressesThatVotedForCanidate(searchAddress)
    
    var tableData:VoterRecordTable[] = []

    if(voterAddresses.length)
    {
      for(var i=0; i<voterAddresses.length; i++)
      {
        var address = voterAddresses[i].voterAddress
        var contributions = voterAddresses[i].cummulativeVoterContribution

        const newVoterRecord:VoterRecordTable = 
        {
          voter: 
          {
              address: address,
              contributions: contributions,
              image: 'ionibowcher.png'
          },
          records: []
        }  

        tableData.push(newVoterRecord)

        var voterRecords = await contract.getVoterRecords(searchAddress, voterAddresses[i].voterAddress)

        for(var j=0; j<voterRecords.length; ++j)
        {
            var record = voterRecords[j]

            const newRecord:Record = 
            {
                record: j+1 + " " + record
            }

            tableData[i].records.push(newRecord)
        }
      }
    }

    return tableData
  }
</script>