const authDialog = document.querySelector('#authorization');
const regDialog = document.querySelector('#registration');
const authBtn = document.querySelector('#auth-btn');
const regBtn = document.querySelector('#reg-btn');
const authForm = authDialog.querySelector('form');
const regForm = regDialog.querySelector('form');
const recordsContainer = document.querySelector('#records');
const newRecordForm = recordsContainer.querySelector('form');
const list = recordsContainer.querySelector('ul');
const nameSpan = document.querySelector('h2>span');
const cancelButtons = document.querySelectorAll('[value="cancel"]');




init();

cancelButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.closest('dialog').close();
    })
})


newRecordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const record = {
        userId: +newRecordForm.id.value,
        text: newRecordForm.text.value
    }
    addRecord(record);
})

authBtn.addEventListener('click', () => {
    if (authBtn.textContent === 'Вхід') {
        authDialog.showModal();
    } else {
        logOut();
    }
})

regBtn.addEventListener('click', () => {
    regDialog.showModal();
})

authForm.addEventListener('submit', async (e) => {
    const userName = authForm.userName.value;
    const pass = authForm.password.value;
    const user = await logIn(userName, pass);

    if (user) {
        nameSpan.textContent = user.name;
        recordsContainer.hidden = false;
        newRecordForm.id.value = user.id;
        authForm.reset();

        showRecords(user.id)

        authBtn.textContent = 'Вихід';
    }
    else {
        e.preventDefault();
        alertDialog("Ім'я або пароль не вірні");
    }
})

regForm.addEventListener('submit', handleRegistration);

async function logIn(userName, password) {
    const init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName, password })
    }
    const response = await fetch('/api/login', init)
    const user = await response.json();

    localStorage.setItem('user', JSON.stringify(user));

    return user
}

function init() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        nameSpan.textContent = user.name;
        recordsContainer.hidden = false;
        newRecordForm.id.value = user.id;
        authBtn.textContent = 'Вихід';
        showRecords(user.id);
    }
}

function addRecord(record) {
    const init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
    }
    const response = fetch('/api/record', init);
}



function handleRegistration(e) {
    const user = {
        name: regForm.userName.value.trim(),
        password: regForm.password.value.trim()
    };

    const init = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    }

    // if (doesUserExist(user.name)) {
    //     e.preventDefault();
    //     alertDialog("Такий користувач вже існує");
    //     return;
    // }

    // if (user.name.length < 2) {
    //     e.preventDefault();
    //     alertDialog("Ім'я має бути не менше 2 символів");
    //     return;
    // }

    // if (user.password.length < 3) {
    //     e.preventDefault();
    //     alertDialog("Пароль має бути не менше 3 символів");
    //     return;
    // }

    // if (regForm.password.value !== regForm.passwordRepeat.value) {
    //     e.preventDefault();
    //     alertDialog("Паролі не співпадають");
    //     return;
    // }

    const response = fetch('/api/register', init);



    alertDialog("Користувача додано");
}

function logOut() {
    nameSpan.textContent = 'Гість';
    recordsContainer.hidden = true;
    authBtn.textContent = 'Вхід';
}

async function showRecords(userId) {
    const records = await getRecords(userId);
    list.innerHTML = records.map(record => `<li>${record.text}</li>`).join('');
}

function doesUserExist(userName) {
    return users.some(user => user.name === userName);
}

function alertDialog(msg) {
    return new Promise((resolve) => {
        const dialog = document.createElement('dialog');
        const form = document.createElement('form');
        const p = document.createElement('p');
        const button = document.createElement('button');

        p.textContent = msg;

        button.textContent = 'OK';
        dialog.addEventListener('close', () => {
            dialog.remove();
            resolve();
        });

        form.append(p, button);
        dialog.append(form);
        document.body.append(dialog)

        form.method = 'dialog';

        dialog.showModal();
    })
}

async function getRecords(userId) {
    const response = await fetch(`/api/records/${userId}`);
    const records = await response.json();
    return records
}





