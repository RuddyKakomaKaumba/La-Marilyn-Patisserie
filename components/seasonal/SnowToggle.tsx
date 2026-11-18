"use client";

import { useEffect, useState } from "react";
import { SNOW_EVENT, SNOW_KEY } from "./Snowfall";

/** Bouton du bandeau pour couper ou relancer la neige (mémorisé). */
export default function SnowToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    try {
      setOn(localStorage.getItem(SNOW_KEY) !== "off");
    } catch {}
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(SNOW_KEY, next ? "on" : "off");
    } catch {}
    window.dispatchEvent(new Event(SNOW_EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      className="season-banner__snow"
      title={on ? "Arrêter la neige" : "Faire tomber la neige"}
    >
      <span aria-hidden="true">❄</span>
      <span className="sr-only">Neige animée</span>
    </button>
  );
}
