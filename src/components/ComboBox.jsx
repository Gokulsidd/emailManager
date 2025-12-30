'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export default function ComboBox({
  value,
  onChange,
  onOptionSelect,
  onClear,
  options,
  placeholder = 'Select or type...',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const filtered = options.filter((option) =>
      option.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    onChange(option);
    if (onOptionSelect) {
      onOptionSelect(option);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue('');
    onChange('');
    if (onClear) {
      onClear();
    }
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsReadOnly(false);
            setIsOpen(true);
          }}
          onBlur={() => setIsReadOnly(true)}
          readOnly={isReadOnly}
          className="w-full px-3 py-2 pr-16 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 text-sm transition-all"
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          name={`field-${Date.now()}-${Math.random()}`}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="Clear"
            >
              <X className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-muted rounded transition-colors"
            aria-label="Toggle dropdown"
          >
            <ChevronDown
              className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionClick(option)}
              className="px-3 py-2 hover:bg-accent cursor-pointer transition-colors text-sm"
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && inputValue && (
        <div className="absolute z-10 w-full mt-1 bg-popover border rounded-lg shadow-lg">
          <div className="px-3 py-2 text-muted-foreground text-sm">
            No matches found. Press Enter to use &quot;{inputValue}&quot;
          </div>
        </div>
      )}
    </div>
  );
}