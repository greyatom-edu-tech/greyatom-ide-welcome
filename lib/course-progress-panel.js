/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class CourseProgressPanel {
  constructor (props) {
    this.props = props
    etch.initialize(this)
  }

  destroy () {
    return etch.destroy(this)
  }

  update () {}

  render () {
    return (
      <div className='row'>
        <div class="col-sm-3 col-xs-12">
          <div class="count-box assignments-completed">
            <div class="count-no">{ this.props.completedProjects }</div>
            <div class="box-h">Assignments Completed</div>
          </div>
        </div>
        <div class="col-sm-6 col-xs-12">
          <div class="col-sm-7 col-xs-12 center-box">
            <div class="count-box points-earned">
              <div class="count-no">{ this.props.totalPointsEarned }</div>
              <div class="box-h">Total Points Earned</div>
            </div>
          </div>
        </div>
        <div class="col-sm-3 col-xs-12 pull-right">
          <div class="count-box quizzes-completed">
            <div class="count-no">{ this.props.pointsEarnedThisWeek }</div>
            <div class="box-h">Points Earned This Week</div>
          </div>
        </div>
      </div>
    )
  }
}
