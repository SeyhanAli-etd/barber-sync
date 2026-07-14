import React from 'react';
import './WorkingHoursDisplay.css';

const dayTranslations = {
  monday: 'Pazartesi',
  tuesday: 'Salı',
  wednesday: 'Çarşamba',
  thursday: 'Perşembe',
  friday: 'Cuma',
  saturday: 'Cumartesi',
  sunday: 'Pazar',
};

const WorkingHoursDisplay = ({ workingHours }) => {
  if (!workingHours) {
    return <p>Çalışma saatleri belirtilmemiş.</p>;
  }

  const today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

  return (
    <div className="working-hours-container">
      <h4>Çalışma Saatleri</h4>
      <ul>
        {Object.entries(workingHours).map(([day, hours]) => (
          <li key={day} className={day === today ? 'today' : ''}>
            <span className="day-name">{dayTranslations[day]}</span>
            <span className="hours">{hours.toLowerCase() === 'closed' ? 'Kapalı' : hours}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkingHoursDisplay;