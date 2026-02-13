import React, { useState } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://raw.githubusercontent.com";

export const EnvironmentalMap = ({ onLocationSelect }: any) => {
  return (
    <div className="w-full h-full bg-black/40 rounded-lg cursor-crosshair relative overflow-hidden border border-amber-900/20">
      <div className="absolute top-2 left-2 z-10 text-[10px] text-green-500 font-mono animate-pulse">
        [SCANNING_GLOBAL_SECTORS...]
      </div>
      <ComposableMap projectionConfig={{ scale: 145 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => {
                  const { LATENT, LON } = geo.properties;
                  onLocationSelect(geo.properties);
                }}
                style={{
                  default: { fill: "#111", stroke: "#332200", strokeWidth: 0.5, outline: "none" },
                  hover: { fill: "#443300", stroke: "#ffb000", strokeWidth: 1, outline: "none" },
                  pressed: { fill: "#ffb000", outline: "none" },
                }}
              />
            ))
          }
        </Geographies>
        <Marker coordinates={[37.6173, 55.7558]}>
          <circle r={4} fill="#32cd32" stroke="#fff" strokeWidth={1} />
          <text textAnchor="middle" y={-10} style={{ fontFamily: "monospace", fill: "#32cd32", fontSize: "8px" }}>D-6</text>
        </Marker>
      </ComposableMap>
    </div>
  );
};
