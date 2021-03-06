/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable, Disposable, Notification} from 'atom'
import OverviewPanel from './overview-panel';
import ProjectsPanel from './projects-panel';
import ShortcutsPanel from './shortcuts-panel';

export default class DashboardView {
  constructor (props) {
    this.props = props;
    etch.initialize(this)
    this.disposables = new CompositeDisposable()
    this.disposables.add(atom.commands.add(this.element, {
      'core:move-up': () => { this.scrollUp() },
      'core:move-down': () => { this.scrollDown() },
      'core:page-up': () => { this.pageUp() },
      'core:page-down': () => { this.pageDown() },
      'core:move-to-top': () => { this.scrollToTop() },
      'core:move-to-bottom': () => { this.scrollToBottom() }
    }))
    if (localStorage.getItem('commit-live:token')) {
      process.nextTick(() => this.initializePanels())
    }
  }

  update () {}

  destroy () {
    this.disposables.dispose()
    for (let name in this.panelsByName) {
      const panel = this.panelsByName[name]
      panel.destroy()
    }

    return etch.destroy(this)
  }

  render () {
    return (
      <div className='commit-live-settings-view pane-item' tabIndex='-1'>
        <div className='config-menu' ref='sidebar'>
          <ul className='panels-menu nav nav-pills nav-stacked' ref='panelMenu'>
            <div className='panel-menu-separator' ref='menuSeparator'></div>
          </ul>
        </div>
        {/* The tabindex attr below ensures that clicks in a panel item won't
        cause this view to gain focus. This is important because when this view
        gains focus (e.g. immediately after atom displays it), it focuses the
        currently active panel item. If that focusing causes the active panel to
        scroll (e.g. because the active panel itself passes focus on to a search
        box at the top of a scrolled panel), then the browser will not fire the
        click event on the element within the panel on which the user originally
        clicked (e.g. a package card). This would prevent us from showing a
        package detail view when clicking on a package card. Phew! */}
        <div className='panels' tabIndex='-1' ref='panels'></div>
      </div>
    )
  }

  // This prevents the view being actually disposed when closed
  // If you remove it you will need to ensure the cached settingsView
  // in main.coffee is correctly released on close as well...
  onDidChangeTitle () { return new Disposable() }

  initializePanels () {
    if (this.refs.panels.children.length > 1) {
      return
    }

    this.panelsByName = {}
    const clickHandler = (event) => {
      const target = event.target.closest('.panels-menu li a, .panels-packages li a')
      if (target) {
        const name = target.closest('li').name
        if (name == 'Logout') {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:log-in-out')
        } else {
          this.showPanel(target.closest('li').name)
        }
      }
    }
    this.element.addEventListener('click', clickHandler)
    this.disposables.add(new Disposable(() => this.element.removeEventListener('click', clickHandler)))

    const focusHandler = () => {
      this.focusActivePanel()
    }
    this.element.addEventListener('focus', focusHandler)
    this.disposables.add(new Disposable(() => this.element.removeEventListener('focus', focusHandler)))

    this.addCorePanel('Overview', 'dashboard', () => new OverviewPanel({
      showProjects: () => {
        this.showPanel('Projects')
      },
      showSessionExpired: this.showSessionExpired,
    }))
    this.addCorePanel('Projects', 'file-text', () => new ProjectsPanel({
      projects: [],
      showSessionExpired: this.showSessionExpired,
    }))
    this.addCorePanel('Shortcuts', 'keyboard-o', () => new ShortcutsPanel())
    this.addCorePanel('Logout', 'external-link')

    // this.showDeferredPanel()

    if (!this.activePanel) {
      this.showPanel('Overview')
    }

    if (document.body.contains(this.element)) {
      this.refs.sidebar.style.width = this.refs.sidebar.offsetWidth
    }
  }

  serialize () {
    return {
      deserializer: 'DashboardView',
      uri: this.props.uri
    }
  }

  addCorePanel (name, iconName, panel) {
    const panelMenuItem = document.createElement('li')
    panelMenuItem.name = name
    if (name === 'Logout') {
      panelMenuItem.className = 'ide-logout-btn';
    }
    panelMenuItem.setAttribute('name', name)

    const a = document.createElement('a')
    a.classList.add('fa', `fa-${iconName}`)
    a.textContent = name
    panelMenuItem.appendChild(a)

    this.refs.menuSeparator.parentElement.insertBefore(panelMenuItem, this.refs.menuSeparator)
    this.addPanel(name, panel)
  }

  addPanel (name, panelCreateCallback) {
    if (this.panelCreateCallbacks == null) {
      this.panelCreateCallbacks = {}
    }
    this.panelCreateCallbacks[name] = panelCreateCallback
    if (this.deferredPanel && this.deferredPanel.name === name) {
      this.showDeferredPanel()
    }
  }

  getOrCreatePanel (name, options) {
    let panel = this.panelsByName ? this.panelsByName[name] : null
    if (name == 'Projects' && panel) {
      panel.getProjects()
    }
    // These nested conditionals are not great but I feel like it's the most
    // expedient thing to do - I feel like the "right way" involves refactoring
    // this whole file.
    if (!panel) {
      let callback = this.panelCreateCallbacks ? this.panelCreateCallbacks[name] : null

      if (options && options.pack && !callback) {
        callback = () => {
          if (!options.pack.metadata) {
            const metadata = _.clone(options.pack)
            options.pack.metadata = metadata
          }
          return new PackageDetailView(options.pack, this, this.packageManager, this.snippetsProvider)
        }
      }

      if (callback) {
        panel = callback()
        if (this.panelsByName == null) {
          this.panelsByName = {}
        }
        this.panelsByName[name] = panel
        if (this.panelCreateCallbacks) {
          delete this.panelCreateCallbacks[name]
        }
      }
    }

    return panel
  }

  makePanelMenuActive (name) {
    const previouslyActivePanel = this.refs.sidebar.querySelector('.active')
    if (previouslyActivePanel) {
      previouslyActivePanel.classList.remove('active')
    }

    const newActivePanel = this.refs.sidebar.querySelector(`[name='${name}']`)
    if (newActivePanel) {
      newActivePanel.classList.add('active')
    }
  }

  focusActivePanel () {
    // Pass focus to panel that is currently visible
    for (let i = 0; i < this.refs.panels.children.length; i++) {
      const child = this.refs.panels.children[i]
      if (child.offsetWidth > 0) {
        child.focus()
      }
    }
  }

  showDeferredPanel () {
    if (this.deferredPanel) {
      const {name, options} = this.deferredPanel
      this.showPanel(name, options)
    }
  }

  // Public: show a panel.
  //
  // * `name` {String} the name of the panel to show
  // * `options` {Object} an options hash. Will be passed to `beforeShow()` on
  //   the panel. Options may include (but are not limited to):
  //   * `uri` the URI the panel was launched from
  showPanel (name, options) {
    const panel = this.getOrCreatePanel(name, options)
    if (panel) {
      this.appendPanel(panel, options)
      this.makePanelMenuActive(name)
      this.setActivePanel(name, options)
      this.deferredPanel = null
    } else {
      this.deferredPanel = {name, options}
    }
  }

  appendPanel (panel, options) {
    for (let i = 0; i < this.refs.panels.children.length; i++) {
      this.refs.panels.children[i].style.display = 'none'
    }

    if (!this.refs.panels.contains(panel.element)) {
      this.refs.panels.appendChild(panel.element)
    }

    if (panel.beforeShow) {
      panel.beforeShow(options)
    }
    panel.show()
    panel.focus()
  }

  setActivePanel (name, options = {}) {
    this.activePanel = {name, options}
  }

  removePanel (name) {
    const panel = this.panelsByName ? this.panelsByName[name] : null
    if (panel) {
      panel.destroy()
      delete this.panelsByName[name]
    }
  }

  showSessionExpired () {
    const sessionExpiredNotify = new Notification("info", "Commit Live IDE: Please Login Again", {
      dismissable: false,
      description: 'Your session has expired!'
    });
    atom.notifications.addNotification(sessionExpiredNotify)
  }

  getTitle () {
    return 'Commit Live IDE'
  }

  getIconName () {
    return 'tools'
  }

  getURI () {
    return this.props.uri
  }

  isEqual (other) {
    return other instanceof DashboardView
  }

  scrollUp () {
    this.element.scrollTop -= document.body.offsetHeight / 20
  }

  scrollDown () {
    this.element.scrollTop += document.body.offsetHeight / 20
  }

  pageUp () {
    this.element.scrollTop -= this.element.offsetHeight
  }

  pageDown () {
    this.element.scrollTop += this.element.offsetHeight
  }

  scrollToTop () {
    this.element.scrollTop = 0
  }

  scrollToBottom () {
    this.element.scrollTop = this.element.scrollHeight
  }
}
