import './calendarPage.css';
import React, { useState, useEffect } from 'react';
import onTrackLogo from './onTrackLogo.png';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
import Main from './MainPage.js';
import Home from './HomePage.js';
import RegisterPage from './Registration.js';
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
              <ul>
                <li><a href="/calendarpage">Calendar View</a></li>
                <li><a href=" ">List View</a></li>
              </ul>
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

