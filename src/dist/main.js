"use strict";
async function loadResumeData() {
    const response = await fetch('data.json');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}
function populateHTML(data) {
    const nameEl = document.getElementById('name');
    const titleEl = document.getElementById('title');
    const aboutEl = document.getElementById('about');
    if (nameEl)
        nameEl.textContent = data.name;
    if (titleEl)
        titleEl.textContent = data.title;
    if (aboutEl)
        aboutEl.textContent = data.about;
    // Populate skills
    const skillsContainer = document.getElementById('skills-container');
    if (skillsContainer) {
        for (const [category, skills] of Object.entries(data.skills)) {
            const skillCategory = document.createElement('div');
            skillCategory.className = 'skill-category';
            skillCategory.innerHTML = `
        <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
        <ul>
          ${skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
      `;
            skillsContainer.appendChild(skillCategory);
        }
    }
    // Populate projects
    const projectsContainer = document.getElementById('projects-container');
    if (projectsContainer) {
        data.projects.forEach(project => {
            const projectElement = document.createElement('article');
            projectElement.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.date}</p>
        <p>${project.description}</p>
      `;
            projectsContainer.appendChild(projectElement);
        });
    }
    // Populate experience
    const experienceContainer = document.getElementById('experience-container');
    if (experienceContainer) {
        data.experience.forEach(exp => {
            const expElement = document.createElement('article');
            expElement.innerHTML = `
        <h3>${exp.title}</h3>
        <p>${exp.company} | ${exp.period}</p>
        <p>${exp.description}</p>
      `;
            experienceContainer.appendChild(expElement);
        });
    }
    // Populate education
    const educationContainer = document.getElementById('education-container');
    if (educationContainer) {
        data.education.forEach(edu => {
            const eduElement = document.createElement('article');
            eduElement.innerHTML = `
        <h3>${edu.degree}</h3>
        <p>${edu.institution} | ${edu.year}</p>
      `;
            educationContainer.appendChild(eduElement);
        });
    }
    // Populate contact
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const linkedinEl = document.getElementById('linkedin');
    const githubEl = document.getElementById('github');
    if (emailEl)
        emailEl.textContent = data.contact.email;
    if (phoneEl)
        phoneEl.textContent = data.contact.phone;
    if (linkedinEl)
        linkedinEl.href = data.contact.linkedin;
    if (githubEl)
        githubEl.href = data.contact.github;
}
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const data = await loadResumeData();
        populateHTML(data);
    }
    catch (error) {
        console.error('Error loading resume data:', error);
    }
});
