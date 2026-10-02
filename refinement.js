// Scrolling back reverses the entrance along the same path.
const entranceItems = [...document.querySelectorAll('.entrance')];
const entranceMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateEntrances() {
  entranceItems.forEach(item => {
    item.classList.toggle('scroll-entry', !entranceMotion.matches);
    const top = item.closest('section').getBoundingClientRect().top;
    const raw = Math.max(0, Math.min(1, (innerHeight * .92 - top) / (innerHeight * 1.12)));
    const progress = raw * raw * (3 - 2 * raw);
    const direction = item.classList.contains('entrance-left') ? -1 : item.classList.contains('entrance-right') ? 1 : 0;
    item.style.setProperty('--entry-x', `${direction * (1 - progress) * Math.min(180, innerWidth * .18)}px`);
    item.style.setProperty('--entry-y', `${(1 - progress) * 45}px`);
    item.style.setProperty('--entry-opacity', Math.min(1, progress * 1.65));
    item.style.setProperty('--entry-blur', `${Math.max(0, 1 - progress * 1.7) * 5}px`);
    item.style.setProperty('--entry-turn', `${direction * (1 - progress) * -4}deg`);
  });
}
let entranceFrame = false;
addEventListener('scroll', () => {
  if (entranceFrame) return;
  entranceFrame = true;
  requestAnimationFrame(() => {updateEntrances(); entranceFrame = false;});
}, {passive:true});
addEventListener('resize', updateEntrances);
entranceMotion.addEventListener('change', updateEntrances);
updateEntrances();

document.querySelectorAll('.browser-screen-track').forEach((track, galleryIndex) => {
  track.id ||= `project-gallery-${galleryIndex}`;
  const images = [...track.querySelectorAll('img')];
  const controls = document.createElement('div');
  controls.className = 'gallery-controls';
  const previous = document.createElement('button');
  const next = document.createElement('button');
  const status = document.createElement('span');
  previous.type = next.type = 'button';
  previous.textContent = '←';
  next.textContent = '→';
  previous.setAttribute('aria-label', 'Previous EduConnect screenshot');
  next.setAttribute('aria-label', 'Next EduConnect screenshot');
  previous.setAttribute('aria-controls', track.id);
  next.setAttribute('aria-controls', track.id);
  status.className = 'gallery-status';
  controls.append(previous, status, next);
  track.after(controls);
  function index() {
    return images.reduce((best, image, i) => Math.abs(image.offsetLeft - track.offsetLeft - track.scrollLeft - 10) < Math.abs(images[best].offsetLeft - track.offsetLeft - track.scrollLeft - 10) ? i : best, 0);
  }
  function render() {
    const current = index();
    status.textContent = `${String(current + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    previous.disabled = current === 0;
    next.disabled = current === images.length - 1;
  }
  function go(direction) {
    const target = Math.max(0, Math.min(images.length - 1, index() + direction));
    track.scrollTo({left: images[target].offsetLeft - images[0].offsetLeft, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }
  previous.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));
  track.addEventListener('scroll', render, {passive:true});
  addEventListener('resize', render);
  render();
});

// Gentle mouse-wheel easing. Touch, horizontal gestures, nested galleries,
// dialogs and reduced-motion preferences keep their native scrolling.
let softScrollFrame = 0;
let softScrollTarget = scrollY;
let softScrollTime = 0;
function stopSoftScroll() {
  cancelAnimationFrame(softScrollFrame);
  softScrollFrame = 0;
  document.documentElement.classList.remove('wheel-softening');
}
function easePageScroll(time) {
  const dt = softScrollTime ? Math.min(50,time - softScrollTime) : 16;
  softScrollTime = time;
  const remaining = softScrollTarget - scrollY;
  if (Math.abs(remaining) < .8) {
    scrollTo({top:softScrollTarget,behavior:'instant'}); stopSoftScroll(); return;
  }
  scrollTo({top:scrollY + remaining * (1 - Math.exp(-dt / 150)),behavior:'instant'});
  softScrollFrame = requestAnimationFrame(easePageScroll);
}
addEventListener('wheel', event => {
  if (event.defaultPrevented || event.ctrlKey || entranceMotion.matches || !matchMedia('(pointer:fine)').matches || Math.abs(event.deltaX) >= Math.abs(event.deltaY) || event.shiftKey || document.querySelector('dialog[open]')) return;
  let element = event.target instanceof Element ? event.target : null;
  while (element && element !== document.body) {
    const style = getComputedStyle(element);
    if (/(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 1) return;
    element = element.parentElement;
  }
  const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
  if (!delta) return;
  event.preventDefault();
  if (!softScrollFrame) {softScrollTarget = scrollY; softScrollTime = 0;}
  softScrollTarget = Math.max(0,Math.min(document.documentElement.scrollHeight - innerHeight,softScrollTarget + delta * .65));
  document.documentElement.classList.add('wheel-softening');
  if (!softScrollFrame) softScrollFrame = requestAnimationFrame(easePageScroll);
}, {passive:false});
addEventListener('pointerdown', stopSoftScroll, {passive:true});
addEventListener('keydown', stopSoftScroll);
addEventListener('resize', stopSoftScroll);
entranceMotion.addEventListener('change', stopSoftScroll);
