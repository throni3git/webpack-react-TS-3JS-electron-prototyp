import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Artwork } from "./artwork";

import * as Store from "./store";

export class SceneManager {
	private _renderer!: THREE.WebGLRenderer;
	private _canvas!: HTMLCanvasElement;
	private _containerElement!: HTMLDivElement;
	private _camera!: THREE.PerspectiveCamera;

	private _controls!: OrbitControls;
	private _scene!: THREE.Scene;
	private _artwork!: Artwork;

	private _lastRender = Date.now();
	private _maxFPS = 60;

	constructor(containerElement: HTMLDivElement) {
		const isWebGLAvailable = Store.getState().artwork.isWebGLAvailable;
		if (!isWebGLAvailable) {
			return;
		}

		this._renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
			precision: "mediump",
		});
		this._renderer.setClearColor(new THREE.Color(0xffffff), 0);
		this._renderer.setPixelRatio((window.devicePixelRatio || 1) / 1);

		this._containerElement = containerElement;
		containerElement.appendChild(this._renderer.domElement);

		this._canvas = this._renderer.domElement;

		window.addEventListener("resize", this.resizeCanvas, false);

		this._scene = new THREE.Scene();

		this.setupCamera();

		this._artwork = new Artwork(this._scene);

		this._controls = new OrbitControls(
			this._camera,
			this._renderer.domElement,
		);

		this.framedRedraw();

		this._canvas.addEventListener(
			"webglcontextlost",
			() => {
				const timesContextLost =
					Store.getState().artwork.timesContextLost + 1;

				if (timesContextLost > 5) {
					Store.setArtworkState("isWebGLAvailable", false);
				} else {
					Store.setArtworkState("timesContextLost", timesContextLost);
				}
			},
			false,
		);
	}

	private setupCamera(): void {
		this._camera = new THREE.PerspectiveCamera(45, 1, 0.1, 20);
		this._camera.position.set(0, 0, 10);

		this.resizeCanvas();
	}

	private resizeCanvas = (): void => {
		const containerStyle = getComputedStyle(this._containerElement);
		let containerWidth = parseInt(
			containerStyle.getPropertyValue("width"),
			10,
		);
		let containerHeight = parseInt(
			containerStyle.getPropertyValue("height"),
			10,
		);

		// safety first
		containerWidth = Math.max(1, containerWidth);
		containerHeight = Math.max(1, containerHeight);

		// size canvas
		this._canvas.width = containerWidth;
		this._canvas.height = containerHeight;

		// make sure we don't draw on too large textures
		const AR = containerWidth / containerHeight;

		const CANVAS_MAX_SIZE = 1024;
		let width = Math.min(CANVAS_MAX_SIZE, containerWidth);
		const height = Math.min(CANVAS_MAX_SIZE, containerWidth / AR);
		width = height * AR;

		const newAR = width / height;
		this._camera.aspect = newAR;
		this._camera.updateProjectionMatrix();

		this._renderer.setSize(width, height, false);
		this._canvas.style.width = containerWidth + "px";
		this._canvas.style.height = containerHeight + "px";
	};

	private animate = (): void => {
		this._artwork.update();
	};

	protected framedRedraw = (): void => {
		const tTimestamp = Date.now();
		const tDiff = tTimestamp - this._lastRender;
		const tInterval = 1000 / this._maxFPS;
		this.animate();

		if (tDiff > tInterval) {
			this.render();
			this._lastRender = tTimestamp - (tDiff % tInterval);
		}
		window.requestAnimationFrame(this.framedRedraw);
	};

	private render = (): void => {
		this._controls.update();
		this._renderer.render(this._scene, this._camera);
	};
}
