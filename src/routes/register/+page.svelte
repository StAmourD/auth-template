<script>
  import { onMount } from 'svelte';
  import { thisUser } from '$lib/store.js';

  onMount(async () => {
    const response = await fetch('/auth/check');
    if (response.ok) {
      thisUser.set(await response.json());
    }
  });

  const onSubmit = async () => {
    const data = new FormData(document.getElementById('register-form'));
    const payload = new URLSearchParams(data);

    const response = await fetch('/auth/register', {
      method: 'POST',
      body: payload,
    });
    if (response.ok) {
      thisUser.set(await response.json());
    }
  };

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      thisUser.set(await response.json());
    }
  };
</script>

<main>
  {#if $thisUser}
    {#if $thisUser.authenticated}
      <h1>Register Page</h1>
      <p>Hello {$thisUser.displayname}!</p>
      <button on:click={logout}>Logout</button>
    {:else}
      <h1>Registration Page</h1>
      <form id="register-form">
        Enter Username:<br /><input type="text" name="username" />
        <br />Enter Password:<br /><input type="text" name="password" />
        <br />Full Name:<br /><input type="text" name="displayname" />
        <br /><br /><button on:click={onSubmit}>Submit</button>
      </form>
    {/if}
  {/if}
</main>
