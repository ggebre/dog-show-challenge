document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector("#table-body")
    const dogForm = document.querySelector("#dog-form")
    fetchAllDogs()
 
    function fetchAllDogs(){
        fetch("http://localhost:3000/dogs")
        .then(resp => resp.json())
        .then(dogObjs => {
            dogObjs.forEach(dogObj => {
                let dogHTML = renderRowsOfTable(dogObj)
                tableBody.innerHTML += dogHTML
            })
            tableBody.addEventListener('click', (event) => {
                if(event.target.tagName === "BUTTON"){
                    const id = event.target.dataset.id
                    fetchADogById(id)

                    dogForm.addEventListener('submit', (event) => {
                        const dogUpdate = acceptInputValues()
                        updateDog(id, dogUpdate) 
                        // rerender after updating 
                        
                        event.preventDefault();
                    }, false)
                }
            })
        })
    }
    function renderRowsOfTable({name, breed, sex, id}){
        return `
        <tr><td>Dog ${name}</td> <td>${breed}</td> <td>${sex}</td> <td><button class=edit-dog data-id=${id}>Edit</button></td></tr> 
        `
    } 
    function updateDog(id, dogObj) {
        fetch(`http://localhost:3000/dogs/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                'Accept': "application/json"
              },
              body: JSON.stringify(dogObj)
        })
        .then(resp = resp.json())
        .then(fetchAllDogs())
    } 
    function fetchADogById(id){
        fetch(`http://localhost:3000/dogs/${id}`)
        .then(resp => resp.json())
        .then(dogObj => {
            prePopulateForm(dogObj)  
        })
    } 
    function prePopulateForm({name, breed, sex, id}) {
        dogForm.children.breed.value = breed 
        dogForm.children.name.value = name
        dogForm.children.sex.value = sex
    }

    function acceptInputValues(){
        const breed = dogForm.children.breed.value 
        const name = dogForm.children.name.value 
        const sex = dogForm.children.sex.value 
        return { breed, name, sex}
    }
})