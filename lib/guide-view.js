/** @babel */
/** @jsx etch.dom **/

import etch from 'etch'
import { CompositeDisposable } from 'atom';

export default class GuideView {
  constructor (props) {
    this.props = props
    this.didClickProjectButton = this.didClickProjectButton.bind(this)
    this.didClickContinueButton = this.didClickContinueButton.bind(this)
    this.didClickGitButton = this.didClickGitButton.bind(this)
    this.didClickGitHubButton = this.didClickGitHubButton.bind(this)
    this.didClickPackagesButton = this.didClickPackagesButton.bind(this)
    this.didClickThemesButton = this.didClickThemesButton.bind(this)
    this.didClickStylingButton = this.didClickStylingButton.bind(this)
    this.didClickInitScriptButton = this.didClickInitScriptButton.bind(this)
    this.didClickSnippetsButton = this.didClickSnippetsButton.bind(this)
    this.didExpandOrCollapseSection = this.didExpandOrCollapseSection.bind(this)
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'commit-live:re-render-welcome': () => {
        etch.update(this);
      }
    }));
    etch.initialize(this)
  }

  update () {}

  render () {
    return (
      <div className='welcome is-guide'>
        <div className='welcome-container'>
          <section className='welcome-panel'>
            <h1 className='welcome-title'>
              { this.getUserName() }
            </h1>

            <details className='welcome-card' {...this.getSectionProps('project')}>
              <summary className='welcome-summary icon icon-repo'>
                Search from our <span className='welcome-highlight'>Projects</span>
              </summary>
              <div className='welcome-detail'>
                <p>
                  <img className='welcome-img' src='atom://welcome/assets/shortcut.svg' />
                </p>
                <p>
                  In Commit.Live IDE you can open individual project. 
                  Opening a project will add a tree view to the editor
                  where you can browse all the files.
                </p>
                <p>
                  <button ref='projectButton' onclick={this.didClickProjectButton} className='btn btn-primary'>
                    Search a Project
                  </button>
                </p>
                <p>
                  If you only remember one keyboard shortcut make
                  it <kbd className='welcome-key'>{this.getCommandPaletteKeyBinding()}</kbd>.
                  This keystroke toggles a search box, which lists every
                  Commit.Live project. Start working on any project of your choice to earn those valuable points.
                </p>
              </div>
            </details>

            {
              this.isThereAnyLastProject() &&
              <details className='welcome-card' {...this.getSectionProps('last-project')}>
                <summary className='welcome-summary icon icon-repo'>
                  Last <span className='welcome-highlight'>Viewed</span>
                </summary>
                <div className='welcome-detail'>
                  <p>
                    You were working on <span className='welcome-highlight'>{ this.getLastProject() }</span>
                  </p>
                  <p>
                    <button ref='projectButton' onclick={this.didClickContinueButton} className='btn btn-primary'>
                      Continue
                    </button>
                  </p>
                </div>
              </details>
            }

          </section>
        </div>
      </div>
    )
  }

  getUserName () {
    const userInfo = JSON.parse(localStorage.getItem('commit-live:user-info'));
    return userInfo ? `Welcome, ${userInfo.name}` : 'Get to know Commit Live IDE!';
  }

  isThereAnyLastProject () {
    return localStorage.getItem('commit-live:last-opened-project') || false;
  }

  getLastProject () {
    const lastProject = JSON.parse(localStorage.getItem('commit-live:last-opened-project'));
    return lastProject ? lastProject.name : ''
  }

  getSectionProps (sectionName) {
    const props = {dataset: {section: sectionName}, onclick: this.didExpandOrCollapseSection}
    if (this.props.openSections && this.props.openSections.indexOf(sectionName) !== -1) {
      props.open = true
    }
    return props
  }

  getCommandPaletteKeyBinding () {
    if (process.platform === 'darwin') {
      return 'cmd-o'
    } else {
      return 'ctrl-o'
    }
  }

  getApplicationMenuName () {
    if (process.platform === 'darwin') {
      return 'Atom'
    } else if (process.platform === 'linux') {
      return 'Edit'
    } else {
      return 'File'
    }
  }

  serialize () {
    return {
      deserializer: this.constructor.name,
      openSections: this.getOpenSections(),
      uri: this.getURI()
    }
  }

  async destroy () {
    this.subscriptions.dispose();
  }

  getURI () {
    return this.props.uri
  }

  getTitle () {
    return 'Welcome Guide'
  }

  isEqual (other) {
    return other instanceof GuideView
  }

  getOpenSections () {
    return Array.from(this.element.querySelectorAll('details[open]'))
      .map((sectionElement) => sectionElement.dataset.section)
  }

  didClickProjectButton () {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:project-search')
  }

  didClickContinueButton () {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:connect-to-project')
  }

  didClickGitButton () {
    this.props.reporterProxy.sendEvent('clicked-git-cta')
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'github:toggle-git-tab')
  }

  didClickGitHubButton () {
    this.props.reporterProxy.sendEvent('clicked-github-cta')
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'github:toggle-github-tab')
  }

  didClickPackagesButton () {
    this.props.reporterProxy.sendEvent('clicked-packages-cta')
    atom.workspace.open('atom://config/install', {split: 'left'})
  }

  didClickThemesButton () {
    this.props.reporterProxy.sendEvent('clicked-themes-cta')
    atom.workspace.open('atom://config/themes', {split: 'left'})
  }

  didClickStylingButton () {
    this.props.reporterProxy.sendEvent('clicked-styling-cta')
    atom.workspace.open('atom://.atom/stylesheet', {split: 'left'})
  }

  didClickInitScriptButton () {
    this.props.reporterProxy.sendEvent('clicked-init-script-cta')
    atom.workspace.open('atom://.atom/init-script', {split: 'left'})
  }

  didClickSnippetsButton () {
    this.props.reporterProxy.sendEvent('clicked-snippets-cta')
    atom.workspace.open('atom://.atom/snippets', {split: 'left'})
  }

  didExpandOrCollapseSection (event) {
    const sectionName = event.currentTarget.closest('details').dataset.section
    const action = event.currentTarget.hasAttribute('open') ? 'collapse' : 'expand'
    // this.props.reporterProxy.sendEvent(`${action}-${sectionName}-section`)
  }
}
