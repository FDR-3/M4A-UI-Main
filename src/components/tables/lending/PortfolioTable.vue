<template>
    <div class="tableContainer">
        <h1 class="yellow">{{ displayName }}</h1>

        <p v-if="searchAddress==SYSTEM_PROGRAM_ADDRESS_STRING">Connect Wallet or Search for a Different Public Key</p>

        <ion-input
        v-model="addressToCheck"
        placeholder="Check New Address"
        fill="outline"
        class="nSmallMarginTop"
        :class="{ 'invalid': !isValidPublicKey }"
        @ion-input="isValidPublicKey = isValidSolanaPublicKey(addressToCheck)"
        ></ion-input>

        <ion-button
        id="checkNewAddressButton"
        class="nTinyMarginBottom"
        @click="checkNewAddress()"
        color="green"
        :disabled="!isValidPublicKey"
        >
        Check New Address
        </ion-button>
    </div>

</template>

<script setup lang="ts">
    import { ref, watch, onMounted } from 'vue'
    import { IonText, IonInput, IonButton } from '@ionic/vue'
    import { connectedWallet } from '/src/assets/globalStates/ConnectedWallet.vue'
    import { getUserDisplayName, getCustomOrTrimmedUserDisplayName } from '/src/assets/contracts/Solana/ChatProtocol.vue'
    import { trimAddress, isValidSolanaPublicKey } from '/src/assets/contracts/WalletHelper.vue'
    import { SYSTEM_PROGRAM_ADDRESS_STRING } from '/src/assets/globalStates/AnchorPrograms.vue'

    const emits = defineEmits(['checkNewAddress'])

    var displayName = ref()
    var possiblyTrimmedDisplayName = ref()
    var searchAddress = ref()
    var addressToCheck = ref()
    var isValidPublicKey = ref(false)

    onMounted(() =>
    {
        searchAddress.value = connectedWallet.addressString
        addressToCheck.value = searchAddress.value
        isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

        if(connectedWallet.isChatAccountReady)
        {
            displayName.value = getUserDisplayName(searchAddress.value)
            possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
        }
        else
        {
            displayName.value = searchAddress.value
            possiblyTrimmedDisplayName.value = trimAddress(searchAddress.value)
        }
    })

    watch(connectedWallet, () =>
    {
        searchAddress.value = connectedWallet.addressString
        addressToCheck.value = searchAddress.value
        isValidPublicKey.value = isValidSolanaPublicKey(addressToCheck.value)

        if(connectedWallet.isChatAccountReady)
        {
            displayName.value = getUserDisplayName(searchAddress.value)
            possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(searchAddress.value)
        }
        else
        {
            displayName.value = searchAddress.value
            possiblyTrimmedDisplayName.value = trimAddress(searchAddress.value)
        }  
    })

    async function checkNewAddress()
    {
        emits('checkNewAddress', addressToCheck.value)

        displayName.value = getUserDisplayName(addressToCheck.value)
        possiblyTrimmedDisplayName.value = getCustomOrTrimmedUserDisplayName(addressToCheck.value)

        searchAddress.value = addressToCheck.value

        addressToCheck.value = ""
    }
</script>

<style scoped>
    ion-input
    {
        --highlight-color: var(--ion-color-green)
    }
</style>