const faker = require("faker");

// Valores constantes
const mediaGames = 80;
const maxCromons = 10;
const maxPontuation = 100;

function factoryUserGamer() {
  var genesis = [];
  var interation = 0;
  var dataBestPlayer = {};

  function cromonStruct() {
    this.identification = null;
    this.intelligence = null;
    this.agility = null;
    this.reflection = null;
  }

  function constructFirstGeneration() {
    const dataGeneration = [];
    for (var i = 0; i < maxCromons; i++) {
      var newCromon = new cromonStruct();

      const intelligence = Math.floor(Math.random() * maxPontuation + 1);
      const agility = Math.floor(Math.random() * maxPontuation + 1);
      const reflection = Math.floor(Math.random() * maxPontuation + 1);

      newCromon.identification = faker.name.firstName();
      newCromon.intelligence = intelligence;
      newCromon.agility = agility;
      newCromon.reflection = reflection;

      dataGeneration.push(newCromon);
    }
    return dataGeneration;
  }

  function getMediaPlayer(dataPlayer) {
    const { intelligence, agility, reflection } = dataPlayer;
    return Math.floor((intelligence + agility + reflection) / 3);
  }

  function getBestFathers() {
    const mediaPeoples = genesis.map((ele) => {
      const mediaAttributes = getMediaPlayer(ele);
      return { media: mediaAttributes, dataPeople: ele };
    });

    mediaPeoples.sort((ele) => ele.media);

    return {
      fatherOne: mediaPeoples[0].dataPeople,
      fatherTwo: mediaPeoples[1].dataPeople,
    };
  }

  function calcMediaInf(numberOne, numberTwo) {
    // 19 - 79
    // 60 / 2 + 19

    var sub = numberOne - numberTwo;
    if (sub < 0) sub = sub * -1;

    var numberBetwen = Math.floor(sub / 2);
    return (numberBetwen + numberOne) % 101;
  }

  function calcMediaSup(numberOne, numberTwo) {
    // 19 - 79
    // 60 / 2 + 79 % 101

    var sub = numberOne - numberTwo;
    if (sub < 0) sub = sub * -1;

    var numberBetwen = Math.floor(sub / 2);
    return (numberBetwen + numberTwo) % 101;
  }

  function createChildren(dataParents) {
    const { fatherOne, fatherTwo } = dataParents;

    return {
      OneSon: {
        identification: faker.name.firstName(),
        intelligence: calcMediaInf(
          fatherOne.intelligence,
          fatherTwo.intelligence
        ),
        agility: calcMediaInf(fatherOne.agility, fatherTwo.agility),
        reflection: calcMediaInf(fatherOne.reflection, fatherTwo.reflection),
      },
      SecondSon: {
        identification: faker.name.firstName(),
        intelligence: calcMediaSup(
          fatherOne.intelligence,
          fatherTwo.intelligence
        ),
        agility: calcMediaSup(fatherOne.agility, fatherTwo.agility),
        reflection: calcMediaSup(fatherOne.reflection, fatherTwo.reflection),
      },
    };
  }

  function getMutations(childrens) {
    const { OneSon, SecondSon } = childrens;
    return [{ ...OneSon }, { ...SecondSon }].map((ele) => {
      const { intelligence, agility, reflection } = ele;

      const totalSkills = getMediaPlayer(ele);
      const position = Math.floor(Math.random() * 3);
      const porcentege = 1.1;

      const newIntelligence =
        intelligence < totalSkills && position === 0
          ? Math.floor(intelligence * porcentege)
          : intelligence;

      const newAgility =
        agility < totalSkills && position === 1
          ? Math.floor(agility * porcentege)
          : agility;

      const newReflection =
        reflection < totalSkills && position === 2
          ? Math.floor(reflection * porcentege)
          : reflection;

      return {
        ...ele,
        intelligence: newIntelligence > 100 ? 100 : newIntelligence,
        agility: newAgility > 100 ? 100 : newAgility,
        reflection: newReflection > 100 ? 100 : newReflection,
      };
    });
  }

  function removeFathers(dataFathers) {
    const { fatherOne, fatherTwo } = dataFathers;
    return genesis.filter((ele) => ele !== fatherOne && ele !== fatherTwo);
  }

  function getBestPlayer(childrens) {
    return childrens.filter((ele) => getMediaPlayer(ele) > mediaGames);
  }

  function main() {
    const responseGeneration = constructFirstGeneration();
    genesis = responseGeneration;

    while (!!dataBestPlayer) {
      const bestFathers = getBestFathers();
      const datachildren = createChildren(bestFathers);
      const childrens = getMutations(datachildren);

      const newDataGenesis = removeFathers(bestFathers);
      genesis = [...newDataGenesis, ...childrens];

      const [bestPlayer] = getBestPlayer(childrens);
      interation++;

      if (!!bestPlayer) {
        dataBestPlayer = bestPlayer;

        console.log("Numero de interações: ", interation);
        console.log("Média do jogador: ", getMediaPlayer(bestPlayer));
        console.log("Informações do melhor jogador: ", bestPlayer);

        return false;
      }
    }

    return dataBestPlayer;
  }

  return {
    main,
  };
}

const bestPlayer = factoryUserGamer();
bestPlayer.main();
