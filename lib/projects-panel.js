/** @babel */
/** @jsx etch.dom */

import {CompositeDisposable, TextEditor} from 'atom'
import etch from 'etch'
import _ from 'lodash'
import fetch from './fetch'
import searchFor from './search-in-object'

const classNames = {
  'completed': {
    'tdClass': 'completed',
    'iconClass': 'glyphicon-ok gacomplete-chapt'
  },
  'active': {
    'tdClass': 'current',
    'iconClass': 'glyphicon-adjust gacomplete-chapt'
  }
}

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
      this.focusOnSearch()
      this.showFetchingProjects()
      this.renderProjects()
    })
  }

  destroy () {
    this.subscriptions.dispose()
    return etch.destroy(this)
  }

  update (newProps) {
    this.props = newProps
    return etch.update(this)
  }

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
                  <tbody>
                    {
                      this.props.projects.map((project, i) => {
                        let tdClass = ''
                        let iconClass = 'gacomplete-chapt-incomplete'
                        if (project.userStatus == 'completed' || project.userStatus == 'active') {
                          tdClass = classNames[project.userStatus].tdClass
                          iconClass = classNames[project.userStatus].iconClass
                        }
                        return (
                          <tr key={i}>
                            <td className={ tdClass }>
                              <span
                                class={
                                  `glyphicon gacomplete-chapt ${iconClass}`
                                }
                                aria-hidden="true"
                              />
                            </td>
                            <td>
                              <a href='#' onClick={() => this.startProject(project)}>{ project.name }</a>
                            </td>
                            <td>
                              { project.moduleName }
                            </td>
                            <td>
                              <span className='project-points'>
                                {project.score}/{project.totalScore} Pts
                              </span>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  startProject(project) {
    localStorage.setItem('commit-live:last-opened-project', JSON.stringify(project));
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:connect-to-project')
  }

  filterProjects(searchKey) {
    this.update({
      ...this.props,
      projects: searchFor(this.allProjects, searchKey, ['name', 'moduleName'])
    })
  }

  focusOnSearch() {
    this.refs.searchBox.element.focus()
  }

  showFetchingProjects() {
    this.refs.fetchingProjects.style.display = 'block'
    this.refs.projectsTable.style.display = 'none'
  }

  hideFetchingProjects() {
    this.refs.fetchingProjects.style.display = 'none'
    this.refs.projectsTable.style.display = 'block'
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
      const API_ENDPOINT = `http://api.greyatom.com/v2/user/course/${courseId}/program`
      return fetch(API_ENDPOINT, {
        headers: this.getHeader()
      })
    }
    return false
  }

  renderProjects() {
    this.fetchCourse().then((response) => {
      const listOfProjects = this.retreiveProjectsFromCourse(response.data)
      this.allProjects = listOfProjects
      this.update({
        ...this.props,
        projects: listOfProjects
      })
      this.hideFetchingProjects()
    })
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
