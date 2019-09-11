import React from 'react';

export function PlaySvgComponent(props) {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" { ...props }>
      <path d="M832.0064 512 192 896 192 128 832.0064 512 832.0064 512zM832.0064 512" />
    </svg>
  );
}

export function PauseSvgComponent(props) {
  return (
    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200" { ...props }>
      <path d="M191.397656 128.194684l191.080943 0 0 768.472256-191.080943 0 0-768.472256Z" />
      <path d="M575.874261 128.194684l192.901405 0 0 768.472256-192.901405 0 0-768.472256Z" />
    </svg>
  );
}