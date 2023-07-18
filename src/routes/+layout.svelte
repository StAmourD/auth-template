<script>
  import { SvelteToast } from '@zerodevx/svelte-toast';
  import { thisUser } from '$lib/store.js';

  const toastOptions = {};

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      thisUser.set(await response.json());
    }
  };

  $: console.log($thisUser);
</script>

<nav>
  <a href="/">Home</a>
  <a href="/login">Login</a>
  <a href="/register">Register</a>
  <button on:click={logout}>Logout</button>
  <p>thisUser: {$thisUser.displayname}</p>
</nav>

<SvelteToast {toastOptions} />

<slot />
