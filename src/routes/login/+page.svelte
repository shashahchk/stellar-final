<!--
@component

-->

<script>
    /** @type {import('./$types').PageData} */
    export let data

    import ErrorAlert from '$lib/components/ErrorAlert.svelte'
    import TruncatedKey from '$lib/components/TruncatedKey.svelte'

    import { goto } from '$app/navigation'
    import { errorMessage } from '$lib/stores/alertsStore'
    import { walletStore } from '$lib/stores/walletStore'

    let pincode = ''

    /**
     * @async
     * @function login
     */
    const login = async () => {
        try {
            await walletStore.confirmPincode({ pincode: pincode })
            goto('/dashboard')
        } catch (err) {
            // Notify the user about the error that has taken place.
            // @ts-ignore
            errorMessage.set(err.body.message)
        }
    }
</script>

<div class="hero min-h-screen bg-base-200">
    <div class="hero-content flex-col gap-7 lg:flex-row-reverse">
        <div class="text-center lg:text-left">
            <h1 class="text-5xl font-bold">Login now!</h1>
            <p class="py-6">
                Provide your 6-digit pincode to access the dashboard. To reiterate, this pincode
                never leaves your device, and your secret key is encrypted in your browser and is
                never shared anywhere else.
            </p>
        </div>
        <div class="card w-full max-w-sm flex-shrink-0 bg-base-100 shadow-2xl">
            <div class="card-body">
                <ErrorAlert dismissible={false} />
                <form on:submit|preventDefault={login}>
                    <div class="form-control">
                        <label class="label" for="publicKey">
                            <span class="label-text">Public Key</span>
                        </label>
                        <div class="input-bordered input flex">
                            <TruncatedKey keyText={data.publicKey} />
                        </div>
                    </div>
                    <div class="form-control">
                        <label for="pincode" class="label">
                            <span class="label-text">Pincode</span>
                        </label>
                        <input
                            id="pincode"
                            name="pincode"
                            type="password"
                            class="input-bordered input"
                            minlength="6"
                            maxlength="6"
                            required
                            bind:value={pincode}
                        />
                    </div>
                    <div class="form-control mt-6">
                        <button class="btn-primary btn">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
