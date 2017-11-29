/** @babel */
/** @jsx etch.dom */

import etch from 'etch'

export default class LoaderPanel {
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
      <div className="cl-loader" >
        <div className="cl-top" />
        <div className="cl-main-wrapper">
          <div className="cl-loading cl-line1" />
          <div className="cl-loading cl-line2" />
          <div className="cl-loading cl-line3" />
        </div>
        <div className="text">
          { this.props.text }
        </div>
      </div>
    )
  }
}
