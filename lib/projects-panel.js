/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable, TextEditor} from 'atom'
import etch from 'etch'
import _ from 'lodash'
import fetch from './fetch'
import searchFor from './search-in-object'
import ProjectItem from './project-item'
import {getApiEndpoint} from './util'

export default class ProjectsPanel {
  constructor (props) {
    this.props = props;
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
    this.subscriptions.add(this.refs.searchBox.onDidStopChanging(() => {
      this.filterProjects(this.refs.searchBox.getText())
    }))
    process.nextTick(() => {
      this.getProjects()
    })
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
                  <TextEditor
                    mini={true}
                    ref='searchBox'
                    placeholderText='Search Projects/Modules'
                  />
                </div>
                <h4 ref="fetchingProjects">Fetching Projects...</h4>
                <table className='table' ref="projectsTable">
                  <thead>
                    <tr>
                      <th width='5%'>Status</th>
                      <th width='50%'>Project Name</th>
                      <th width='18%'>Module</th>
                      <th width='10%'>Points</th>
                    </tr>
                  </thead>
                  <tbody ref='projectsTableBody'></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  filterProjects(searchKey) {
    this.renderProjects(searchFor(this.allProjects, searchKey, ['name', 'moduleName']))
  }

  focusOnSearch() {
    this.refs.searchBox.element.focus()
  }

  showFetchingProjects() {
    this.refs.fetchingProjects.style.display = 'block'
    this.refs.projectsTable.style.display = 'none'
    this.refs.searchBox.element.style.display = 'none'
  }

  hideFetchingProjects() {
    this.refs.fetchingProjects.style.display = 'none'
    this.refs.projectsTable.style.display = 'block'
    this.refs.searchBox.element.style.display = 'block'
    this.focusOnSearch()
  }

  getUserToken() {
    return localStorage.getItem('commit-live:token')
  }

  getCourseId() {
    const storedUserInfo = localStorage.getItem('commit-live:user-info');
    if (storedUserInfo) {
      return JSON.parse(storedUserInfo).courseId
    }
    return false
  }

  getHeader() {
    return new Headers({
      'Authorization': this.getUserToken()
    })
  }

  sortByOrder(arrayOfObjects) {
    return _.sortBy(arrayOfObjects, ['order'])
  }

  retreiveProjectsFromCourse(course) {
    const listOfProjects = []
    this.sortByOrder(course.modules).forEach(
      module => this.sortByOrder(module.sections).forEach(
        section => this.sortByOrder(section.submodules).forEach(
          (submodule) => {
            if (submodule.isProject == 1) {
              listOfProjects.push({
                ...submodule,
                moduleName: module.name
              })
            }
          }
        )
      )
    )
    return listOfProjects;
  }

  fetchCourse() {
    const courseId = this.getCourseId()
    if (courseId) {
      const API_ENDPOINT = `${getApiEndpoint()}/user/course/${courseId}/program`
      return fetch(API_ENDPOINT, {
        headers: this.getHeader()
      })
    }
    return false
  }

  getProjects() {
    this.showFetchingProjects()
    this.fetchCourse().then((response) => {
      const listOfProjects = this.retreiveProjectsFromCourse(response.data)
      this.allProjects = listOfProjects
      this.renderProjects(this.allProjects)
      this.hideFetchingProjects()
    }).catch((e) => {
      if (e.message == 'Commit Live API Failed') {
        this.props.showSessionExpired();
        atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:log-in-out')
      }
    })
  }

  renderProjects(listOfProjects) {
    this.refs.projectsTableBody.innerHTML = '';
    listOfProjects.forEach((project, i) => {
      const pRow = new ProjectItem({
        project,
      })
      this.refs.projectsTableBody.appendChild(pRow.element)
    });
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
