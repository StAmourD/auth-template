<script>
  import { SvelteToast } from '@zerodevx/svelte-toast';
  let user;

  const toastOptions = {};

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      user = response.json();
      console.log(user);
    }
  };
</script>

<nav>
  <a href="/">Home</a>
  <a href="/login">Login</a>
  <a href="/register">Register</a>
  <button on:click={logout}>Logout</button>
</nav>

<SvelteToast {toastOptions} />

<slot />
