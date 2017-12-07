/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class LastProjectPanel {
  constructor (props) {
    this.props = props
    etch.initialize(this)
    process.nextTick(() => this.renderLastProject())
  }

  destroy () {
    return etch.destroy(this)
  }

  renderLastProject() {
    const lastProject = this.getLastProject()
    let nameOfLastProject = 'You seem to be new to Commit Live IDE, click the View Projects button given below to work on your first project!'
    if (lastProject) {
      nameOfLastProject = lastProject.name
    } else {
      this.refs.continueBtn.style.display = 'none'
    }
    this.refs.nameOfProject.textContent = nameOfLastProject;
  }

  getLastProject() {
    const lastProject = localStorage.getItem('commit-live:last-opened-project')
    if (lastProject) {
      return JSON.parse(lastProject)
    }
    return false
  }

  update () {}

  continueBtn() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:connect-to-project')
  }

  render () {
    return (
      <div className='panel panel-info last-viewed'>
        <div className='panel-heading'>Last Project Worked On</div>
        <div className='panel-body'>
          <div className='media'>
            <div className='media-left media-middle'>
              <span className='fa fa-code activity-icon'></span>
            </div>
            <div className='media-body'>
              <div className='activity-title' ref='nameOfProject'></div>
            </div>
          </div>
          <div className='activity-btn' ref='continueBtn' onClick={this.continueBtn}>
            <button className='btn btn-success btn-md'>Continue</button>
          </div>
        </div>
      </div>
    )
  }
}
