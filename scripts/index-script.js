'use strict';

/*
GLOBAL VARIABLES
 */
const characterURI = 'https://anapioficeandfire.com/api/characters';
const characterIds = {
    583: {id: 583, image: 'assets/card-jon-snow.jpg'},
    271: {id: 271, image: 'assets/card-daenerys.jpg'},
    148: {id: 148, image: 'assets/card-arya.jpg'},
    957: {id: 957, image: 'assets/card-sansa.jpg'},
    213: {id: 213, image: 'assets/card-bran.jpg'},
    529: {id: 529, image: 'assets/card-jaime.jpg'},
    954: {id: 954, image: 'assets/card-samwell.jpg'},
    1052: {id: 1052, image: 'assets/card-tyrion.jpg'},
    238: {id: 238, image: 'assets/card-cersei.jpg'},
    743: {id: 743, image: 'assets/card-melisandre.jpg'},
};

var characterPromiseArray = [];
var charactersArray = [];

/*
DOM VARIABLES
 */
const playNow = document.querySelector('#playnow');


/*
CLASS DEFINITIONS
 */
class Character {
    name;
    gender;
    titles;
    image;
    constructor(name, gender, titles, image) {
        this.name = name;
        this.gender = gender;
        this.titles = titles;
        this.image = image;
    }
}

/*
HELPER FUNCTIONS
 */
const fetchCharacterById = function(characterId, charURI) {
    const uri = charURI.substring(0) + '/' + characterId.toString();
    return fetch(uri);
};

const createPromises = function(charIds) {
    const tmpPromises = [];
    Object.keys(charIds).forEach( item => {
        tmpPromises.push(fetchCharacterById(item, characterURI));
    });
    return tmpPromises;
};

const resolveAllPromises = async function(arrayOfPromises) {
    let characters = [];
    let values = await Promise.all(arrayOfPromises);
    values = values.map( res => res.json());

    return Promise.all(values).then( allChar => {
        allChar.forEach( function(char) {
            const index = char.url.lastIndexOf('/');
            const charId = char.url.slice(index + 1);
            characters.push(
                new Character(char.name, char.gender, char.titles, characterIds[charId].image)
            );
        });
        return characters;
    });
};

const chooseCharacter = function(character) {
    LocalStorage.set(StorageKeys.CHARACTER, character);
};

const clearStorage = function() {
    LocalStorage.clear();
};


const addListeners = function () {
    console.log('==== ADDING LISTENERS ====');
    characterRow.addEventListener('click', (event) => {
        const target = event.target;
        if (target.nodeName.toLowerCase() === 'img') {
            const name = target.getAttribute('data-char-name');
            const chosenChar = findCharacter(name, charactersArray);
            chooseCharacter(chosenChar);
        }
    });

    playNow.addEventListener('click', (event) => {
        const char = LocalStorage.get(StorageKeys.CHARACTER);
        if (!char) {
            alert('PLEASE SELECT A CHARACTER BEFORE PLAYING!');
            return;
        }

        if (confirm(`You chose ${char.name}. Do you want to proceed?`)) {
            location.href = 'board.html';

        } else {
            console.log('Player canceled');
        }
    });
};

/*
==========================
========== MAIN ==========
==========================
 */
const main = async function() {
    console.log('===== RUNNING MAIN ======');
    clearStorage();
    characterPromiseArray = createPromises(characterIds);
    charactersArray = await resolveAllPromises(characterPromiseArray);

    renderCharacters(charactersArray);
    addListeners();
};


(function() {
    main();
})();
