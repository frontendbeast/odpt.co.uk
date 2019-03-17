import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import LogoText from "../components/logo/logo-text"
import SEO from "../components/seo"

import coaching from "../images/coaching.jpg"
import headshot from "../images/headshot.jpg"

import "../sass/index.scss"

class IndexPage extends React.Component {
  state = {
    fields: {
      name: {
        blurred: false,
        touched: false,
        value: "",
      },
      email: {
        blurred: false,
        touched: false,
        value: "",
      },
      phone: {
        blurred: false,
        touched: false,
        value: "",
      },
      message: {
        blurred: false,
        touched: false,
        value: "",
      },
      website: {
        blurred: false,
        touched: false,
        value: "",
      }
    },
    errors: [],
    success: false,
  }

  handleFormSubmit = event => {
    event.preventDefault();

    const fields = this.state.fields;

    Object.entries(fields).forEach(([field, properties]) => {
      fields[field].touched = true;
      fields[field].blurred = true;
    });

    this.setState({ fields });
    
    if(document.getElementsByClassName('has-error').length === 0) {
      const data = {};

      Object.entries(this.state.fields).forEach(([key, props]) => data[key] = props.value);

      this.setState({ success: false });

      fetch('/send.php', {
        body: JSON.stringify(data),
        method: 'POST'
      })
        .then(async response => {

          if(response.status === 202) {
            const fields = this.state.fields;

            Object.entries(fields).forEach(([field, properties]) => {
              fields[field].value = "";
              fields[field].touched = false;
              fields[field].blurred = false;
            });

            this.setState({ fields: fields, errors: [], success: true });
          } else {
            const result = await response.json();
            this.setState({ errors: result.errors });
          }
        })
        .catch(response => console.error(response))
    }

  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    const fields = this.state.fields;

    if(event.type === "change") {
      fields[name].touched = true;
    }

    if(event.type === "blur") {
      fields[name].blurred = true;
    }

    fields[name].value = value;

    this.setState({ fields: fields });
  }

  hasError(name) {
    switch (name) {
      case 'name': 
        return this.isRequiredError('name');
      case 'email': 
        return this.isValidError('email', 'email');
      case 'phone': 
        return this.isValidError('phone', 'phone');
      case 'message':
        return this.isRequiredError('message');
      case 'contact':
        return (this.isBlurred('email') && this.isEmpty('email') && this.isBlurred('phone') && this.isEmpty('phone'));
      default: 
        return false;
    }
  }

  isBlurred(name) {
    return this.state.fields[name].blurred;
  }

  isEmpty(name) {
    return this.state.fields[name].value === "";
  }

  isRequiredError(name) {
    return this.isEmpty(name) && this.isTouched(name);
  }

  isTouched(name) {
    return this.state.fields[name].touched;
  }

  isValid(name, type) {
    const value = this.state.fields[name].value;

    switch (type) {
      case 'email':
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value); {/* eslint-disable-line */}
      case 'phone': 
        return /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|#)\d{3,4})?$/.test(value);
      default:
        return true;
    }
  }

  isValidError(name, type) {
    return !this.isEmpty(name) && this.isBlurred(name) && !this.isValid(name, type);
  }

  renderErrors() {
    const prefix = (this.state.errors.length===1) ? 'was an error' : 'were errors';
    return `<p>There ${prefix} submitting the form: </p><ul>${this.state.errors.map(error => `<li>${error.message}</li>`)}</ul>`; 
  }

  render() {
    return (
      <Layout>
        <SEO title="ODPT" keywords={[`gatsby`, `application`, `react`]} />
        <div className="c-section c-section--align-bottom c-section--bg o-grid o-grid--two-column">
          <div className="c-section__content">
            <LogoText />
            <p>Improve your Health and Wellbeing</p>
            <p>Professional fitness, nutrition and lifestyle training. Based in Manchester, UK. Online support available worldwide.</p>
          </div>
          <div className="c-section__fixed" style={{ backgroundImage: `url(${headshot})` }}></div>
        </div>
        <div className="c-section c-section--align-bottom c-section--bg o-grid o-grid--two-column" style={{ backgroundImage: `url(${coaching})` }}>
          <div className="c-section__content">
            <h2 className="c-section__heading">Train to Meet your Goals</h2>
            <p>Personalised and individual training and diet programs to meet your goals. Full and regular biometric analysis. Constant support to promote positive lifestyle changes.</p>
            {/* <Link className="c-button" to="/personal-training">Personal training</Link> */}
          </div>
        </div>
        <div className="c-section o-grid o-grid--two-column o-grid--two-row u-bg--grey-darker">
          <div className="c-section__content">
            <h2 className="c-section__heading">Personal Training</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
          </div>
          <div className="c-section__content o-grid__item--full">
            <div className="o-grid o-grid--three-column">
              <div className="o-grid__item c-pricing">
                <h3 className="c-pricing__header">Bronze package</h3>
                <ul className="c-pricing__list">
                  <li className="c-pricing__info c-pricing__info--highlight">2 sessions per week</li>
                  <li className="c-pricing__info">Full Periodized Fitness Programming</li>
                  <li className="c-pricing__info">Body Analysis and Biometric Monitoring</li>
                  <li className="c-pricing__info">Nutritional Analysis and Guidance</li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">4 weeks <strong>&pound;360</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">8 weeks <strong>&pound;685</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">12 weeks <strong>&pound;985</strong></li>
                </ul>
              </div>
              <div className="o-grid__item c-pricing">
                <h3 className="c-pricing__header">Silver package</h3>
                <ul className="c-pricing__list">
                  <li className="c-pricing__info c-pricing__info--highlight">3 sessions per week</li>
                  <li className="c-pricing__info">Full Periodized Fitness Programming</li>
                  <li className="c-pricing__info">Body Analysis and Biometric Monitoring</li>
                  <li className="c-pricing__info">Nutritional Analysis and Guidance</li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">4 weeks <strong>&pound;540</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">8 weeks <strong>&pound;1030</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">12 weeks <strong>&pound;1475</strong></li>
                </ul>
              </div>
              <div className="o-grid__item c-pricing">
                <h3 className="c-pricing__header">Gold package</h3>
                <ul className="c-pricing__list">
                  <li className="c-pricing__info c-pricing__info--highlight">4 sessions per week</li>
                  <li className="c-pricing__info">Full Periodized Fitness Programming</li>
                  <li className="c-pricing__info">Body Analysis and Biometric Monitoring</li>
                  <li className="c-pricing__info">Nutritional Analysis and Guidance</li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">4 weeks <strong>&pound;720</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">8 weeks <strong>&pound;1375</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--price">12 weeks <strong>&pound;1970</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="c-section o-grid o-grid--two-column u-bg--grey-darkest">
          <div className="c-section__content">
            <h2 className="c-section__heading">Get in touch</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. </p>
          </div>
          <div className="c-section__content">
            <form className="c-form" method="post" onSubmit={this.handleFormSubmit}>
              <div className="c-form__field-group">
                <div className={`c-form__field--full${this.hasError('name') ? ' has-error' : ''}`}>
                  <label htmlFor="name">Name { this.hasError('name') && <span>is required</span> }</label>
                  <input name="name" id="name" onChange={this.handleInputChange} onBlur={this.handleInputChange} value={this.state.fields.name.value} />
                </div>
              </div>
              <div className="c-form__field-group">
                <div className={`c-form__field--full${this.hasError('email') || this.hasError('contact') ? ' has-error' : ''}`}>
                  <label htmlFor="email">Email { this.hasError('email') && <span>is not valid</span> } { this.hasError('contact') && <span> or phone required</span> }</label>
                  <input name="email" id="email" type="email" onChange={this.handleInputChange} onBlur={this.handleInputChange} value={this.state.fields.email.value} />
                </div>
                <div className={`c-form__field--full${this.hasError('phone') || this.hasError('contact') ? ' has-error' : ''}`}>
                  <label htmlFor="phone">Phone { this.hasError('phone') && <span>is not valid</span> }</label>
                  <input name="phone" id="phone" type="tel" onChange={this.handleInputChange} onBlur={this.handleInputChange} value={this.state.fields.phone.value} />
                </div>
              </div>
              <div className={`c-form__field--full${this.hasError('message') ? ' has-error' : ''}`}>
                <label htmlFor="message">Message { this.hasError('message') && <span>is required</span> }</label>
                <textarea name="message" id="message" onChange={this.handleInputChange} onBlur={this.handleInputChange} value={this.state.fields.message.value}></textarea>
              </div>
              <div className="c-form__field--trap">
                <input name="website" onChange={this.handleInputChange} onBlur={this.handleInputChange} value={this.state.fields.website.value} tabIndex="-1" autoComplete="off" aria-hidden="true" />
              </div>
              <div className="c-form__button-group">
                { this.state.errors.length > 0 && <div className="c-form__error"><p>There { this.state.errors.length > 1 ? "were errors" : "was an error" } submitting the form:</p><ul>{ this.state.errors.map((error, i) => (<li key={`error-${i}`}>{ error.message }</li>)) }</ul></div> }
                { this.state.success && <p>Thanks for getting in touch, Oli will get back to you soon.</p> }
                <button type="submit" className="c-button">Send</button>
              </div>
            </form>
          </div>
        </div>
      </Layout>
    )
  }
}

export default IndexPage
