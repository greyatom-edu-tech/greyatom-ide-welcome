/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable, Disposable} from 'atom'

export default class SettingsView {
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
  }

  update () {}

  destroy () {
    this.disposables.dispose()
    return etch.destroy(this)
  }

  render () {
    return (
      <div className='welcome'>
          <section className='login-wrapper'>
            <div className='login-box'>
              <div className='box-column hello-box'>
                <div className='box-title'>
                  Hello,
                </div>
              </div>
              <div className='box-column login-details'>
                <p class="logo">
                  <img src='atom://greyatom-ide-welcome/assets/commit-live-login.png' />
                </p>
                <a href="dashboard.html" className='btn btn-primary btn-lg btn-block login-github'>
                  <span className='fa fa-github'></span>
                  Sign in with GitHub account
                </a>
              </div>
            </div>
          </section>
      </div>
    )
  }

  // This prevents the view being actually disposed when closed
  // If you remove it you will need to ensure the cached settingsView
  // in main.coffee is correctly released on close as well...
  onDidChangeTitle () { return new Disposable() }

  serialize () {
    return {
      deserializer: 'SettingsView',
      uri: this.props.uri
    }
  }

  getTitle () {
    return 'Commit Live Login'
  }

  getIconName () {
    return 'tools'
  }

  getURI () {
    return this.props.uri
  }

  isEqual (other) {
    return other instanceof SettingsView
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
