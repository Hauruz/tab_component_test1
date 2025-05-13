import type { FC } from 'react';
import type { TabModel } from './types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TabProps {
  tab: TabModel;
  isActive?: boolean;
  onPinToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  'data-tab-id'?: string;
}

const Tab: FC<TabProps> = ({
  tab,
  isActive = false,
  onPinToggle,
  onSelect,
  onClose,
  'data-tab-id': dataTabId,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: tab.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      data-tab-id={dataTabId}
      onClick={() => onSelect(tab.id)}
      className={
        'relative flex items-center whitespace-nowrap px-4 py-2 select-none ' +
        'rounded-t-lg ' +
        (isActive
          ? 'bg-white border border-gray-300 border-b-white -mb-[1px]'
          : 'bg-gray-100 hover:bg-gray-200 border-transparent hover:border-gray-300')
      }
    >
      <span className={isActive ? 'text-gray-800' : 'text-gray-600'}>
        {tab.title}
      </span>

      
      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation();
          onPinToggle(tab.id);
        }}
        className="ml-2"
        aria-label={tab.pinned ? 'Unpin tab' : 'Pin tab'}
      >
        {tab.pinned ? '📌' : '📍'}
      </button>

      <button
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation();
          onClose(tab.id);
        }}
        className="ml-2 text-gray-400 hover:text-gray-600"
        aria-label="Close tab"
      >
        ✕
      </button>
    </div>
  );
};

export default Tab;
