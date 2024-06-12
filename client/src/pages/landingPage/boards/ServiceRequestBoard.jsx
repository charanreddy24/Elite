import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import ServiceRequestModal from '/src/components/Modals/ServiceRequest.jsx';

export default function parkingReportBoard({ cardsArray, setCardsArray }) {
  const handleCreateClick = () => {
    console.log('Create button clicked');
  };
  const [cards, setCards] = useState([]);
  useEffect(() => {
    setCards(cardsArray); // Update cards when kanbanCardArray changes
  }, [cardsArray]);

  return (
    <div className="flex gap-2 overflow-y-auto w-full h-full text-center">
      <Column
        title="Requests Created"
        headingColor="text-red-500"
        column="Requests Created"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
      />

      <Column
        title="Service In Progress"
        headingColor="text-red-500"
        column="Service In Progress"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
      />
      <Column
        title="Resolved"
        headingColor="text-red-500"
        column="Resolved"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
      />
    </div>
  );
}

// const BoardColumn = ({ title, headingColor, column, cards, setCards }) => {
//   return (
//     <div className="bg-white dark:bg-slate-800 p-4 rounded shadow-sm flex flex-col flex-1 overflow-y-auto">
//       <h2 className="mb-4 pb-2 border-b border-gray-300 text-center sm:text-sm">
//         {title}
//       </h2>
//     </div>
//   );
// };

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
        <span className="">{filteredCards.length}</span>
      </div>

      {title === 'Requests Created' && (
        <ServiceRequestModal
          cardsArray={cardsArray}
          setCardsArray={setCardsArray}
          disabled
        />
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
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

      {(title === 'Active Day Permit' || title === 'Active Night Permit') && (
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
      )}
    </div>
  );
};

const Card = ({
  title,
  id,
  column,
  handleDragStart,
  incidentType,
  loggedBy,
  incidentDate,
  description,
}) => {
  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { title, id, column })}
        className="cursor-grab border  rounded bg-gradient-to-r from-red-200 via-mint-500 to-purple-200 outline outline-1 outline-gray-300 p-3 active:cursor-grabbing"
      >
        <h3 className="font-medium ">{title}</h3>
        <div className="flex items-center justify-between gap-1 text-sm text-black font-medium">
          <p className="">Logged by: {loggedBy}</p>
          <p className="">Type of Incident: {incidentType}</p>
        </div>
        <div className="text-sm text-black">
          <p className="">Date: {incidentDate}</p>
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

// const AddCard = ({ column, setCards }) => {
//   const [text, setText] = useState("");
//   const [adding, setAdding] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!text.trim().length) return;

//     const newCard = {
//       column,
//       title: text.trim(),
//       id: Math.random().toString(),
//     };
//     setCards((pv) => [...pv, newCard]);
//     setAdding(false);
//   };
//   return (
//     <>
//       {adding ? (
//         <motion.form layout onSubmit={handleSubmit}>
//           <textarea
//             onChange={(e) => setText(e.target.value)}
//             autoFocus
//             placeholder="Add new task..."
//             className="w-full rounded border border-violet-400 bg-violet-400/20 p-3
//             text-sm text-neutral-50
//             placeholder:text-violet-300 focus:outline-0"
//           />
//           <div className="mt-1.5 flex items-center justify-end gap-1.5 ">
//             <button
//               onClick={() => setAdding(false)}
//               className="px-3 py-1.5 text-xs text-neutral-400 transition-colors
//             hover:text-neutral-50"
//             >
//               Close
//             </button>
//             <button
//               type="submit"
//               className=" flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5
//               text-xs text-neutral-400 transition-colors"
//             >
//               <span>Add</span>
//               <FiPlus />
//             </button>
//           </div>
//         </motion.form>
//       ) : (
//         <motion.button
//           onClick={() => setAdding(true)}
//           className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400
//           transition hover:text-neutral-50"
//         >
//           <span>Add card</span>
//           <FiPlus />
//         </motion.button>
//       )}
//     </>
//   );
// };
//
