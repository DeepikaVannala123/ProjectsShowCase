import {Component} from 'react'
import Loader from 'react-loader-spinner'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class Projects extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    projectsList: [],
    activeOptionId: 'ALL',
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    const {activeOptionId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOptionId}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoaderView = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickButton = () => {
    this.getProjectsData()
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="button" onClick={this.onClickButton} type="button">
        Retry
      </button>
    </div>
  )

  renderProjects = () => {
    const {projectsList} = this.state
    return (
      <div className="items-cont">
        <ul className="items-list">
          {projectsList.map(each => (
            <li key={each.id} className="each-item">
              <img src={each.imageUrl} alt={each.name} className="image" />
              <p className="name">{each.name}</p>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderProjectsAllList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProjects()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeOption = event => {
    this.setState({activeOptionId: event.target.value}, this.getProjectsData)
  }

  render() {
    const {activeOptionId} = this.state
    return (
      <>
        <nav className="nav-header">
          <div className="nav-content">
            <img
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </div>
        </nav>
        <div className="container">
          <select
            value={activeOptionId}
            onChange={this.onChangeOption}
            className="select-box"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id} className="option-text">
                {each.displayText}
              </option>
            ))}
          </select>
          <div className="cont">{this.renderProjectsAllList()}</div>
        </div>
      </>
    )
  }
}

export default Projects
