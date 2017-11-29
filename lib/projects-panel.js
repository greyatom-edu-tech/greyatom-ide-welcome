/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable, Disposable} from 'atom'
import etch from 'etch'

export default class ProjectsPanel {
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
            <h3 className='welcome-block'>Projects</h3>
          </div>
          <div className='content-wrapper project-list'>
            <div className='row'>
              <div className='col-sm-12'>
                <div className='search-project-box'>
                  <input type='text' className='form-control' placeholder='Search project' />
                </div>
                <table className='table'>
                  <thead>
                    <tr>
                      <th width='5%'>Status</th>
                      <th width='50%'>Project Name</th>
                      <th width='18%'>Module</th>
                      <th width='10%'>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className='completed'><span class="glyphicon glyphicon-ok gacomplete-chapt" aria-hidden="true"></span></td>
                      <td><a href='#'>Work with the IPL data set and do a deeper dive on looping constructs and various data structures constructs and various data structures</a></td>
                      <td>Python Data Science Toolbox</td>
                      <td><span className='project-points'>0/350 Pts</span></td>
                    </tr>
                    <tr>
                      <td className='current'><span class="glyphicon glyphicon-adjust gacomplete-chapt" aria-hidden="true"></span></td>
                      <td><a href='#'>Use  the basic Numpy concepts to analyze ball-by-ball delivery information of a lot of matches</a></td>
                      <td>First Steps to ML</td>
                      <td><span className='project-points'>150/650 Pts</span></td>
                    </tr>
                    <tr>
                      <td><span class="glyphicon gacomplete-chapt-incomplete" aria-hidden="true"></span></td>
                      <td><a href='#'>Use Pandas DataFrame and analyze Mumbai Indians and Pune Warriors match details</a></td>
                      <td>Problem Solving with ML</td>
                      <td><span className='project-points'>0/750 Pts</span></td>
                    </tr>
                    <tr>
                      <td><span class="glyphicon gacomplete-chapt-incomplete" aria-hidden="true"></span></td>
                      <td><a href='#'>Work with the full IPL dataset with several matches</a></td>
                      <td>Fintech Hackathon</td>
                      <td><span className='project-points'>0/350 Pts</span></td>
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
