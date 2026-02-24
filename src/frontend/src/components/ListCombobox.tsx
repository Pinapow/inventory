import { useState, useEffect, useRef, useCallback, useId } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { listsApi } from '../services/api';
import { ItemList } from '../types/item';
import { cn } from '@/lib/utils';

interface ListComboboxProps {
  id?: string;
  value: string;
  onChange: (id: string) => void;
  error?: boolean;
  disabled?: boolean;
}

const DEBOUNCE_MS = 300;
const RESULTS_SIZE = 10;

export default function ListCombobox({ id, value, onChange, error = false, disabled = false }: ListComboboxProps) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<ItemList[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }
    const controller = new AbortController();
    listsApi.getById(value, controller.signal)
      .then((list) => {
        if (!controller.signal.aborted) {
          setInputValue(list.name);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setInputValue('');
      });
    return () => controller.abort();
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    setSearching(true);

    const timer = setTimeout(async () => {
      try {
        const response = await listsApi.getAll({ search: inputValue, size: RESULTS_SIZE }, controller.signal);
        if (!controller.signal.aborted) {
          setOptions(response.content);
          setActiveIndex(-1);
        }
      } catch {
        if (!controller.signal.aborted) setOptions([]);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [inputValue, isOpen]);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const selectOption = useCallback((list: ItemList) => {
    onChange(list.id);
    setInputValue(list.name);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [onChange]);

  const clearSelection = useCallback(() => {
    onChange('');
    setInputValue('');
    setOptions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (value) onChange('');
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          selectOption(options[activeIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          'flex items-center w-full h-10 px-3 bg-background border rounded-lg transition-all duration-200 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
          error ? 'border-destructive focus-within:ring-destructive' : 'border-input',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une liste..."
          disabled={disabled}
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground min-w-0"
        />
        {value && !disabled && (
          <button
            type="button"
            onClick={clearSelection}
            aria-label="Effacer la selection"
            className="ml-2 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {!value && (
          <ChevronDown className={cn(
            'h-4 w-4 text-muted-foreground flex-shrink-0 ml-2 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        )}
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 w-full mt-1 bg-popover border rounded-xl shadow-float overflow-hidden"
        >
          {searching ? (
            <li className="px-4 py-3 text-muted-foreground text-sm">Recherche...</li>
          ) : options.length === 0 ? (
            <li className="px-4 py-3 text-muted-foreground text-sm">Aucune liste trouvee</li>
          ) : (
            options.map((list, index) => (
              <li
                key={list.id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={list.id === value}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectOption(list);
                }}
                className={cn(
                  'px-4 py-2.5 cursor-pointer transition-colors duration-150 flex items-center justify-between text-sm',
                  index === activeIndex
                    ? 'bg-secondary text-foreground'
                    : list.id === value
                    ? 'bg-secondary/50 text-foreground'
                    : 'text-foreground hover:bg-secondary/60'
                )}
              >
                <span className="font-medium">{list.name}</span>
                {list.category && (
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{list.category}</span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
