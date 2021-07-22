import * as Store from "./store";

interface IColorTheme {
	LoadingBackground: string;
	Background: string;
	HeadingLogoUrl: string;
	DefaultTextColor: string;
	LightTextColor: string;
	LinkColor: string;
	LinkHoverColor: string;
	HighlightColor: string;
	ActiveMenuColor: string;
	CaptionUnderlineColor: string;
	RulerColor: string;
	GalleryArrayColor: string;
	ShadowColor: string;
	ScrollThumbColor: string;
}

export const LightTheme: IColorTheme = {
	LoadingBackground: "#ededed",
	Background: "rgba(255,255,255,0.86)", // "#ffffffdd"
	HeadingLogoUrl: "assets/logo_light.svg",
	DefaultTextColor: "#333333",
	LightTextColor: "#333333bb",
	LinkColor: "#000000",
	LinkHoverColor: "#ab854f",
	HighlightColor: "#ab854f",
	ActiveMenuColor: "#8c6c40",
	CaptionUnderlineColor: "#888888",
	RulerColor: "#666666",
	GalleryArrayColor: "#cccccc",
	ShadowColor: "#444444",
	ScrollThumbColor: "#ccccccaa"
};

export const DarkTheme: IColorTheme = {
	LoadingBackground: "#251e1e",
	Background: "rgba(23, 18, 18, 0.6)", // "#17121299",
	HeadingLogoUrl: "assets/logo_dark.svg",
	DefaultTextColor: "#cccccc",
	LightTextColor: "#ccccccbb",
	LinkColor: "#cccccc",
	LinkHoverColor: "#ab854f",
	HighlightColor: "#ab854f",
	ActiveMenuColor: "#8c6c40",
	CaptionUnderlineColor: "#888888",
	RulerColor: "#999999",
	GalleryArrayColor: "#cccccc",
	ShadowColor: "#333333",
	ScrollThumbColor: "#444444aa"
};

export const DebugTheme: IColorTheme = {
	LoadingBackground: "lime",
	Background: "yellow",
	HeadingLogoUrl: "assets/logo_dark.svg",
	DefaultTextColor: "red",
	LightTextColor: "pink",
	LinkColor: "purple",
	LinkHoverColor: "orange",
	HighlightColor: "green",
	ActiveMenuColor: "gold",
	CaptionUnderlineColor: "blue",
	RulerColor: "aquamarine",
	GalleryArrayColor: "yellow",
	ShadowColor: "cyan",
	ScrollThumbColor: "black"
};

export let Colors: IColorTheme = LightTheme;
if (!Store.getState().artwork.useLightTheme) {
	Colors = DarkTheme;
}

export const NEWS_IMAGE_FOLDER = "data/news_images/";
export const MEDIA_FOLDER = "media/";

export const BORDER = 1;
export const BORDER_RADIUS = 3 * BORDER;
