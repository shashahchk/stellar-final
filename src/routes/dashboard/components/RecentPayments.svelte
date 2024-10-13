<!--
@component

-->

<script>
    import TruncatedKey from '$lib/components/TruncatedKey.svelte'

    import { page } from '$app/stores'

    /** @typedef {import('stellar-sdk').ServerApi.EffectRecord} EffectRecord */
    console.log($page.data.payments);

    export function calculateTotalSent(operation) {
        let totalSent = 0;
        // Iterate over each operation in the data
        console.log(operation);
        // Check if asset_balance_changes exists
        if (operation.asset_balance_changes) {
            // Iterate through asset_balance_changes
            operation.asset_balance_changes.forEach(change => {
            // Check if the change is a transfer and from the source account
            if (change.type === 'transfer' && change.from === operation.source_account) {
                // Add the amount to totalSent
                totalSent += parseFloat(change.amount);
                }
            });
        }

        return totalSent;
    }

</script>

<h3>Recent Payments</h3>
<table class="table">
    <thead>
        <tr>
            <th>Amount</th>
            <th>Asset</th>
            <th>Direction</th>
        </tr>
    </thead>
    <tbody>
        {#each $page.data.payments as payment}
            <tr>
                <th>
                    {#if payment.amount}
                        {parseFloat(payment.amount).toFixed(2)}
                    {:else if payment.starting_balance}
                        {parseFloat(payment.starting_balance).toFixed(2)}
                    {:else if payment.type === 'account_merge'}
                        {#await payment.effects() then effects}
                            {#each effects.records.filter((/** @type {EffectRecord} */ e) => e.type === 'account_credited') as effect}
                                {parseFloat(effect.amount).toFixed(2)}
                            {/each}
                        {/await}
                    {:else if payment.asset_balance_changes}
                        {calculateTotalSent(payment)}
                    {/if}
                </th>
                <td>
                    {#if payment.type === 'create_account' || payment.asset_type === 'native' || payment.type === 'account_merge'}
                        XLM
                    {:else}
                        XLM
                    {/if}
                </td>
                <td>
                    {#if payment.to === $page.data.publicKey || ('funder' in payment && payment.funder !== $page.data.publicKey) || ('into' in payment && payment.into === $page.data.publicKey)}
                        Received
                    {:else}
                        Sent
                    {/if}
                </td>
            </tr>
        {/each}
    </tbody>
</table>
