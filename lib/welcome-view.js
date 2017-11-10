/** @babel */
/** @jsx etch.dom **/

import etch from 'etch'

export default class WelcomeView {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  didChangeShowOnStartup () {
    atom.config.set('welcome.showOnStartup', this.checked)
  }

  update () {}

  serialize () {
    return {
      deserializer: 'WelcomeView',
      uri: this.props.uri
    }
  }

  render () {
    return (
      <div className='welcome'>
        <div className='welcome-container'>
          <header className='welcome-header' style={{textAlign: 'center'}}>
            <a href='https://app2.commit.live'>
              <img src='atom://welcome/assets/commit-live-logo-white.svg' />
            </a>
            <a href='http://www.greyatom.com'>
              <h1 className='welcome-title'>
                <img style={{maxWidth:'34%'}} src='atom://welcome/assets/greyatom-logo.svg' />
              </h1>
            </a>
          </header>

          <section className='welcome-panel'>
            <p>For help, please visit</p>
            <ul>
              <li>The <a href='https://github.com/commit-live-students/help-center'>FAQ's</a> for Guides and troubleshooting reference.</li>
            </ul>
          </section>
        </div>
      </div>
    )
  }

  getURI () {
    return this.props.uri
  }

  getTitle () {
    return 'Welcome'
  }

  isEqual (other) {
    other instanceof WelcomeView
  }
}
