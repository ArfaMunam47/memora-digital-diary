import { useState, useEffect, useCallback, useRef } from 'react';
import { DiaryBook, DiaryElement, DiaryPage, PageBackground, TemplateDefinition, TemplateElement } from '../types/diary';
import { INITIAL_BOOK } from '../data/initialBook';
import { STARTER_TEMPLATES } from '../data/templates';

const STORAGE_KEY = 'keepsake_diary_book_data_v1';
const MAX_HISTORY = 40;

export function useDiaryStore() {
  // Load from local storage or fallback to INITIAL_BOOK
  const [book, setBook] = useState<DiaryBook>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.pages) && parsed.pages.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved diary book, using default:', e);
    }
    return INITIAL_BOOK;
  });

  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');

  // Undo / Redo history stacks
  const [past, setPast] = useState<DiaryBook[]>([]);
  const [future, setFuture] = useState<DiaryBook[]>([]);

  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active page accessor
  const activePage: DiaryPage = book.pages[activePageIndex] || book.pages[0];

  // Selected element accessor
  const selectedElement = activePage?.elements.find((el) => el.id === selectedElementId) || null;

  // Auto-save debounced to localStorage
  useEffect(() => {
    setSaveStatus('unsaved');
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);

    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saving');
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(book));
        setTimeout(() => setSaveStatus('saved'), 300);
      } catch (err) {
        console.error('Failed to auto-save to localStorage:', err);
        setSaveStatus('unsaved');
      }
    }, 600);

    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [book]);

  // Push state to undo stack
  const recordHistory = useCallback((prevBook: DiaryBook) => {
    setPast((curr) => [...curr.slice(-MAX_HISTORY), prevBook]);
    setFuture([]); // clear redo stack on new action
  }, []);

  // Update book and record undo
  const updateBook = useCallback((newBook: DiaryBook, shouldRecord = true) => {
    setBook((curr) => {
      if (shouldRecord) {
        recordHistory(curr);
      }
      return {
        ...newBook,
        updatedAt: new Date().toISOString(),
      };
    });
  }, [recordHistory]);

  // Undo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    setFuture((curr) => [book, ...curr]);
    setPast(newPast);
    setBook(previous);
  }, [past, book]);

  // Redo
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setPast((curr) => [...curr, book]);
    setFuture(newFuture);
    setBook(next);
  }, [future, book]);

  // Element actions
  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const updateElement = useCallback(
    (id: string, updates: Partial<DiaryElement>, shouldRecord = true) => {
      setBook((prevBook) => {
        if (shouldRecord) {
          recordHistory(prevBook);
        }
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          const updatedElements = page.elements.map((el) => {
            if (el.id !== id) return el;
            return { ...el, ...updates } as DiaryElement;
          });
          return { ...page, elements: updatedElements };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });
    },
    [activePageIndex, recordHistory]
  );

  const addElement = useCallback(
    (elementData: TemplateElement) => {
      const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          const maxZ = page.elements.reduce((acc, el) => Math.max(acc, el.zIndex || 0), 0);
          const newElement = {
            ...elementData,
            id: newId,
            zIndex: maxZ + 1,
          } as DiaryElement;
          return {
            ...page,
            elements: [...page.elements, newElement],
          };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });
      setSelectedElementId(newId);
    },
    [activePageIndex, recordHistory]
  );

  const deleteElement = useCallback(
    (idToDelete?: string) => {
      const targetId = idToDelete || selectedElementId;
      if (!targetId) return;

      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          return {
            ...page,
            elements: page.elements.filter((el) => el.id !== targetId),
          };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });

      if (selectedElementId === targetId) {
        setSelectedElementId(null);
      }
    },
    [selectedElementId, activePageIndex, recordHistory]
  );

  const duplicateElement = useCallback(
    (idToDup?: string) => {
      const targetId = idToDup || selectedElementId;
      if (!targetId) return;

      const targetEl = activePage?.elements.find((el) => el.id === targetId);
      if (!targetEl) return;

      const newId = `el-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const duplicated: DiaryElement = {
        ...targetEl,
        id: newId,
        x: Math.min(targetEl.x + 20, 500),
        y: Math.min(targetEl.y + 20, 700),
        zIndex: (targetEl.zIndex || 1) + 1,
      };

      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          return {
            ...page,
            elements: [...page.elements, duplicated],
          };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });

      setSelectedElementId(newId);
    },
    [selectedElementId, activePage, activePageIndex, recordHistory]
  );

  const reorderElement = useCallback(
    (id: string, action: 'front' | 'back' | 'forward' | 'backward') => {
      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          const elements = [...page.elements];
          const currIndex = elements.findIndex((el) => el.id === id);
          if (currIndex === -1) return page;

          const target = elements[currIndex];
          elements.splice(currIndex, 1);

          if (action === 'front') {
            elements.push(target);
          } else if (action === 'back') {
            elements.unshift(target);
          } else if (action === 'forward') {
            const nextIdx = Math.min(currIndex + 1, elements.length);
            elements.splice(nextIdx, 0, target);
          } else if (action === 'backward') {
            const prevIdx = Math.max(currIndex - 1, 0);
            elements.splice(prevIdx, 0, target);
          }

          // normalize z-indices
          const normalized = elements.map((el, i) => ({
            ...el,
            zIndex: i + 1,
          }));

          return { ...page, elements: normalized };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });
    },
    [activePageIndex, recordHistory]
  );

  // Page background & title
  const updatePageBackground = useCallback(
    (updates: Partial<PageBackground>) => {
      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          return {
            ...page,
            background: {
              ...page.background,
              ...updates,
            },
          };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });
    },
    [activePageIndex, recordHistory]
  );

  const updatePageTitle = useCallback(
    (title: string) => {
      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          return { ...page, title };
        });
        return { ...prevBook, pages: updatedPages, updatedAt: new Date().toISOString() };
      });
    },
    [activePageIndex, recordHistory]
  );

  // Page navigation & management
  const addPage = useCallback(
    (templateId?: string) => {
      const template = templateId
        ? STARTER_TEMPLATES.find((t) => t.id === templateId)
        : null;

      const newPageNumber = book.pages.length + 1;
      const newPage: DiaryPage = {
        id: `page-${Date.now()}`,
        pageNumber: newPageNumber,
        title: template ? template.title : `Page ${newPageNumber}`,
        background: template
          ? { ...template.background }
          : {
              type: 'pattern',
              color: '#FFFDF9',
              pattern: 'dotted',
              patternOpacity: 0.15,
              patternColor: '#78350F',
            },
        elements: template
          ? (template.elements.map((el, i) => ({
              ...el,
              id: `el-${Date.now()}-${i}`,
            })) as DiaryElement[])
          : [],
      };

      setBook((prevBook) => {
        recordHistory(prevBook);
        return {
          ...prevBook,
          pages: [...prevBook.pages, newPage],
          updatedAt: new Date().toISOString(),
        };
      });

      setActivePageIndex(book.pages.length);
      setSelectedElementId(null);
    },
    [book.pages.length, recordHistory]
  );

  const duplicatePage = useCallback(
    (indexToDup?: number) => {
      const targetIdx = indexToDup !== undefined ? indexToDup : activePageIndex;
      const pageToDup = book.pages[targetIdx];
      if (!pageToDup) return;

      const duplicatedPage: DiaryPage = {
        id: `page-${Date.now()}`,
        pageNumber: book.pages.length + 1,
        title: `${pageToDup.title} (Copy)`,
        background: { ...pageToDup.background },
        elements: pageToDup.elements.map((el) => ({
          ...el,
          id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        })),
      };

      setBook((prevBook) => {
        recordHistory(prevBook);
        const newPages = [...prevBook.pages];
        newPages.splice(targetIdx + 1, 0, duplicatedPage);
        // renumber
        const renumbered = newPages.map((p, i) => ({ ...p, pageNumber: i + 1 }));
        return {
          ...prevBook,
          pages: renumbered,
          updatedAt: new Date().toISOString(),
        };
      });

      setActivePageIndex(targetIdx + 1);
      setSelectedElementId(null);
    },
    [activePageIndex, book.pages, recordHistory]
  );

  const deletePage = useCallback(
    (indexToDelete?: number) => {
      const targetIdx = indexToDelete !== undefined ? indexToDelete : activePageIndex;
      if (book.pages.length <= 1) {
        // Can't delete the only page
        return;
      }

      setBook((prevBook) => {
        recordHistory(prevBook);
        const newPages = prevBook.pages.filter((_, i) => i !== targetIdx);
        const renumbered = newPages.map((p, i) => ({ ...p, pageNumber: i + 1 }));
        return {
          ...prevBook,
          pages: renumbered,
          updatedAt: new Date().toISOString(),
        };
      });

      const nextActive = Math.max(0, Math.min(targetIdx, book.pages.length - 2));
      setActivePageIndex(nextActive);
      setSelectedElementId(null);
    },
    [activePageIndex, book.pages.length, recordHistory]
  );

  const switchPage = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < book.pages.length) {
        setActivePageIndex(newIndex);
        setSelectedElementId(null);
      }
    },
    [book.pages.length]
  );

  const reorderPages = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;
      setBook((prevBook) => {
        recordHistory(prevBook);
        const pages = [...prevBook.pages];
        const [moved] = pages.splice(fromIndex, 1);
        pages.splice(toIndex, 0, moved);
        const renumbered = pages.map((p, i) => ({ ...p, pageNumber: i + 1 }));
        return {
          ...prevBook,
          pages: renumbered,
          updatedAt: new Date().toISOString(),
        };
      });
      setActivePageIndex(toIndex);
      setSelectedElementId(null);
    },
    [recordHistory]
  );

  const applyTemplateToCurrentPage = useCallback(
    (template: TemplateDefinition) => {
      setBook((prevBook) => {
        recordHistory(prevBook);
        const updatedPages = prevBook.pages.map((page, idx) => {
          if (idx !== activePageIndex) return page;
          const newElements = template.elements.map((el, i) => ({
            ...el,
            id: `el-${Date.now()}-${i}`,
          })) as DiaryElement[];
          return {
            ...page,
            title: template.title,
            background: { ...template.background },
            elements: newElements,
          };
        });
        return {
          ...prevBook,
          pages: updatedPages,
          updatedAt: new Date().toISOString(),
        };
      });
      setSelectedElementId(null);
    },
    [activePageIndex, recordHistory]
  );

  const updateBookTitle = useCallback(
    (title: string) => {
      setBook((prev) => ({ ...prev, title }));
    },
    []
  );

  const resetBook = useCallback(() => {
    recordHistory(book);
    setBook(INITIAL_BOOK);
    setActivePageIndex(0);
    setSelectedElementId(null);
  }, [book, recordHistory]);

  return {
    book,
    activePageIndex,
    activePage,
    selectedElementId,
    selectedElement,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    saveStatus,
    undo,
    redo,
    selectElement,
    updateElement,
    addElement,
    deleteElement,
    duplicateElement,
    reorderElement,
    updatePageBackground,
    updatePageTitle,
    addPage,
    duplicatePage,
    deletePage,
    switchPage,
    reorderPages,
    applyTemplateToCurrentPage,
    updateBookTitle,
    resetBook,
  };
}
