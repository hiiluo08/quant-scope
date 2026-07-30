import React, { useState, useRef, useEffect } from 'react';

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
    <div ref={wrapperRef} style={{ position: 'relative', width: '250px' }}>
      <input
        type="text"
        className="form-input"
        placeholder="Search 500+ symbols..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '6px',
          border: '1px solid var(--border)',
          background: 'var(--surface)',
          color: 'var(--ink)'
        }}
      />
      {isOpen && filteredSymbols.length > 0 && (
        <ul
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            marginTop: '4px',
            padding: 0,
            listStyle: 'none',
            zIndex: 10,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
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
                color: 'var(--ink)',
                borderBottom: '1px solid var(--border-light)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--page-bg)')}
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
