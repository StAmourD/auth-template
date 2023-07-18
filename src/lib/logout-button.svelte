<script>
  import { thisUser } from '$lib/store.js';

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      thisUser.set(await response.json());
    }
  };
</script>

<button on:click={logout}>Logout</button>
