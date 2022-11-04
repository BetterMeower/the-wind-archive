<script>	
	import Modal from "../Modal.svelte";
    import * as clm from "../clmanager.js";
	import {modalShown, user} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Set Theme</h2>
    <div slot="default" class="grid">
        <button on:click={() => {
            const _user = $user;
			_user.theme = "orange";
			user.set(_user);
			clm.updateProfile();
        }}>Orange</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "blue";
			user.set(_user);
			clm.updateProfile();
        }}>Blue</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "green";
			user.set(_user);
			clm.updateProfile();
        }}>Green</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "magenta";
			user.set(_user);
			clm.updateProfile();
        }}>Magenta</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "red";
			user.set(_user);
			clm.updateProfile();
        }}>Red</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "pink";
			user.set(_user);
			clm.updateProfile();
        }}>Pink</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "gray";
			user.set(_user);
			clm.updateProfile();
        }}>Gray</button>

        <button on:click={() => {
            const _user = $user;
			_user.theme = "purple";
			user.set(_user);
			clm.updateProfile();
        }}>Purple</button>

        <button on:click={() => {$modalShown = false}}>Close</button>
	</div>
</Modal>

<style>
    .grid {
        display: grid;
        grid-template-columns: auto auto auto auto;
        grid-column-gap: 5px;
        grid-row-gap: 5px;
        padding: 1px;
    }
</style>