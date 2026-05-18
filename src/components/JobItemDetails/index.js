import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {FaStar, FaExternalLinkAlt, FaSuitcase} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {
      match: {
        params: {id},
      },
    } = this.props

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        skills: data.job_details.skills,
        lifeAtCompany: data.job_details.life_at_company,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {jobDetails, similarJobs} = this.state

    return (
      <div className="job-details-container">
        <div className="job-card-details">
          {/* TOP SECTION */}

          <div className="top-section">
            <img
              src={jobDetails.companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />

            <div>
              <h1 className="job-title">{jobDetails.title}</h1>

              <div className="rating-container">
                <FaStar className="star-icon" />

                <p>{jobDetails.rating}</p>
              </div>
            </div>
          </div>

          {/* MIDDLE */}

          <div className="middle-section">
            <div className="location-employment">
              <div className="icon-text">
                <MdLocationOn />

                <p>{jobDetails.location}</p>
              </div>

              <div className="icon-text">
                <FaSuitcase />

                <p>{jobDetails.employmentType}</p>
              </div>
            </div>

            <p className="package">{jobDetails.packagePerAnnum}</p>
          </div>

          <hr />

          {/* DESCRIPTION */}

          <div className="description-header">
            <h1>Description</h1>

            <a
              href={jobDetails.companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit
              <FaExternalLinkAlt />
            </a>
          </div>

          <p className="description-text">{jobDetails.jobDescription}</p>

          {/* SKILLS */}

          <h1 className="skills-heading">Skills</h1>

          <ul className="skills-list">
            {jobDetails.skills.map(eachSkill => (
              <li key={eachSkill.name} className="skill-item">
                <img
                  src={eachSkill.image_url}
                  alt={eachSkill.name}
                  className="skill-image"
                />

                <p>{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          {/* LIFE */}

          <h1 className="life-heading">Life at Company</h1>

          <div className="life-container">
            <p className="life-description">
              {jobDetails.lifeAtCompany.description}
            </p>

            <img
              src={jobDetails.lifeAtCompany.image_url}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>

        {/* SIMILAR JOBS */}

        <h1 className="similar-heading">Similar Jobs</h1>

        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <li key={eachJob.id} className="similar-job-card">
              <div className="top-section">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />

                <div>
                  <h1 className="job-title">{eachJob.title}</h1>

                  <div className="rating-container">
                    <FaStar className="star-icon" />

                    <p>{eachJob.rating}</p>
                  </div>
                </div>
              </div>

              <h1>Description</h1>

              <p className="description-text">{eachJob.jobDescription}</p>

              <div className="location-employment">
                <div className="icon-text">
                  <MdLocationOn />

                  <p>{eachJob.location}</p>
                </div>

                <div className="icon-text">
                  <FaSuitcase />

                  <p>{eachJob.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />

      <h1>Oops! Something Went Wrong</h1>

      <p>We cannot seem to find the page you are looking for.</p>

      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

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
    return (
      <>
        <Header />

        <div className="job-details-page">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
