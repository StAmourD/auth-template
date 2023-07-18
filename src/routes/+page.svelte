<script>
  import { onMount } from 'svelte';
  import { thisUser } from '$lib/store.js';
  import LogoutButton from '$lib/logout-button.svelte';

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
</script>

<main>
  {#if $thisUser?.authenticated !== undefined && $thisUser?.authenticated === true}
    <h1>Hello {$thisUser.displayname}!</h1>
  {:else}
    <h1>Please log in</h1>
    <button on:click={loginWithGoogle}>Login with Google</button>
    <button on:click={loginWithGitHub}>Login with GitHub</button>
    <a href="/login">Login with Email</a>
  {/if}
</main>
