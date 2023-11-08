import './calendarPage.css';
import React, { useState, useEffect } from 'react';
import onTrackLogo from './onTrackLogo.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
const api = "http://localhost:5001"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


function CalendarPage() {
  useEffect(() => {
    const daysContainer = document.querySelector(".days");
    const nextBtn = document.querySelector(".next-btn");
    const prevBtn = document.querySelector(".prev-btn");
    const month = document.querySelector(".month");
    const todayBtn = document.querySelector(".today-btn");

    const date = new Date();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();

    function renderCalendar() {
      date.setDate(1);
      const firstDay = new Date(currentYear, currentMonth, 1);
      const lastDay = new Date(currentYear, currentMonth + 1, 0);
      const lastDayIndex = lastDay.getDay();
      const lastDayDate = lastDay.getDate();
      const prevLastDay = new Date(currentYear, currentMonth, 0);
      const prevLastDayDate = prevLastDay.getDate();
      const nextDays = 7 - lastDayIndex - 1;
    
      month.innerHTML = `${months[currentMonth]} ${currentYear}`;
    
      let days = "";
    
      for (let x = firstDay.getDay(); x > 0; x--) {
        days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
      }
    
      for (let i = 1; i <= lastDayDate; i++) {
        if (
          i === new Date().getDate() &&
          currentMonth === new Date().getMonth() &&
          currentYear === new Date().getFullYear()
        ) {
          days += `<div class="day today">${i}</div>`;
        } else {
          days += `<div class="day ">${i}</div>`;
        }
      }
    
      for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next">${j}</div>`;
      }
    
      hideTodayBtn();
      daysContainer.innerHTML = days;
    }

    function hideTodayBtn() {
      if (
        currentMonth === new Date().getMonth() &&
        currentYear === new Date().getFullYear()
      ) {
        todayBtn.style.display = "none";
      } else {
        todayBtn.style.display = "flex";
      }
    }

    nextBtn.addEventListener("click", () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
    
    prevBtn.addEventListener("click", () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
    
    todayBtn.addEventListener("click", () => {
      currentMonth = date.getMonth();
      currentYear = date.getFullYear();
      renderCalendar();
    });

    renderCalendar();
  },[]);

  return (
    <body>
      <title>Calendar</title>
            <header>
                <div class="wave-header">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path 
                fill="#79addc" fill-opacity="1" d="M0,320L60,304C120,288,240,256,360,229.3C480,203,600,181,720,176C840,171,960,181,1080,181.3C1200,181,1320,171,1380,165.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>
                </div>
                <div id='logo-container'> 
                <img src={onTrackLogo} id='logo' alt="Logo" />
                <div id='title'>onTrack</div>
                </div>
            </header>
      <div class="container">
        <div class="calendar">
          <div class="header">
            <div class="month">November, 2023</div>
              <div class="btns">
                <div class="btn today-btn">
                  <i class="fas fa-calendar-day"></i>
                </div>
                <div class="btn prev-btn">
                  <i class="fas fa-chevron-left"></i>
                </div>
                <div class="btn next-btn">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          <div class="weekdays">
            <div class="day">Sun</div>
            <div class="day">Mon</div>
            <div class="day">Tue</div>
            <div class="day">Wed</div>
            <div class="day">Thu</div>
            <div class="day">Fri</div>
            <div class="day">Sat</div>
          </div>
          <div class="days"> 
          </div>
        </div>
      </div>
    </body>
    
  );
}
export default CalendarPage;

