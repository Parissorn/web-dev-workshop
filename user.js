const BASE_URL = 'http://localhost:3000';

//when the page is loaded, run loadData()
window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    // get all users' data
    const response = await axios.get(`${BASE_URL}/users`)

    // show all users
    const userDiv = document.getElementById('user')
    let htmlData = '<div>'
    for (let i = 0; i < response.data.length; i++) {
        let user = response.data[i]
        htmlData += `<div>
                          ${user.firstname}  ${user.lastname}   
                          
                          <a href="index.html?id=${user.id}"><button>Edit</button></a>

                          <button class='delete' data-id=${user.id}>Delete</button>
                      </div>`
    }
    htmlData += '</div>'
    userDiv.innerHTML = htmlData

    //make delete-button usable by send the delete method to the server for each id
    const delBut = document.getElementsByClassName('delete')
    for (let i = 0; i < delBut.length; i++) {

        // add event for each delete-button
        delBut[i].addEventListener('click', async (event) => {
            let id = event.target.dataset.id
            try {
                await axios.delete(`${BASE_URL}/user/${id}`)
                // re-load the page to get the new data after delete 
                loadData()
            } catch (error) {
                console.log('error', error)
            }

        })

    }
}
