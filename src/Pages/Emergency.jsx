import {
  Search,
  MapPinned,
  PhoneCall,
  AlertCircle,
  Navigation,
  Activity,
  LoaderCircle,
} from 'lucide-react'
import EmergencyBanner from '../Components/EmergencyBanner'
import Header from '../Components/Header'
import { useState, useEffect, useMemo } from 'react'
import Footer from '../Components/Home/Footer'
import { motion, AnimatePresence } from 'framer-motion'

const HOSPITALS_URL = '/Emergency%20Hospitals.json'
const NEARBY_RADIUS_KM = 10
const PAGE_SIZE = 30

const parseCoordinate = (value) => {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const startLat = parseCoordinate(lat1)
  const startLon = parseCoordinate(lon1)
  const endLat = parseCoordinate(lat2)
  const endLon = parseCoordinate(lon2)

  if (startLat == null || startLon == null || endLat == null || endLon == null) {
    return null
  }

  const R = 6371
  const dLat = (endLat - startLat) * (Math.PI / 180)
  const dLon = (endLon - startLon) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(startLat * (Math.PI / 180)) *
      Math.cos(endLat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return Number.parseFloat((R * c).toFixed(1))
}

const normalizeHospital = (hospital, index) => {
  const latitude = parseCoordinate(hospital?.latitude)
  const longitude = parseCoordinate(hospital?.longitude)
  const rawPhone = String(hospital?.ambulance_number ?? '').trim()
  const primaryPhone = rawPhone.split(',')[0]?.trim() ?? ''

  return {
    id: `${hospital?.hospital_name ?? 'hospital'}-${index}`,
    hospital_name: hospital?.hospital_name ?? 'Unknown Hospital',
    district: hospital?.district ?? hospital?.zilla ?? 'Unknown',
    address: hospital?.address ?? 'Address not available',
    latitude,
    longitude,
    ambulance_number: rawPhone,
    primaryPhone,
    type: hospital?.type ?? 'Hospital',
  }
}

const fetchHospitals = async () => {
  const response = await fetch(HOSPITALS_URL)

  if (!response.ok) {
    throw new Error('Failed to load hospital data.')
  }

  const data = await response.json()
  if (!Array.isArray(data)) return []

  return data.map(normalizeHospital)
}

const getUserLocation = () =>
  new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: 'Geolocation is not supported by this browser.' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          userLatitude: position.coords.latitude,
          userLongitude: position.coords.longitude,
        })
      },
      () => {
        resolve({
          error:
            'Location access denied. Distance calculation unavailable. You can still search hospitals manually.',
        })
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  })

const filterHospitals = (hospitals, searchTerm, selectedDistrict) =>
  hospitals.filter((hospital) => {
    const query = searchTerm.trim().toLowerCase()
    const matchesSearch =
      !query || hospital.hospital_name.toLowerCase().includes(query)
    const matchesDistrict =
      !selectedDistrict || hospital.district === selectedDistrict

    return matchesSearch && matchesDistrict
  })

const sortHospitalsByDistance = (hospitals, userLatitude, userLongitude) => {
  const withDistance = hospitals.map((hospital) => ({
    ...hospital,
    distanceKm:
      userLatitude != null && userLongitude != null
        ? calculateDistance(
            userLatitude,
            userLongitude,
            hospital.latitude,
            hospital.longitude
          )
        : null,
  }))

  if (userLatitude == null || userLongitude == null) {
    return withDistance
  }

  return [...withDistance].sort((a, b) => {
    if (a.distanceKm == null) return 1
    if (b.distanceKm == null) return -1
    return a.distanceKm - b.distanceKm
  })
}

const Emergency = () => {
  const [hospitals, setHospitals] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [locating, setLocating] = useState(true)
  const [locationError, setLocationError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const data = await fetchHospitals()
        if (active) {
          setHospitals(data)
          setFetchError('')
        }
      } catch (error) {
        if (active) {
          setHospitals([])
          setFetchError(error?.message || 'Failed to load hospital data.')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    const loadLocation = async () => {
      setLocating(true)
      const result = await getUserLocation()

      if (!active) return

      if (result.error) {
        setLocationError(result.error)
        setUserLatitude(null)
        setUserLongitude(null)
      } else {
        setLocationError('')
        setUserLatitude(result.userLatitude)
        setUserLongitude(result.userLongitude)
      }

      setLocating(false)
    }

    loadData()
    loadLocation()

    return () => {
      active = false
    }
  }, [])

  const districts = useMemo(() => {
    const list = hospitals.map((hospital) => hospital.district).filter(Boolean)
    return [...new Set(list)].sort((a, b) => a.localeCompare(b))
  }, [hospitals])

  const processedHospitals = useMemo(() => {
    const filtered = filterHospitals(hospitals, searchTerm, selectedDistrict)
    return sortHospitalsByDistance(filtered, userLatitude, userLongitude)
  }, [hospitals, searchTerm, selectedDistrict, userLatitude, userLongitude])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedDistrict])

  const hasLocation = userLatitude != null && userLongitude != null
  const isListLoading = loading || locating
  const totalPages = Math.max(1, Math.ceil(processedHospitals.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const paginatedHospitals = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return processedHospitals.slice(startIndex, startIndex + PAGE_SIZE)
  }, [processedHospitals, currentPage])

  const stats = {
    total: hospitals.length,
    nearby: hasLocation
      ? processedHospitals.filter(
          (hospital) =>
            hospital.distanceKm != null && hospital.distanceKm <= NEARBY_RADIUS_KM
        ).length
      : 0,
    district: selectedDistrict || 'All Districts',
    locationStatus: locating
      ? 'Detecting...'
      : hasLocation
        ? 'Enabled'
        : 'Disabled',
  }

  const nearestHospitalId =
    hasLocation && paginatedHospitals[0]?.distanceKm != null
      ? paginatedHospitals[0].id
      : null

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.06 },
    },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <EmergencyBanner />

        {isListLoading ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3 text-sm font-medium text-violet-700">
            <LoaderCircle className="h-4 w-4 animate-spin text-violet-500" />
            {loading ? 'Loading hospitals...' : 'Calculating nearby distances...'}
          </div>
        ) : null}

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <SummaryCard label="Total Hospitals" value={stats.total} icon={Activity} color="text-pink-600" />
          <SummaryCard label="Nearby Hospitals" value={stats.nearby} icon={Navigation} color="text-purple-600" />
          <SummaryCard label="Selected District" value={stats.district} icon={MapPinned} color="text-rose-600" />
          <SummaryCard
            label="Location Status"
            value={stats.locationStatus}
            icon={Activity}
            color={hasLocation ? 'text-emerald-600' : 'text-amber-600'}
            pulse={locating}
          />
        </div>

        <AnimatePresence>
          {locationError ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 overflow-hidden"
            >
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 shadow-sm">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p className="text-sm font-medium leading-6">{locationError}</p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {fetchError ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {fetchError}
          </div>
        ) : null}

        <div className="mt-8 rounded-[28px] border border-white/80 bg-white/70 p-4 shadow-lg backdrop-blur-xl">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <div className="relative w-full flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search hospital name..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
              />
            </div>

            <div className="w-full md:w-64">
              <select
                value={selectedDistrict}
                onChange={(event) => setSelectedDistrict(event.target.value)}
                className="h-12 w-full cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition-all focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
              >
                <option value="">All Districts</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full border-t border-slate-200 px-1 pt-3 md:w-auto md:border-l md:border-t-0 md:px-4 md:pt-0">
              <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 md:text-left">
                Showing {paginatedHospitals.length} of {processedHospitals.length} hospitals
              </p>
            </div>
          </div>
        </div>

        <section className="mt-8">
          {isListLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : processedHospitals.length > 0 ? (
            <>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {paginatedHospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital.id}
                    data={hospital}
                    isNearest={hospital.id === nearestHospitalId}
                  />
                ))}
              </motion.div>

              {totalPages > 1 ? (
                <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-[28px] border border-white/80 bg-white/70 px-4 py-4 shadow-lg backdrop-blur-xl sm:flex-row">
                  <p className="text-sm font-medium text-slate-600">
                    Page {currentPage} of {totalPages}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => index + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true
                        return (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        )
                      })
                      .map((page, index, pages) => {
                        const previousPage = pages[index - 1]
                        const showGap = previousPage && page - previousPage > 1

                        return (
                          <span key={page} className="flex items-center gap-2">
                            {showGap ? <span className="px-1 text-slate-400">...</span> : null}
                            <button
                              type="button"
                              onClick={() => setCurrentPage(page)}
                              className={`h-10 cursor-pointer min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
                                page === currentPage
                                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-200/60'
                                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {page}
                            </button>
                          </span>
                        )
                      })}

                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                      className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-20 text-center"
            >
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-400">
                <Activity size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No hospitals found.</h3>
              <p className="mt-2 max-w-xs text-slate-500">
                Try another district or search keyword.
              </p>
            </motion.div>
          )}
        </section>
      </div>

      <Footer />
    </div>
  )
}

const SummaryCard = ({ label, value, icon: Icon, color, pulse }) => (
  <div className="rounded-3xl border border-white bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-transform hover:-translate-y-1">
    <div className="flex items-center gap-3">
      <div className={`rounded-2xl bg-slate-50 p-2.5 ${color}`}>
        <Icon size={20} className={pulse ? 'animate-pulse' : ''} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className={`text-lg font-black ${color}`}>{value}</p>
      </div>
    </div>
  </div>
)

const HospitalCard = ({ data, isNearest }) => {
  const canCall = Boolean(data.primaryPhone)
  const canOpenMap = data.latitude != null && data.longitude != null

  return (
    <motion.article
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={`group relative overflow-hidden rounded-[32px] border transition-all duration-500 hover:shadow-2xl hover:shadow-pink-200/40 ${
        isNearest
          ? 'z-10 scale-[1.02] border-pink-200 bg-linear-to-br from-pink-50 via-white to-purple-50 ring-2 ring-pink-100'
          : 'border-slate-100 bg-white/90 backdrop-blur-sm'
      }`}
    >
      {isNearest ? (
        <div className="absolute right-0 top-0">
          <div className="flex items-center gap-1.5 rounded-bl-2xl bg-pink-500 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
            <Navigation size={12} className="fill-current" />
            Nearest Emergency Hospital
          </div>
        </div>
      ) : null}

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-pink-600">
              {data.district}
            </p>
            <h3 className="text-xl font-black leading-tight text-slate-900 transition-colors group-hover:text-pink-600">
              {data.hospital_name}
            </h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-pink-50 group-hover:text-pink-500">
            <Activity size={24} />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <MapPinned className="mt-0.5 h-5 w-5 text-slate-400" />
            <p className="text-sm leading-relaxed text-slate-600">{data.address}</p>
          </div>

          <div className="flex items-center gap-3">
            <PhoneCall className="h-5 w-5 text-slate-400" />
            <p className="text-sm font-bold text-slate-700">
              {data.ambulance_number || 'Not available'}
            </p>
          </div>

          {data.distanceKm != null ? (
            <div className="flex w-fit items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-1.5">
              <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-600">{data.distanceKm} km away</span>
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {canCall ? (
            <a
              href={`tel:${data.primaryPhone}`}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-rose-500 to-pink-500 text-sm font-bold text-white shadow-lg shadow-pink-200/50 transition-all hover:opacity-90"
            >
              <PhoneCall size={16} />
              Call Ambulance
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex h-11 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-bold text-slate-400"
            >
              <PhoneCall size={16} />
              Call Ambulance
            </button>
          )}

  
        </div>
      </div>
    </motion.article>
  )
}

const SkeletonCard = () => (
  <div className="h-[320px] animate-pulse space-y-4 rounded-[32px] border border-slate-100 bg-white p-6">
    <div className="flex justify-between">
      <div className="flex-1 space-y-2">
        <div className="h-3 w-16 rounded bg-slate-100" />
        <div className="h-6 w-3/4 rounded bg-slate-100" />
      </div>
      <div className="h-12 w-12 rounded-2xl bg-slate-50" />
    </div>
    <div className="space-y-3 pt-4">
      <div className="h-4 w-full rounded bg-slate-50" />
      <div className="h-4 w-2/3 rounded bg-slate-50" />
    </div>
    <div className="flex gap-2 pt-4">
      <div className="h-11 flex-1 rounded-2xl bg-slate-100" />
      <div className="h-11 flex-1 rounded-2xl bg-slate-100" />
    </div>
  </div>
)

export default Emergency
