import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  getAuth,
  setPersistence,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  Auth,
  AuthProvider,
  User,
  browserLocalPersistence,
  onAuthStateChanged
} from 'firebase/auth';

import { getFirestore, collection, Firestore, onSnapshot, addDoc, CollectionReference } from "firebase/firestore"; 


import { FIREBASE_CONFIG } from './constants.js';
import { IEntry, IPerson } from './models/people.js';
import "./PersonView.js"

@customElement('web-brain')
export class WebBrain extends LitElement {
  @property({ type: String }) title = 'Web brain';

  @property({ type: String }) search = '';

  @property({ type: Object }) newPerson: IPerson | null = null;

  @property({ type: Object }) user: User | null = null;

  @property({type: Array}) persons : Array<[string, IPerson]> = [];

  public firebaseApp: FirebaseApp;

  private auth: Auth;

  private firestore : Firestore;

  private provider: AuthProvider = new GoogleAuthProvider();

  private peopleCollection : CollectionReference | null = null;

  constructor() {
    super();
    this.firebaseApp = initializeApp(FIREBASE_CONFIG);

    this.firestore = getFirestore();
    this.auth = getAuth();
    
    onAuthStateChanged(this.auth, (user) => {
      console.log(`onAuthStateChanged ${user}`);
      if (user) { 
        this.user = user;
        this.peopleCollection = collection(this.firestore, `/users/${this.user.uid}/people`);

        const unsub = onSnapshot(this.peopleCollection, (querySnapshot) => {
          const tempPersons : Array<[string, IPerson]> = []
          querySnapshot.forEach((doc) => {
            tempPersons.push([doc.id, doc.data() as IPerson]);
          });
          this.persons = tempPersons
        });
      } 
    });
    
  }

  static styles = css``;

  async logIn() {
    console.log('Logging in');
    try {
      await setPersistence(this.auth,browserLocalPersistence);
      const result = await signInWithPopup(this.auth, this.provider);
      console.log('logged in');
      this.user = result.user;
    } catch (error) {
      console.log('Error when logging in', error);
    }
  }

  async logout() {
    console.log('Logging out');
    try {
      await signOut(this.auth);
      console.log('logged out');
      this.user = null;
    } catch (error) {
      console.log('Error while logging out', error);
    }
  }

  async savePerson() {
    console.log(`saving ${JSON.stringify(this.newPerson)}`);

    if(this.peopleCollection){
      try {
        const docRef = await addDoc(this.peopleCollection, this.newPerson);
        this.newPerson = null;
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
  
      this.newPerson = null;
    }

  }

  render() {
    return html`
      <h1>${this.title}</h1>

      <!-- Login -->
      <div class="login-button">
        ${this.user
          ? html`
              <p>Logged in as ${this.user.email}</p>
              <button
                @click="${this.logout}"
              >Logout</button>
            `
          : html`<button
              @click="${this.logIn}"
            >LogIn with Google!</button>`}
      </div>

      <!-- Form -->
      <div>
        Here comes the search bar
        <input
          type="text"
          @input="${(e: any) => {
            this.search = e.target.value;
          }}"
        />
      </div>

      <!-- Adding people -->
            <div>
        Adding a new person
        <input
          type="text"
          @input="${(e: any) => {
            const entry : IEntry = { content : "Met at the 6th floor at SC"};
            const p : IPerson = { name: e.target.value, entries: [entry] }
            this.newPerson = p;
          }}"
        />
        <button
              @click="${this.savePerson}"
            >Save new person!</button>
      </div>    

      <!-- Content -->
      <main>
        <h2>The content will come here</h2>

        <ul>
        ${this.persons.filter( p => p[1].name.includes(this.search) ).map((person) =>
          // html`<li>${person[0]} - ${person[1].name}</li>`
          html`<person-view personId="${person[0]}" .person="${person[1]}"></person-view>`
        )}
        </ul>

      </main>

      <footer>Web brain, because you forget everything</footer>
    `;
  }
}
