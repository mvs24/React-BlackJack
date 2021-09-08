import { useEffect, useState } from "react";
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
  const [loser, setLoser] = useState<undefined | string>(undefined);
  const [winner, setWinner] = useState<undefined | string>(undefined);

  useEffect(() => {
    const checkForLoserHandler = () => {
      if (turn === "you" && myPoints > 21) {
        setLoser("Dealer won");
      } else if (turn === "dealer" && dealerPoints > 21) {
        setLoser("You won");
      }
    };

    checkForLoserHandler();
  }, [turn, myPoints, dealerPoints]);

  useEffect(() => {
    const checkForBlackjack = function () {
      if (turn === "you" && myPoints === 21) {
        setWinner("Blackjack!! You won!!!");
      } else if (turn === "dealer" && dealerPoints === 21) {
        setWinner("Blackjack!!! Dealer won");
      }
    };

    checkForBlackjack();
  }, [turn, myPoints, dealerPoints]);

  const removeCardHandler = (randomCard: Card) => {
    setCards((prevState) => prevState.filter((card) => card !== randomCard));
  };

  const confirmAceValueHandler = () => {
    setConfirmedAceValue(aceValue);
    setAceCardSelect(false);
    if (aceValue) {
      if (turn === "you") setMyPoints((prevPoints) => prevPoints + aceValue);
      if (turn === "dealer")
        setDealerPoints((prevPoints) => prevPoints + aceValue);
    }
  };

  const addPoints = (card: Card) => {
    const isAce = card.value === 1 || card.value === 14;
    if (isAce) {
      setAceCardSelect(true);
    } else {
      if (turn === "you") setMyPoints((prevPoints) => prevPoints + card.value);
      else setDealerPoints((prevPoints) => prevPoints + card.value);
    }
  };

  const hitHandler = () => {
    const randomIndex = getRandomIndex(cards.length);
    const randomCard = cards[randomIndex];

    if (turn === "you") {
      setMyCards((prevState) => [...prevState, randomCard]);
    } else {
      setDealerCards((prevCards) => [...prevCards, randomCard]);
    }
    addPoints(randomCard);
    removeCardHandler(randomCard);
  };

  const checkWinner = function () {
    if (myPoints > dealerPoints) {
      setWinner(`You won`);
    } else {
      setWinner("Dealer won");
    }
  };

  const standHandler = function () {
    if (myPoints > 0 && dealerPoints > 0) {
      checkWinner();
    }
    setTurn(turn === "you" ? "dealer" : "you");
  };

  return (
    <div className="App">
      {loser !== undefined &&
        setTimeout(() => {
          alert(loser);
        })}
      {winner &&
        setTimeout(() => {
          alert(winner);
        })}
      <div className={`you ${turn === "you" ? "active" : ""}`}>
        <div>You</div>

        <div>
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
        </div>
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
      <div className={`dealer ${turn === "dealer" ? "active" : ""}`}>
        <div>Dealer</div>
        {dealerCards.map((card) => {
          return (
            <span
              key={card.presentation}
              className={`${card.color} cardPresentation`}
            >
              {card.presentation}
            </span>
          );
        })}
        <div className="">Points: ${dealerPoints}</div>
      </div>
      <div className="buttons">
        <button
          disabled={aceCardSelect && confirmedAceValue === undefined}
          onClick={() => {
            if (!winner && !loser) hitHandler();
          }}
        >
          Hit
        </button>
        <button
          onClick={() => {
            if (!winner && !loser) standHandler();
          }}
        >
          Stand
        </button>
      </div>
    </div>
  );
}

export default App;
