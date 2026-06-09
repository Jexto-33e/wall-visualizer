import { createRoot, Root } from "react-dom/client";
import App from "./App";
import "./index.css";
import type { Artwork, WallPlacement } from "./types";

class WallVisualizer extends HTMLElement {
  private root: Root | null = null;
  private products: Artwork[] = [];

  static get observedAttributes() {
    return ["products"];
  }

  connectedCallback() {
    if (!this.root) {
      this.root = createRoot(this);
      this.renderApp();
    }
  }

  attributeChangedCallback(
    name: string,
    _oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === "products" && newValue) {
      try {
        this.products = JSON.parse(newValue);
        this.renderApp();
      } catch (error) {
        console.error("Error parsing products attribute:", error);
      }
    }
  }

  set productsData(data: Artwork[]) {
    this.products = data;
    this.renderApp();
  }

  private handleCheckout = (placedItems: WallPlacement[]) => {
    const event = new CustomEvent("checkout", {
      detail: { items: placedItems },
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  };

  private handleRequestProducts = () => {
    const event = new CustomEvent("request-products", {
      bubbles: true,
      composed: true,
    });

    this.dispatchEvent(event);
  };

  private renderApp() {
    if (!this.root) return;

    this.root.render(
      <App 
      initialProducts={this.products} 
      onCheckout={this.handleCheckout} 
      onRequestProducts={this.handleRequestProducts} />,
    );
  }

  disconnectedCallback() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }
}

if (!customElements.get("wall-visualizer")) {
  customElements.define("wall-visualizer", WallVisualizer);
}
