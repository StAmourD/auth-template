<!-- src/routes/index.svelte -->
<script>
  import { onMount } from 'svelte';

  let user;

  onMount(async () => {
    const response = await fetch('/auth/check');
    if (response.ok) {
      user = await response.json();
      console.log(user)
    }
  });

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      user = response.json();
    }
  };
</script>

<main>
  {#if user}
    {#if user.authenticated}
      <h1>Login Page</h1>
      <p>Hello {user.displayName}!</p>
      <button on:click={logout}>Logout</button>
    {:else}
      <h1>Login Page</h1>
      <a href="/">Home</a>
      <form method="POST" action="/auth/login">
        Enter Username:<br><input type="text" name="username">
        <br>Enter Password:<br><input type="password" name="password">
        <br><br><input type="submit" value="Submit">
      </form>
    {/if}
  {/if}
</main>
