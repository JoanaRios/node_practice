//---------------------------menu responsive animations------------------------
const reorderIcon = document.getElementById('reorder');
const nav = document.getElementById('nav');

reorderIcon.addEventListener('click', ()=>{
    nav.classList.toggle('on')
});


//----------------------------dates responsive----------------------
const date = document.querySelectorAll('.date');
const hidden = document.querySelectorAll('.hidden');

for (let i = 0; i < date.length; i++) {
    const d = date[i];
    d.addEventListener('click', () => {
        const hidden = d.lastElementChild;
        hidden.classList.toggle('hidden-on');
    });
}
