import { css, html, LitElement } from "lit";
import { customElement, property } from 'lit/decorators.js';

import { IPerson } from "./models/people.js";

import "./PersonView.js";

@customElement("persons-view")
export class PersonsView extends LitElement{

    @property({type: String}) search : string = "";
    
    @property({type: Array}) persons : Array<[string, IPerson]> = [];

    static styles = css``;

    render(){
        return html`
        <ul>
            ${this.persons.filter( p => p[1].name.includes(this.search) ).map((person) =>
                html`<person-view personId="${person[0]}" .person="${person[1]}"></person-view>`
            )}
        </ul>
        `;
    }
}