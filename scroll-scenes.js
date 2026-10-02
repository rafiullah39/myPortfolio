// Projects move sideways without consuming the page's vertical scroll.
const projectSection = document.getElementById('projects');
const projectCards = [...projectSection.querySelectorAll('.feature-card, .small-card')];
const projectLabels = ['Daira', 'EduConnect', 'ClientFlow', 'Blood Bank', 'EVM'];
const projectSequence = document.createElement('div');
projectSequence.className = 'project-scenes horizontal-projects';
const projectControls = document.createElement('nav');
projectControls.className = 'scene-controls';
projectControls.setAttribute('aria-label', 'Choose a project');
const projectTrack = document.createElement('div');
projectTrack.className = 'scene-panels project-track';
projectTrack.id = 'project-track';
projectTrack.tabIndex = 0;
projectTrack.setAttribute('role', 'region');
projectTrack.setAttribute('aria-label', 'Project gallery. Swipe sideways or use the project buttons.');
projectSection.insertBefore(projectSequence, projectSection.querySelector('.feature-grid'));
projectSequence.append(projectControls, projectTrack);
const projectReduced = matchMedia('(prefers-reduced-motion: reduce)');
function selectProject(index) {
  const target = projectCards[Math.max(0, Math.min(projectCards.length - 1, index))];
  projectTrack.scrollTo({left:target.offsetLeft - projectCards[0].offsetLeft, behavior:projectReduced.matches ? 'instant' : 'smooth'});
}
const projectTabs = projectCards.map((card, index) => {
  card.classList.remove('reveal');
  card.classList.add('scene-panel');
  card.dataset.projectNumber = String(index + 1).padStart(2, '0');
  projectTrack.append(card);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = `${card.dataset.projectNumber} / ${projectLabels[index]}`;
  button.setAttribute('aria-controls', projectTrack.id);
  button.addEventListener('click', () => selectProject(index));
  projectControls.append(button);
  return button;
});
projectSection.querySelector('.feature-grid').remove();
projectSection.querySelector('.small-grid').remove();
const galleryNavigation = document.createElement('div');
galleryNavigation.className = 'project-gallery-navigation';
const galleryPrevious = document.createElement('button');
const galleryNext = document.createElement('button');
const galleryPosition = document.createElement('span');
const galleryHint = document.createElement('span');
galleryHint.className = 'project-gallery-hint';
galleryHint.textContent = 'Explore sideways ↔ · Scroll down for AI films ↓';
galleryPrevious.type = galleryNext.type = 'button';
galleryPrevious.textContent = '←'; galleryNext.textContent = '→';
galleryPrevious.setAttribute('aria-label', 'Previous project');
galleryNext.setAttribute('aria-label', 'Next project');
galleryPrevious.setAttribute('aria-controls', projectTrack.id);
galleryNext.setAttribute('aria-controls', projectTrack.id);
galleryNavigation.append(galleryHint, galleryPrevious, galleryPosition, galleryNext);
projectSequence.append(galleryNavigation);
let currentProject = 0;
function updateProjectGallery() {
  currentProject = projectCards.reduce((best, card, index) => Math.abs(card.offsetLeft - projectCards[0].offsetLeft - projectTrack.scrollLeft) < Math.abs(projectCards[best].offsetLeft - projectCards[0].offsetLeft - projectTrack.scrollLeft) ? index : best, 0);
  projectTabs.forEach((button,index) => button.setAttribute('aria-current', String(index === currentProject)));
  galleryPosition.textContent = `${String(currentProject + 1).padStart(2,'0')} / 05`;
  galleryPrevious.disabled = currentProject === 0;
  galleryNext.disabled = currentProject === projectCards.length - 1;
  projectSequence.style.setProperty('--scene-progress', `${(currentProject + 1) / projectCards.length * 100}%`);
}
galleryPrevious.addEventListener('click', () => selectProject(currentProject - 1));
galleryNext.addEventListener('click', () => selectProject(currentProject + 1));
projectTrack.addEventListener('scroll', updateProjectGallery, {passive:true});
projectTrack.addEventListener('keydown', event => {
  if (event.target !== projectTrack || !['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault(); selectProject(currentProject + (event.key === 'ArrowRight' ? 1 : -1));
});
addEventListener('resize', updateProjectGallery);
updateProjectGallery();
