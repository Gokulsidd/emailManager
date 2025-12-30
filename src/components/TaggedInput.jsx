'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function TaggedInput({ tags, onChange, placeholder = 'Type and press Enter' }) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const addTags = (newTags) => {
    const validTags = [];
    const invalidTags = [];

    newTags.forEach(tag => {
      const trimmedTag = tag.trim();
      if (trimmedTag) {
        if (isValidEmail(trimmedTag)) {
          if (!tags.includes(trimmedTag)) {
            validTags.push(trimmedTag);
          }
        } else {
          invalidTags.push(trimmedTag);
        }
      }
    });

    if (validTags.length > 0) {
      onChange([...tags, ...validTags]);
    }

    if (invalidTags.length > 0) {
      setError(`Invalid email(s): ${invalidTags.join(', ')}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTags([inputValue]);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const emails = pastedText.split(/[,;\s]+/).filter(email => email.trim());
    addTags(emails);
    setInputValue('');
  };

  const handleRemoveTag = (indexToRemove) => {
    onChange(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <div className="w-full px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 bg-background transition-all">
        <div className="flex flex-wrap gap-1.5 items-center">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-sm rounded-md font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(index)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
            placeholder={tags.length === 0 ? placeholder : ''}
            autoComplete="off"
          />
        </div>
      </div>
      {error && (
        <p className="text-destructive text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}