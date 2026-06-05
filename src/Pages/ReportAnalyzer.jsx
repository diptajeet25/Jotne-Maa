import { useCallback, useMemo, useRef, useState } from 'react'
import axios from 'axios'
import {
  FiActivity,
  FiAlertCircle,
  FiCheck,
  FiCheckCircle,
  FiClipboard,
  FiCopy,
  FiDroplet,
  FiDownload,
  FiFileText,
  FiLoader,
  FiSearch,
  FiShield,
  FiUploadCloud,
  FiX,
} from 'react-icons/fi'
import { HiOutlineBeaker, HiOutlineDocumentReport } from 'react-icons/hi'
import { RiSparklingLine } from 'react-icons/ri'
import Header from '../Components/Header.jsx'
import Footer from '../Components/Home/Footer.jsx'

const OCR_API_URL =
  'https://tahamina1116keya-medical-report-ocr-hf-space.hf.space/analyze-report'
const BACKEND_URL =
  (import.meta.env.VITE_REPORT_ANALYSIS_URL || 'https://jotnemaa.vercel.app').replace(/\/+$/, '')

const REPORT_TYPES = [
  { id: 'ultrasound', label: 'Ultrasound Report', icon: FiActivity },
  { id: 'blood-sugar', label: 'Blood Sugar Report', icon: FiDroplet },
  { id: 'urine', label: 'Urine Report', icon: HiOutlineBeaker },
  { id: 'serology', label: 'Serology Report', icon: FiCheckCircle },
  { id: 'other', label: 'Other Report', icon: HiOutlineDocumentReport },
]

const LOADING_STEPS = [
  'Uploading Report...',
  'Extracting Text...',
  'Analyzing with AI...',
]

const TABS = [
  { id: 'summary', label: 'Summary' },
  { id: 'details', label: 'Report Details' },
  { id: 'explanation', label: 'AI Explanation' },
  { id: 'actions', label: 'Recommended Actions' },
  { id: 'raw', label: 'Raw OCR' },
]

const ACCEPTED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
]
const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg']

const normalizeTableRow = (row, index) => {
  if (row == null) {
    return { parameter: `Row ${index + 1}`, result: '' }
  }

  if (typeof row === 'string') {
    return { parameter: row, result: '' }
  }

  if (Array.isArray(row)) {
    return {
      parameter: String(row[0] ?? ''),
      result: String(row[1] ?? ''),
    }
  }

  const parameter =
    row.parameter ??
    row.Parameter ??
    row.name ??
    row.test ??
    row.Test ??
    row.key ??
    ''

  const result =
    row.result ??
    row.Result ??
    row.value ??
    row.Value ??
    row['Result / Value'] ??
    row.reading ??
    ''

  return {
    parameter: String(parameter),
    result: String(result),
  }
}

const getRiskStyle = (riskLevel) => {
  const level = String(riskLevel ?? '').trim().toLowerCase()

  if (
    ['none', 'low', 'low risk', 'no risk', 'minimal'].some((item) => level.includes(item))
  ) {
    return {
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      card: 'border-emerald-200 bg-emerald-50',
      dot: 'bg-emerald-500',
    }
  }

  if (
    ['moderate', 'medium', 'mid', 'moderate risk', 'medium risk'].some((item) =>
      level.includes(item)
    )
  ) {
    return {
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      card: 'border-amber-200 bg-amber-50',
      dot: 'bg-amber-500',
    }
  }

  if (
    ['high', 'severe', 'critical', 'high risk'].some((item) => level.includes(item))
  ) {
    return {
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      card: 'border-rose-200 bg-rose-50',
      dot: 'bg-rose-500',
    }
  }

  return {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    card: 'border-slate-200 bg-slate-50',
    dot: 'bg-slate-400',
  }
}

const isAcceptedFile = (file) => {
  if (!file) return false

  const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension)
}

const ReportAnalyzer = () => {
  const fileInputRef = useRef(null)

  const [selectedReportType, setSelectedReportType] = useState('ultrasound')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')
  const [ocrText, setOcrText] = useState('')
  const [tableData, setTableData] = useState([])
  const [analysis, setAnalysis] = useState(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [searchTerm, setSearchTerm] = useState('')
  const [copyFeedback, setCopyFeedback] = useState('')

  const normalizedTable = useMemo(
    () => tableData.map((row, index) => normalizeTableRow(row, index)),
    [tableData]
  )

  const filteredTable = useMemo(() => {
    if (!searchTerm.trim()) return normalizedTable

    const query = searchTerm.toLowerCase()
    return normalizedTable.filter(
      (row) =>
        row.parameter.toLowerCase().includes(query) ||
        row.result.toLowerCase().includes(query)
    )
  }, [normalizedTable, searchTerm])

  const riskAssessment = analysis?.risk_assessment
  const riskStyle = getRiskStyle(riskAssessment?.risk_level)

  const showCopyFeedback = (message) => {
    setCopyFeedback(message)
    window.setTimeout(() => setCopyFeedback(''), 2000)
  }

  const resetResults = () => {
    setOcrText('')
    setTableData([])
    setAnalysis(null)
    setActiveTab('summary')
    setSearchTerm('')
    setError('')
  }

  const handleFileSelect = (file) => {
    if (!file) return

    if (!isAcceptedFile(file)) {
      setError('Please upload a PDF, PNG, JPG, or JPEG file.')
      return
    }

    setSelectedFile(file)
    setError('')
    resetResults()
  }

  const handleFileChange = (event) => {
    handleFileSelect(event.target.files?.[0] ?? null)
  }

  const handleDragOver = useCallback((event) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((event) => {
    event.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((event) => {
    event.preventDefault()
    setIsDragging(false)
    handleFileSelect(event.dataTransfer.files?.[0] ?? null)
  }, [])

  const handleAnalyze = async () => {
    if (!selectedFile || loading) return

    setLoading(true)
    setLoadingStep(0)
    setError('')
    resetResults()

    try {
      setLoadingStep(0)
      const formData = new FormData()
      formData.append('file', selectedFile)

      const ocrResponse = await axios.post(OCR_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })

      const ocrData = ocrResponse.data

      if (!ocrData?.success) {
        throw new Error(
          ocrData?.message || 'OCR processing failed. Please try another file.'
        )
      }

      const extractedText = ocrData.ocr_text ?? ''
      const extractedTable = Array.isArray(ocrData.table) ? ocrData.table : []

      setLoadingStep(1)
      setOcrText(extractedText)
      setTableData(extractedTable)

      setLoadingStep(2)
      const analysisResponse = await axios.post(
        `${BACKEND_URL}/report-analysis`,
        {
          table: extractedTable,
          ocrText: extractedText,
        },
        { timeout: 120000 }
      )
      console.log('Analysis response:', analysisResponse.data)

      const analysisData = analysisResponse.data

      if (!analysisData?.success || !analysisData?.analysis) {
        throw new Error(
          analysisData?.message || 'AI analysis failed. Please try again.'
        )
      }

      setAnalysis(analysisData.analysis)
      setActiveTab('summary')
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.response?.data?.error ||
        requestError?.message ||
        'Something went wrong while analyzing your report.'

      setError(message)
    } finally {
      setLoading(false)
      setLoadingStep(0)
    }
  }

  const handleCopyText = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      showCopyFeedback(`${label} copied!`)
    } catch {
      setError('Unable to copy to clipboard.')
    }
  }

  const handleCopyTable = () => {
    const header = 'Parameter\tResult / Value\n'
    const rows = normalizedTable
      .map((row) => `${row.parameter}\t${row.result}`)
      .join('\n')

    handleCopyText(header + rows, 'Table')
  }

  const handleDownloadCSV = () => {
    const escapeCsv = (value) => `"${String(value).replace(/"/g, '""')}"`
    const header = 'Parameter,Result / Value\n'
    const rows = normalizedTable
      .map((row) => `${escapeCsv(row.parameter)},${escapeCsv(row.result)}`)
      .join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `medical_report_${Date.now()}.csv`
    link.click()
    URL.revokeObjectURL(url)
    showCopyFeedback('CSV downloaded!')
  }

  const hasResults = Boolean(analysis)

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,207,232,0.55),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.38),transparent_28%),linear-gradient(180deg,#fff7fb_0%,#ffffff_100%)] text-slate-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/74 p-5 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur-md sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute -left-8 top-2 h-36 w-36 rounded-full bg-pink-200/50 blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-16 h-44 w-44 rounded-full bg-violet-200/45 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-32 rounded-full bg-rose-100/60 blur-3xl" />

          <div className="relative z-10 space-y-8">
            {/* Hero */}
            <header className="rounded-[30px] border border-white/70 bg-white/85 p-5 shadow-sm sm:p-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-pink-100 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-600 shadow-sm">
                <RiSparklingLine className="h-4 w-4" />
                AI Report Analysis
              </span>

              <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-r from-[#FF5FA2] to-[#9B5DE5] text-white shadow-[0_16px_32px_rgba(155,93,229,0.24)]">
                    <FiShield className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-600">
                      Jotne Maa Healthcare
                    </p>
                    <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                      AI Medical Report Analyzer
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                      Upload medical reports and receive AI-powered health insights.
                    </p>
                  </div>
                </div>

                <div className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-semibold text-violet-700">
                  <FiShield className="h-4 w-4" />
                  Secure Analysis
                </div>
              </div>
            </header>

            {/* Report Type Cards */}
            <div>
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-violet-600">
                Report Type
              </p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {REPORT_TYPES.map((type) => {
                  const Icon = type.icon
                  const isSelected = selectedReportType === type.id

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedReportType(type.id)}
                      className={`rounded-[26px] border p-5 text-left shadow-[0_16px_40px_rgba(15,23,42,0.06)] transition-all hover:-translate-y-0.5 ${
                        isSelected
                          ? 'border-pink-200 bg-pink-50/80 ring-2 ring-violet-200'
                          : 'border-slate-100 bg-white/90 hover:border-pink-100'
                      }`}
                    >
                      <div
                        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${
                          isSelected
                            ? 'bg-linear-to-r from-pink-500 to-violet-500 text-white shadow-[0_10px_24px_rgba(236,72,153,0.22)]'
                            : 'bg-pink-50 text-pink-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-semibold text-slate-900">{type.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Upload */}
            <div className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  fileInputRef.current?.click()
                }
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`cursor-pointer rounded-[26px] border-2 border-dashed p-8 text-center transition-all sm:p-12 ${
                isDragging
                  ? 'border-pink-400 bg-pink-50/60'
                  : 'border-pink-200/80 hover:border-violet-300 hover:bg-pink-50/30'
              }`}
            >
              <FiUploadCloud className="mx-auto h-14 w-14 text-pink-500" />
              <h3 className="mt-4 text-lg font-bold text-slate-950">
                Drag & drop your medical report
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                or click to browse — PDF, PNG, JPG, JPEG
              </p>
            </div>

            {selectedFile && (
              <div className="mt-4 flex items-center justify-between rounded-2xl border border-pink-100 bg-pink-50/70 px-4 py-3">
                <div className="flex items-center gap-3 overflow-hidden">
                  <FiFileText className="h-5 w-5 shrink-0 text-pink-600" />
                  <span className="truncate text-sm font-medium text-slate-800">
                    {selectedFile.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    resetResults()
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-600"
                  aria-label="Remove file"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-pink-500 to-violet-500 px-6 py-4 text-base font-bold text-white shadow-[0_16px_32px_rgba(155,93,229,0.28)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiLoader className="h-5 w-5 animate-spin" />
                  Analyzing Report...
                </>
              ) : (
                'Analyze Report'
              )}
            </button>

            {copyFeedback && (
              <p className="mt-3 text-center text-sm font-medium text-emerald-600">
                {copyFeedback}
              </p>
            )}
            </div>

            {/* Error */}
            {error && (
            <div className="rounded-[26px] border border-rose-200 bg-rose-50/90 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
                <div>
                  <h3 className="font-semibold text-rose-800">Analysis Error</h3>
                  <p className="mt-1 text-sm leading-6 text-rose-700">{error}</p>
                </div>
              </div>
            </div>
            )}

            {/* Loading */}
            {loading && (
            <div className="rounded-[30px] border border-slate-100 bg-white p-8 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <div className="mx-auto max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-pink-50">
                  <FiLoader className="h-8 w-8 animate-spin text-pink-600" />
                </div>
                <h3 className="mt-5 text-xl font-black text-slate-950">
                  Processing Your Report
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Please wait while we extract and analyze your medical data.
                </p>

                <div className="mt-8 space-y-4 text-left">
                  {LOADING_STEPS.map((step, index) => {
                    const isActive = loadingStep === index
                    const isComplete = loadingStep > index

                    return (
                      <div
                        key={step}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                          isActive
                            ? 'border-pink-200 bg-pink-50/70'
                            : isComplete
                              ? 'border-emerald-200 bg-emerald-50'
                              : 'border-slate-100 bg-slate-50'
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isComplete
                              ? 'bg-emerald-500 text-white'
                              : isActive
                                ? 'bg-linear-to-r from-pink-500 to-violet-500 text-white'
                                : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isComplete ? (
                            <FiCheck className="h-4 w-4" />
                          ) : isActive ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="text-xs font-bold">{index + 1}</span>
                          )}
                        </div>
                        <p
                          className={`text-sm font-medium ${
                            isActive
                              ? 'text-pink-700'
                              : isComplete
                                ? 'text-emerald-700'
                                : 'text-slate-500'
                          }`}
                        >
                          {step}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            )}

            {/* Results Dashboard */}
            {!loading && (
            <div className="rounded-[30px] border border-slate-100 bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:p-7">
              <div className="border-b border-slate-100 pb-5">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-600">Results</p>
                <h2 className="mt-2 text-xl font-black text-slate-950 sm:text-2xl">Analysis Dashboard</h2>
                <p className="mt-1 text-sm text-slate-500">
                  AI-powered insights from your uploaded medical report.
                </p>
              </div>

              {!hasResults ? (
                <div className="flex flex-col items-center py-20 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-400">
                    <FiUploadCloud className="h-8 w-8" />
                  </div>
                  <p className="mt-4 max-w-sm text-slate-500">
                    Upload a medical report to begin analysis.
                  </p>
                </div>
              ) : (
                <div className="mt-6">
                  {/* Tabs */}
                  <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-100 bg-slate-50 p-1.5">
                    {TABS.map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                          activeTab === tab.id
                            ? 'bg-white text-pink-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Summary Tab */}
                  {activeTab === 'summary' && (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-[26px] border border-pink-100 bg-linear-to-br from-pink-50/80 via-white to-violet-50/50 p-6 shadow-sm">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900">
                              Analysis Summary
                            </h3>
                            <p className="mt-4 text-sm leading-7 text-slate-700">
                              {analysis.summary || 'No summary available.'}
                            </p>
                          </div>
                          <span
                            className={`inline-flex shrink-0 items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-semibold ${riskStyle.badge}`}
                          >
                            <span className={`h-2.5 w-2.5 rounded-full ${riskStyle.dot}`} />
                            {riskAssessment?.risk_level || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Report Details Tab */}
                  {activeTab === 'details' && (
                    <div className="mt-8">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 sm:max-w-sm">
                          <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Search parameter or value..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleCopyTable}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none"
                          >
                            <FiClipboard className="h-4 w-4" />
                            Copy Table
                          </button>
                          <button
                            type="button"
                            onClick={handleDownloadCSV}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-pink-500 to-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 sm:flex-none"
                          >
                            <FiDownload className="h-4 w-4" />
                            Download CSV
                          </button>
                        </div>
                      </div>

                      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[520px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                              <tr>
                                <th className="px-5 py-4">#</th>
                                <th className="px-5 py-4">Parameter</th>
                                <th className="px-5 py-4">Result / Value</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredTable.map((row, index) => (
                                <tr key={`${row.parameter}-${index}`} className="hover:bg-slate-50/70">
                                  <td className="px-5 py-4 font-medium text-slate-400">
                                    {index + 1}
                                  </td>
                                  <td className="px-5 py-4 font-semibold text-slate-800">
                                    {row.parameter}
                                  </td>
                                  <td className="px-5 py-4 text-slate-600">
                                    <span className="rounded-lg bg-pink-50 px-3 py-1 font-medium text-pink-700">
                                      {row.result}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {filteredTable.length === 0 && (
                          <div className="py-10 text-center text-sm text-slate-500">
                            No parameters match your search.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Explanation Tab */}
                  {activeTab === 'explanation' && (
                    <div className="mt-8 space-y-6">
                      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-emerald-800">
                          <FiCheckCircle className="h-5 w-5" />
                          Normal Findings
                        </h3>
                        {analysis.normal_findings?.length > 0 ? (
                          <ul className="mt-4 space-y-3">
                            {analysis.normal_findings.map((finding, index) => (
                              <li
                                key={`normal-${index}`}
                                className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm leading-6 text-emerald-900"
                              >
                                <FiCheck className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-4 text-sm text-emerald-700">
                            No normal findings reported.
                          </p>
                        )}
                      </div>

                      <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-rose-800">
                          <FiAlertCircle className="h-5 w-5" />
                          Abnormal Findings
                        </h3>
                        {analysis.abnormal_findings?.length > 0 ? (
                          <ul className="mt-4 space-y-3">
                            {analysis.abnormal_findings.map((finding, index) => (
                              <li
                                key={`abnormal-${index}`}
                                className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm leading-6 text-rose-900"
                              >
                                <FiAlertCircle className="mt-1 h-4 w-4 shrink-0 text-rose-600" />
                                <span>{finding}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-4 text-sm text-rose-700">
                            No abnormal findings reported.
                          </p>
                        )}
                      </div>

                      <div className={`rounded-3xl border p-6 ${riskStyle.card}`}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-lg font-bold text-slate-900">Risk Assessment</h3>
                          <span
                            className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-sm font-semibold ${riskStyle.badge}`}
                          >
                            <span className={`h-2.5 w-2.5 rounded-full ${riskStyle.dot}`} />
                            {riskAssessment?.risk_level || 'Unknown'}
                          </span>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-700">
                          {riskAssessment?.reason || 'No risk assessment details available.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recommended Actions Tab */}
                  {activeTab === 'actions' && (
                    <div className="mt-8">
                      {analysis.recommended_actions?.length > 0 ? (
                        <ul className="space-y-3">
                          {analysis.recommended_actions.map((action, index) => (
                            <li
                              key={`action-${index}`}
                              className="flex items-start gap-4 rounded-2xl border border-pink-100 bg-pink-50/50 px-5 py-4"
                            >
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-violet-500 text-white">
                                <FiCheck className="h-4 w-4" />
                              </span>
                              <p className="text-sm leading-7 text-slate-700">{action}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                          No recommended actions provided.
                        </div>
                      )}
                    </div>
                  )}

                  {/* Raw OCR Tab */}
                  {activeTab === 'raw' && (
                    <div className="mt-8">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
                          Original OCR Text
                        </h3>
                        <button
                          type="button"
                          onClick={() => handleCopyText(ocrText, 'OCR text')}
                          className="inline-flex items-center gap-2 rounded-xl border border-pink-200 px-4 py-2 text-sm font-semibold text-pink-600 transition hover:bg-pink-50"
                        >
                          <FiCopy className="h-4 w-4" />
                          Copy OCR
                        </button>
                      </div>
                      <div className="max-h-[480px] overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-6">
                        <pre className="whitespace-pre-wrap font-mono text-sm leading-7 text-slate-700">
                          {ocrText || 'No OCR text available.'}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ReportAnalyzer
