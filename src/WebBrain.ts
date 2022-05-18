import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('web-brain')
export class WebBrain extends LitElement {
  @property({ type: String }) title = 'Web brain';

  @property({ type: String }) search = '';

  static styles = css`
    :host {
    }

  `;

  render() {
    return html`
      <h1>${this.title}</h1>

      <!-- Form -->
      <div>
        Here comes the search bar
        <input type="text" @input="${ (e:any) => {this.search = e.target.value} }" />
      </div>  

      <!-- Content -->
      <main>
        The content will come here  
      </main> 

      <footer>Web brain, because you forget everything</footer>
    `;
  }
}
