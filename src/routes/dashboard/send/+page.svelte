<style>
    .loading-button {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        transition: transform 0.3s ease, background-color 0.3s ease;
        background-color: #007bff; /* Button background color */
        color: white; /* Button text color */
        border: none; /* Remove default border */
        border-radius: 4px; /* Rounded corners */
        cursor: pointer; /* Pointer cursor on hover */
    }

    .loading-button.is-loading {
        cursor: wait;
        animation: pulse 1s infinite ease-in-out;
        background-color: grey; /* Change to a shade lighter or darker for effect */
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 4px solid transparent;
        border-top-color: white;
        border-right-color: white;
        border-radius: 50%;
        animation: spin 1.5s linear infinite, rotate 1.5s linear infinite;
        margin-right: 8px;
        display: inline-block;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.01); }
    }

    @keyframes rotate {
        0%, 100% { transform: rotate(0deg); }
        50% { transform: rotate(180deg); }
    }

    .loading-button:disabled {
        opacity: 0.8;
        cursor: not-allowed;
    }

    .modal-overlay {
      position: fixed; /* Make the overlay fixed to cover the whole viewport */
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6); /* Semi-transparent black background */
      display: flex; /* Center the modal */
      justify-content: center; /* Center horizontally */
      align-items: center; /* Center vertically */
      z-index: 1000; /* Ensure it appears on top */
    }
  
    .modal-content {
      background: white;
      padding: 20px;
      border-radius: 5px;
      position: relative;
      max-width: 500px;
      width: 90%; /* Ensure responsiveness */
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
    }
  
    .close-button {
      margin-top: 10px;
      padding: 5px 10px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
  
    .close-button:hover {
      background-color: #0056b3;
    }
</style>
  
<script>
    export let isLoading = false;
    export let isComplete = false;

    const conversionRate = 100;

    function convertPoundsToTokens(pounds, tipPercentage) {
        // Apply the tip to the pound value
        const totalPounds = pounds + (pounds * (tipPercentage / 100));

        // Convert the final pound value to tokens
        const tokens = Math.round(totalPounds * conversionRate);
        
        return tokens;
    }


    export let numberOfTokens = 100;
    export let poundValue = 100;
    export let show = false;
    export let transactionLink = "https://stellar.expert/explorer/testnet/tx/f7a96e4a727a2a7bc950c38f3a729501110978e3e1fc536430a08acd27b10df4";
    export let onClose = () => {};
  
    function handleClose() {
      show = false;
    }

    export const openModal = () => {
      show = true
    }

    // `export let data` allows us to pull in any parent load data for use here.
    /** @type {import('./$types').PageData} */
    export let data

    // We import any Svelte components we will need
    import ConfirmationModal from '$lib/components/ConfirmationModal.svelte'
    import InfoAlert from '$lib/components/InfoAlert.svelte'
    import { receiptData } from '$lib/data/mockData'
    // We import any stores we will need to read and/or write
    import { infoMessage } from '$lib/stores/alertsStore'
    import { contacts } from '$lib/stores/contactsStore'
    import { walletStore } from '$lib/stores/walletStore'

    // We import some of our `$lib` functions
    import {
        fetchAccount,
        submit,
        fetchAccountBalances,
        findStrictSendPaths,
        findStrictReceivePaths,
    } from '$lib/stellar/horizonQueries'
    import {
        createCreateAccountTransaction,
        createPathPaymentStrictReceiveTransaction,
        createPathPaymentStrictSendTransaction,
        createPaymentTransaction,
    } from '$lib/stellar/transactions'

    import {
        Keypair,
        Contract,
        SorobanRpc,
        TransactionBuilder,
        Networks,
        BASE_FEE,
        nativeToScVal,
        Address,
    } from "@stellar/stellar-sdk";


    // The `open` Svelte context is used to open the confirmation modal
    import { getContext } from 'svelte'
    const { open } = getContext('simple-modal')

    // Define some component variables that will be used throughout the page
    let destination = ''
    $: otherDestination = destination === 'other'
    let otherPublicKey = ''
    let sendAsset = 'native'
    let sendAmount = ''
    let receiveAsset = ''
    let receiveAmount = ''
    let memo = ''
    /** @type {boolean|null} */
    let createAccount = null
    let pathPayment = false
    /** @type {import('stellar-sdk').ServerApi.PaymentPathRecord[]} */
    let availablePaths = []
    let strictReceive = false
    let paymentXDR = ''
    let paymentNetwork = ''
    let tipPercentage = 0
    $: totalAmount = (parseFloat(totalRawAmount) || 0) * (1 + tipPercentage / 100)
    $: totalRawAmount = receiptData.items.reduce((total, item) => total + item.price, 0).toFixed(2)
    $: placeholderEmployee =
        contacts.getAll().find((contact) => contact.name === receiptData.host)?.name ||
        'Select Recipient'

    /**
     * Check whether or not the account exists and is funded on the Stellar network.
     * @async
     * @function checkDestination
     * @param {string} publicKey Public Stellar address to check on the network
     */
    let checkDestination = async (publicKey) => {
        // Only do this if the `publicKey` is not "other". This check lets us
        // use the same function for both the select dropdown, and the
        // `otherPublicKey` input element.
        if (publicKey !== 'other') {
            try {
                // If the account returns successfully, ensure we're not using a
                // `createAccount` operation
                await fetchAccount(publicKey)
                createAccount = false
            } catch (err) {
                // Otherwise, inform the user about what will take place
                // @ts-ignore
                if (err.status === 404) {
                    createAccount = true
                    sendAsset = 'native'
                    infoMessage.set(
                        'Account Not Funded: You are sending a payment to an account that does not yet exist on the Stellar ledger. Your payment will take the form of a <code>creatAccount</code> operation, and the amount you send must be at least 1 XLM.'
                    )
                }
            }
        }
    }

    /**
     * Query Horizon for available paths between a combination of source and destination assets and accounts.
     * @async
     * @function findPaths
     */
    const findPaths = async () => {
        // Query the paths from Horizon
        let paths = strictReceive
            ? await findStrictReceivePaths({
                  sourcePublicKey: data.publicKey,
                  destinationAsset: receiveAsset,
                  destinationAmount: receiveAmount,
              })
            : await findStrictSendPaths({
                  sourceAsset: sendAsset,
                  sourceAmount: sendAmount,
                  destinationPublicKey: otherDestination ? otherPublicKey : destination,
              })
        // Fill the component variable `availablPaths` with our returned paths
        availablePaths = paths
        // If both send and receive assets have been selected re-select the path
        // to update the relevant amount
        if (receiveAsset && sendAsset) {
            selectPath()
        }
    }

    /**
     * Select a path for use in the path payment operation, and set the component variables accordingly.
     * @function selectPath
     */
    const selectPath = () => {
        if (strictReceive) {
            // Set the `sendAmount` variable to the chosen path amount. The
            // filtering we do checks if the asset_type matches because that
            // will give us our 'native' XLM asset, otherwise we match on the
            // asset_code.
            sendAmount = availablePaths.filter(
                (path) =>
                    path.source_asset_type === sendAsset ||
                    sendAsset.startsWith(path.source_asset_code)
            )[0].source_amount
        } else {
            // Set the `receiveAmount` variable to the chosen path amount. The
            // filtering we do checks if the asset_type matches because that
            // will give us our 'native' XLM asset, otherwise we match on the
            // asset_code.
            receiveAmount = availablePaths.filter(
                (path) =>
                    path.destination_asset_type === receiveAsset ||
                    receiveAsset.startsWith(path.destination_asset_code)
            )[0].destination_amount
        }
    }

    /**
     * Takes an action after the pincode has been confirmed by the user.
     * @async
     * @function onConfirm
     * @param {string} pincode Pincode that was confirmed by the modal window */
    const onConfirm = async (pincode) => {
        // Use the walletStore to sign the transaction
        let signedTransaction = await walletStore.sign({
            transactionXDR: paymentXDR,
            network: paymentNetwork,
            pincode: pincode,
        })
        // Submit the transaction to the Stellar network
        await submit(signedTransaction)
    }

    /**
     * Create a payment transaction depending on user selections, and present it to the user for approval or rejection.
     * @async
     * @function previewPaymentTransaction
     */

    async function fetchData() {
        try {
            const response = await fetch('http://localhost:5000/deploy');
            const data = await response.json();
            console.log(data);
            if (data.success) {
                // Remove the newline character from the "output" value
                const output = data.output.trim();
                console.log(output);
                return output;
            } else {
                console.error("Request was not successful.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            return null;
        }
    }

    // Call the function

    const previewPaymentTransaction = async () => {
        console.log(destination);
        console.log(tipPercentage);

    const sourceKeypair = Keypair.fromSecret(
        $walletStore.devInfo.secretKey
    );

    const server = new SorobanRpc.Server(
    "https://soroban-testnet.stellar.org:443",
  );


    const contract = new Contract("CAOJVTII2ASZXO2T225K7KRMB6YFPKMQCY3P3L6545NCYZTTGMBJ73JK");
    const sourceAccount = await server.getAccount(sourceKeypair.publicKey());

    numberOfTokens = convertPoundsToTokens(18.96, tipPercentage);
    poundValue = numberOfTokens + (numberOfTokens * (tipPercentage / 100)); 

    isLoading = true;

    let builtTransaction = new TransactionBuilder(sourceAccount, {
        fee: BASE_FEE,
        networkPassphrase: Networks.TESTNET,
    })
    .addOperation(
      contract.call(
        "make_payments",
        nativeToScVal(Address.fromString($walletStore.publicKey)),
        nativeToScVal([Address.fromString(destination)]),
        nativeToScVal(Address.fromString('GCXQH2KHFMNA6ISZ6GGXMEEEGS2NRXLGKXQ3NKUS5IUZL5XGGAQ7HOYE')),
        nativeToScVal(Address.fromString('CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC')),
        nativeToScVal(numberOfTokens, { type: "i128" }),
        nativeToScVal(tipPercentage, { type: "i128" }),
      ),
    )
    .setTimeout(30)
    .build();

    let preparedTransaction = await server.prepareTransaction(builtTransaction);
    preparedTransaction.sign(sourceKeypair);

    try {
        let sendResponse = await server.sendTransaction(preparedTransaction);
        console.log(`Sent transaction: ${JSON.stringify(sendResponse)}`);

        if (sendResponse.status === "PENDING") {
        let getResponse = await server.getTransaction(sendResponse.hash);
        // Poll `getTransaction` until the status is not "NOT_FOUND"
        while (getResponse.status === "NOT_FOUND") {
            console.log("Waiting for transaction confirmation...");
            // See if the transaction is complete
            getResponse = await server.getTransaction(sendResponse.hash);
            // Wait one second
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }

        console.log(`getTransaction response: ${JSON.stringify(getResponse)}`);

        if (getResponse.status === "SUCCESS") {
            // Make sure the transaction's resultMetaXDR is not empty
            if (!getResponse.resultMetaXdr) {
            throw "Empty resultMetaXDR in getTransaction response";
            }
            transactionLink = 'https://stellar.expert/explorer/testnet/tx/' + sendResponse.hash;
            isLoading = false;
            isComplete = true;
            openModal();
        } else {
            throw `Transaction failed: ${getResponse.resultXdr}`;
        }
        } else {
            throw sendResponse.errorResultXdr;
        }
    } catch (err) {
        // Catch and report any errors we've thrown
        console.log("Sending transaction failed");
        console.log(JSON.stringify(err));
    }

    }
</script>

<h1>Your Receipt</h1>
<p>
    Our secure payment allows you to directly tip our employees with no hidden costs. Simply select
    from a dropdown containing a list of the current shift's employees, or enter their account key.
</p>
<p>Please complete the fields below to manage your receipt.</p>

<!-- Receipt -->
<div class="receipt mx-auto max-w-lg rounded-lg bg-white p-5 shadow-md">
    <!-- Restaurant Info -->
    <div class="mb-4 text-center">
        <h2 class="text-2xl font-bold">{receiptData.restaurantName}</h2>
        <p>{receiptData.address}</p>
        <p>{receiptData.phone}</p>
    </div>

    <!-- Order and Host Info -->
    <div class="mb-4 flex justify-between">
        <div class="text-left">
            <p><strong>Order Number:</strong> {receiptData.orderNumber}</p>
            <p><strong>Host:</strong> {receiptData.host}</p>
        </div>
        <!-- Date and Time Info -->
        <div class="text-right">
            <p><strong>Date:</strong> {receiptData.date}</p>
            <p><strong>Time:</strong> {receiptData.time}</p>
        </div>
    </div>

    <hr class="my-4" />

    <!-- Items List -->
    <h3 class="mb-2 text-left text-xl font-semibold">Items</h3>
    <ul class="mb-4 list-inside list-disc text-left">
        {#each receiptData.items as item}
            <li>{item.name} - ${item.price.toFixed(2)}</li>
        {/each}
    </ul>
     <!-- Total Amount -->
     <p class="text-right text-lg font-bold"><strong>Total:</strong> ${receiptData.items.reduce((total, item) => total + item.price, 0).toFixed(2)}</p>
</div>

<!-- Employee -->
<div class="form-control my-5">
    <label for="destination" class="label">
        <span class="label-text">Employee</span>
    </label>
    <select
        bind:value={destination}
        on:change={() => checkDestination(destination)}
        id="destination"
        name="destination"
        class="select select-bordered"
    >
        <option value="" disabled selected></option>
        {#each $contacts as contact (contact.id)}
            <option value={contact.address}>{contact.name}</option>
        {/each}
        <option value="other">Other...</option>
    </select>
</div>
<!-- /Destination -->

<!-- OtherDestination -->
{#if otherDestination}
    <div class="form-control my-5">
        <label for="otherPublicKey" class="label">
            <span class="label-text">Destination Public Key</span>
        </label>
        <input
            bind:value={otherPublicKey}
            on:change={() => checkDestination(otherPublicKey)}
            id="otherPublicKey"
            name="otherPublicKey"
            type="text"
            placeholder="G..."
            class="input input-bordered"
        />
    </div>
{/if}
<!-- /OtherDestination -->

<!-- InfoAlert -->
{#if createAccount}
    <InfoAlert />
{/if}
<!-- /InfoAlert -->

<!-- PathPayment -->
{#if pathPayment}
    <div class="flex w-full">
        <div class="grid w-5/12">
            <h3>Sending</h3>
            <div class="form-control w-full">
                <label for="sendAmount" class="label">
                    <span class="label-text">You send... {strictReceive ? '(estimated)' : ''}</span>
                </label>
                <div class="join">
                    <div class="grow">
                        <div>

                            <div id="totalRawAmount" class="input input-bordered">
                                {totalRawAmount}
                            </div>
                        </div>
                        <!-- Tipping Options -->
                        <div class="form-control my-5">
                            <label for="tip" class="label">
                                <span class="label-text">Tip</span>
                            </label>
                            <select
                                id="tip"
                                name="tip"
                                class="select select-bordered"
                                bind:value={tipPercentage}
                            >
                                <option value="0">No Tip</option>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                            </select>
                        </div>
                        <!-- Total Amount -->
                        <label for="totalAmount" class="label">
                            <span class="label-text">Total Amount</span>
                        </label>
                        <div id="totalAmount">
                            {totalAmount}
                        </div>
                    </div>
                    <select
                        class="join-item select select-bordered"
                        bind:value={sendAsset}
                        on:change={selectPath}
                    >
                        <option value="" disabled>Select asset</option>
                        {#if strictReceive && availablePaths}
                            {#each availablePaths as path}
                                {#if path.source_asset_type === 'native'}
                                    <option value="native">XLM</option>
                                {:else}
                                    {@const assetString = `${path.source_asset_code}:${path.source_asset_issuer}`}
                                    <option value={assetString}>{path.source_asset_code}</option>
                                {/if}
                            {/each}
                        {:else if !strictReceive}
                            <option value="native">XLM</option>
                            {#each data.balances as balance}
                                {#if 'asset_code' in balance}
                                    {@const assetString = `${balance.asset_code}:${balance.asset_issuer}`}
                                    <option value={assetString}>{balance.asset_code}</option>
                                {/if}
                            {/each}
                        {/if}
                    </select>
                </div>
            </div>
        </div>
        <div class="divider divider-horizontal mx-5 w-1/6">
            Strict {strictReceive ? 'Receive' : 'Send'}
            <input bind:checked={strictReceive} type="checkbox" class="toggle" />
        </div>
        <div class="grid w-5/12">
            <h3>Receiving</h3>
            <div class="form-control w-full">
                <label for="receiveAmount" class="label">
                    <span class="label-text"
                        >They receive... {!strictReceive ? '(estimated)' : ''}</span
                    >
                </label>
                <div class="join">
                    <div class="grow">
                        <div>
                            
                            <div id="totalRawAmount" class="input input-bordered">
                                {totalRawAmount}
                            </div>
                        </div>
                        <!-- Tipping Options -->
                        <div class="form-control my-5">
                            <label for="tip" class="label">
                                <span class="label-text">Tip</span>
                            </label>
                            <select
                                id="tip"
                                name="tip"
                                class="select select-bordered"
                                bind:value={tipPercentage}
                            >
                                <option value="0">No Tip</option>
                                <option value="10">10%</option>
                                <option value="20">20%</option>
                                <option value="30">30%</option>
                            </select>
                        </div>
                        <!-- Total Amount -->
                        <div class="form-control my-5">
                            <label for="totalAmount" class="label">
                                <span class="label-text">Total Amount</span>
                            </label>
                            <div id="totalAmount" class="input input-bordered">
                                {totalAmount}
                            </div>
                        </div>
                    </div>
                    <select
                        bind:value={receiveAsset}
                        on:change={selectPath}
                        class="join-item select select-bordered"
                    >
                        <option value="" disabled>Select asset</option>
                        {#if !strictReceive && availablePaths}
                            {#each availablePaths as path}
                                {#if path.destination_asset_type === 'native'}
                                    <option value="native">XLM</option>
                                {:else}
                                    {@const assetString = `${path.destination_asset_code}:${path.destination_asset_issuer}`}
                                    <option value={assetString}
                                        >{path.destination_asset_code}</option
                                    >
                                {/if}
                            {/each}
                        {:else if strictReceive}
                            <option value="native">XLM</option>
                            {#if otherPublicKey || destination}
                                {#await fetchAccountBalances(otherPublicKey || destination) then balances}
                                    {#each balances as balance}
                                        {#if 'asset_code' in balance}
                                            {@const assetString = `${balance.asset_code}:${balance.asset_issuer}`}
                                            <option value={assetString}>{balance.asset_code}</option
                                            >
                                        {/if}
                                    {/each}
                                {/await}
                            {/if}
                        {/if}
                    </select>
                </div>
            </div>
        </div>
    </div>
{:else}
    <!-- Amount -->
    <div class="form-control my-5 max-w-full">
        <label for="amount" class="label">
            <span class="label-text">Amount</span>
        </label>
        <div class="join">
            <div class="grow">
                <div>
    
                    <div id="totalRawAmount" class="input w-full join-item input-bordered">
                        {totalRawAmount}
                    </div>
                    <!-- Tipping Options -->
                    <div class="form-control my-5">
                        <label for="tip" class="label">
                            <span class="label-text">Tip</span>
                        </label>
                        <select
                            id="tip"
                            name="tip"
                            class="select select-bordered"
                            bind:value={tipPercentage}
                        >
                            <option value="0">No Tip</option>
                            <option value="10">10%</option>
                            <option value="20">20%</option>
                            <option value="30">30%</option>
                        </select>
                    </div>
                    <!-- Total Amount -->
                    <div class="form-control my-5">
                        <label for="totalAmount" class="label">
                            <span class="label-text">Total Amount</span>
                        </label>
                        <div id="totalAmount" class="input input-bordered">
                            {totalAmount}
                        </div>
                    </div>
                </div>
            </div>
            <select
                id="asset"
                name="asset"
                class="join-item select select-bordered"
                bind:value={sendAsset}
                disabled={createAccount}
            >
                <option value="" disabled>Select Asset</option>
                <option value="native">XLM</option>
                {#each data.balances as balance}
                    {#if 'asset_code' in balance}
                        {@const assetString = `${balance.asset_code}:${balance.asset_issuer}`}
                        <option value={assetString}>{balance.asset_code}</option>
                    {/if}
                {/each}
            </select>
        </div>
    </div>
    <!-- /Amount -->
{/if}
<!-- /PathPayment -->

<!-- Button -->
{#if !isComplete}
<div class="form-control my-5">
    <button class="loading-button btn btn-primary" on:click={previewPaymentTransaction} disabled={isLoading} class:is-loading={isLoading}>
        {#if isLoading}
            <span class="spinner"></span> Processing...
        {:else}
            Make Payment
        {/if}
    </button>
</div>
{:else}
<p>Thanks!</p>
{/if}

{#if show}
  <div class="modal-overlay" on:click={handleClose}>
    <div class="modal-content" on:click|stopPropagation>
      <slot></slot>
      <h3>Transaction Complete!</h3>
      <p> We sent {numberOfTokens} tokens (£{totalAmount}). You can view the verified transaction <a href="{transactionLink}">here</a>.</p>
      <button class="btn btn-primary" on:click={handleClose}>Close</button>
    </div>
  </div>
{/if}

<!-- /Button -->
