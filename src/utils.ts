/**
 * utilities
 * @author Thomas Thron
 */

import * as THREE from "three";

export function detectWebGL(): boolean {
	try {
		var canvas = document.createElement("canvas");
		return !!(
			(window as any).WebGLRenderingContext &&
			(canvas.getContext("webgl") ||
				canvas.getContext("experimental-webgl"))
		);
	} catch (e) {
		return false;
	}
}

/**
 * helper to yield a json with a specific format
 * @param url file location
 */
export async function loadJsonFile<T>(url: string): Promise<T> {
	const promise = new Promise<T>((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = "json";
		xhr.onreadystatechange = (bla: Event) => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				const parsed = xhr.response as T;
				resolve(parsed);
			}
		};
		xhr.onerror = () => reject(xhr.statusText);
		xhr.open("GET", url);
		xhr.send();
	});
	return promise;
}

/** general json file typing needed since the info/news/... entries must be the value of a key */
export interface IJsonFile<T> {
	entries: T[];
}

/** typing for a universal section with a caption */
export interface IHeadedParagraphSection {
	caption: string;
	paragraphs: string[];
	htmlTag?: string;
	outerHtmlTag?: string;
}

function openHtmlTag(tagName: string): string {
	return "<" + tagName + ">";
}

function closeHtmlTag(tagName: string): string {
	return "</" + tagName + ">";
}

/** joins string snippets to HTML <ul> elements */
export function joinParagraphs(
	paragraphs: string[],
	htmlTag: string = "p",
	outerHtmlTag?: string
): string {
	const middle = paragraphs
		.map(para => openHtmlTag(htmlTag) + para + closeHtmlTag(htmlTag))
		.join("");
	if (!outerHtmlTag) return middle;
	const tagOpen = openHtmlTag(outerHtmlTag);
	const tagClose = closeHtmlTag(outerHtmlTag);
	return tagOpen + middle + tagClose;
}

interface ITextureRessource {
	name: string;
	texture: THREE.Texture;
}

export async function loadTexture(url: string): Promise<ITextureRessource> {
	const result = new Promise<ITextureRessource>((resolve, reject) => {
		textureLoader.load(
			url,
			texture => {
				resolve({ name: url, texture });
			},
			error => {
				reject(error);
			}
		);
	});
	return result;
}

const textureLoader = new THREE.TextureLoader();
