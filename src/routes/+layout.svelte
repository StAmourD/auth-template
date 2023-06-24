<script>
  let user;

  const logout = async () => {
    const response = await fetch('/auth/logout');
    if (response.ok) {
      user = response.json();
    }
  };
</script>
<nav>
  <a href="/">Home</a>
  <a href="/login">Login</a>
  <a href="/register">Register</a>
  <button on:click={logout}>Logout</button>
</nav>

<slot></slot>