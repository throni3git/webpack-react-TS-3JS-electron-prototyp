import * as React from "react";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";

import { SceneManager } from "./sceneManager";

import { Colors, BORDER_RADIUS } from "./constants";

import * as Store from "./store";

const ArtworkContainer = styled.div`
	width: 100%;
	height: 100%;
	position: absolute;
	overflow: hidden;
`;

const AllContainer = styled.div`
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
`;

const GlobalStyle = createGlobalStyle`
* {
	box-sizing: border-box;
	font-family: sans-serif;
}

html, body {
	color: ${Colors.DefaultTextColor};
	background-color: ${Colors.LoadingBackground};
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
}

a {
	color: ${Colors.LinkColor};
	&:hover {
		color: ${Colors.LinkHoverColor};
	}
}

li {
  padding: 3px 0;
}
`;

export class Container extends React.Component<
	IContainerProps,
	IContainerState
> {
	private _baseElement?: HTMLDivElement;
	private _sceneManager?: SceneManager;

	constructor(props: Container["props"]) {
		super(props);

		this.state = {};

		Store.subscribe(() => this.setState({}));
	}

	public componentDidMount() {
		this._sceneManager = new SceneManager(this._baseElement!);
	}

	public render() {
		return (
			<AllContainer>
				{Store.getState().artwork.isWebGLAvailable && (
					<ArtworkContainer
						ref={(ref) => (this._baseElement = ref!)}
					/>
				)}
				<GlobalStyle />
			</AllContainer>
		);
	}
}

export interface IContainerProps {}

interface IContainerState {}
