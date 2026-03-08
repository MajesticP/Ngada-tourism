'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, MailOpen, Trash2, RefreshCw, ChevronDown, ChevronUp,
  User, AtSign, Clock, MessageSquare, Inbox, Filter
} from 'lucide-react'

type Pesan = {
  id_pesan: number
  nama: string
  email: string
  subjek: string | null
  pesan: string
  sudah_baca: boolean
  created_at: string
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function PesanPage() {
  const [messages, setMessages] = useState<Pesan[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const param = filter === 'all' ? '' : `?filter=${filter}`
      const res = await fetch(`/api/pesan${param}`)
      if (!res.ok) return
      const data = await res.json()
      setMessages(data.messages)
      setUnreadCount(data.unreadCount)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  const toggleRead = async (msg: Pesan) => {
    const newVal = !msg.sudah_baca
    // Optimistic update
    setMessages(prev => prev.map(m => m.id_pesan === msg.id_pesan ? { ...m, sudah_baca: newVal } : m))
    setUnreadCount(prev => newVal ? Math.max(0, prev - 1) : prev + 1)
    await fetch(`/api/pesan/${msg.id_pesan}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sudah_baca: newVal }),
    })
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus pesan ini?')) return
    setDeleting(id)
    await fetch(`/api/pesan/${id}`, { method: 'DELETE' })
    setMessages(prev => prev.filter(m => m.id_pesan !== id))
    if (expanded === id) setExpanded(null)
    setDeleting(null)
  }

  const handleExpand = async (msg: Pesan) => {
    if (expanded === msg.id_pesan) {
      setExpanded(null)
      return
    }
    setExpanded(msg.id_pesan)
    // Auto-mark as read when opened
    if (!msg.sudah_baca) {
      await toggleRead(msg)
    }
  }

  const markAllRead = async () => {
    const unread = messages.filter(m => !m.sudah_baca)
    await Promise.all(
      unread.map(m => fetch(`/api/pesan/${m.id_pesan}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sudah_baca: true }),
      }))
    )
    setMessages(prev => prev.map(m => ({ ...m, sudah_baca: true })))
    setUnreadCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-forest-900 flex items-center gap-3">
            Kotak Masuk
            {unreadCount > 0 && (
              <span className="bg-terra-500 text-white text-sm font-body font-semibold px-2.5 py-0.5 rounded-full">
                {unreadCount} baru
              </span>
            )}
          </h1>
          <p className="text-forest-500 text-sm mt-1">Pesan dari halaman Kontak publik</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 text-sm text-forest-600 hover:text-forest-800 border border-forest-200 px-3 py-2 rounded-xl hover:bg-forest-50 transition-colors"
            >
              <MailOpen size={15} /> Tandai semua dibaca
            </button>
          )}
          <button
            onClick={fetchMessages}
            className="flex items-center gap-2 text-sm text-forest-500 hover:text-forest-700 border border-ngada-200 px-3 py-2 rounded-xl hover:bg-ngada-50 transition-colors"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-ngada-50 border border-ngada-100 p-1 rounded-xl w-fit">
        {(['all', 'unread', 'read'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-white text-forest-900 shadow-sm'
                : 'text-forest-500 hover:text-forest-700'
            }`}
          >
            <Filter size={13} />
            {f === 'all' ? 'Semua' : f === 'unread' ? 'Belum dibaca' : 'Sudah dibaca'}
          </button>
        ))}
      </div>

      {/* Message list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-ngada-100 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-ngada-100 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-ngada-100 rounded w-1/4" />
                  <div className="h-3 bg-ngada-100 rounded w-1/3" />
                  <div className="h-3 bg-ngada-100 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-ngada-100 p-16 text-center">
          <Inbox size={48} className="mx-auto text-ngada-200 mb-4" />
          <p className="font-display text-xl text-forest-600">
            {filter === 'unread' ? 'Tidak ada pesan baru' : 'Belum ada pesan masuk'}
          </p>
          <p className="text-forest-400 text-sm mt-2">
            Pesan dari halaman Kontak akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id_pesan}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className={`bg-white rounded-2xl border transition-shadow ${
                  !msg.sudah_baca
                    ? 'border-ngada-300 shadow-md shadow-ngada-100'
                    : 'border-ngada-100 shadow-sm'
                }`}
              >
                {/* Row */}
                <div
                  className="flex items-start gap-4 p-5 cursor-pointer select-none"
                  onClick={() => handleExpand(msg)}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-semibold text-sm ${
                    !msg.sudah_baca ? 'bg-ngada-500' : 'bg-forest-300'
                  }`}>
                    {msg.nama.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-medium text-sm ${!msg.sudah_baca ? 'text-forest-900' : 'text-forest-600'}`}>
                        {msg.nama}
                      </span>
                      {!msg.sudah_baca && (
                        <span className="w-2 h-2 bg-ngada-500 rounded-full shrink-0" />
                      )}
                      <span className="text-forest-300 text-xs">·</span>
                      <span className="text-forest-400 text-xs flex items-center gap-1">
                        <Clock size={11} /> {formatDate(msg.created_at)}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${!msg.sudah_baca ? 'text-ngada-600 font-medium' : 'text-forest-400'}`}>
                      {msg.subjek ?? 'Tanpa subjek'}
                    </p>
                    <p className="text-forest-500 text-sm mt-1 truncate">{msg.pesan}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => toggleRead(msg)}
                      title={msg.sudah_baca ? 'Tandai belum dibaca' : 'Tandai sudah dibaca'}
                      className="w-8 h-8 rounded-lg hover:bg-ngada-50 flex items-center justify-center text-forest-400 hover:text-ngada-600 transition-colors"
                    >
                      {msg.sudah_baca ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>
                    <button
                      onClick={() => handleDelete(msg.id_pesan)}
                      disabled={deleting === msg.id_pesan}
                      title="Hapus pesan"
                      className="w-8 h-8 rounded-lg hover:bg-terra-50 flex items-center justify-center text-forest-400 hover:text-terra-600 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="text-forest-300 ml-1">
                      {expanded === msg.id_pesan ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                <AnimatePresence>
                  {expanded === msg.id_pesan && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-ngada-100">
                        {/* Meta */}
                        <div className="flex flex-wrap gap-4 mb-4 text-xs text-forest-500">
                          <span className="flex items-center gap-1.5 bg-ngada-50 px-3 py-1.5 rounded-full">
                            <User size={12} /> {msg.nama}
                          </span>
                          <a
                            href={`mailto:${msg.email}`}
                            className="flex items-center gap-1.5 bg-ngada-50 px-3 py-1.5 rounded-full hover:bg-ngada-100 transition-colors"
                          >
                            <AtSign size={12} /> {msg.email}
                          </a>
                          <span className="flex items-center gap-1.5 bg-ngada-50 px-3 py-1.5 rounded-full">
                            <MessageSquare size={12} />
                            {msg.subjek ?? 'Tanpa subjek'}
                          </span>
                        </div>

                        {/* Message body */}
                        <div className="bg-ngada-50 rounded-xl p-4 text-forest-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {msg.pesan}
                        </div>

                        {/* Reply button */}
                        <div className="mt-4">
                          <a
                            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subjek ?? 'Wisata Ngada')}`}
                            className="btn-primary text-sm inline-flex items-center gap-2"
                          >
                            <Mail size={14} /> Balas via Email
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
