import React, {
  useLayoutEffect,
  useState,
  useCallback,
  useRef,
  useEffect,
  type FC,
} from 'react';
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useNavigate, useLocation } from 'react-router-dom';
import type { TabModel } from './types';
import Tab from './Tab';
import OverflowMenu from './OverflowMenu';
import { loadTabs, saveTabs } from '../../utils/storage';

const STORAGE_KEY = 'exonn-tabs-order';

function debounce<F extends (...args: any[]) => void>(fn: F, ms: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

interface TabsContainerProps {
  initialTabs: TabModel[];
}

const TabsContainer: FC<TabsContainerProps> = ({ initialTabs }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useState<TabModel[]>(
    () => loadTabs<TabModel[]>(STORAGE_KEY) ?? initialTabs
  );
  const [visibleTabs, setVisibleTabs] = useState<TabModel[]>(tabs);
  const [overflowTabs, setOverflowTabs] = useState<TabModel[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    saveTabs(STORAGE_KEY, tabs);
  }, [tabs]);

  const updateOverflow = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth;

    const pinned = tabs.filter(t => t.pinned);
    const rest   = tabs.filter(t => !t.pinned);

    let used = 0;
    pinned.forEach(tab => {
      const el = container.querySelector<HTMLElement>(`[data-tab-id="${tab.id}"]`);
      used += el?.getBoundingClientRect().width ?? 0;
    });

    const newVis: TabModel[] = [...pinned];
    const newOvf: TabModel[] = [];
    rest.forEach(tab => {
      const el = container.querySelector<HTMLElement>(`[data-tab-id="${tab.id}"]`);
      const w = el?.getBoundingClientRect().width ?? 0;
      if (used + w <= cw) {
        newVis.push(tab);
        used += w;
      } else {
        newOvf.push(tab);
      }
    });

    setVisibleTabs(prev => (arraysEqual(prev, newVis) ? prev : newVis));
    setOverflowTabs(prev => (arraysEqual(prev, newOvf) ? prev : newOvf));
  }, [tabs]);

  useLayoutEffect(() => {
    updateOverflow();
  }, [tabs, updateOverflow]);

  useEffect(() => {
    const handler = debounce(updateOverflow, 100);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [updateOverflow]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTabs(prev =>
        arrayMove(
          prev,
          prev.findIndex(t => t.id === active.id),
          prev.findIndex(t => t.id === over.id)
        )
      );
    }
  };

  const activeId = tabs.find(t => t.url === location.pathname)?.id;

  return (
    <div className="relative border-b border-gray-300 bg-gray-200">
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tabs.map(t => t.id)} strategy={horizontalListSortingStrategy}>
          <div
            ref={containerRef}
            className="flex overflow-x-auto no-scrollbar items-end space-x-0"
          >
            {visibleTabs.map(tab => (
              <Tab
                key={tab.id}
                tab={tab}
                data-tab-id={tab.id}
                isActive={tab.id === activeId}
                onPinToggle={id =>
                  setTabs(prev =>
                    prev.map(t => (t.id === id ? { ...t, pinned: !t.pinned } : t))
                  )
                }
                onSelect={id => {
                  const sel = tabs.find(t => t.id === id);
                  if (sel) navigate(sel.url);
                }}
                onClose={id => setTabs(prev => prev.filter(t => t.id !== id))}
              />
            ))}
          </div>
        </SortableContext>

        {overflowTabs.length > 0 && (
          <div className="absolute right-0 top-0 bottom-0 flex items-center pr-2">
            <OverflowMenu
              tabs={overflowTabs}
              onSelectOverflow={id => {
                const sel = tabs.find(t => t.id === id);
                if (sel) navigate(sel.url);
              }}
              onPinToggleOverflow={id =>
                setTabs(prev =>
                  prev.map(t => (t.id === id ? { ...t, pinned: !t.pinned } : t))
                )
              }
              onCloseOverflow={id => setTabs(prev => prev.filter(t => t.id !== id))}
            />
          </div>
        )}
      </DndContext>
    </div>
  );
};

export default TabsContainer;
