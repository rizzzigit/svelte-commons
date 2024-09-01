<script lang="ts" module>
	import {
		type AwaiterChildrenParameters,
		type AwaiterResetFunction,
		AwaiterResultType
	} from './types.js';
</script>

<script lang="ts" generics="T extends any, P extends any">
	import { onMount, type Snippet } from 'svelte';

	let {
		callback,
		autoLoad = true,
		reset = $bindable(),

		initialPayload = null,

		ready,
		loading,
		children,
		success,
		error
	}: {
		callback: (setPayload: (payload: P | null) => void) => Promise<T> | T;
		autoLoad?: boolean;
		initialPayload?: P | null;
		reset?: AwaiterResetFunction<P>;

		children?: Snippet<[AwaiterChildrenParameters<T, P>]>;
		ready?: Snippet<[AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Ready }]>;
		loading?: Snippet<[AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Loading }]>;
		success?: Snippet<[AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Success }]>;
		error?: Snippet<[AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Error }]>;
	} = $props();

	let autoLoadState: boolean = $state(autoLoad);
	let payloadState: P | null = $state(initialPayload);
	let promiseState: Promise<T> | null = $state(null);

	async function run(): Promise<void> {
		try {
			const setPayload: (payload: P | null) => void = (payload) => (payloadState = payload);

			try {
				const result = callback(setPayload);

				if (result instanceof Promise) {
					try {
						await (promiseState = result);
					} catch {}
				}
			} catch (error: any) {
				throw (promiseState = Promise.reject(error));
			}
		} catch {}

		try {
			await promiseState;
		} catch (error: any) {
			console.error(error);
		}
	}

	const resetFunc: AwaiterResetFunction<P> = async (
		load: boolean = autoLoad,
		initialPayload: P | null = null
	) => {
		promiseState = null;
		payloadState = initialPayload;

		if ((autoLoadState = load)) {
			await run();
		}
	};

	reset = resetFunc;

	onMount(async () => {
		if (autoLoadState) {
			void run();
		}
	});
</script>

{#snippet readyWrapper()}
	{@const params: AwaiterChildrenParameters<T, P> & {  status: AwaiterResultType.Ready } = { reset: resetFunc, status: AwaiterResultType.Ready, payload: payloadState }}
	{#if ready != null}
		{@render ready(params)}
	{:else if children != null}
		{@render children(params)}
	{/if}
{/snippet}

{#snippet loadingWrapper()}
	{@const params: AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Loading } = { reset: resetFunc, status: AwaiterResultType.Loading, payload: payloadState }}
	{#if loading != null}
		{@render loading(params)}
	{:else if children != null}
		{@render children(params)}
	{/if}
{/snippet}

{#snippet successWrapper(result: T)}
	{@const params: AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Success } = { reset: resetFunc, status: AwaiterResultType.Success, result, payload: payloadState }}
	{#if success != null}
		{@render success(params)}
	{:else if children != null}
		{@render children(params)}
	{/if}
{/snippet}

{#snippet errorWrapper(errorData: Error)}
	{@const params: AwaiterChildrenParameters<T, P> & { status: AwaiterResultType.Error } = { reset: resetFunc, status: AwaiterResultType.Error, error: errorData, payload: payloadState }}
	{#if error != null}
		{@render error(params)}
	{:else if children != null}
		{@render children(params)}
	{/if}
{/snippet}

{#if promiseState == null}
	{#if autoLoad}
		{@render loadingWrapper()}
	{:else}
		{@render readyWrapper()}
	{/if}
{:else}
	{#await promiseState}
		{@render loadingWrapper()}
	{:then result}
		{@render successWrapper(result)}
	{:catch error}
		{@render errorWrapper(error)}
	{/await}
{/if}
