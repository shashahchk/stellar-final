<!--
@component

The employees page allows restaurant managers to manage recurring salary payments to employees subject to their work performance.
Star employees can be flagged as "favorites".
-->

<script>
    import { receiptData } from '$lib/data/mockData' // Assuming you have mock data for receipts
    import { writable } from 'svelte/store'

    // Store for the table number filter
    let tableNumberFilter = writable('')

    // Function to navigate to the detailed receipt page
    function navigateToReceipt() {
        window.location.href = `/receipt`
    }

    // Function to navigate to the manage page
    function navigateToManage() {
        window.location.href = `/dashboard/send`
    }
</script>

<div class="receipt-list">
    <h2>Pending Receipts</h2>
    <input
        type="text"
        class="filter-input"
        placeholder="Filter by table number"
        bind:value={$tableNumberFilter}
    />
    <div class="receipt-grid">
        {#each receiptData.filter( (receipt) => receipt.tableNumber.includes($tableNumberFilter) ) as receipt}
            <div class="receipt-item">
                <p><strong>Order Number:</strong> {receipt.orderNumber}</p>
                <p><strong>Host:</strong> {receipt.host}</p>
                <p><strong>Date:</strong> {receipt.date}</p>
                <p><strong>Table Number:</strong> {receipt.tableNumber}</p>
                <p>
                    <strong>Total:</strong> ${receipt.items
                        .reduce((total, item) => total + item.price, 0)
                        .toFixed(2)}
                </p>
                <a href={`/dashboard/send`} class="manage-button">Manage</a>
            </div>
        {/each}
    </div>
</div>

<style>
    .receipt-list {
        margin: 0 auto;
        padding: 1rem;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .filter-input {
        margin-bottom: 1rem;
        padding: 0.5rem;
        width: 100%;
        border: 1px solid #ddd;
        border-radius: 4px;
    }

    .receipt-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    .receipt-item {
        padding: 1rem;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease;
    }

    .receipt-item:hover {
        background-color: #f1f1f1;
    }

    .manage-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .manage-button:hover {
        background-color: #0056b3;
    }
</style>