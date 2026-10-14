import React from 'react';
import { Radio, Youtube, FolderOpen, Users, Palette, HelpCircle, Check, Copy } from 'lucide-react';
import { STUDIO_THEMES } from '../constants/themes';

export default function Header({
  theme,
  themeId,
  setThemeId,
  showThemeMenu,
  setShowThemeMenu,
  roomCode,
  roomInput,
  setRoomInput,
  setRoomCode,
  copyInviteLink,
  copiedInvite,
  currentDriftMs,
  propagationLatencyMs,
  adjustmentMode,
  showCustomUrlBar,
  setShowCustomUrlBar,
  handleLocalFileSelect,
  toggleSimulate10Users,
  simulatingLoad,
  setShowSpecsModal
}) {
  return (
    <header
      style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
      className="h-14 border-b px-4 flex items-center justify-between gap-3 z-30 shrink-0"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: theme.accent }}
            className="w-7 h-7 rounded flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm"
          >
            KS
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-sm">KinoSync</span>
            <span
              style={{ backgroundColor: theme.accentSoft, color: theme.accent, borderColor: theme.border }}
              className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border font-semibold"
            >
              v2.4
            </span>
          </div>
        </div>

        <div style={{ backgroundColor: theme.border }} className="h-5 w-[1px] mx-1 hidden sm:block" />

        {/* Room Switcher */}
        <div
          style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
          className="flex items-center rounded border px-2 py-1 gap-1.5"
        >
          <Radio size={13} style={{ color: theme.statusOk }} className="animate-pulse" />
          <span style={{ color: theme.textSecondary }} className="text-[11px] font-mono">ROOM:</span>
          <input
            value={roomInput}
            onChange={e => setRoomInput(e.target.value.toUpperCase())}
            onKeyDown={e => {
              if (e.key === 'Enter' && roomInput.trim()) setRoomCode(roomInput.trim().toUpperCase());
            }}
            className="bg-transparent font-mono font-bold text-xs w-16 focus:outline-none"
            style={{ color: theme.textPrimary }}
            maxLength={8}
          />
          {roomInput !== roomCode && (
            <button
              onClick={() => setRoomCode(roomInput.trim().toUpperCase())}
              style={{ backgroundColor: theme.accent }}
              className="text-[10px] text-white px-1.5 py-0.5 rounded font-medium cursor-pointer"
            >
              Join
            </button>
          )}
          <button
            onClick={copyInviteLink}
            title="Copy Room Invite Link"
            className="p-1 rounded hover:opacity-80 transition-opacity cursor-pointer"
            style={{ color: theme.textSecondary }}
          >
            {copiedInvite ? <Check size={13} style={{ color: theme.statusOk }} /> : <Copy size={13} />}
          </button>
        </div>

        {/* Live Sync Telemetry Pill */}
        <div
          style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
          className="hidden lg:flex items-center gap-3 px-2.5 py-1 rounded border text-[11px] font-mono tabular-nums"
        >
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: Math.abs(currentDriftMs) <= 250 ? theme.statusOk : theme.statusWarn }}
            />
            <span>DRIFT: {currentDriftMs >= 0 ? `+${currentDriftMs}` : currentDriftMs}ms</span>
          </span>
          <span style={{ color: theme.textSecondary }}>|</span>
          <span>RTT: {propagationLatencyMs}ms</span>
          <span style={{ color: theme.textSecondary }}>|</span>
          <span style={{ color: adjustmentMode === 'LOCKED' ? theme.statusOk : theme.statusWarn }}>
            {adjustmentMode}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowCustomUrlBar(!showCustomUrlBar)}
          style={{ backgroundColor: theme.bgElevated, borderColor: theme.border, color: theme.textPrimary }}
          className="px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
        >
          <Youtube size={14} style={{ color: '#EF4444' }} />
          <span className="hidden md:inline">Load YT / URL</span>
        </button>

        <label
          style={{ backgroundColor: theme.bgElevated, borderColor: theme.border, color: theme.textPrimary }}
          className="px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          title="Sync a local MP4/MKV file without uploading"
        >
          <FolderOpen size={14} style={{ color: theme.accent }} />
          <span className="hidden md:inline">Open Local File</span>
          <input type="file" accept="video/*" onChange={handleLocalFileSelect} className="hidden" />
        </label>

        <button
          onClick={toggleSimulate10Users}
          style={{
            backgroundColor: simulatingLoad ? theme.accentSoft : theme.bgElevated,
            borderColor: simulatingLoad ? theme.accent : theme.border,
            color: simulatingLoad ? theme.accent : theme.textPrimary
          }}
          className="px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
        >
          <Users size={14} />
          <span className="hidden sm:inline">{simulatingLoad ? '11 Users Active' : 'Simulate 10 Users'}</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
            className="px-2.5 py-1.5 rounded border text-xs font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Palette size={14} style={{ color: theme.accent }} />
            <span className="hidden xl:inline">{theme.name}</span>
          </button>

          {showThemeMenu && (
            <div
              style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
              className="absolute right-0 mt-1.5 w-52 rounded-md border shadow-xl py-1.5 z-50"
            >
              <div className="px-3 py-1 text-[10px] font-mono uppercase" style={{ color: theme.textSecondary }}>
                Dark Themes
              </div>
              {Object.values(STUDIO_THEMES).filter(t => t.mode === 'dark').map(t => (
                <button
                  key={t.id}
                  onClick={() => { setThemeId(t.id); setShowThemeMenu(false); }}
                  className="w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: themeId === t.id ? theme.bgElevated : 'transparent' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: t.bgPrimary, borderColor: t.accent }} />
                    {t.name}
                  </span>
                  {themeId === t.id && <Check size={12} style={{ color: t.accent }} />}
                </button>
              ))}
              <div className="px-3 py-1 mt-1 text-[10px] font-mono uppercase" style={{ color: theme.textSecondary }}>
                Light Themes
              </div>
              {Object.values(STUDIO_THEMES).filter(t => t.mode === 'light').map(t => (
                <button
                  key={t.id}
                  onClick={() => { setThemeId(t.id); setShowThemeMenu(false); }}
                  className="w-full px-3 py-1.5 text-left text-xs flex items-center justify-between hover:opacity-80 cursor-pointer"
                  style={{ backgroundColor: themeId === t.id ? theme.bgElevated : 'transparent' }}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: t.bgPrimary, borderColor: t.accent }} />
                    {t.name}
                  </span>
                  {themeId === t.id && <Check size={12} style={{ color: t.accent }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setShowSpecsModal(true)}
          style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
          className="p-1.5 rounded border hover:opacity-80 cursor-pointer"
          title="Sync Architecture & Latency Report"
        >
          <HelpCircle size={15} />
        </button>
      </div>
    </header>
  );
}