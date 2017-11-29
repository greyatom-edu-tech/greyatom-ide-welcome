/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable, Disposable} from 'atom'
import etch from 'etch'

export default class OverviewPanel {
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
            <h3 className='welcome-block'>Welcome,</h3>
            <h4 className='welcome-block user-name'>waheedp</h4>
          </div>
          <div className='content-wrapper'>
            <div className='row'>
              <div className='col-sm-12'>
                <div class="panel panel-info">
                  <div class="panel-heading">Course Progress</div>
                  <div class="panel-body course-progress">
                      <div class="col-sm-12 progress-count-row">
                        <div className='row'>
                          <div class="col-sm-3 col-xs-12">
                            <div class="count-box assignments-completed">
                              <div class="count-no">25</div>
                              <div class="box-h">Projects Completed</div>
                            </div>
                          </div>
                          <div class="col-sm-6 col-xs-12">
                            <div class="col-sm-7 col-xs-12 center-box">
                              <div class="count-box points-earned">
                                <div class="count-no">300</div>
                                <div class="box-h">Total Points Earned</div>
                              </div>
                            </div>
                          </div>
                          <div class="col-sm-3 col-xs-12 pull-right">
                            <div class="count-box quizzes-completed">
                              <div class="count-no">134</div>
                              <div class="box-h">Points Earned This Week</div>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
              <div className='col-sm-12'>
                <div className='panel panel-info last-viewed'>
                  <div className='panel-heading'>Last Project Worked On</div>
                  <div className='panel-body'>
                    <div className='media'>
                      <div className='media-left media-middle'>
                        <span className='fa fa-code activity-icon'></span>
                      </div>
                      <div className='media-body'>
                        <div className='activity-title'>Use the basic Numpy concepts to analyze ball-by-ball delivery information of a lot of matches</div>
                      </div>
                    </div>
                    <div className='activity-btn'>
                      <a className='btn btn-success btn-md' role='button' href='#'>Continue</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-sm-12 bottom-links-row'>
                <a href='#' className='btn btn-md btn-primary'>View Projects</a>
                <a href='#' className='btn btn-md btn-link'>Need help?</a>
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
