import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const MapController = ({ activeStore, stores }) => {
  const map = useMap()

  useEffect(() => {
    // Invalidate map size to ensure tiles load correctly
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }, [map])

  useEffect(() => {
    if (activeStore) {
      map.setView([activeStore.lat, activeStore.lng], 15, { animate: true })
    } else if (stores.length > 0) {
      const bounds = stores.map(s => [s.lat, s.lng])
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }
  }, [activeStore, stores, map])

  return null
}

const CustomMarker = ({ store, isActive, onClick }) => {
  return (
    <Marker
      position={[store.lat, store.lng]}
      eventHandlers={{ click: () => onClick(store) }}
      icon={L.divIcon({
        className: isActive ? 'active-marker' : '',
        html: `
          <div class="${isActive ? 'scale-125 z-10' : ''} relative transition-transform">
            <div class="w-10 h-10 rounded-full bg-green-500 border-4 border-white shadow-lg flex items-center justify-center">
              <div class="w-3 h-3 rounded-full bg-white"></div>
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
      })}
    >
      <Popup className="rounded-xl shadow-xl">
        <div className="font-sans p-2">
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">{store.storeId}</span>
          <h5 className="mt-1 mb-1 text-sm font-bold text-gray-800">{store.name}</h5>
          <p className="text-xs text-gray-600">{store.area}, {store.line2}</p>
          <p className="text-xs text-gray-500">{store.city}</p>
        </div>
      </Popup>
    </Marker>
  )
}

const StoreLocatorMap = ({ activeStore, stores, handleStoreClick }) => {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: '500px' }}>
      <MapContainer
        key="store-locator-map"
        center={[19.1000, 72.8400]}
        zoom={12}
        zoomControl={false}
        className="leaflet-container"
        style={{ width: '100%', height: '100%' }}
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ZoomControl position="bottomright" />
      <MapController activeStore={activeStore} stores={stores} />
      {stores.map(store => (
        <CustomMarker
          key={store.id}
          store={store}
          isActive={activeStore?.id === store.id}
          onClick={handleStoreClick}
        />
      ))}
    </MapContainer>
    </div>
  )
}

export default StoreLocatorMap
