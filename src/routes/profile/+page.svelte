<script>
  import { onMount } from 'svelte';
  import { toast } from '@zerodevx/svelte-toast';
  import { thisUser } from '$lib/store.js';

  let thisProfile = {};

  onMount(async () => {
    const response = await fetch('/auth/check');

    if (response.ok) {
      thisUser.set(await response.json());
      if ($thisUser?.authenticated === undefined || $thisUser?.authenticated === false) {
        window.location = '/';
      }
    }

    const profileResponse = await fetch('/auth/profile');
    if (profileResponse.ok) {
      thisProfile = await profileResponse.json();
      console.log(thisProfile);
    }
  });

  const onSave = async (event) => {
    event.preventDefault();
    const data = new FormData(document.getElementById('profile-form'));
    const payload = new URLSearchParams(data);

    const profileResponse = await fetch('/auth/profile', {
      method: 'POST',
      body: payload,
    });
    if (profileResponse.ok) {
      thisProfile = await profileResponse.json();
    } else {
      // TODO show login toast form (to be created)
      window.location = '/';
    }
  };
</script>

<main>
  {#if $thisUser?.authenticated !== undefined && $thisUser?.authenticated === true}
    <h1>Profile Page</h1>
    <form id="profile-form">
      <label for="displayname">Display Name: </label><input
        type="text"
        name="displayname"
        value={thisProfile.displayname}
      /><br /><br />
      <label for="color">Favorite Color: </label><input
        type="text"
        name="color"
        value={thisProfile.color}
      /><br /><br />
      <label for="petcount">Number of Pets: </label><input
        type="text"
        name="petcount"
        value={thisProfile.petcount}
      /><br /><br /><br />
      <button on:click={onSave}>Save</button>
    </form>
  {:else}
    <h1>Profile Page: Please log in first</h1>
  {/if}
</main>
