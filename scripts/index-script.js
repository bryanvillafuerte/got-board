'use strict';
const characterURI = 'https://anapioficeandfire.com/api/characters';
const characterIds = [583, 271, 148, 957, 213, 529, 954, 1052, 238, 743];

let characterPromiseArray = [];
let charactersArray = [];

class Character {
    name;
    gender;
    titles;
    constructor(name, gender, titles) {
        this.name = name;
        this.gender = gender;
        this.titles = titles;
    }
}

const fetchCharacterById = function(characterId, charURI) {

    const uri = charURI.substring(0) + '/' + characterId.toString();
    return fetch(uri);
};


const main = async function() {
    console.log('===== RUNNING MAIN ======');

    characterIds.forEach( item => {
        characterPromiseArray.push(fetchCharacterById(item, characterURI));
    });

    let values = await Promise.all(characterPromiseArray);
    values = values.map( res => res.json());

    values = await Promise.all(values);
    values.forEach( function(char) {
        charactersArray.push(
            new Character(char.name, char.gender, char.titles)
        );
    });
    console.log(charactersArray);
};


(function() {
    main();
})();
