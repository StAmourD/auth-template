<script>
  import { onMount } from 'svelte';
  import { thisUser } from '$lib/store.js';

  onMount(async () => {
    const response = await fetch('/auth/check');
    if (response.ok) {
      thisUser.set(await response.json());
    }
  });

  const loginWithGoogle = () => {
    window.location.href = '/auth/google';
  };

  const loginWithGitHub = () => {
    window.location.href = '/auth/github';
  };

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      thisUser.set(await response.json());
    }
  };
</script>

<main>
  <p>page thisUser: {$thisUser.displayname}</p>
  {#if $thisUser}
    {#if $thisUser.authenticated}
      <h1>Hello {$thisUser.displayname}!</h1>
      <button on:click={logout}>Logout</button>
    {:else}
      <h1>Please log in</h1>
      <button on:click={loginWithGoogle}>Login with Google</button>
      <button on:click={loginWithGitHub}>Login with GitHub</button>
      <a href="/login">Login with email</a>
    {/if}
  {/if}
</main>
