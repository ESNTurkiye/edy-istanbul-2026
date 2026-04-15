"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngExpression, Map } from "leaflet";
import "leaflet/dist/leaflet.css";

const DARK_TILES =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

// Centered on historical peninsula + Kadıköy; tighter zoom on desktop, wider on mobile so landmarks read as a route
const ISTANBUL_CENTER: LatLngExpression = [41.01, 29.003];
const ZOOM_DESKTOP = 13;
const ZOOM_MOBILE = 11.75;

function isNarrowViewport() {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
}

function Controller({ onMapReady }: { onMapReady: (m: Map) => void }) {
    const map = useMap();
    useEffect(() => {
        const apply = () => {
            const z = isNarrowViewport() ? ZOOM_MOBILE : ZOOM_DESKTOP;
            map.setView(ISTANBUL_CENTER, z, { animate: false });
            map.invalidateSize();
            onMapReady(map);
        };

        apply();
        window.addEventListener("resize", apply);
        const mq = window.matchMedia("(max-width: 767px)");
        mq.addEventListener("change", apply);
        return () => {
            window.removeEventListener("resize", apply);
            mq.removeEventListener("change", apply);
        };
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
            zoom={ZOOM_DESKTOP}
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
                opacity={0.92}
            />
            <Controller onMapReady={onMapReady} />
        </MapContainer>
    );
}
