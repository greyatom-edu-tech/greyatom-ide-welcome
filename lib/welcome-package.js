/** @babel */

import {CompositeDisposable} from 'atom'
let SettingsView = require('./settings-view')
let LoginView = require('./login-view')

const SETTINGS_VIEW_URI = 'atom://greyatom-ide-welcome/settings'
const LOGIN_VIEW_URI = 'atom://greyatom-ide-welcome/login'

export default class WelcomePackage {
  async activate () {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.workspace.addOpener((filePath) => {
      if (filePath === SETTINGS_VIEW_URI) {
        return this.createSettingsView({uri: SETTINGS_VIEW_URI})
      }
    }))

    this.subscriptions.add(atom.workspace.addOpener((filePath) => {
      if (filePath === LOGIN_VIEW_URI) {
        return this.createLoginView({uri: LOGIN_VIEW_URI})
      }
    }))

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'commit-live-welcome:show', () => this.show())
    )

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'commit-live-welcome:hide', () => this.hide())
    )

    this.hide()
    this.show()
  }

  hide () {
    const allPanes = atom.workspace.getPanes();
    allPanes.forEach((pane) => {
      const activePane = pane.activeItem;
      if (activePane instanceof SettingsView || activePane instanceof LoginView) {
        pane.destroy();
      }
    });
  }

  show () {
    return Promise.all([
      atom.workspace.open(SETTINGS_VIEW_URI),
      // atom.workspace.open(LOGIN_VIEW_URI)
    ])
  }

  deactivate () {
    this.subscriptions.dispose()
  }

  createSettingsView (state) {
    if (SettingsView == null) SettingsView = require('./settings-view')
    return new SettingsView({...state})
  }

  createLoginView (state) {
    if (LoginView == null) LoginView = require('./login-view')
    return new LoginView({...state})
  }
}
