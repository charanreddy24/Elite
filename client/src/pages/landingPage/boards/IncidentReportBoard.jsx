import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import IncidentReportModal from '/src/components/Modals/IncidentReport.jsx';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

export default function incidentReportBoard({ cardsArray, setCardsArray }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setCards(cardsArray);
      setLoading(false);
    }, 1000);
  }, [cardsArray]);

  return (
    <div className="flex gap-2 overflow-y-auto w-full h-full text-center">
      <Column
        title="Incident Report Created"
        headingColor="text-red-500"
        column="Incident Report Created"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
        loading={loading}
        setLoading={setLoading}
      />
      <Column
        title="Actioned"
        headingColor="text-red-500"
        column="Actioned"
        cards={cards}
        setCards={setCards}
        cardsArray={cardsArray}
        setCardsArray={setCardsArray}
        loading={loading}
        setLoading={setLoading}
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
  loading,
  setLoading,
}) => {
  const [active, setActive] = useState(false);
  const [newColumn, setNewColumn] = useState('');
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    setNewColumn(column);
  }, [column]);

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
    currentUser.isAdmin
      ? null
      : toast.error(`Only Admin can move this into ${newColumn}`);
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
      setNewColumn(column);
      cardToTransfer = {
        ...cardToTransfer,
        column,
      };
      fetch(
        `/api/incidentReport/updateIncidentReportColumn/${cardToTransfer._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newColumn }),
        },
      ).catch((error) => {
        console.error('Error updating column for card:', cardId, error);
      });

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
    currentUser.isAdmin
      ? toast.success(`Successfully Moved into ${newColumn}`)
      : null;
  };
  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow-sm flex flex-col flex-1 overflow-y-auto ">
      <div className="mb-3 flex items-center text-center justify-between">
        <h2 className={'mb-4 pb-2 border-b border-gray-300 text-center '}>
          {title}
        </h2>
        {loading ? (
          <div className="bg-lime-500 text-white px-2 py-1 mt-[-23px] rounded ">
            <Spinner size="sm"></Spinner>
          </div>
        ) : (
          <span className="bg-lime-500 text-white px-2 py-1 mt-[-23px] rounded ">
            {filteredCards.length}
          </span>
        )}
      </div>
      {title === 'Incident Report Created' && (
        <IncidentReportModal
          cardsArray={cardsArray}
          setCardsArray={setCardsArray}
        />
      )}
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner size="xl"></Spinner>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDragEnd}
          className={`h-full w-full transition-colors ${
            active ? 'bg-slate-300' : 'bg-neutral-800/0'
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
  loggedDate,
  slug,
  description,
  _id,
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const dragStartHandler = currentUser.isAdmin
    ? (e) => handleDragStart(e, { title, id, column, slug })
    : null;

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={dragStartHandler}
        className="cursor-grab border  rounded bg-gradient-to-r from-slate-600 via-slate-500 to-slate-400 outline outline-1 outline-gray-300 p-3 active:cursor-grabbing"
      >
        <Link
          className="font-medium dark:text-gray-900 text-white"
          to={`/view-incidentReport/${_id}`}
        >
          <h3 className="font-medium border-solid border-b-2 inline-block border-white-300">
            {title}
          </h3>

          <div className="flex justify-end p-1">
            <p className="border border-slate-600 rounded-lg inline-block text-xs text-black p-1">
              Status: {column}
            </p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-1 text-sm text-white font-medium p-1">
          <p className="">Logged by: {loggedBy}</p>
          <p className="">Type of Incident: {incidentType}</p>
        </div>
        <div className="text-sm text-white p-1">
          <p className="">Logged on Date: {loggedDate}</p>
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
      className="my-0.5 h-0.5 w-full bg-slate-900 opacity-0"
    ></div>
  );
};
