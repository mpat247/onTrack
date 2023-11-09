import React, { useEffect } from 'react';
import './calendarPage.css'; // Ensure you have corresponding CSS

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Dummy task data
const tasks = [
  { name: "Task 1", date: "2023-11-15" },
  { name: "Task 2", date: "2023-11-30" },
  { name: "Task 3", date: "2023-11-25" }];

function CalendarPage() {
  useEffect(() => {
    const daysContainer = document.querySelector(".days");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const monthElement = document.querySelector(".month");
    const todayBtn = document.querySelector(".today-btn");

    const date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    const renderCalendar = () => {
      date.setDate(1);
      const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
      const prevLastDay = new Date(currentYear, currentMonth, 0);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const nextDays = 7 - lastDay.getDay() - 1;
      
      monthElement.textContent = `${months[currentMonth]} ${currentYear}`;
      
      let daysHTML = "";
      
      for (let x = firstDayIndex; x > 0; x--) {
        daysHTML += `<div class="day prev-day">${prevLastDay.getDate() - x + 1}</div>`;
      }
      
       for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const task = tasks.find(task => task.date === fullDate);
    let taskHTML = '';

    if (task) {
      taskHTML = `
        <div class="task-card">
          <div class="task-details">
            <span class="task-name"><strong>${task.name}</strong></span>
            <span class="task-date"><em>${task.date}</em></span>
          </div>
        </div>`;
    }
    
    if (i === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) {
      daysHTML += `<div class="day today">${i}${taskHTML}</div>`;
    } else {
      daysHTML += `<div class="day">${i}${taskHTML}</div>`;
    }
  }
      
      for (let j = 1; j <= nextDays; j++) {
        daysHTML += `<div class="day next-day">${j}</div>`;
      }
      
      daysContainer.innerHTML = daysHTML;
      hideTodayBtn();
    };

    const hideTodayBtn = () => {
      todayBtn.style.display = (currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()) ? 'none' : 'flex';
    };

    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
    
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
    
    todayBtn.addEventListener('click', () => {
      currentMonth = new Date().getMonth();
      currentYear = new Date().getFullYear();
      renderCalendar();
    });

    renderCalendar();
  }, []);

  return (
    <div>
      <header>
        {/* Your header here */}
      </header>
      <div className="container">
        <div className="calendar">
          <div className="header">
            <div className="month">November, 2023</div>
            <div className="btns">
              <div className="btn today-btn"><i className="fas fa-calendar-day"></i>Today</div>
              <div className="btn prev-btn"><i className="fas fa-chevron-left"></i>Prev</div>
              <div className="btn next-btn"><i className="fas fa-chevron-right"></i>Next</div>
            </div>
          </div>
          <div className="weekdays">
            {daysShort.map(day => <div key={day} className="weekday">{day}</div>)}
          </div>
          <div className="days">
            {/* Days will be rendered here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
