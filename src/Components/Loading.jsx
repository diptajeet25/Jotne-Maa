const Loading = ({
  message = 'Preparing your care experience...',
  hint = 'Please wait a moment',
}) => {
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-0">
      <section className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_28px_90px_rgba(155,93,229,0.1)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-[#fff0f6] via-white to-[#f7f1ff]" />
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#FF5FA2]/12 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-[#9B5DE5]/12 blur-3xl" />

        <div className="relative grid gap-8 px-5 py-6 sm:px-8 sm:py-8 xl:grid-cols-[0.95fr_1.05fr] xl:items-center xl:px-10 xl:py-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5FA2]/15 bg-white/75 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF5FA2] shadow-sm">
              Loading
            </div>

            <div className="space-y-3">
              <h2 className="max-w-xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                {message}
              </h2>
              <p className="max-w-lg text-sm leading-6 text-slate-600 sm:text-base">{hint}</p>
            </div>

            <div className="space-y-3 rounded-3xl border border-white/70 bg-white/70 p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Progress
                  </div>
                  <div className="mt-1 text-sm font-medium text-slate-700">Syncing week guidance</div>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5FA2] animate-pulse" />
                  <span>Live</span>
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-2/3 rounded-full bg-linear-to-r from-[#FF5FA2] via-[#F79AD3] to-[#9B5DE5] animate-pulse" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-left text-xs text-slate-500 sm:text-sm">
                {['Checking data', 'Building view', 'Almost ready'].map((step, index) => (
                  <div key={step} className="rounded-2xl bg-slate-50 px-3 py-3 shadow-sm">
                    <div className="mb-2 h-2.5 w-14 rounded-full bg-linear-to-r from-[#FF5FA2]/80 to-[#9B5DE5]/80 animate-pulse" />
                    <p className="font-medium text-slate-600">{step}</p>
                    <p className="mt-1 text-[11px] text-slate-400">Step 0{index + 1}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pl-1">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF5FA2] animate-bounce [animation-delay:-0.2s]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F79AD3] animate-bounce [animation-delay:-0.1s]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#9B5DE5] animate-bounce" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-20 rounded-full bg-slate-100" />
                  <div className="h-5 w-28 rounded-full bg-slate-200/80" />
                </div>
                <div className="h-11 w-11 rounded-full bg-linear-to-br from-[#FF5FA2]/20 to-[#9B5DE5]/20" />
              </div>

              <div className="space-y-3">
                <div className="h-3 w-full rounded-full bg-slate-100" />
                <div className="h-3 w-11/12 rounded-full bg-slate-100" />
                <div className="h-3 w-10/12 rounded-full bg-slate-100" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="rounded-2xl bg-slate-50 p-3">
                    <div className="h-10 w-10 rounded-xl bg-linear-to-br from-[#FF5FA2]/20 to-[#9B5DE5]/20" />
                    <div className="mt-3 h-3 w-16 rounded-full bg-slate-200/80" />
                    <div className="mt-2 h-2.5 w-12 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/80 bg-white/75 p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-24 rounded-full bg-slate-100" />
                  <div className="h-4 w-40 rounded-full bg-slate-200/80" />
                </div>
                <div className="h-12 w-12 rounded-full bg-linear-to-br from-[#FF5FA2]/20 to-[#9B5DE5]/20" />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2 rounded-2xl bg-slate-50 px-3 py-4">
                    <div className="mx-auto h-10 w-10 rounded-full bg-slate-200/80" />
                    <div className="mx-auto h-3 w-14 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Loading