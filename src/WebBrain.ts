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

import { getFirestore, collection, Firestore, onSnapshot, addDoc } from "firebase/firestore"; 


import { FIREBASE_CONFIG } from './constants.js';
import { IPerson } from './models/people.js';

@customElement('web-brain')
export class WebBrain extends LitElement {
  @property({ type: String }) title = 'Web brain';

  @property({ type: String }) search = '';

  @property({ type: Object }) newPerson: IPerson | null = null;

  @property({ type: Object }) user: User | null = null;

  @property({type: Array}) persons : Array<IPerson> | null = null;

  public firebaseApp: FirebaseApp;

  private auth: Auth;

  private firestore : Firestore;

  private provider: AuthProvider = new GoogleAuthProvider();

  private peopleCollection;


  constructor() {
    super();
    this.firebaseApp = initializeApp(FIREBASE_CONFIG);

    this.firestore = getFirestore();
    this.auth = getAuth();

    this.peopleCollection = collection(this.firestore, "people");

    onAuthStateChanged(this.auth, (user) => {
      console.log(`onAuthStateChanged${user}`);
      if (user) { this.user = user;} 
    });
    
    const unsub = onSnapshot(this.peopleCollection, (querySnapshot) => {
      // const cities = [];
      querySnapshot.forEach((doc) => {
          console.log(doc.data());
      });
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

    try {
      const docRef = await addDoc(this.peopleCollection, this.newPerson);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    this.newPerson = null;
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
            const p : IPerson = { name: e.target.value }
            this.newPerson = p;
          }}"
        />
        <button
              @click="${this.savePerson}"
            >Save new person!</button>
      </div>    

      <!-- Content -->
      <main>The content will come here</main>

      <footer>Web brain, because you forget everything</footer>
    `;
  }
}
