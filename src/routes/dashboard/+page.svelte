<script>
    import AssetStats from './components/AssetStats.svelte'
    import RecentPayments from './components/RecentPayments.svelte'
    import FavoriteContacts from './components/FavoriteContacts.svelte'
</script>

<AssetStats />

<div class="overflow-x-auto">
    <RecentPayments />
</div>
<div class="overflow-x-auto">
    <FavoriteContacts />
</div>
