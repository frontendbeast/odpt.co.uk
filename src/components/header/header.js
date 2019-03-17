import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import "./header.scss"
import "./nav.scss"

const Header = ({ siteTitle }) => (
  <header className="c-header">

    <div className="c-header__nav-compact">
      <Link className="c-header__link" to="/">
        <svg viewBox="0 0 138.794 110" className="c-header__logo"><title>Home</title><path d="M59.036 95.682V9.7h23.568q1.035 0 2.07.035c25.7.804 42.88 16.684 42.88 45.186 0 25.969-13.99 41.446-35.846 44.719l.003.002A56.83 56.83 0 0 1 74.787 110h8.91c32.937 0 55.097-20.028 55.097-55.079C138.794 20.184 116.63 0 83.696 0h-35.43v95.631a37.798 37.798 0 0 0 10.77.046z"/><path d="M84.257 100.276c14.181-9.907 23.423-26.648 23.423-45.955 0-16.027-7.192-32.263-18.739-40.068a37.547 37.547 0 0 0-6.337-.438l-8.778.027a.214.214 0 0 0 0 .277c13.82 8.076 23.026 21.743 23.026 40.202 0 24.018-16.507 42.853-37.815 45.51a42.139 42.139 0 0 1-10.77-.043C27.028 96.97 10.829 78.204 10.829 54.321c0-21.569 13.852-38.652 32.73-43.249V1.156C18.618 5.864 0 27.449 0 54.32c0 29.104 20.997 52.384 48.268 55.19a54.27 54.27 0 0 0 5.575.286 52.85 52.85 0 0 0 30.416-9.528z"/></svg>
      </Link>
      {/* <a className="c-header__nav-trigger" href="#trigger:nav">Menu</a> */}
    </div>

    <a className="c-header__anchor" id="trigger:nav"></a> {/* eslint-disable-line */}
    <nav className="c-nav">
      <Link className="c-nav__block c-header__link" to="/">
        <svg viewBox="0 0 138.794 110" className="c-header__logo"><title>Home</title><path d="M59.036 95.682V9.7h23.568q1.035 0 2.07.035c25.7.804 42.88 16.684 42.88 45.186 0 25.969-13.99 41.446-35.846 44.719l.003.002A56.83 56.83 0 0 1 74.787 110h8.91c32.937 0 55.097-20.028 55.097-55.079C138.794 20.184 116.63 0 83.696 0h-35.43v95.631a37.798 37.798 0 0 0 10.77.046z"/><path d="M84.257 100.276c14.181-9.907 23.423-26.648 23.423-45.955 0-16.027-7.192-32.263-18.739-40.068a37.547 37.547 0 0 0-6.337-.438l-8.778.027a.214.214 0 0 0 0 .277c13.82 8.076 23.026 21.743 23.026 40.202 0 24.018-16.507 42.853-37.815 45.51a42.139 42.139 0 0 1-10.77-.043C27.028 96.97 10.829 78.204 10.829 54.321c0-21.569 13.852-38.652 32.73-43.249V1.156C18.618 5.864 0 27.449 0 54.32c0 29.104 20.997 52.384 48.268 55.19a54.27 54.27 0 0 0 5.575.286 52.85 52.85 0 0 0 30.416-9.528z"/></svg>
      </Link>
      {/* <a className="c-header__nav-close c-header__nav-trigger" href="#0">Close</a> */}{/* eslint-disable-line */}
      {/* <ul className="c-nav__block c-nav__list">
        <li className="c-nav__item"><Link className="c-header__link" to="/personal-training">Personal training</Link></li>
        <li className="c-nav__item"><Link className="c-header__link" to="/online-coaching">Online coaching</Link></li>
        <li className="c-nav__item"><Link className="c-header__link" to="/facilites">Facilities</Link></li>
      </ul> */}
      <ul className="c-nav__block c-nav__list">
        {/* <li className="c-nav__item"><Link className="c-header__link" to="/about-oli">About Oli</Link></li>
        <li className="c-nav__item"><Link className="c-header__link" to="/testimonials">Testimonials</Link></li>
        <li className="c-nav__item"><Link className="c-header__link" to="/blog">Blog</Link></li> */}
        <li className="c-nav__item"><Link className="c-header__link c-button" to="/get-in-touch">Get in touch</Link></li>
      </ul>
    </nav>
  </header>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
