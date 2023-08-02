


// Получаем список сотрудников из хранилища
const getEmployesFromStorage = () => JSON.parse(localStorage.getItem('employes')) || [];

// Сохраняем список сотрудников из localStorage
const setEmployesInStorage = (employes) => localStorage.setItem('employes', JSON.stringify(employes));

// сгенерировать ИД
const generateTaskId = () => {
    const currentId = localStorage.getItem('id') || 0;
    localStorage.setItem('id', Number(currentId) + 1);

    return Number(currentId) + 1;
}

const createList = () => {
    const ul = document.getElementById('item-list');
    ul.innerHTML = '';
    const employes = getEmployesFromStorage();
    employes.forEach((employe) => ul.append(createEmployeLi(employe)));
}

//проверка формы 
const errorInput = () => {
    const input = document.querySelectorAll('.input');
    const errorInput = document.querySelectorAll('.error-input')

    for (let i = 0; i < errorInput.length; i++) {
        errorInput[i].classList.remove('error-input');
        errorInput[i].previousSibling.remove();
    }
        
    for (let i = 0; i < input.length; i++){
        if(!input[i].value){
            let error = document.createElement('span')
            error.classList.add('error');
            error.innerHTML = 'введите данные';
            if(!input[i].previousSibling){
                input[i].parentElement.insertBefore(error, input[i]);
                input[i].classList.add('error-input');
            }
        } 
    }

    addEmployeValidation();
}

//добавление нового сотрудника 
const addEmploye = (employe) => {
    const employes = getEmployesFromStorage();
    employes.push(employe);
    setEmployesInStorage(employes);

    createList();
}

//удаление сотрудника
const deleteEmploye = (id) => {
    const oldListEmploye = getEmployesFromStorage();
    const newListEmploye = oldListEmploye.filter((employe) => employe.id !== id);
    setEmployesInStorage(newListEmploye);

    createList();
}

//модальное окно удаления сотрудника
const modalApproved = (employe, title, btn1Text, btn2Text) => {
    const modalWindow = document.getElementById('modalAproved');
    modalWindow.style.display = 'block';

    const modalTitle = document.querySelector('.title');
    modalTitle.textContent = title;

    const btn1 = document.querySelector('.btn1');
    btn1.textContent = btn1Text;
    btn1.addEventListener('click', () => {
        deleteEmploye(employe.id);
        modalWindow.style.display = 'none';
    });

    const btn2 = document.querySelector('.btn2');
    btn2.textContent = btn2Text;
    btn2.addEventListener('click', () => {
        modalWindow.style.display = 'none';
    });

    const modal = document.querySelector('.modal');
    modal.addEventListener('click', event => {
        event._isClickWitchinModal = true;
    })

    modalWindow.addEventListener('click', event => {
        if(event._isClickWitchinModal) return;
        modalWindow.style.display = 'none';
    })
       
}

//инфа о сотруднике для модального окна
const infoEmployeModalAdd = (info, employe, type ) => {
    const container = document.createElement('div');
    container.classList.add('container');

    const text = document.createElement('span');
    text.classList.add('span');
    text.textContent = info;

    const input = document.createElement('input');
    input.value = employe;
    input.type = type;
    
    container.append(text);
    container.append(input);

    return {
        container,
        input,
    } 
}

//изменение данных сотрудника
const сhangeEmploye = (employe) => {
    const oldListEmploye = getEmployesFromStorage();
    const user = oldListEmploye.find( item => item.id === employe.id);
    user.name = employe.name;
    user.surname = employe.surname;
    user.midlename = employe.midlename;
    user.birthday = employe.birthday;
    
    setEmployesInStorage(oldListEmploye);
    createList();
    
}

//модальное окно изменения данных сотрудников
const modalChangeEmploye = (employe ) => {
    const modalWindow = document.getElementById('modalInfo');
    modalWindow.style.display = 'block';

    const nameElement = infoEmployeModalAdd('Имя', employe.name);
    const surElement = infoEmployeModalAdd('Фамилия', employe.surname);
    const midleElement = infoEmployeModalAdd('Отчество', employe.midlename);
    const birthElement = infoEmployeModalAdd('Дата рождения', employe.birthday, 'date');
    
    const modal = document.querySelector('.modal-info')
    modal.append(nameElement.container);
    modal.append(surElement.container);
    modal.append(midleElement.container);
    modal.append(birthElement.container);

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'button-container');
    modal.append(buttonContainer);

    const addButton = document.createElement('button');
    addButton.textContent = 'Изменить';
    buttonContainer.append(addButton);

    addButton.addEventListener('click', () => {
        сhangeEmploye({
            id:employe.id, 
            name:nameElement.input.value,
            surname: surElement.input.value,
            midlename: midleElement.input.value,
            birthday: birthElement.input.value,
        });
        modalWindow.style.display = 'none';
        modal.innerHTML = '';
        console.log(birthElement.input.value);
    });
    

    modal.addEventListener('click', event => {
        event._isClickWitchinModal = true;
    })

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Отмена';
    buttonContainer.append(cancelButton);

    cancelButton.addEventListener('click', () => {
        modalWindow.style.display = 'none';
        modal.innerHTML = '';
    });

    modalWindow.addEventListener('click', () => {
        if(event._isClickWitchinModal) return;
        modalWindow.style.display = 'none';
        modal.innerHTML = '';
    });

}

// создание строки с данными сотрудника
const createEmployeLi = (employe) => {
    const item = document.createElement('li');
    item.classList.add('item', 'flex');
    
    item.id = String(employe.id);

    const infoEmploye = document.createElement('span');
    infoEmploye.classList.add('info');
    infoEmploye.innerHTML = employe.name + ' ' + employe.surname + ' ' + employe.midlename + ' дата рождения: ' + employe.birthday;
    item.append(infoEmploye);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить сотрудника';
    deleteButton.classList.add('btn-delete');
    item.append(deleteButton);

    const changeButton = document.createElement('button');
    changeButton.textContent = 'Изменить данные сотрудника';
    changeButton.classList.add('btn-change');
    item.append(changeButton);

    deleteButton.addEventListener('click', () => {
        modalApproved(employe, 'Вы уверены?', 'да', 'нет');
    });

    changeButton.addEventListener('click', () => {
        modalChangeEmploye(employe);
    });

    return item
}

//добавление сотрудника с условием валидации 

const addEmployeValidation = () => {
    const employeName = document.getElementById('employe__name');
    const employeSurName = document.getElementById('employe__surname');
    const employeMidleName = document.getElementById('employe__midlename');
    const employeBirthday = document.getElementById('employe__birthday');

    if (employeName.value === '' || employeSurName.value === '' || employeMidleName.value === '' || employeBirthday.value === '' ) {  
        } else {
            addEmploye({
                name:employeName.value,
                surname: employeSurName.value,
                midlename: employeMidleName.value,
                birthday: employeBirthday.value,
                id: generateTaskId(),
            });

        employeName.value = '';
        employeSurName.value = '';
        employeMidleName.value = '';
        employeBirthday.value = ''; 
        }
}

(function() {
    document.addEventListener('DOMContentLoaded', function(){
        createList();

        const buttonAdd = document.getElementById('btn-add');

        buttonAdd.addEventListener('click', () => {
            errorInput();
        })
    })
})();