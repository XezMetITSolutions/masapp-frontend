'use client';

import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SafeHTMLProps {
  content: string;
  allowedTags?: string[];
  allowedAttributes?: string[];
  className?: string;
  dangerouslySetInnerHTML?: boolean;
}

export default function SafeHTML({ 
  content, 
  allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
  allowedAttributes = [],
  className = '',
  dangerouslySetInnerHTML = false
}: SafeHTMLProps) {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    return DOMPurify.sanitize(content, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: allowedAttributes,
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_DOM: true,
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false
    });
  }, [content, allowedTags, allowedAttributes]);

  if (dangerouslySetInnerHTML) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />
    );
  }

  // Güvenli text rendering
  return (
    <div className={className}>
      {sanitizedContent}
    </div>
  );
}

// Güvenli link bileşeni
interface SafeLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function SafeLink({ href, children, className = '', target = '_blank', rel = 'noopener noreferrer' }: SafeLinkProps) {
  const sanitizedHref = useMemo(() => {
    // Sadece güvenli protokollere izin ver
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    const url = new URL(href, window.location.origin);
    
    if (!allowedProtocols.includes(url.protocol)) {
      return '#';
    }
    
    return href;
  }, [href]);

  return (
    <a 
      href={sanitizedHref}
      className={className}
      target={target}
      rel={rel}
    >
      {children}
    </a>
  );
}

// Güvenli form input bileşeni
interface SafeInputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  pattern?: string;
}

export function SafeInput({ 
  type, 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  maxLength = 255,
  pattern
}: SafeInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // XSS koruması
    newValue = newValue.replace(/[<>]/g, '');
    
    // Max length kontrolü
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.substring(0, maxLength);
    }
    
    // Pattern kontrolü
    if (pattern && !new RegExp(pattern).test(newValue)) {
      return;
    }
    
    onChange(newValue);
  };

  return (
    <input
      type={type}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      maxLength={maxLength}
      pattern={pattern}
      autoComplete="off"
      spellCheck="false"
    />
  );
}

// Güvenli textarea bileşeni
interface SafeTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  maxLength?: number;
  rows?: number;
}

export function SafeTextarea({ 
  value, 
  onChange, 
  placeholder = '', 
  className = '',
  maxLength = 1000,
  rows = 4
}: SafeTextareaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    
    // XSS koruması
    newValue = newValue.replace(/[<>]/g, '');
    
    // Max length kontrolü
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.substring(0, maxLength);
    }
    
    onChange(newValue);
  };

  return (
    <textarea
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={className}
      maxLength={maxLength}
      rows={rows}
      autoComplete="off"
      spellCheck="false"
    />
  );
}
