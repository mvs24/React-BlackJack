import { useState } from "react";
import "./App.css";
import Card from "./models/Card";
import { Color } from "./models/Card";

const generateCards: () => Card[] = () => {
  const cards: Card[] = [];
  const shapes: { suits: string; color: Color }[] = [
    { suits: "♦", color: "red" },
    { suits: "♣", color: "black" },
    { suits: "♥", color: "red" },
    { suits: "♠", color: "black" },
  ];
  for (let i = 1; i <= 13; i++) {
    shapes.forEach((shape) => {
      const card = new Card(i, shape.color, shape.suits);
      cards.push(card);
    });
  }

  return cards;
};

const getRandomIndex = (cardsLength: number) => {
  return Math.floor(Math.random() * cardsLength);
};

function generateRandomIndexes(shuffledIndexes: number[]) {
  if (shuffledIndexes.length === 52) return;

  const randomIndex = getRandomIndex(52);
  if (shuffledIndexes.includes(randomIndex) === false) {
    shuffledIndexes.push(randomIndex);
  }

  generateRandomIndexes(shuffledIndexes);
}

const shuffleCards = (): Card[] => {
  const cards = generateCards();
  const shuffledIndexes: number[] = [];

  generateRandomIndexes(shuffledIndexes);
  const shuffleCards: Card[] = [];
  shuffledIndexes.forEach((index) => {
    shuffleCards.push(cards[index]);
  });

  return shuffleCards;
};

function App() {
  const [cards, setCards] = useState<Card[]>(shuffleCards());
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [myPoints, setMyPoints] = useState<number>(0);
  const [dealerPoints, setDealerPoints] = useState<number>(0);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [turn, setTurn] = useState<"you" | "dealer">("you");
  const [aceCardSelect, setAceCardSelect] = useState<boolean>(false);
  const [aceValue, setAceValue] = useState<undefined | number>(undefined);
  const [confirmedAceValue, setConfirmedAceValue] = useState<
    number | undefined
  >(undefined);
  const [winner, setWinner] = useState<undefined | string>(undefined);

  const removeCardHandler = (randomCard: Card) => {
    setCards((prevState) => prevState.filter((card) => card !== randomCard));
  };

  const confirmAceValueHandler = () => {
    setConfirmedAceValue(aceValue);
    setAceCardSelect(false);
    if (aceValue) setMyPoints((prevPoints) => prevPoints + aceValue);
  };

  const addPoints = (card: Card) => {
    const isAce = card.value === 1 || card.value === 14;
    if (isAce) {
      setAceCardSelect(true);
    } else {
      setMyPoints((prevPoints) => prevPoints + card.value);
    }
  };

  const hitHandler = () => {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];

    if (turn === "you") {
      setMyCards((prevState) => [...prevState, randomCard]);
      addPoints(randomCard);
    } else {
      setDealerCards((prevCards) => [...prevCards, randomCard]);
    }
    removeCardHandler(randomCard);
  };

  return (
    <div className="App">
      <div className="you">
        {myCards.map((card) => {
          return (
            <span
              key={card.presentation}
              className={`${card.color} cardPresentation`}
            >
              {card.presentation}
            </span>
          );
        })}
        <div>Points: {myPoints}</div>

        {aceCardSelect === true && (
          <>
            <input
              type="number"
              onChange={(e) => setAceValue(+e.target.value)}
            />
            <button onClick={confirmAceValueHandler}>Confirm</button>
          </>
        )}
      </div>
      <div className="dealer">Dealer</div>
      <div className="buttons">
        <button
          disabled={aceCardSelect && confirmedAceValue === undefined}
          onClick={hitHandler}
        >
          Hit
        </button>
        <button>Stand</button>
        <button>Dealer</button>
      </div>
    </div>
  );
}

export default App;
