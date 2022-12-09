<!-- Tired of the orange login and registration screen. -->

<script>
	import
		{screen, setupPage as page,
		modalShown, modalPage,
		auth_header,
		user
	} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
	const link = clm.link;
	// @ts-ignore
	window.clm = clm;

	import unloadedProfile from "../lib/unloadedprofile.js";

	import meowerLogo from "../assets/logo.svg";
	import meowy from "../assets/meowy.svg";

	import {tick, onMount} from "svelte";
	import {fade} from 'svelte/transition';
	import sleep from "../lib/sleep.js";

	let logo, setup, logoImg, loginStatus = "";

	async function connect() {
		await clm.disconnect();
		clm.connect();

		await new Promise(resolve => link.once("connected", resolve));
	}

	let rememberMe = false;
	let acceptTerms = false;

	onMount(() => {
		page.subscribe(async value => {
			if (!setup) return;

			setup.classList.remove("white");
			if (value === "logo") {
				clm.disconnect();
				loginStatus = "";

				await tick();
				setup.classList.add("white");
				logoImg.height = 0;
				logo.classList.remove("top");
				
				await sleep(600);
				// Directly changing image height instead
				// of using transforms to prevent blur
				logoImg.height = 80;
				await sleep(300);
				setup.classList.remove("white");
				logoImg.height = 40;
				logo.classList.add("top");

				await sleep(700);
				loginStatus = "Log in now...";
				await connect();

				if (localStorage.getItem("meower_savedusername") && localStorage.getItem("meower_savedpassword")) {
					doLogin(localStorage.getItem("meower_savedusername"), localStorage.getItem("meower_savedpassword"), true);
				} else {
					await mainSetup();
				}
			} else if (value === "reconnect") {
				loginStatus = "";
				await connect();
				await sleep(100);
				page.set("welcome");
			}
		});
	});

	/**
	 * Goes to main setup screen.
	*/
	async function mainSetup() {
		localStorage.clear();
		user.set(unloadedProfile());
		loginStatus = "";
		page.set("blank");
		await sleep(600);
		page.set("welcome");
	}

	/**
	 * Logs in.
	 * 
	 * @param {string} username
	 * @param {string} password
	*/
	function doLogin(username, password, autoLogin = false) {
		try {
			loginStatus = "Please give me your name; Please contact us...";
			clm.meowerRequest({
				cmd: "direct",
				val: {
					cmd: "authpswd",
					val: {
						username: username,
						pswd: password,
					},
				},
			}).then(async val => {
				try {
					const profileVal = await clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "get_profile",
							val: val.payload.username,
						},
					});
					user.update(v => Object.assign(v, {
						...profileVal.payload,
						name: val.payload.username,
					}));
					auth_header.set({username: val.payload.username, token: val.payload.token});

					if (rememberMe || localStorage.getItem("meower_savedusername") === username) {
						localStorage.setItem("meower_savedusername", username);
						localStorage.setItem("meower_savedpassword", val.payload.token);
					}

					screen.set("main");
				} catch(e) {
					localStorage.clear();
					console.error("Unexpected " + e + " error getting user data!");
					link.disconnect(1000, "No user information found");
				}
			}).catch(code => {
				if (autoLogin) return mainSetup();

				switch (code) {
					case "E:103 | ID not found":
						loginStatus = "wrong name!";
						break;
					case "I:011 | Invalid Password":
						loginStatus = "Wrong password!";
						break;
					case "E:018 | Account Banned":
						$modalPage = "banned";
						$modalShown = true;
						loginStatus = "";
						break;
					case "E:019 | Illegal characters detected":
						loginStatus = "No spaces or other special characters!";
						break;
					case "E:106 | Too many requests":
						loginStatus = "Lots of medicine! Please try again soon.";
						break;
					default:
						loginStatus = `Unexpected ${code} error!`;
				}
			});
		} catch(e) {
			if (autoLogin) return mainSetup();

			console.error(e);
			loginStatus = "error confirmation: " + e;
		}
	}
</script>

<div out:fade={{duration: 300}} bind:this={setup} class="setup white">
	{#if $page === "logo"}
		<div out:fade={{duration: 300}} class="fullcenter">
			<div>
				<div class="logo top" bind:this={logo}>
					<img
						bind:this={logoImg}
						alt="arrival"
						src={meowerLogo}
						class="logo-img"
						height="40"
					/>
				</div>
				<div class="connecting">{loginStatus}</div>
			</div>
		</div>
	{:else if $page === "reconnect"}
		<div class="fullcenter">
			again...
		</div>
	{:else if $page === "welcome"}
		<div class="fullcenter">
			<div class="column-ui">
				<div>
					<img
						alt="arrival"
						src={meowerLogo}
						class="logo-img"
						height="70"
					/>
					<br /><br />
				</div>
				<button on:click={() => page.set("login")}>Changes</button> <br />
				<button on:click={() => page.set("join")}>Open an account</button> <br />
				{#if localStorage.getItem("meower_savedusername")}
					<button on:click={() => {
						rememberMe = true;
						doLogin(
							localStorage.getItem("meower_savedusername"),
							localStorage.getItem("meower_savedpassword"),
						)
					}}>Register with your registered information ({localStorage.getItem("meower_savedusername")})</button>
					<p class="small">{loginStatus}</p>
				{/if}
				<button on:click={() => {
					loginStatus = "";
					page.set("blank");
					screen.set("main");
				}}>fly</button>
				<p class="small">(Many features won't be available until you get started.)</p>
				<div>
					<p class="small">
						Better Recovery v1.4.2
					</p>
					<img
						src={meowy}
						alt=""
						height="64"
					>
				</div>
			</div>
		</div>
	{:else if $page === "login"}
		<div class="fullcenter">
			<h1>will meow</h1>
			
			<form class="column-ui"
				on:submit|preventDefault={e => {
					if (!(e.target[0].value && e.target[1].value)) {
						loginStatus = "You must enter your username and password!";
						return false;
					}
					doLogin(
						e.target[0].value,
						e.target[1].value,
					);
					return false;
				}}
			>
				<input type="text" placeholder="user name" maxlength="20"> <br />
				<input type="password" placeholder="the password" maxlength="64">
				<p class="checkboxes">
					<input id="remember-me" type="checkbox" bind:checked={rememberMe}>
					<label for="remember-me">
						save this message
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons">
					<button type="button" on:click|preventDefault={()=>{
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>change</button>
					<button type="submit">the law</button>
				</div>
			</form>
		</div>
	{:else if $page === "join"}
		<div class="fullcenter">
			<h1>it almost tastes good</h1>

			<form class="column-ui"
				on:submit|preventDefault={e => {
					const username = e.target[0].value;
					const password = e.target[1].value;
					if (!(username && password)) {
						loginStatus = "You must create a username and password!";
						return false;
					}

					loginStatus = "Create account..."

					clm.meowerRequest({
						cmd: "direct",
						val: {
							cmd: "gen_account",
							val: {
								username: username,
								pswd: password,
							},
						},
						listener: "join",
					}).then(async val => {
						if (val.mode === "auth" && val.payload.username === username) {
							loginStatus = "Searching for user data...";
							const profileVal = await clm.meowerRequest({
								cmd: "direct",
								val: {
									cmd: "get_profile",
									val: val.payload.username,
								},
							});
							user.update(v => Object.assign(v, {
								...profileVal.payload,
								name: val.payload.username,
							}));
							auth_header.set({username: val.payload.username, token: val.payload.token});

							loginStatus = "";
							
							if (rememberMe) {
								localStorage.setItem("meower_savedusername", username);
								localStorage.setItem("meower_savedpassword", val.payload.token);
							}

							page.set("go");
							await sleep(1000);
							screen.set("main");
						} else {
							loginStatus = "Unexpected connection error!";
						}
					}).catch(code => {
						switch (code) {
							case "I:015 | Account exists":
								loginStatus = "That username already exists!";
								break;
							case "I:011 | Invalid Password":
								loginStatus = "Wrong password!";
								break;
							case "E:119 | IP Blocked":
								$modalPage = "ipBanned";
								$modalShown = true;
								loginStatus = "";
								break;
							case "E:019 | Illegal characters detected":
								loginStatus = "Contains no spaces or special characters.";
								break;
							case "E:106 | Too many requests":
								loginStatus = "So many questions! Please try again later.";
								break;
							default:
								loginStatus = `Unexpected ${code} error!`;
						}
					});
				}}
			>
				<input type="text" placeholder="Stress" maxlength="20"> <br />
				<input type="password" placeholder="important principles" maxlength="64">
				<p class="checkboxes">
					<input id="remember-me" type="checkbox" bind:checked={rememberMe}>
					<label for="remember-me">
						for this post
					</label>
					<br />
					<input id="accept-terms" type="checkbox" bind:checked={acceptTerms}>
					<label for="accept-terms">
						theory <a
							href="https://meower.org/legal" target="_blank"
						>Meower Terms and conditions and data protection</a>
					</label>
				</p>
				<span class="login-status">{loginStatus}</span>
				<div class="buttons">
					<button type="button" on:click|preventDefault={()=>{
						page.set("welcome");
						loginStatus = "";
						return false;
					}}>a passenger</button>
					<button type="submit" disabled={!acceptTerms}>That's right!</button>
				</div>
			</form>
		</div>
	{:else if $page === "blank"}
		<div></div>
	{:else if $page === "go"}
		<div class="fullcenter">Next!</div>
	{:else}
		<div class="fullcenter">
			<div class="column-ui">
				Landed on this page for some reason….
				<br />
				(Current page: {$page})

				<div class="buttons">
					<button on:click={()=>page.set("logo")}>a passenger</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.setup {
		background-color: var(--orange);
		color: var(--foreground-orange);
		font-size: 150%;

		text-align: center;
		
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1000;
		
		width: 100%;
		min-height: 100vh;
		height: 100%;

		display: table;
	}
	.fullcenter {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		margin: auto;
		overflow: auto;

		display: table-cell;
		vertical-align: middle;
		padding: 0.5em;
	}

	.setup.white {
		background-color: var(--background);
		color: var(--orange-button);
	}

	.logo {
		position: relative;
		bottom: 0px;
		transition:
			bottom 0.3s cubic-bezier(0,1,1,1);
	}
	.logo-img {
		transition:
			height 0.3s cubic-bezier(0,1,1,1);
	}
	.logo.top {
		bottom: 10px;
	}
	.setup:not(.white) .logo-img {
		filter: brightness(0) invert(1);
	}

	.small {
		font-size: 75%;
	}

	.connecting {
		height: 0;
		overflow: visible;
	}

	.column-ui {
		width: 24em;
		max-width: calc(100vw - 2em);
		min-height: 8em;

		position: relative;

		margin: auto;
	}
	.column-ui > * {
		width: 100%;
	}
	.column-ui .buttons {
		display: flex;
		width: 24em;
		max-width: 100%;

		margin-top: 2em;
	}
	.column-ui .buttons * {
		flex-grow: 1;
		flex-shrink: 1;
		padding-left: 0;
		padding-right: 0;
	}

	.login-status {
		display: inline-block;
		height: 0;
		overflow: visible;
	}

	label, .checkboxes input {
		vertical-align: middle;
	}

	.checkboxes {
		text-align: left;
		font-size: 90%;
	}
</style>
