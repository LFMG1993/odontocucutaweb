import React from 'react'
import { Monitor, MapPin, User, Hash, Tag, QrCode } from 'lucide-react'
import type { EquipoInventario } from '@/types/soporte'

interface EquipoBannerProps {
  equipo: EquipoInventario
}

export const EquipoBanner: React.FC<EquipoBannerProps> = ({ equipo }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 text-white shadow-lg border border-blue-800/40 animate-fade-in-entry">
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/20 flex items-center justify-center shrink-0">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Equipo Vinculado por QR
              </span>
              {equipo.codigo_patrimonial && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-blue-200">
                  {equipo.codigo_patrimonial}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white tracking-tight mt-0.5">
              {equipo.tipo_equipo} {equipo.marca ? `— ${equipo.marca}` : ''} {equipo.modelo || ''}
            </h3>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 text-xs font-semibold text-blue-100 self-start sm:self-auto">
          <QrCode className="w-3.5 h-3.5 text-blue-300" />
          <span>Ticket Auto-asociado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-white/10 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="truncate">
            <strong className="text-white font-medium">Sede:</strong> {equipo.sede}
          </span>
        </div>

        {equipo.ubicacion_especifica && (
          <div className="flex items-center gap-2 text-slate-300">
            <Tag className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span className="truncate">
              <strong className="text-white font-medium">Ubicación:</strong> {equipo.ubicacion_especifica}
            </span>
          </div>
        )}

        {equipo.serial && (
          <div className="flex items-center gap-2 text-slate-300">
            <Hash className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">
              <strong className="text-white font-medium">Serial:</strong> {equipo.serial}
            </span>
          </div>
        )}

        {equipo.usuario_asignado && (
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              <strong className="text-white font-medium">Custodio:</strong> {equipo.usuario_asignado}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
