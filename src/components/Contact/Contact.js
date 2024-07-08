import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_ikmtphn', 'template_9fifg5l', e.target, 'NPAL5UbfX1BVraceP')
      .then((result) => {
        console.log(result.text);
        setSuccessMessage('Message sent successfully!');
      }, (error) => {
        console.log(error.text);
        setSuccessMessage('Failed to send the message. Please try again later.');
      });

    setFormData({
      email: '',
      message: ''
    });
  };

  return (
    <section className='section contact center' id='contact'>
      <h2 className='section__title'>Contact</h2>
      <form className='contact__form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email-input'>Email
            <input
              type='email'
              id='email-input'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label htmlFor='message-input'>Message
            <textarea
              id='message-input'
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type='submit' className='btn btn--outline'>Send Message</button>
        {successMessage && <p className='success-message'>{successMessage}</p>}
      </form>
    </section>
  );
};

export default Contact;
