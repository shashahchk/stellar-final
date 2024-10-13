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

<center>
    <img src="https://banner2.cleanpng.com/20180410/ggq/avf52f2tf.webp">
</center>



<ul class="menu h-full w-80 bg-base-200 p-4 text-base-content">
    {#each dashboardRoutes as route}
        {@const linkClass = $page.route.id === route.route ? 'active': ''}
        <li>
            <a href={route.route} class={linkClass}
                >{route.text}</a
            >
        </li>
    {/each}
</ul>
