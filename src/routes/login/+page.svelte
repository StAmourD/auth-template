<!-- src/routes/index.svelte -->
<script>
  import { onMount } from 'svelte';
  import { toast } from '@zerodevx/svelte-toast';

  let user;

  onMount(async () => {
    const response = await fetch('/auth/check');

    if (response.ok) {
      user = await response.json();
      console.log(user);
    }
  });

  const onSubmit = async () => {
    const data = new FormData(document.getElementById('login-form'));
    const payload = new URLSearchParams(data);

    const response = await fetch('/auth/login', {
      method: 'POST',
      body: payload,
    });
    if (response.ok) {
      user = await response.json();
      console.log(user);
    } else {
      user = await response.json();
      console.log(user);
      toast.push(user.message, {
        theme: {
          '--toastBarHeight': 0,
        },
        duration: 5000,
      });
    }
  };

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      user = response.json();
      console.log(user);
    }
  };
</script>

<main>
  {#if user}
    {#if user.authenticated}
      <h1>Login Page</h1>
      <p>Hello {user.displayname}!</p>
      <button on:click={logout}>Logout</button>
    {:else}
      <h1>Login Page</h1>
      <a href="/">Home</a>
      <form id="login-form">
        Enter Username:<br /><input type="text" name="username" />
        <br />Enter Password:<br /><input type="password" name="password" />
        <br /><br /><button on:click={onSubmit}>Submit</button>
      </form>
    {/if}
  {/if}
</main>
