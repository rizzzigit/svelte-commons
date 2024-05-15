<script lang="ts" context="module">
  import { colors as enderColorScheme } from "./color-scheme/green.js";
  import { colors as enderDarkColorScheme } from "./color-scheme/green-dark.js";

  import { writable, type Writable, derived as d } from "svelte/store";
  import { BROWSER } from "esm-env";

  export type ColorSchemeName = "green" | "green-dark" | string;

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
    ["green"]: enderColorScheme(),
    ["green-dark"]: enderDarkColorScheme(),
  };

  export function registerColorScheme(theme: string, colorScheme: ColorValues) {
    if (theme in registeredColors) {
      console.warn(`Color scheme ${theme} already exists. Overriding...`);
    }

    registeredColors[theme] = colorScheme;
  }

  function generateCssPropertyDeclarations(theme: ColorSchemeName) {
    const color = registeredColors[theme];
    console.log(color);

    let style = "";

    for (const key in color) {
      if (style.length !== 0) {
        style += "; ";
      }

      style += `--${key}: #${color[<ColorKey>key].toString(16).padStart(8, "0")}`;
    }

    return style;
  }

  const currentColorScheme: Writable<ColorSchemeName> = writable(
    BROWSER ? localStorage.getItem("theme") || "green" : "green"
  );

  if (BROWSER) {
    currentColorScheme.subscribe((value) => {
      if (!(value in registeredColors)) {
        console.warn(`Unknown theme: ${value}. Using default theme.`);
        currentColorScheme.set("green");

        return;
      }

      localStorage.setItem("theme", value);
    });
  }

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

  let resolved: ColorSchemeName = $state("green");

  if (colorScheme != null) {
    if (!(colorScheme in registeredColors)) {
      throw new Error(`Color scheme ${colorScheme} does not exist.`);
    }

    resolved = colorScheme;
  } else if (BROWSER && $currentColorScheme != null) {
    resolved = $currentColorScheme;
  } else {
    resolved = "green";
  }
</script>

<svelte:head>
  {#key resolved}
    {@html `<style>body { ${generateCssPropertyDeclarations(resolved)}}</style>`}
  {/key}
</svelte:head>
