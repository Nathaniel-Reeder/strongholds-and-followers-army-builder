// Get All Armies button
const getAllBtn = document.getElementById("get-all-armies")

//base URL
const baseURL = "http://localhost:4000"

// GET from server

const getAllArmies = () => {
    axios.get(`${baseURL}/army/view-all`).then(response => displayArmyCard(response)).catch(err => console.log(err))
}

// Event Listener
getAllBtn.addEventListener('click', getAllArmies)

// container element for the army cards
const armyContainer = document.getElementById("army-container")

const displayArmyCard = response => {
    console.log(response)
    
    // Loop over the response
    console.log(response.data[0].id)
    armyContainer.innerHTML = ``
    for (let i = 0; i < response.data.length; i++) {
        console.log(`For loop iteration ${i}`)
        let prev = i - 1
        console.log(prev)
        //get the ID of the current Army
        let armyID = response.data[i].id
        let prevArmyID = undefined
        if (prev >= 0) {
            prevArmyID = response.data[prev].id
        }
        
        
        createArmyCard(response, armyID, prevArmyID, i)
        
    }
}

const createArmyCard = (response, armyId, prevId, i) => {
    // Create the army card element
    const armyCard = document.createElement('div')
    armyCard.classList.add('army-card')
    // If the army has already been logged, only get the traits, otherwise create the initial army card
    if(armyId === prevId){
        console.log(`Army ID: ${armyId}`, `prevId: ${prevId}`)
        const {name, description} = response.data[i]
        const traitsSection = document.getElementById(`traits-${armyId}`)
        const traitCard = document.createElement('div')
        traitCard.classList.add('trait')
        traitCard.innerHTML = `
        <h5>${name}</h5>
        <p>${description}</p>
        `
        traitsSection.appendChild(traitCard)
    } else {
        // Destructure army data from the response
        const {ancestry, army_name, commander_name, equipment, level, unit_type, cost, attack, defense, power, toughness, morale, size, name, description} = response.data[i]
        console.log(armyId, name, description)
        armyCard.innerHTML = `
            <h3>${army_name}</h3>
            <h4>Commander: ${commander_name}</h4>
            <p>${ancestry} ${equipment} ${level} ${unit_type}</p>
            <p>Cost: ${cost}</p>
                
            <table>
                <tr>
                    <td>Attack: +${attack}</td>
                    <td>Defense: ${defense + 10}</td>
                </tr>
                <tr>
                    <td>Power: +${power}</td>
                    <td>Toughness: ${toughness + 10}</td>
                </tr>
                <tr>
                    <td>Morale: +${morale}</td>
                    <td>Size: ${size}</td>
                </tr>
            </table>
    
            <h4>Traits:</h4>
            <section id="traits-${armyId}"></section>
            
            `
        armyContainer.appendChild(armyCard)
        
        const traitsSection = document.getElementById(`traits-${armyId}`)
        const traitCard = document.createElement('div')
        traitCard.classList.add('trait')
        traitCard.innerHTML = `
        <h5>${name}</h5>
        <p>${description}</p>
        `
        traitsSection.appendChild(traitCard)
    }
}