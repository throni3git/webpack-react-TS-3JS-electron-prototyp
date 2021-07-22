import * as ReactDOM from "react-dom";
import * as React from "react";

import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";

library.add(fab);
library.add(fas);

import { Container } from "./container";

declare var BUILD_TIMESTAMP: string;
console.log("webpack-react-TS-3JS-electron prototyp " + BUILD_TIMESTAMP);

declare var IS_PRODUCTION: boolean;
if (!IS_PRODUCTION) {
	console.log("Development mode");
}

const body = document.getElementsByTagName("body")[0];

const content = document.createElement("div");
content.style.width = "100%";
content.style.height = "100%";
content.style.overflow = "hidden";

body.appendChild(content);

ReactDOM.render(React.createElement(Container), content);
