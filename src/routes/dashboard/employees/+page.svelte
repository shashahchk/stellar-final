<!--
@component

The employees page allows restaurant managers to manage recurring salary payments to employees subject to their work performance.
Star employees can be flagged as "favorites".
-->

<script>
    // We import things from external packages that will be needed
    import { Trash2Icon, UserPlusIcon } from 'svelte-feather-icons'

    // We import any Svelte components we will need
    import TruncatedKey from '$lib/components/TruncatedKey.svelte'

    // We import any stores we will need to read and/or write
    import { contacts } from '$lib/stores/contactsStore'

    // We declare a _reactive_ component variable that will hold information for
    // a user-created contact entry, which can be added to the contacts store.
    $: newContact = {
        name: '',
        address: '',
        favorite: false,
        id: '',
    }
</script>

<h1>Employees</h1>
<p>
    The employees page allows restaurant managers to manage recurring salary payments to employees subject to their work performance.
    Star employees can be flagged as "favorites".
</p>

<h3>All employees</h3>

<table class="table w-full">
    <thead>
        <tr>
            <th class="w-1/12 text-center">Favorite</th>
            <th>Name</th>
            <th>Address</th>
            <th class="w-1/12 text-center">Action</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th class="text-center">
                <input
                    bind:checked={newContact.favorite}
                    id="favorite"
                    name="favorite"
                    type="checkbox"
                    class="checkbox-accent checkbox checkbox-sm"
                />
            </th>
            <td>
                <label for="name">
                    <span class="label-text hidden">Name</span>
                </label>
                <input
                    bind:value={newContact.name}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Name"
                    class="input-bordered input input-sm w-full"
                />
            </td>
            <td>
                <label for="address">
                    <span class="label-text hidden">Address</span>
                </label>
                <input
                    bind:value={newContact.address}
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Address"
                    class="input-bordered input input-sm w-full"
                />
            </td>
            <td class="text-center">
                <button
                    on:click={() => contacts.add(newContact)}
                    id="addContactButton"
                    name="addContactButton"
                    type="submit"
                    class="btn-success btn-sm btn-square btn"
                >
                    <UserPlusIcon size="16" />
                </button>
            </td>
        </tr>
        {#each $contacts as contact (contact.id)}
            <tr>
                <th class="text-center">
                    <input
                        on:click={() => contacts.favorite(contact.id)}
                        id={`favoriteCheckbox${contact.id}`}
                        name={`favoriteCheckbox${contact.id}`}
                        type="checkbox"
                        checked={contact.favorite}
                        class="checkbox-accent checkbox checkbox-sm"
                    />
                </th>
                <td>
                    <div class="flex items-center space-x-3">
                        <div class="avatar">
                            <div class="not-prose w-10 rounded-full">
                                <img
                                    src="/{contact.image}.jpg"
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
                <td class="text-center">
                    <button
                        on:click={() => contacts.remove(contact.id)}
                        id={`removeContact${contact.id}`}
                        name={`removeContact${contact.id}`}
                        class="btn-error btn-sm btn-square btn"
                    >
                        <Trash2Icon size="16" />
                    </button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>
