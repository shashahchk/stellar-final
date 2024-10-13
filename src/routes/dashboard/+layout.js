import { get } from 'svelte/store'
import { goto } from '$app/navigation'

import { fetchAccountBalances, fetchRecentPayments } from '$lib/stellar/horizonQueries'
import { walletStore } from '$lib/stores/walletStore'

/** @type {import ('./$types').LayoutLoad} */
export async function load() {
    const { publicKey } = get(walletStore)
    if (!publicKey) {
        goto('/signup')
    }

    return {
        publicKey: publicKey,
        balances: await fetchAccountBalances(publicKey),
        payments: await fetchRecentPayments(publicKey),
    }
}
