'use strict';

// ===== Валідатори через замикання / каррінг =====
function createValidator(type) {
  return function (value) {
    if (type === 'string') return value.trim().length > 0;
    if (type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (type === 'list') return value.trim().length > 0;
    return false;
  };
}

const validate = {
  name: createValidator('string'),
  email: createValidator('email'),
  education: createValidator('string'),
  experience: createValidator('string'),
  skills: createValidator('list')
};

// ===== OOP-класи =====

class Section {
  constructor(text) {
    this.text = text;
  }

  get content() {
    return this.text;
  }

  set content(value) {
    this.text = value;
  }
}

class Experience extends Section {}
class Education extends Section {}

class Skills {
  constructor(list) {
    this.skills = list.split(',').map(s => s.trim());
  }

  get allSkills() {
    return this.skills;
  }

  set addSkill(skill) {
    this.skills.push(skill);
  }
}

class PersonalInfo {
  constructor(name, email) {
    this._name = name;
    this._email = email;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get email() {
    return this._email;
  }

  set email(value) {
    this._email = value;
  }
}

class Resume {
  constructor(personalInfo, education, experience, skills) {
    this.personalInfo = personalInfo;
    this.education = education;
    this.experience = experience;
    this.skills = skills;
  }

  get fullName() {
    return this.personalInfo.name;
  }

  set fullName(newName) {
    this.personalInfo.name = newName;
  }

  render() {
    return `
      <h2>${this.fullName}</h2>
      <p><strong>Email:</strong> ${this.personalInfo.email}</p>
      <p><strong>Освіта:</strong> ${this.education.content}</p>
      <p><strong>Досвід:</strong> ${this.experience.content}</p>
      <p><strong>Навички:</strong> ${this.skills.allSkills.join(', ')}</p>
    `;
  }
}

// ===== Основна логіка =====

document.getElementById('generate-btn').addEventListener('click', () => {
  const ask = (message, type) => {
    let value;
    do {
      value = prompt(message);
    } while (!validate[type](value));
    return value;
  };

  const name = ask("Введіть своє ім'я:", 'name');
  const email = ask("Введіть свій email:", 'email');
  const education = ask("Опишіть свою освіту:", 'education');
  const experience = ask("Опишіть досвід роботи:", 'experience');
  const skills = ask("Введіть навички через кому:", 'skills');

  // Створення об'єктів
  const personalInfo = new PersonalInfo(name, email);
  const educationObj = new Education(education);
  const experienceObj = new Experience(experience);
  const skillsObj = new Skills(skills);
  const resume = new Resume(personalInfo, educationObj, experienceObj, skillsObj);

  // Відображення
  document.getElementById('resume-output').innerHTML = resume.render();

  // Збереження
  localStorage.setItem('resume', JSON.stringify({
    name, email, education, experience, skills
  }));
});

// Завантаження з localStorage
window.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('resume'));
  if (data) {
    const personalInfo = new PersonalInfo(data.name, data.email);
    const educationObj = new Education(data.education);
    const experienceObj = new Experience(data.experience);
    const skillsObj = new Skills(data.skills);
    const resume = new Resume(personalInfo, educationObj, experienceObj, skillsObj);
    document.getElementById('resume-output').innerHTML = resume.render();
  }
});
