// src/components/Tabs/OverflowMenu.tsx
import React, { useState } from 'react';
import type { FC } from 'react';
import type { TabModel } from './types';

interface OverflowMenuProps {
  tabs: TabModel[];
  onSelectOverflow: (id: string) => void;
  onPinToggleOverflow: (id: string) => void;
  onCloseOverflow: (id: string) => void;     
}

const OverflowMenu: FC<OverflowMenuProps> = ({
  tabs,
  onSelectOverflow,
  onPinToggleOverflow,
  onCloseOverflow,                        
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(open => !open)}
        className="px-3 py-1 bg-gray-200 rounded"
        aria-label="More tabs"
      >
        ⋯
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-10">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className="flex items-center justify-between px-4 py-2 hover:bg-gray-100"
            >
              <button
                onClick={() => {
                  onSelectOverflow(tab.id);
                  setIsOpen(false);
                }}
                className="flex-1 text-left"
              >
                {tab.title}
              </button>
              <div className="flex items-center space-x-2">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onPinToggleOverflow(tab.id);
                  }}
                  aria-label={tab.pinned ? 'Unpin tab' : 'Pin tab'}
                >
                  {tab.pinned ? '📌' : '📍'}
                </button>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onCloseOverflow(tab.id);
                  }}
                  aria-label="Close tab"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverflowMenu;
