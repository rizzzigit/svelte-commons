<script lang="ts" context="module">
  import { colors as enderColorScheme } from "./color-scheme/green.js";
  import { colors as enderDarkColorScheme } from "./color-scheme/green-dark.js";

  import { derived as d, get } from "svelte/store";
  import { persisted } from "svelte-persisted-store";

  export type ColorSchemeName = "Green" | "Green Dark" | string;

  export type ColorValues = Record<ColorKey, number>;
  export enum ColorKey {
    Primary = "primary",
    OnPrimary = "onPrimary",
    PrimaryContainer = "primaryContainer",
    OnPrimaryContainer = "onPrimaryContainer",

    PrimaryVariant = "primaryVariant",
    OnPrimaryVariant = "onPrimaryVariant",
    PrimaryContainerVariant = "primaryContainerVariant",
    OnPrimaryContainierVariant = "onPrimaryContainerVariant",

    Background = "background",
    BackgroundVariant = "backgroundVariant",
    OnBackground = "onBackground",
    OnBackgroundVariant = "onBackgroundVariant",

    Error = "error",
    ErrorBackground = "errorBackground",
    OnError = "onError",

    Warning = "warning",
    WarningBackground = "warningBackground",
    OnWarning = "onWarning",

    Info = "info",
    InfoBackground = "infoBackground",
    OnInfo = "onInfo",

    Shadow = "shadow",
  }

  export const intColorToHex = (color: number): string =>
    `#${color.toString(16)}`;

  export const registeredColors: Record<ColorSchemeName, ColorValues> = {
    ["Green"]: enderColorScheme(),
    ["Green Dark"]: enderDarkColorScheme(),
  };

  export function registerColorScheme(theme: string, colorScheme: ColorValues) {
    if (theme in registeredColors) {
      console.warn(`Color scheme ${theme} already exists. Overriding...`);
    }

    registeredColors[theme] = colorScheme;
  }
  export function getColorInt(
    key: ColorKey,
    theme: ColorSchemeName = get(currentColorScheme)
  ): number | null {
    return registeredColors?.[theme]?.[key] ?? 0;
  }

  export function getColorHex(key: ColorKey, theme?: ColorSchemeName) {
    return `#${getColorInt(key, theme)?.toString(16).padStart(8, "0")}`;
  }

  export function getColorRgba(key: ColorKey, theme?: ColorSchemeName) {
    const hex = getColorHex(key, theme);

    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    const alpha = Number.parseInt(hex.slice(6, 8), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
  }

  function generateCssPropertyDeclarations(theme: ColorSchemeName) {
    const color = registeredColors[theme];

    let style = "";

    for (const key in color) {
      if (style.length !== 0) {
        style += "; ";
      }

      style += `--${key}: #${color[<ColorKey>key].toString(16).padStart(8, "0")}`;
    }

    return style;
  }

  const currentColorScheme = persisted("color-scheme", "Green", {
    serializer: {
      parse: (value) => (value in registeredColors ? value : "Green"),
      stringify: (value) => value,
    },
  });

  export function setColorScheme(theme: ColorSchemeName) {
    if (!(theme in registeredColors)) {
      throw new Error(`Color scheme ${theme} does not exist.`);
    }

    currentColorScheme.set(theme);
  }

  const readonlyCurrentColorScheme = d(currentColorScheme, (value) => value);
  export { readonlyCurrentColorScheme as currentColorScheme };
</script>

<script lang="ts">
  const { colorScheme }: { colorScheme?: ColorSchemeName } = $props();

  const resolved = colorScheme ?? $currentColorScheme;
</script>

<svelte:head>
  {#key resolved}
    {@html `<style>body { ${generateCssPropertyDeclarations(resolved)}}</style>`}
  {/key}
</svelte:head>
