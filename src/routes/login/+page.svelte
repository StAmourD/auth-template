<!-- src/routes/index.svelte -->
<script>
  import { onMount } from 'svelte'

  let user;

  onMount(async () => {
    const response = await fetch('/auth/check')
    if (response.ok) {
      user = await response.json()
      console.log(user)
    }
  });

  const onSubmit = async () => {
    const data = new FormData(document.getElementById("login-form"));
    const payload = new URLSearchParams(data)
    // var data = new FormData(form);
    console.log(data)
    alert(1)
    const response = await fetch('/auth/login',{
      method: "POST",
      body: payload
    })
    if (response.ok) {
      user = await response.json()
      console.log(user)
    }
  };

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
      <iframe name="dummyframe" id="dummyframe" style="display: none;"></iframe>
      <a href="/">Home</a>
      <form id="login-form">
        Enter Username:<br><input type="text" name="username">
        <br>Enter Password:<br><input type="password" name="password">
        <br><br><button on:click={onSubmit}>Submit</button>
      </form>
    {/if}
  {/if}
</main>
