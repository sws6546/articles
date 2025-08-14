<script lang="ts">
	import "../app.css";
	import favicon from "$lib/assets/favicon.svg";
	import Header from "$lib/components/Header.svelte";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Header />

<div class="flex flex-row justify-center">
	<main class="container w-full max-w-10xl">
		{@render children?.()}
	</main>
</div>
