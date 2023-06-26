const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2302-acc-et-web-pt-e';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
const fetchAllPlayers = async () => {
    try {
            const response = await fetch(APIURL);
            const players = await response.json();
            return players;
        } 
    catch (err) {
            console.error('Uh oh, trouble fetching players!', err);
                }
};
const fetchSinglePlayer = async (id) => {
    try {
            const response = await fetch(`${APIURL}/${id}`);
            const player = await response.json();
            return player
        } 
    catch (err) {
            console.error(`Oh no, trouble fetching player #${id}!`, err);
                }
};
const addNewPlayer = async (playerObj) => {
    try {

        } 
    catch (err) {
            console.error('Oops, something went wrong with adding that player!', err);
                }
};

const removePlayer = async (id) => {
    try {
            const response = await fetch(`${APIURL}/${id}` , {
                method: `DELETE`,
            });
            const removedPlayer = await response.json();
            return removedPlayer;
        } 
    catch (err) {
        console.error(
            `Whoops, trouble removing player #${id} from the roster!`, err);
                }
};

const renderSinglePlayerbyid = async (id) => {
    try{
            const player = await fetchSinglePlayer(id)
            const playerElement = document.createElement('div');
            playerElement.classList.add(`player-details`);
            playerElement.innerHTML = `
                <p>ID: ${player.id}</p>
                <p>Cohort ID: ${player.cohortId}</p>
                <p>Created: ${player.createdAt}</p>
                <p>Updated: ${player.updatedAt}</p>
                <button class="close-button">Close</button>
            `;
            playerContainer.appendChild(playerElement);

    // add event listener to close button
            const closeButton = playerElement.querySelector('.close-button');
            closeButton.addEventListener('click', () => {
            playerElement.remove();
            });
        } 
    catch (err) {
    console.error(err);
                }
    }

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerlist - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = async (playerlist) => {
    try {
            playerContainer.innerHTML = ``;
            playerlist.data.players.forEach((player) => {
                const playerElement = document.createElement(`div`);
                playerElement.classList.add(`player`);
                playerElement.innerHTML = `
                    <h2>Name: ${player.name}</h2>
                    <p>id: ${player.id}</p>
                    <p>Breed: ${player.breed}</p>
                    <p>Status: ${player.status}</p>
                    <p> <img src="${player.imageUrl}<" alt=""></p>
                    <button class="details-button" data-id="${player.id}">See Details</button>
                    <button class="delete-button" data-id="${player.id}">Delete</button>
                    `;
                playerContainer.appendChild(playerElement);

      const detailsButton = playerElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        try {
          const id = event.target.dataset.id;
          renderSinglePlayerbyid(id)
            } 
        catch (err) {
          console.error(err);
                    }});
   
    const deleteButton = playerElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        try {
                const id = event.target.dataset.id;
                await removePlayer(id);
                const players = await fetchAllPlayers();
                renderAllPlayers(players);
             } 
        catch (err) {
                console.error(err);
                    }});
            })} 
    catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
                }
};



/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
        const form = document.getElementById(`new-player-form`);
        form.innerHTML = `
            <label for"id">Enter player id: </label>
            <input type="text" name="name" id="id" required>

            <label for"name">Enter player name: </label>
            <input type="text" name="name" id="name" required>

            <label for"breed">Enter player breed: </label>
            <input type="text" name="name" id="breed" required>

            <label for"status">Enter player status: </label>
            <input type="text" name="name" id="status" required>

            <label for"imageUrl">Enter player imageUrl: </label>
            <input type="text" name="name" id="imageUrl" required>

            <button class="add-player-button">add</button>
            `
        const addButton = form.querySelector(`.add-player-button`);
        addButton.addEventListener(`click`, async (event) => {
            try {
                event.preventDefault()
                const body = {
                    name: document.querySelector(`#name`).value,
                    breed: document.querySelector(`#breed`).value,
                    status: document.querySelector(`#status`).value,
                    imagrUrl: document.querySelector(`#imagrUrl`).value,
                    id: document.querySelector(`#id`).value,
                }
                const response = await fetch(APIURL, {
                    method:"POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                })
                console.log(response)
                const data = await response.json()
                console.log(data)
                console.log(await fetchSinglePlayer(data.id))
                }
            catch (err) {
                console.error(err)
                        }
        })
        } 
    catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
                }
}
const init = async () => {
    renderNewPlayerForm();
    const players = await fetchAllPlayers();
    return renderAllPlayers(players);
}

init();
