/** @babel */

import {CompositeDisposable} from 'atom'
let DashboardView = require('./dashboard-view')
let LoginView = require('./login-view')

const DASHBOARD_VIEW_URI = 'atom://greyatom-ide-welcome/dashboard'
const LOGIN_VIEW_URI = 'atom://greyatom-ide-welcome/login'

export default class WelcomePackage {
  async activate () {
    this.subscriptions = new CompositeDisposable()

    this.subscriptions.add(atom.workspace.addOpener((filePath) => {
      if (filePath === DASHBOARD_VIEW_URI) {
        return this.createDashboardView({uri: DASHBOARD_VIEW_URI})
      }
    }))

    this.subscriptions.add(atom.workspace.addOpener((filePath) => {
      if (filePath === LOGIN_VIEW_URI) {
        return this.createLoginView({uri: LOGIN_VIEW_URI})
      }
    }))

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'commit-live-welcome:show-login', () => this.showLogin())
    )

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'commit-live-welcome:show-dashboard', () => this.showDashboard())
    )

    this.subscriptions.add(
      atom.commands.add('atom-workspace', 'commit-live-welcome:hide', () => this.hide())
    )

    this.hide()
  }

  hide () {
    const allPanes = atom.workspace.getPanes();
    allPanes.forEach((pane) => {
      const activePane = pane.activeItem;
      if (activePane instanceof DashboardView || activePane instanceof LoginView) {
        pane.destroy();
      }
    });
  }

  closeAll () {
    atom.workspace.getPanes().forEach(function(pane) {
      pane.destroy();
    });
  }

  showDashboard () {
    this.closeAll()
    return Promise.all([
      atom.workspace.open(DASHBOARD_VIEW_URI)
    ])
  }

  showLogin () {
    this.closeAll()
    return Promise.all([
      atom.workspace.open(LOGIN_VIEW_URI)
    ])
  }

  deactivate () {
    this.subscriptions.dispose()
  }

  createDashboardView (state) {
    if (DashboardView == null) DashboardView = require('./dashboard-view')
    return new DashboardView({...state})
  }

  createLoginView (state) {
    if (LoginView == null) LoginView = require('./login-view')
    return new LoginView({...state})
  }
}
