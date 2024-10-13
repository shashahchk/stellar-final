<!--
@component

-->

<script>
    import { page } from '$app/stores'
</script>

<div class="flex items-center gap-5">
    <img class="w-20" src="/fish.png" alt="fishAndChips" />
    <h1>FISH & CHIPS Co.</h1>
</div>
<h3>Restaurant Assets Overview</h3>
<div class="stats stats-vertical w-full bg-primary text-primary-content shadow lg:stats-horizontal">
    {#each $page.data.balances as balance}
        <div class="stat flex flex-row justify-between">
            <div>
                <div class="stat-title text-white">{balance.asset_code ?? 'XLM'} Balance</div>
                <div class="stat-value">
                    {parseFloat(balance.balance).toFixed(2)}
                    {balance.asset_code ?? 'XLM'}
                </div>
            </div>
            <div>
                <div class="stat-title text-green-400">Inflow (Restaurant Revenue)</div>
                <div class="stat-value">
                    {(1.29 * parseFloat(balance.balance)).toFixed(2)}
                    {balance.asset_code ?? 'XLM'}
                </div>
            </div>
            <div>
                <div class="stat-title text-orange-400">Outflow (Employees Salary)</div>
                <div class="stat-value">
                    {(0.29 * parseFloat(balance.balance)).toFixed(2)}
                    {balance.asset_code ?? 'XLM'}
                </div>
            </div>
        </div>
    {/each}
</div>
