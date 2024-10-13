/**
 */

import { get } from 'svelte/store'

import { goto } from '$app/navigation'

import { walletStore } from '$lib/stores/walletStore'

/** @type {import('./$types').PageLoad} */
export function load() {
    const wallet = get(walletStore)
    if (!wallet.publicKey || !wallet.keyId) {
        goto('/signup')
    }

    return {
        keyId: wallet.keyId,
        publicKey: wallet.publicKey,
    }
}
