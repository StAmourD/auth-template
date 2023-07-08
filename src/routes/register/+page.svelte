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
      <h1>Register Page</h1>
      <p>Hello {user.displayname}!</p>
      <button on:click={logout}>Logout</button>
    {:else}
      <h1>Registration Page</h1>
      <form method="POST" action="/auth/register">
        Enter Username:<br><input type="text" name="username">
        <br>Enter Password:<br><input type="text" name="password">
        <br><br><input type="submit" value="Submit">
        <br>Full Name:<br><input type="text" name="displayname">
      </form>
    {/if}
  {/if}
</main>
