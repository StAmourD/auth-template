<script>
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { thisUser } from '$lib/store.js';
  import LogoutButton from '$lib/logout-button.svelte';

  const toastOptions = {};

  $: console.log($thisUser);
</script>

<nav>
  <a href="/">Home</a>
  {#if $thisUser?.authenticated !== undefined && $thisUser?.authenticated === true}
    <LogoutButton />
  {:else}
    <a href="/login">Login</a>
    <a href="/register">Register</a>
  {/if}
  <p>thisUser: {$thisUser.displayname}</p>
</nav>

<SvelteToast {toastOptions} />

<slot />
