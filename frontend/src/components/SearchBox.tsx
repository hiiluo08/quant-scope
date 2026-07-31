import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBoxProps {
  symbols: string[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

export const SearchBox: React.FC<SearchBoxProps> = ({ symbols, selectedSymbol, onSelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredSymbols = symbols.filter((sym) =>
    sym.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 50); // Limit to 50 results to prevent lag

  useEffect(() => {
    setQuery(selectedSymbol);
  }, [selectedSymbol]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '300px' }}>
      <div style={{ position: 'relative' }}>
        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={16} />
        <input
          type="text"
          style={{
            width: '100%',
            padding: '8px 12px 8px 36px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box'
          }}
          placeholder="Search symbols..."
          onFocus={(e) => {
            setIsOpen(true);
            e.currentTarget.style.borderColor = 'var(--accent)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
          }}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
        />
      </div>
      {isOpen && filteredSymbols.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            marginTop: '8px',
            padding: 0,
            listStyle: 'none',
            zIndex: 10,
            boxShadow: 'var(--shadow-md)'
          }}
        >
          {filteredSymbols.map((sym) => (
            <li
              key={sym}
              onClick={() => {
                onSelect(sym);
                setIsOpen(false);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                borderBottom: '1px solid var(--border-subtle)',
                fontSize: '0.875rem'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--surface-2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {sym}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
