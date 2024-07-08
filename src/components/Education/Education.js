import './Education.css';

const Education = ({ education }) => (
  <div className='education'>
    <h2 className='education__title'>EDUCATION</h2>
    {education.map((edu) => (
      <div key={edu.id} className='education__item'>
        <h3 className='education__institution'>{edu.institution}</h3>
        <p className='education__degree'>
          {edu.degree} ({edu.from} - {edu.to})
        </p>
        <p className='education__description'>{edu.description}</p>
      </div>
    ))}
  </div>
);

export default Education;
