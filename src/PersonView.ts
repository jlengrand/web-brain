import { Timestamp } from 'firebase/firestore';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { IPerson } from './models/people.js';

@customElement('person-view')
export class PersonView extends LitElement {

    @property({type: String}) personId : string = "";

    @property({type: Object}) person! :  IPerson;

    static styles = css``;

    render() {
        return html`
        <li>
        ${this.formatTime(this.person.updatedAt)} - ${this.person.name}
            <div>
                <ul>
                    ${this.person.entries.map((entry) =>
                        html`<li>${this.formatTime(entry.updatedAt)} - ${entry.content}</li>`
                    )}
                </ul>
            </div>
        </li>
        `;
    }

    // eslint-disable-next-line class-methods-use-this
    formatTime(zeTime? : Timestamp | null) {
        return zeTime ? zeTime.toDate().toLocaleDateString() : "unknown";
    }
}
