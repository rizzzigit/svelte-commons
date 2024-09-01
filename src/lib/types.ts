import { writable, type Writable } from 'svelte/store';

export type ColorSchemeName = 'Green' | 'Green Dark' | string;

export type ColorValues = Record<ColorKey, number>;

export enum ColorKey {
	Primary = 'primary',
	OnPrimary = 'onPrimary',
	PrimaryContainer = 'primaryContainer',
	OnPrimaryContainer = 'onPrimaryContainer',

	PrimaryVariant = 'primaryVariant',
	OnPrimaryVariant = 'onPrimaryVariant',
	PrimaryContainerVariant = 'primaryContainerVariant',
	OnPrimaryContainierVariant = 'onPrimaryContainerVariant',

	Background = 'background',
	BackgroundVariant = 'backgroundVariant',
	OnBackground = 'onBackground',
	OnBackgroundVariant = 'onBackgroundVariant',

	Error = 'error',
	ErrorBackground = 'errorBackground',
	OnError = 'onError',

	Warning = 'warning',
	WarningBackground = 'warningBackground',
	OnWarning = 'onWarning',

	Info = 'info',
	InfoBackground = 'infoBackground',
	OnInfo = 'onInfo',

	Shadow = 'shadow'
}

export type AwaiterResetFunction<P> = (load?: boolean, initialPayload?: P | null) => Promise<void>;

export type AwaiterCallback<T, P> = (setPayload: P) => T | Promise<T>;

export enum AwaiterResultType {
	Ready,
	Loading,
	Success,
	Error
}

export type AwaiterChildrenParameters<T, P> = {
	status: AwaiterResultType;
	payload: P | null;
	reset: AwaiterResetFunction<P>;
} & (
	| {
			status: AwaiterResultType.Success;
			result: T;
	  }
	| {
			status: AwaiterResultType.Ready;
	  }
	| {
			status: AwaiterResultType.Error;
			error: Error;
	  }
	| {
			status: AwaiterResultType.Loading;
	  }
);

export enum ViewMode {
	Unset = 0,

	Mobile = 0b0000001,
	Desktop = 0b0000010,
	Browser = 0b0000100,
	Standalone = 0b0001000,
	Fullscreen = 0b0010000,
	MinimalUI = 0b0100000,
	OverlayControls = 0b1000000
}

export enum BannerClass {
	Info = 'info',
	Warning = 'warning',
	Error = 'error'
}

export enum OverlayPositionType {
	Center,
	Offset
}

export type OverlayPosition =
	| [type: OverlayPositionType.Center]
	| [type: OverlayPositionType.Offset, x: number, y: number];

export enum DialogClass {
	Normal = 'normal',
	Warning = 'warning',
	Error = 'error'
}

export enum ButtonClass {
	Primary = 'primary',
	PrimaryContainer = 'primary-container',
	Background = 'background',
	BackgroundVariant = 'background-variant',
	Transparent = 'transparent'
}

export type ButtonCallback = (event: MouseEvent) => Promise<void> | void;

export enum InputClass {
	Primary = 'primary',
	PrimaryContainer = 'primary-container',
	Background = 'background',
	Transparent = 'transparent'
}

export enum InputType {
	Text,
	Password,
	Number,
	Date,
	Time,
	Submit,
	DropDown,
	Radio
}

export type InputOptions<T extends InputType> = ({
	class?: InputClass;
	icon?: string;
	name?: string;

	value: Writable<unknown>;
	tabIndex?: number;
} & (
	| {
			type: InputType.Text | InputType.Password;
			placeholder?: string;
			value: Writable<string>;
			update?: (value: string) => void;
	  }
	| {
			type: InputType.Number;
			placeholder?: string;
			value: Writable<number>;
			update?: (value: number) => void;
	  }
)) & { type: T };

export const viewMode: Writable<ViewMode> = writable(ViewMode.Unset);
