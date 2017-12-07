/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable, Disposable} from 'atom'
import etch from 'etch'

const keyShortcuts = {
  darwin: {
    'toggleTerminal': 'CMD+I',
    'toggleFileTree': 'CTRL+ALT+O',
    'searchProject': 'CMD+O',
    'searchFile': 'CMD+P'
  },
  others: {
    'toggleTerminal': 'CTRL+I',
    'toggleFileTree': 'CTRL+ALT+O',
    'searchProject': 'CTRL+O',
    'searchFile': 'CTRL+P'
  }
}

export default class ShortcutsPanel {
  constructor () {
    etch.initialize(this)
    this.subscriptions = new CompositeDisposable()
    this.subscriptions.add(atom.commands.add(this.element, {
      'core:move-up': () => { this.scrollUp() },
      'core:move-down': () => { this.scrollDown() },
      'core:page-up': () => { this.pageUp() },
      'core:page-down': () => { this.pageDown() },
      'core:move-to-top': () => { this.scrollToTop() },
      'core:move-to-bottom': () => { this.scrollToBottom() }
    }))
  }

  destroy () {
    this.subscriptions.dispose()
    return etch.destroy(this)
  }

  update () {}

  render () {
    return (
      <div tabIndex='0' className='panels-item ga-ide'>
        <div className='container-panel'>
          <div className='welcome-msg-ide'>
            <h3 className='welcome-block'>Keyboard Shortcuts</h3>
          </div>
          <div className='content-wrapper project-list'>
            <div className='row'>
              <div className='col-sm-12'>
                <div className='search-project-box'>
                  <input type='text' className='form-control' placeholder='Search Shortcut' />
                </div>
                <table className='table'>
                  <thead>
                    <tr>
                      <th width='18%'>Keystroke</th>
                      <th width='20%'>Command</th>
                      <th width='62%'>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='keyboard-shortcut'>
                        {this.getCommandPaletteKeyBinding('toggleTerminal')}
                      </td>
                      <td>Toggle Terminal</td>
                      <td>Using this shortcut, you can toggle the terminal seen in the bottom when you are coding for any project.</td>
                    </tr>
                    <tr>
                      <td className='keyboard-shortcut'>
                        {this.getCommandPaletteKeyBinding('toggleFileTree')}
                      </td>
                      <td>Toggle File-Tree</td>
                      <td>Using this shortcut, you can toggle the file-tree seen in the left hand side when you are coding for any project.</td>
                    </tr>
                    <tr>
                      <td className='keyboard-shortcut'>
                        {this.getCommandPaletteKeyBinding('searchProject')}
                      </td>
                      <td>Search Project</td>
                      <td>Use this shortcut to quickly search and open a project.</td>
                    </tr>
                    <tr>
                      <td className='keyboard-shortcut'>
                        {this.getCommandPaletteKeyBinding('searchFile')}
                      </td>
                      <td>Search File</td>
                      <td>Use this shortcut for searching a file while working on any project</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getCommandPaletteKeyBinding (key) {
    if (process.platform === 'darwin') {
      return keyShortcuts.darwin[key]
    } else {
      return keyShortcuts.others[key]
    }
  }

  focus () {
    this.element.focus()
  }

  show () {
    this.element.style.display = ''
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
