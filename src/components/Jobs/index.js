// src/components/Jobs/index.js

import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsSearch, BsBriefcaseFill, BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({
      profileApiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch('https://apis.ccbp.in/profile', options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        profileApiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      jobsApiStatus: apiStatusConstants.inProgress,
    })

    const {searchInput, employmentType, salaryRange} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const employmentTypes = employmentType.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJobs = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedJobs,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        jobsApiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  clickSearchButton = () => {
    this.getJobs()
  }

  changeEmploymentType = event => {
    const {employmentType} = this.state

    if (employmentType.includes(event.target.value)) {
      const filteredData = employmentType.filter(
        each => each !== event.target.value,
      )

      this.setState(
        {
          employmentType: filteredData,
        },
        this.getJobs,
      )
    } else {
      this.setState(
        prevState => ({
          employmentType: [...prevState.employmentType, event.target.value],
        }),
        this.getJobs,
      )
    }
  }

  changeSalaryRange = event => {
    this.setState(
      {
        salaryRange: event.target.value,
      },
      this.getJobs,
    )
  }

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-card">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />

        <h1>{profileDetails.name}</h1>

        <p>{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <button type="button" className="retry-button" onClick={this.getProfile}>
      Retry
    </button>
  )

  renderProfileSection = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileSuccessView()

      case apiStatusConstants.failure:
        return this.renderProfileFailureView()

      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )

      default:
        return null
    }
  }

  renderJobsSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return (
        <div className="no-jobs-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
            className="no-jobs-image"
          />

          <h1>No Jobs Found</h1>

          <p>We could not find any jobs. Try other filters.</p>
        </div>
      )
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <Link
            to={`/jobs/${eachJob.id}`}
            className="job-link"
            key={eachJob.id}
          >
            <li className="job-card">
              <div className="job-top-section">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />

                <div>
                  <h1 className="job-title">{eachJob.title}</h1>

                  <div className="rating-container">
                    <BsStarFill className="star-icon" />

                    <p>{eachJob.rating}</p>
                  </div>
                </div>
              </div>

              <div className="job-middle-section">
                <div className="location-employment">
                  <div className="icon-text">
                    <MdLocationOn />

                    <p>{eachJob.location}</p>
                  </div>

                  <div className="icon-text">
                    <BsBriefcaseFill />

                    <p>{eachJob.employmentType}</p>
                  </div>
                </div>

                <p>{eachJob.packagePerAnnum}</p>
              </div>

              <hr />

              <h1>Description</h1>

              <p>{eachJob.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  renderJobsFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for.</p>

      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsSection = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsSuccessView()

      case apiStatusConstants.failure:
        return this.renderJobsFailureView()

      case apiStatusConstants.inProgress:
        return (
          <div className="loader-container" data-testid="loader">
            <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
          </div>
        )

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    const {employmentTypesList, salaryRangesList} = this.props

    return (
      <>
        <Header />

        <div className="jobs-page">
          <div className="filters-section">
            {this.renderProfileSection()}

            <hr />

            <h1 className="filter-heading">Type of Employment</h1>

            <ul className="employment-list">
              {employmentTypesList.map(each => (
                <li key={each.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={each.employmentTypeId}
                    value={each.employmentTypeId}
                    onChange={this.changeEmploymentType}
                  />

                  <label htmlFor={each.employmentTypeId}>{each.label}</label>
                </li>
              ))}
            </ul>

            <hr />

            <h1 className="filter-heading">Salary Range</h1>

            <ul className="salary-list">
              {salaryRangesList.map(each => (
                <li key={each.salaryRangeId}>
                  <input
                    type="radio"
                    id={each.salaryRangeId}
                    value={each.salaryRangeId}
                    name="salary"
                    onChange={this.changeSalaryRange}
                  />

                  <label htmlFor={each.salaryRangeId}>{each.label}</label>
                </li>
              ))}
            </ul>
          </div>

          <div className="jobs-section">
            <div className="search-container">
              <input
                type="search"
                value={searchInput}
                onChange={this.changeSearchInput}
                className="search-input"
              />

              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.clickSearchButton}
              >
                <BsSearch />
              </button>
            </div>

            {this.renderJobsSection()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
