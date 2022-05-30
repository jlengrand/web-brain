import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IPerson } from './models/people.js';

@customElement('person-view')
export class PersonView extends LitElement {

    @property({type: String}) personId : string = "";

    @property({type: Object}) person! :  IPerson;


    static styles = css``;

    render() {
        return html`<li>${this.personId} - ${this.person.name}</li>`;
    }
}
