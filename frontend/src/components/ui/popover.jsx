import React, { useRef, useEffect } from "react";

// Controlled Popover implementation (no Popper.js)
export function Popover({ open, setOpen, children }) {
  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      {React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, setOpen })
          : child
      )}
    </div>
  );
}

export function PopoverTrigger({ children, open, setOpen }) {
  const child = React.Children.only(children);
  return React.cloneElement(child, {
    onClick: e => {
      setOpen(!open);
      if (child.props.onClick) child.props.onClick(e);
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'data-popover-trigger': true,
  });
}

export function PopoverContent({ children, open, setOpen, className = "", style = {}, position = "bottom", ...props }) {
  const contentRef = useRef();
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);
  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div
      ref={contentRef}
      className={className}
      style={{
        zIndex: 1000,
        minWidth: 240,
        background: 'white',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        border: '1px solid #e5e7eb',
        padding: 16,
        position: 'absolute',
        left: 0,
        ...(position === 'top'
          ? { bottom: '100%', top: 'auto', marginBottom: 8, marginTop: 0 }
          : { top: '100%', marginTop: 8, marginBottom: 0 }),
        ...style
      }}
      tabIndex={-1}
      {...props}
    >
      {children}
    </div>
  );
} 