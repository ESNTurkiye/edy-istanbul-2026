"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression, Map } from "leaflet";
import "leaflet/dist/leaflet.css";

const DARK_TILES =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

const ISTANBUL_CENTER: LatLngExpression = [41.01, 29.0];
const INITIAL_ZOOM = 12;

function Controller({ onMapReady }: { onMapReady: (m: Map) => void }) {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        onMapReady(map);
    }, [map, onMapReady]);
    return null;
}

interface Props {
    onMapReady: (m: Map) => void;
}

export default function MapBackground({ onMapReady }: Props) {
    return (
        <MapContainer
            center={ISTANBUL_CENTER}
            zoom={INITIAL_ZOOM}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            touchZoom={false}
            keyboard={false}
            attributionControl={false}
            style={{ width: "100%", height: "100%", background: "#020C1C" }}
        >
            <TileLayer
                url={DARK_TILES}
                subdomains="abcd"
                maxZoom={19}
                opacity={0.78}
            />
            <Controller onMapReady={onMapReady} />
        </MapContainer>
    );
}
