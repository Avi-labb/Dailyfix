import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, ArrowLeft, List, Map as MapIcon } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const storeRegistry = [
  { id: 'store1', lat: 19.1198, lng: 72.8733, name: 'KARTIKA MEDICAL', storeId: 'S0001', area: 'Marol', line2: 'Andheri East', city: 'Mumbai, Maharashtra' },
  { id: 'store2', lat: 19.0760, lng: 72.8345, name: 'BEAUTY AND MORE', storeId: 'S0002', area: 'Station Road', line2: 'Khar West', city: 'Mumbai, Maharashtra' },
  { id: 'store3', lat: 19.0600, lng: 72.8300, name: 'BEAUTY LIFE STYLE', storeId: 'S0003', area: 'Hill Road', line2: 'Bandra West', city: 'Mumbai, Maharashtra' },
  { id: 'store4', lat: 19.0810, lng: 72.8390, name: 'ROYAL BEAUTY', storeId: 'S0004', area: 'Station Road', line2: 'Santacruz West', city: 'Mumbai, Maharashtra' },
  { id: 'store5', lat: 19.0820, lng: 72.8400, name: 'AURA BEAUTY', storeId: 'S0005', area: 'Station Road', line2: 'Santacruz West', city: 'Mumbai, Maharashtra' },
  { id: 'store6', lat: 19.1000, lng: 72.8300, name: 'BEAUTY GLOW', storeId: 'S0006', area: 'Lokhandwala', line2: 'Andheri West', city: 'Mumbai, Maharashtra' },
  { id: 'store7', lat: 19.1010, lng: 72.8310, name: 'BEAUTY PLANET', storeId: 'S0007', area: 'Lokhandwala', line2: 'Andheri West', city: 'Mumbai, Maharashtra' },
  { id: 'store8', lat: 19.1100, lng: 72.8600, name: 'MAHARASTRA BEAUTY', storeId: 'S0008', area: 'Old Nagardas Road', line2: 'Andheri East', city: 'Mumbai, Maharashtra' },
  { id: 'store9', lat: 19.0900, lng: 72.8650, name: 'DHANLAXMI NOVELTY', storeId: 'S0009', area: 'Kalina', line2: 'Santacruz East', city: 'Mumbai, Maharashtra' },
  { id: 'store10', lat: 19.0880, lng: 72.8500, name: 'GETWELL CHEMIST', storeId: 'S0010', area: 'Station Road', line2: 'Santacruz East', city: 'Mumbai, Maharashtra' },
  { id: 'store11', lat: 19.1150, lng: 72.8450, name: 'GETWELL CHEMIST', storeId: 'S0011', area: 'Station Road', line2: 'Andheri West', city: 'Mumbai, Maharashtra' },
  { id: 'store12', lat: 19.1300, lng: 72.8200, name: 'SHIVRAJ SUPER SHOPPE', storeId: 'S0012', area: 'Yari Road', line2: 'Andheri West', city: 'Mumbai, Maharashtra' },
  { id: 'store13', lat: 19.1200, lng: 72.8800, name: 'METRO MART NX', storeId: 'S0013', area: 'Pump House', line2: 'Andheri East', city: 'Mumbai, Maharashtra' }
]

const MapController = ({ activeStore, stores }) => {
  const map = useMap()

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
        html: `<div class="${isActive ? 'scale-115' : ''} w-8 h-8 rounded-full rounded-br-none bg-emerald-500 rotate-[-45deg] flex items-center justify-center border-2 border-white shadow-lg transition-transform"><div class="w-3 h-3 rounded-full bg-white"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -28]
      })}
    >
      <Popup className="rounded-xl shadow-xl">
        <div className="font-sans p-1">
          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{store.storeId}</span>
          <h5 className="mt-1 mb-2 text-sm font-bold text-slate-800">{store.name}</h5>
          <p className="text-xs text-slate-500 leading-relaxed">{store.area}, {store.line2}<br/>{store.city}</p>
        </div>
      </Popup>
    </Marker>
  )
}

const StoreLocator = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStore, setActiveStore] = useState(null)
  const [viewMode, setViewMode] = useState('list')
  const storeListRef = useRef(null)

  const filteredStores = storeRegistry.filter(store => {
    return store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           store.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
           store.line2.toLowerCase().includes(searchQuery.toLowerCase()) ||
           store.storeId.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleStoreClick = (store) => {
    setActiveStore(store)
    if (viewMode === 'list' && window.innerWidth < 1024) {
      setViewMode('map')
    }
    if (storeListRef.current) {
      const card = document.getElementById(store.id)
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    }
  }

  return (
    <div className="min-h-screen py-20 px-8 md:px-16 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-emerald-500 transition-colors mb-2 group">
              <ArrowLeft size={16} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Our Store Network</h1>
          </div>

          <div className="inline-flex lg:hidden bg-slate-200/80 p-1 rounded-xl self-center shadow-inner">
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center gap-2 ${viewMode === 'list' ? 'bg-white text-slate-900' : 'text-slate-600'}`}
            >
              <List size={16} />
              List View
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
            >
              <MapIcon size={16} />
              Map View
            </button>
          </div>
        </div>

        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden" style={{ height: '70vh', minHeight: '550px' }}>
          {/* Sidebar (List) */}
          <div className={`absolute left-0 top-0 w-full lg:w-[35%] h-full bg-white border-r border-slate-200 flex flex-col z-10 transition-transform duration-300 ${viewMode === 'map' && window.innerWidth < 1024 ? '-translate-x-full' : 'translate-x-0'}`}>
            <div className="p-5 border-b border-slate-100">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, area, or zip code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto" ref={storeListRef}>
              {filteredStores.map(store => (
                <div
                  key={store.id}
                  id={store.id}
                  onClick={() => handleStoreClick(store)}
                  className={`store-card p-5 border-b border-slate-100 cursor-pointer flex gap-4 transition-all ${activeStore?.id === store.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent hover:bg-slate-50'}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                      <MapPin size={20} />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 font-bold tracking-wide rounded text-[10px] border border-slate-200">{store.storeId}</span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm tracking-tight mb-1">{store.name}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed">{store.area}, {store.line2}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{store.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className={`absolute left-0 top-0 w-full lg:left-[35%] lg:w-[65%] h-full transition-transform duration-300 ${viewMode === 'list' && window.innerWidth < 1024 ? 'translate-x-full' : 'translate-x-0'}`}>
            <MapContainer
              center={[19.1000, 72.8400]}
              zoom={12}
              zoomControl={false}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              <ZoomControl position="bottomright" />
              <MapController activeStore={activeStore} stores={filteredStores} />
              {filteredStores.map(store => (
                <CustomMarker
                  key={store.id}
                  store={store}
                  isActive={activeStore?.id === store.id}
                  onClick={handleStoreClick}
                />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoreLocator
