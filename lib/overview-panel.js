/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable, Disposable} from 'atom'
import {shell} from 'electron'
import etch from 'etch'
import fetch from './fetch'
import LoaderPanel from './loader-panel';
import LastProjectPanel from './last-project-panel';
import CourseProgressPanel from './course-progress-panel';
import {getApiEndpoint} from './util'

export default class OverviewPanel {
  constructor (props) {
    this.props = props
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
    process.nextTick(() => this.getCourseProgress())
  }

  destroy () {
    this.subscriptions.dispose()
    return etch.destroy(this)
  }

  update () {}

  getUserName() {
    let username = ''
    const storedUserInfo = localStorage.getItem('commit-live:user-info');
    if (storedUserInfo) {
      const { name, userName } = JSON.parse(storedUserInfo)
      username = name || userName
    }
    return username
  }

  render () {
    return (
      <div tabIndex='0' className='panels-item ga-ide'>
        <div className='container-panel'>
          <div className='welcome-msg-ide'>
            <h3 className='welcome-block'>Welcome,</h3>
            <h4 className='welcome-block user-name'>{ this.getUserName() }</h4>
          </div>
          <div className='content-wrapper'>
            <div className='row'>
              <div className='col-sm-12'>
                <div class="panel panel-info">
                  <div className="panel-heading">Course Progress</div>
                  <div className="panel-body course-progress">
                    <div className="col-sm-12 progress-count-row" ref="courseProgress"></div>
                  </div>
                </div>
              </div>
              <div className='col-sm-12'>
                <LastProjectPanel />
              </div>
              <div className='col-sm-12 bottom-links-row'>
                <button className='btn btn-md btn-primary' onClick={this.props.showProjects}>
                  View Projects
                </button>
                &nbsp;
                &nbsp;
                <a href='#' onClick={this.needHelpDidClick}>Need help?</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  needHelpDidClick() {
    shell.openExternal(`${getApiEndpoint()}/freshdesk/login/${this.getUserToken()}`);
  }

  getCourseProgress() {
    this.showFetching()
    this.fetchCourseProgress().then((response) => {
      this.hideFetching()
      const totalProgress = response[0].data
      const weeklyProgress = response[1].data
      this.loadCourseProgress(totalProgress, weeklyProgress)
    }).catch((e) => {
      if (e.message == 'Commit Live API Failed') {
        this.props.showSessionExpired();
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:log-in-out')
      }
    })
  }

  showFetching() {
    const loader = new LoaderPanel({
      text: 'Calculating your progress...'
    });
    this.refs.courseProgress.appendChild(loader.element)
  }

  hideFetching() {
    for (let i = 0; i < this.refs.courseProgress.children.length; i++) {
      this.refs.courseProgress.children[i].style.display = 'none'
    }
  }

  loadCourseProgress(totalProgress, weeklyProgress) {
    const courseProgress = new CourseProgressPanel({
      completedProjects: totalProgress.assignmentCompleted, 
      totalPointsEarned: totalProgress.score, 
      pointsEarnedThisWeek: weeklyProgress.score,
    });
    this.refs.courseProgress.appendChild(courseProgress.element)
  }

  getUserToken() {
    return localStorage.getItem('commit-live:token')
  }

  getHeader() {
    return new Headers({
      'Authorization': this.getUserToken()
    })
  }

  fetchTotalProgress() {
    const API_ENDPOINT = `${getApiEndpoint()}/user/dashboard/summary`
    return fetch(API_ENDPOINT, { 
      headers: this.getHeader()
    })
  }

  fetchWeeklyProgress() {
    const API_ENDPOINT = `${getApiEndpoint()}/user/dashboard/weekly-summary`
    return fetch(API_ENDPOINT, { 
      headers: this.getHeader()
    })
  }

  fetchCourseProgress() {
    return Promise.all([
      this.fetchTotalProgress(), 
      this.fetchWeeklyProgress(),
    ])
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
