<!--
@component

-->

<script>
    import TruncatedKey from '$lib/components/TruncatedKey.svelte'

    import { contacts } from '$lib/stores/contactsStore'

    $: favoriteContacts = $contacts?.filter((contact) => contact.favorite)
</script>

<h3>Star Employees</h3>
<table class="table w-full">
    <thead>
        <tr>
            <th>Favorite</th>
            <th>Name</th>
            <th>Address</th>
        </tr>
    </thead>
    {#if favoriteContacts}
        <tbody>
            {#each favoriteContacts as contact (contact.id)}
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            class="checkbox-accent checkbox checkbox-sm"
                            checked={contact.favorite}
                            on:click={() => contacts.favorite(contact.id)}
                        />
                    </th>
                    <td>
                        <div class="flex items-center space-x-3">
                            <div class="avatar">
                                <div class="not-prose w-10 rounded-full">
                                    <img
                                        src="{contact.address}.png"
                                        alt="Avatar Tailwind CSS Component"
                                    />
                                </div>
                            </div>
                            <div>
                                <div class="font-bold">{contact.name}</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <TruncatedKey keyText={contact.address} lookupName={false} />
                    </td>
                    <th>
                        <button class="btn btn-ghost btn-xs">Stellar.Expert</button>
                    </th>
                </tr>
            {/each}
        </tbody>
    {/if}
</table>
