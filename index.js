const BASE_URL = 'http://localhost:3000'
let mode = 'create' // default
let selectedId = ''//default

// user validation
const validate = (user) => {
    let error = []

    if (!user.firstname) {
        error.push('pleae fill in the firstname')
    }
    if (!user.lastname) {
        error.push('pleae fill in the lastname')
    }
    if (!user.age) {
        error.push('pleae fill in your age')
    }
    if (!user.gender) {
        error.push('pleae fill in your gender')
    }
    if (!user.interests) {
        error.push('pleae fill in your interests')
    }
    if (!user.description) {
        error.push('pleae fill in your description')
    }
    return error
}

// get user by id after clicking on edit button in user page and be able to edit the user
window.onload = async () => {

    // get id-param from user you want to edit
    let URLparams = new URLSearchParams(window.location.search)
    let id = URLparams.get('id')

    // if there is a id-param (if you cliked edit button), if you come back to this page with out clicking edit button nothing will happen
    if (id) {
        // update mode and global-id-variable
        mode = 'edit'
        selectedId = parseFloat(id)
        try {

            // get the user data by id 
            const response = await axios.get(`${BASE_URL}/users/${selectedId}`)
            const user = response.data.data

            //get HTML element
            let firstnameDOM = document.querySelector('input[name=firstname]');
            let lastnameDOM = document.querySelector('input[name=lastname]');
            let ageDOM = document.querySelector('input[name=age]');
            let genderDOM = document.querySelector(`input[name=gender][value=${user.gender}]`);
            let interestDOM = document.querySelectorAll('input[name=interest]');
            let descriptionDOM = document.querySelector('textarea[name=description]');

            // update HTML element
            firstnameDOM.value = user.firstname
            lastnameDOM.value = user.lastname
            ageDOM.value = user.age
            genderDOM.checked = true
            for (let i = 0; i < interestDOM.length; i++) {
                if (user.interests.includes(interestDOM[i].value)) {
                    interestDOM[i].checked = true
                }
            }
            descriptionDOM.value = user.description

        } catch (error) {
            console.log('error', error)
        }
    }

}

// create user right after clicking on Submit button and then sending user data to server to communicate with DB 
const submitData = async () => {
    let firstnameDOM = document.querySelector('input[name=firstname]');
    let lastnameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked') || {};
    let interestDOM = document.querySelectorAll('input[name=interest]:checked') || {};
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let msgDOM = document.querySelector('.message');

    try {

        // format the interests because it can have more than 1 value
        let interests = ''
        for (let i = 0; i < interestDOM.length; i++) {
            interests += interestDOM[i].value

            if (i != interestDOM.length - 1) {
                interests += ', '
            }
        }

        // the data that will go to server
        let user = {
            firstname: firstnameDOM.value,
            lastname: lastnameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            interests: interests,
            description: descriptionDOM.value
        }

        // validate the data before it goes
        const validation = validate(user)
        if (validation.length > 0) {
            throw {
                message: '- you must fill all the blanks -',
                errors: validation
            }
        }

        let message = 'Submission successed!'
        // if not editting then the default is create-mode
        if (mode === 'create') {
            const response = await axios.post(`${BASE_URL}/user`, user)
        } else {
            // edit-mode
            await axios.put(`${BASE_URL}/user/${selectedId}`, user)
            message = 'Edit successfully'
        }

        // show the successful message section
        msgDOM.className = 'message success'
        msgDOM.innerText = message

    } catch (error) {
        console.log('error', error)

        // error จากฝั่ง server
        if (error.response) {
            console.log(error.response.data.error)
        }

        // show the incompleted message section
        msgDOM.className = 'message danger'

        let divH = document.createElement('div')
        divH.innerText = error.message

        let listContainer = document.createElement('ul')
        for (let i = 0; i < error.errors.length; i++) {
            let list = document.createElement('li')
            list.innerText = error.errors[i]
            listContainer.appendChild(list)
        }

        msgDOM.appendChild(divH)
        msgDOM.appendChild(listContainer)

    }
};