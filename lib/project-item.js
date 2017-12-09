/** @babel */
/** @jsx etch.dom */

import etch from 'etch'
import {CompositeDisposable} from 'atom'

const classNames = {
  'completed': {
    'tdClass': 'completed',
    'iconClass': 'glyphicon-ok gacomplete-chapt',
    'tooltipTitle': 'Completed'
  },
  'active': {
    'tdClass': 'current',
    'iconClass': 'glyphicon-adjust gacomplete-chapt',
    'tooltipTitle': 'In-Progress'
  }
}

export default class ProjectItem {
  constructor (props) {
    this.props = props
    this.props.tdClass = ''
    this.props.iconClass = 'gacomplete-chapt-incomplete'
    this.subscriptions = new CompositeDisposable()
    if (props.project.userStatus == 'completed' || props.project.userStatus == 'active') {
      this.props.tdClass = classNames[props.project.userStatus].tdClass
      this.props.iconClass = classNames[props.project.userStatus].iconClass
    }
    etch.initialize(this)
    if (props.project.userStatus && props.project.userStatus != 'locked') {
      this.subscriptions.add(
        atom.tooltips.add(this.refs.status, {
          title: classNames[props.project.userStatus].tooltipTitle,
          placement: 'top'
        })
      );
    }
  }

  destroy () {
    this.subscriptions.dispose()
    return etch.destroy(this)
  }

  update () {}

  render () {
    return (
      <tr>
        <td className={ this.props.tdClass }>
          <span
            ref='status'
            class={
              `glyphicon gacomplete-chapt ${this.props.iconClass}`
            }
            aria-hidden="true"
          />
        </td>
        <td>
          <a href='#' onClick={this.startProject}>
            { this.props.project.name }
          </a>
        </td>
        <td>
          { this.props.project.moduleName }
        </td>
        <td>
          <span className='project-points'>
            {this.props.project.score}/{this.props.project.totalScore} Pts
          </span>
        </td>
      </tr>
    )
  }

  startProject() {
    localStorage.setItem('commit-live:last-opened-project', JSON.stringify(this.props.project));
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'commit-live:connect-to-project')
  }
}
