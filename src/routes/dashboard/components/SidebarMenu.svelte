<!--
@component
-->

<script>
    import { page } from '$app/stores'

    const dashboardRoutes = [
        { route: '/dashboard/pendingReceipts', text: 'Pending Customer Receipts' },
        { route: '/dashboard/employees', text: 'Employees' },
        { route: '/dashboard/makePayment', text: 'Make payment' },
    ]
</script>

<ul class="menu h-full w-80 p-4 text-base-content" style="background-color: #ffeb99;">
    {#each dashboardRoutes as route}
        {@const linkClass = $page.route.id === route.route ? 'active': ''}
        <li>
            <a href={route.route} class={linkClass}
                >{route.text}</a
            >
        </li>
    {/each}
</ul>
