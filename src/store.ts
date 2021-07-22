import { detectWebGL } from "./utils";

import * as urlParams from "./urlParameters";

declare var IS_PRODUCTION: boolean;

export interface IArtwork {
	isWebGLAvailable: boolean;
	timesContextLost: number;
	useLightTheme: boolean;
}

export interface IDebugging {
	hideSite: boolean;
}

export interface State {
	artwork: IArtwork;
	debug: IDebugging;
}

const isWebGLAvailable = detectWebGL();
// const isWebGLAvailable = false;

const hours = new Date().getHours();
let isDayTime = hours >= 8 && hours <= 20;
let useLightTheme = isDayTime && !urlParams.darkTheme;

let currentState: State = {
	artwork: {
		isWebGLAvailable,
		timesContextLost: 0,
		useLightTheme: useLightTheme,
	},
	debug: {
		hideSite: urlParams.hideSite,
	},
};

// Subscription
export type Subscriber = () => void;

const subscribers: Subscriber[] = [];

export const subscribe = (cb: Subscriber) => {
	subscribers.push(cb);

	return () => {
		const index = subscribers.indexOf(cb);

		if (index > -1) {
			subscribers.splice(index, 1);
		}
	};
};

const update = () => {
	for (const subscription of subscribers) {
		subscription();
	}
};

// Getter and Setters
export const getState = () => currentState;

export const setState = <K extends keyof State>(key: K, value: State[K]) => {
	currentState = {
		...currentState,
		[key]: value,
	};

	update();
};

export const setArtworkState = <K extends keyof IArtwork>(
	key: K,
	value: IArtwork[K],
) => {
	const currentArtworkState = getState().artwork;
	setState("artwork", { ...currentArtworkState, [key]: value });
};
