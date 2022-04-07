const headerIcon = document.querySelector('.header-icon');
const nav = document.querySelector('.nav');

headerIcon.addEventListener('click', () =>{
    if (nav.classList.contains('nav-off')){
        nav.classList.remove('nav-off');
        nav.classList.add('nav-on');
    } else {
        nav.classList.remove('nav-on');
        nav.classList.add('nav-off');
    }
});

const pedirCita = document.querySelector('.list-item');
const subMenu = document.querySelector('.sub-menu');

pedirCita.addEventListener('click', ()=>{
    subMenu.classList.toggle('sub-menu--visible')
})
const date = document.querySelectorAll('.date');
const hidden = document.querySelectorAll('.hidden');

for (let i = 0; i < date.length; i++) {
    const d = date[i];
    d.addEventListener('click', () => {
        const hidden = d.lastElementChild;
        hidden.classList.toggle('hidden-on');
    });
}
