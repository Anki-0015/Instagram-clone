export function PostSkeleton() {
  return (
    <article className="ig-card ig-mb-md" style={{ maxWidth: 470 }}>
      {/* Header skeleton */}
      <div className="ig-p-md ig-flex ig-gap-sm">
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--ig-hover)',
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              width: 120,
              height: 14,
              background: 'var(--ig-hover)',
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Image skeleton */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1/1',
          background: 'var(--ig-hover)',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />

      {/* Actions skeleton */}
      <div className="ig-p-md">
        <div className="ig-flex ig-gap-md ig-mb-sm">
          <div
            style={{
              width: 24,
              height: 24,
              background: 'var(--ig-hover)',
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
          <div
            style={{
              width: 24,
              height: 24,
              background: 'var(--ig-hover)',
              borderRadius: 4,
              animation: 'pulse 1.5s ease-in-out infinite'
            }}
          />
        </div>
        <div
          style={{
            width: '80%',
            height: 12,
            background: 'var(--ig-hover)',
            borderRadius: 4,
            marginBottom: 8,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
        <div
          style={{
            width: '60%',
            height: 12,
            background: 'var(--ig-hover)',
            borderRadius: 4,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </article>
  )
}

export function ProfileGridSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
      {[...Array(9)].map((_, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1/1',
            background: 'var(--ig-hover)',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  )
}

export function ExploreGridSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }} className="ig-explore-grid">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            aspectRatio: '1/1',
            background: 'var(--ig-hover)',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.05}s`
          }}
        />
      ))}
    </div>
  )
}
