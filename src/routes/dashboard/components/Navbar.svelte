<!--
@component

-->

<script>
    import { MenuIcon } from 'svelte-feather-icons'

    import { page } from '$app/stores'
</script>

<header class="navbar bg-yellow-100">
    <label for="drawer-toggle" class="btn btn-square btn-ghost drawer-button lg:hidden"
        ><MenuIcon size="24" /></label
    >
    <div class="flex-1">
        <a href="/dashboard" class="btn btn-ghost flex items-center space-x-2 text-xl normal-case">
            <img src="/tipJarIcon.png" alt="tipJar" class="h-10 w-10" />
            <span>TipTap</span>
        </a>
    </div>
    <div class="flex-none">
        <div class="dropdown dropdown-end">
            <button tabindex="0" class="avatar btn btn-circle btn-ghost">
                <div class="w-10 rounded-full">
                    <img
                        src={`https://id.lobstr.co/${$page.data.publicKey}.png`}
                        alt="stellar-account-identicon"
                    />
                </div>
            </button>
            <ul
                class="menu-compact menu dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
                <li>
                    <a href="/dashboard/settings/kyc" class="justify-between">
                        Manage KYC Information
                    </a>
                </li>
                <li><a href="/dashboard/settings/dev">Dev Helpers</a></li>
            </ul>
        </div>
    </div>
</header>
