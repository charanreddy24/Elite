import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ParkingReportModal from '/src/components/Modals/ParkingReport.jsx';

export default function parkingReportBoard({ cardsArray, setCardsArray }) {
  const handleCreateClick = () => {
    console.log('Create button clicked');
  };
  const [cards, setCards] = useState([]);
  useEffect(() => {
    setCards(cardsArray); // Update cards when kanbanCardArray changes
  }, [cardsArray]);

  return (
    <div className="flex gap-2 overflow-y-auto w-full h-full text-center ">
      <Column
        title="Active Permits"
        headingColor="text-red-500"
        column="Active Permits"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
      />

      <Column
        title="Expired Permits"
        headingColor="text-red-500"
        column="Expired Permits"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
      />
    </div>
  );
}

const Column = ({
  title,
  headingColor,
  column,
  cards,
  setCards,
  cardsArray,
  setCardsArray,
}) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData('cardId', card.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);
    setActive(true);
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const el = getNearestIndicator(e, indicators);
    el.element.style.opacity = '1';
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();
    indicators.forEach((i) => {
      i.style.opacity = '0';
    });
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - (box.top + DISTANCE_OFFSET);
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );
    return el;
  };
  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column = "${column}"]`));
  };

  const handleDragLeave = (e) => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd = (e) => {
    setActive(false);
    clearHighlights();

    const cardId = e.dataTransfer.getData('cardId');
    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || '-1';

    if (before !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((c) => c.id === cardId);

      if (!cardToTransfer) return;

      cardToTransfer = {
        ...cardToTransfer,
        column,
      };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === '-1';

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;
        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };
  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow-sm flex flex-col flex-1 overflow-y-auto ">
      <div className="mb-3 flex items-center text-center justify-between">
        <h2 className={'mb-4 pb-2 border-b border-gray-300 text-center '}>
          {title}
        </h2>
        <span className="bg-lime-500 text-white px-2 py-1 mt-[-23px] rounded ">
          {filteredCards.length}
        </span>
      </div>

      {title === 'Active Permits' && (
        <ParkingReportModal
          cardsArray={cardsArray}
          setCardsArray={setCardsArray}
        />
      )}

      <div
        className={`h-full w-full transition-colors ${
          active ? 'bg-lime-50' : 'bg-neutral-800/0'
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId="-1" column={column} />
        {/* <AddCard column={column} setCards={setCards} /> */}
      </div>
    </div>
  );
};

const Card = ({
  column,
  handleDragStart,
  visitingUnitNumber,
  visitorName,
  issuedOn,
  parkingDayCount,
  validUntil,
  licensePlate,
  vehicleMake,
  vehicleColor,
  id,
}) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { id, column })}
        className="cursor-grab border  rounded bg-gradient-to-r from-slate-600 via-slate-450 to-slate-400 outline outline-1 outline-gray-300 p-3 active:cursor-grabbing"
      >
        <h3 className="font-medium text-white">
          Visiting Unit: {visitingUnitNumber}
        </h3>
        <div className="flex items-center justify-between gap-1 text-sm text-white font-medium">
          <p className="">Visitor Name: {visitorName}</p>
          <p className="">License Plate: {licensePlate}</p>
        </div>
        <div className="text-sm text-white">
          <p className="">Issued On: {issuedOn}</p>
          <p className="">Valid Until: {validUntil}</p>
        </div>
      </motion.div>
      <DropIndicator beforeId={id} column={column} />
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || '-1'}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    ></div>
  );
};
