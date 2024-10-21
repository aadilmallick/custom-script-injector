import { html, css } from "../Dom";
import WebComponent from "./WebComponent";

const HTMLContent = html`
  <div class="container">
    <h1>\${title}</h1>
    <slot></slot>
  </div>
`;

const CSSContent = css`
  .container {
    position: fixed;
    height: 2rem;
    width: 2rem;
    padding: 1rem;
    color: white;
    background-color: red;
    z-index: 1000;
    top: 0;
    right: 0;
  }
`;

const observedAttributes = [] as const;

export default class ContentScriptUI extends WebComponent<
  typeof observedAttributes
> {
  constructor() {
    super({
      HTMLContent,
      templateId: "content-script-ui",
      cssContent: CSSContent,
    });
  }

  static get observedAttributes() {
    return observedAttributes;
  }

  static registerSelf() {
    WebComponent.register("content-script-ui", ContentScriptUI);
  }
}
