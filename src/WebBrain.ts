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

import { FIREBASE_CONFIG } from './constants.js';

@customElement('web-brain')
export class WebBrain extends LitElement {
  @property({ type: String }) title = 'Web brain';

  @property({ type: String }) search = '';

  @property({ type: Object }) user: User | null = null;

  public firebaseApp: FirebaseApp;

  private auth: Auth;

  private provider: AuthProvider = new GoogleAuthProvider();

  constructor() {
    super();
    this.firebaseApp = initializeApp(FIREBASE_CONFIG);

    this.auth = getAuth();

    onAuthStateChanged(this.auth, (user) => {
      console.log(`onAuthStateChanged${user}`);
      if (user) { this.user = user;} 
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

  render() {
    return html`
      <h1>${this.title}</h1>

      <!-- Login -->
      <div class="login-button">
        ${this.user
          ? html`
              <p>Logged in as ${this.user.email}</p>
              <button
                label="Logout"
                @click="${this.logout}"
              >Logout</button>
            `
          : html`<button
              label="LogIn with Google"
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

      <!-- Content -->
      <main>The content will come here</main>

      <footer>Web brain, because you forget everything</footer>
    `;
  }
}
