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
    more: {
      intro: false,
      training: false
    }
  }

  handleFormSubmit = async event => {
    event.preventDefault();

    const fields = this.state.fields;

    Object.entries(fields).forEach(([field, properties]) => {
      fields[field].touched = true;
      fields[field].blurred = true;
    });

    this.setState({ fields });

    const errors = await document.getElementsByClassName('has-error');
    
    if(errors.length === 0) {
      const data = ["form-name=contact"];
      
      Object.entries(this.state.fields).forEach(([key, props]) => data.push(`${encodeURIComponent(key)}=${encodeURIComponent(props.value)}`));

      this.setState({ success: false });

      fetch('/', {
        body: data.join('&'),
        headers: ({
          "Content-Type": "application/x-www-form-urlencoded",
        }),
        method: 'POST',
      })
        .then(async response => {
          if(response.status === 200) {
            const fields = this.state.fields;

            Object.entries(fields).forEach(([field, properties]) => {
              fields[field].value = "";
              fields[field].touched = false;
              fields[field].blurred = false;
            });

            this.setState({ fields: fields, errors: [], success: true });
          } else {
            this.setState({ errors: [{ message: "Submission failed" }] });
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

  toggleMore(item) {
    const more = this.state.more;
    more[item] = !more[item];

    this.setState({ more });
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
            <p>Professional and effective support for health, training, nutrition and lifestyle. Available for one-to-one direct training, and also remote online support. Offering a comprehensive and personal service, designed to empower you to reach your fitness goals while improving confidence and life skills; and incorporating proven scientific methods to maximise results, and carefully monitor progress.</p>
            <p className={`u-hidden-mobile${this.state.more.intro ? '' : ' is-hidden'}`}>Oli Dickinson Personal Training offers a modern and tested approach to training, from an exclusive and private training studio in Manchester. Extensive training and support packages are also available for online clients worldwide. All training packages include full fitness programming, regular and scientific progress monitoring, nutritional guidance, and continuing support.</p>
            <button className="u-hidden-desktop c-button" onClick={() => this.toggleMore('intro')}>{this.state.more.intro ? 'Less' : 'More'} info</button>
          </div>
          <div className="c-section__fixed" style={{ backgroundImage: `url(${headshot})` }}></div>
        </div>
        <div className="c-section c-section--align-bottom c-section--bg o-grid o-grid--two-column" style={{ backgroundImage: `url(${coaching})` }}>
          <div className="c-section__content">
            <h2>Train to Meet your Goals</h2>
            <p>Working from a private studio in Manchester, you will have the freedom to train at a time to suit your lifestyle, and in an environment designed to maximise your potential. With a broad range of resistance machines, free weights, cardiovascular and plyometric equipment, the training studio is fully equipped to meet whatever fitness goals you wish to pursue. With the help of experienced and qualified fitness programming and monitoring, you will be guided to appreciate your capacity and potential to live a healthier and happier life.</p>
            <p className={`u-hidden-mobile${this.state.more.training ? '' : ' is-hidden'}`}>Online clients will also benefit from regular and direct contact via Skype or Facetime to address any issues in their fitness journey, to closely monitor progress, and to encourage a lifestyle centred on personal health and wellbeing.</p>
            <button className="u-hidden-desktop c-button" onClick={() => this.toggleMore('training')}>{this.state.more.training ? 'Less' : 'More'} info</button>
            {/* <Link className="c-button" to="/personal-training">Personal training</Link> */}
          </div>
        </div>
        <div className="c-section o-grid o-grid--two-column o-grid--three-row u-bg--grey-darker">
          <div className="c-section__content">
            <h2>Personal Training</h2>
            <p>Get in touch today to arrange a consultation at your convenience. I look forward to hearing from you and working with you to pursue your health, fitness and wellbeing goals.</p>
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
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">4 weeks <strong className="c-pricing__price">&pound;360</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">8 weeks <strong className="c-pricing__price">&pound;685</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">12 weeks <strong className="c-pricing__price">&pound;985</strong></li>
                </ul>
              </div>
              <div className="o-grid__item c-pricing">
                <h3 className="c-pricing__header">Silver package</h3>
                <ul className="c-pricing__list">
                  <li className="c-pricing__info c-pricing__info--highlight">3 sessions per week</li>
                  <li className="c-pricing__info">Full Periodized Fitness Programming</li>
                  <li className="c-pricing__info">Body Analysis and Biometric Monitoring</li>
                  <li className="c-pricing__info">Nutritional Analysis and Guidance</li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">4 weeks <strong className="c-pricing__price">&pound;540</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">8 weeks <strong className="c-pricing__price">&pound;1030</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">12 weeks <strong className="c-pricing__price">&pound;1475</strong></li>
                </ul>
              </div>
              <div className="o-grid__item c-pricing">
                <h3 className="c-pricing__header">Gold package</h3>
                <ul className="c-pricing__list">
                  <li className="c-pricing__info c-pricing__info--highlight">4 sessions per week</li>
                  <li className="c-pricing__info">Full Periodized Fitness Programming</li>
                  <li className="c-pricing__info">Body Analysis and Biometric Monitoring</li>
                  <li className="c-pricing__info">Nutritional Analysis and Guidance</li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">4 weeks <strong className="c-pricing__price">&pound;720</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">8 weeks <strong className="c-pricing__price">&pound;1375</strong></li>
                  <li className="c-pricing__info c-pricing__info--highlight c-pricing__info--plan">12 weeks <strong className="c-pricing__price">&pound;1970</strong></li>
                </ul>
              </div>
              <div className="o-grid__item c-pricing">
                <h3 className="c-pricing__header">Online training</h3>
                <ul className="c-pricing__list">
                  <li className="c-pricing__info c-pricing__info--highlight">Weekly 30 minute consultation via Skype / Facetime</li>
                  <li className="c-pricing__info">Full Periodized Fitness Programming</li>
                  <li className="c-pricing__info">Body Analysis and Biometric Monitoring</li>
                  <li className="c-pricing__info">Nutritional Analysis and Guidance</li>
                  <li className="c-pricing__info">Email support</li>
                  <li className="c-pricing__info c-pricing__info--highlight">12 weeks <strong className="c-pricing__price">&pound;500</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="c-section o-grid o-grid--two-column u-bg--grey-darkest">
          <div className="c-section__content">
            <h2>Get in touch</h2>
            <p>Get in touch today to arrange a consultation at your convenience. I look forward to hearing from you and working with you to pursue your health, fitness and wellbeing goals. </p>
          </div>
          <div className="c-section__content">
          <form method="post" action="/" name="contact form" data-netlify="true" netlify-honeypot="website" hidden>
            <input name="name" />
            <input name="email" />
            <input name="phone" />
            <textarea name="message"></textarea>
          </form>
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
