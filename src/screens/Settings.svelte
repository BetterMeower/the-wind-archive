<!-- You probably know what this is. -->

<script>
	import Container from "../lib/Container.svelte";

	import {user, modalShown, modalPage} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
</script>

<!--
	<p>Quote: {$user.quote}</p>
	<form 
		class="createpost"
		on:submit|preventDefault={e => {
			//spinner.set(true);
			const _user = $user;
			_user.quote = e.target[0].value;
			user.set(_user);

			clm.updateProfile();
			//spinner.set(false);
		}}
	>
		<input
			type="text"
			class="white"
			placeholder="Write something..."
				id="qinput"
				name="qinput"
			autocomplete="false"
		>
		<button>Save Quote</button>
	</form>
-->
<Container>
	<h1>almost none</h1>
	Here you can change the settings. After registering your account, you can share it with other users.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={()=>{
				const _user = $user;
				_user.layout = _user.layout === "new" ? "old" : "new";
				user.set(_user);

				clm.updateProfile();
			}}
		></button>
	</div>

	<h2>send OFFER</h2>
	    Current settings are set {$user.layout}.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={()=>{
				$modalPage = "theme";
				$modalShown = true;
			}}
		></button>
	</div>

	<h2>matter</h2>
	    That has also changed {$user.theme}.
</Container>
<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			checked={!$user.mode}
			on:change={()=>{
				const _user = $user;
				_user.mode = !_user.mode;
				user.set(_user);

				clm.updateProfile();
			}}
		>
	</div>

	<h2>on the street in the dark</h2>
	Dark mode must be enabled {$user.mode ? "disabled" : "enabled"}.
</Container>
<Container>
	<div class="settings-controls">
		<input
			type="checkbox"
			checked={$user.sfx}
			on:change={()=>{
				const _user = $user;
				_user.sfx = !_user.sfx;
				user.set(_user);

				clm.updateProfile();
			}}
		>
	</div>

	<h2>Important</h2>
	The health effects are already visible {!$user.sfx ? "disabled" : "enabled"}.
</Container>
{#if $user.name}
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				$modalPage = "changePassword";
				$modalShown = true;
			}}
		></button>
	</div>

	<h2>you should change your password</h2>
	Change your account password.
</Container>
<Container>
	<div class="settings-controls">
		<button
			class="circle settings"
			on:click={() => {
				$modalPage = "deleteAccount";
				$modalShown = true;
			}}
		></button>
	</div>

	<h2>terminate your account</h2>
	Delete your Meower account permanently. It will not be extensive.
</Container>
{/if}

<div class="eee"></div>

<style>
	.settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	input[type="checkbox"], button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>
