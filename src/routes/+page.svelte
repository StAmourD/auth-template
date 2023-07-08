<!-- src/routes/index.svelte -->
<script>
  import { onMount } from 'svelte';

  let user;

  onMount(async () => {
    const response = await fetch('/auth/check');
    if (response.ok) {
      console.log(await response)
      user = await response.json();
      console.log(user)
    }
  });

  const loginWithGoogle = () => {
    window.location.href = '/auth/google'
  };

  const loginWithGitHub = () => {
    window.location.href = '/auth/github'
  };

  const logout = async () => {
    const response = await fetch('/auth/logout')
    if (response.ok) {
      user = response.json()
      console.log(user)
    }
  };
</script>

<main>
  {#if user}
    {#if user.authenticated}
      <h1>Hello {user.displayName}!</h1>
      <button on:click={logout}>Logout</button>
    {:else}
      <h1>Please log in</h1>
      <button on:click={loginWithGoogle}>Login with Google</button>
      <button on:click={loginWithGitHub}>Login with GitHub</button>
      <a href="/login">Login with email</a>
    {/if}
  {/if}
</main>
