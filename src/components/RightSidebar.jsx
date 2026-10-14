import React from 'react';
import { Users, Crown, MessageSquare, ListVideo, BarChart2, Activity, Eye, EyeOff, ArrowUp, Play } from 'lucide-react';
import { formatTimecode } from '../utils/search';
import { MEDIA_CATALOG } from '../constants/catalog';

export default function RightSidebar({
  theme,
  roomData,
  participantsList,
  displayName,
  setDisplayName,
  isHost,
  userId,
  updateRoomState,
  activeRightTab,
  setActiveRightTab,
  chatMessages,
  revealedSpoilers,
  setRevealedSpoilers,
  broadcastTransport,
  chatSpoilerMode,
  setChatSpoilerMode,
  localTime,
  chatInput,
  setChatInput,
  handleSendChat,
  voteQueueItem,
  newPollQuestion,
  setNewPollQuestion,
  newPollOpt1,
  setNewPollOpt1,
  newPollOpt2,
  setNewPollOpt2,
  handleCreatePoll,
  votePoll,
  currentDriftMs,
  activeSourceType,
  telemetryLogs
}) {
  return (
    <div
      style={{ backgroundColor: theme.bgSecondary }}
      className="lg:col-span-4 xl:col-span-3 flex flex-col h-full border-t lg:border-t-0"
    >
      {/* Participants */}
      <div style={{ borderColor: theme.border }} className="p-3 border-b shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase font-semibold flex items-center gap-1.5" style={{ color: theme.textSecondary }}>
            <Users size={13} />
            Viewers in Room ({participantsList.length})
          </span>
          <input
            type="text"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            title="Click to edit your display name"
            style={{ backgroundColor: theme.bgElevated, borderColor: theme.border, color: theme.textPrimary }}
            className="text-[11px] px-2 py-0.5 rounded border w-28 text-right font-medium focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {participantsList.map(p => {
            const isParticipantHost = roomData?.hostId === p.id;
            return (
              <div
                key={p.id}
                style={{
                  backgroundColor: theme.bgElevated,
                  borderColor: isParticipantHost ? theme.accent : theme.border
                }}
                className="px-2 py-1 rounded border text-[11px] flex items-center gap-1.5 shrink-0"
              >
                {isParticipantHost && <Crown size={11} className="text-amber-400" />}
                <span className="font-medium">{p.name}</span>
                {isHost && p.id !== userId && (
                  <button
                    onClick={() => updateRoomState(prev => ({ ...prev, hostId: p.id, hostName: p.name }))}
                    title={`Make ${p.name} the Room Host`}
                    style={{ color: theme.accent }}
                    className="text-[10px] font-mono underline ml-1 cursor-pointer"
                  >
                    Crown
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderColor: theme.border }} className="grid grid-cols-4 border-b text-xs font-medium shrink-0">
        {[
          { id: 'chat', label: 'Chat', icon: MessageSquare },
          { id: 'queue', label: 'Queue', icon: ListVideo },
          { id: 'polls', label: 'Polls', icon: BarChart2 },
          { id: 'telemetry', label: 'Sync Stats', icon: Activity }
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeRightTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveRightTab(tab.id)}
              style={{
                borderColor: active ? theme.accent : 'transparent',
                color: active ? theme.textPrimary : theme.textSecondary,
                backgroundColor: active ? theme.bgElevated : 'transparent'
              }}
              className="py-2.5 border-b-2 flex items-center justify-center gap-1 cursor-pointer"
            >
              <Icon size={13} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Tab */}
      {activeRightTab === 'chat' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {chatMessages.map(msg => {
              const isBlurred = msg.isSpoiler && !revealedSpoilers[msg.id];
              return (
                <div
                  key={msg.id}
                  style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
                  className="p-2.5 rounded border text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold">{msg.senderName}</span>
                    <button
                      onClick={() => broadcastTransport('CHAT_TIMESTAMP_JUMP', { baseMediaTime: msg.mediaTime || 0 })}
                      style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded hover:underline cursor-pointer"
                      title="Jump video to this message's timestamp"
                    >
                      @ {formatTimecode(msg.mediaTime || 0)}
                    </button>
                  </div>
                  <div
                    onClick={() => {
                      if (isBlurred) setRevealedSpoilers(prev => ({ ...prev, [msg.id]: true }));
                    }}
                    className={isBlurred ? 'blur-sm select-none cursor-pointer' : ''}
                    title={isBlurred ? 'Spoiler hidden — Click to reveal' : ''}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendChat} style={{ borderColor: theme.border }} className="p-2.5 border-t flex flex-col gap-2 shrink-0">
            <div className="flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setChatSpoilerMode(!chatSpoilerMode)}
                style={{ color: chatSpoilerMode ? theme.statusWarn : theme.textSecondary }}
                className="flex items-center gap-1 font-mono cursor-pointer"
              >
                {chatSpoilerMode ? <EyeOff size={12} /> : <Eye size={12} />}
                {chatSpoilerMode ? 'Spoiler Blur ON' : 'Mark as Spoiler'}
              </button>
              <span style={{ color: theme.textSecondary }} className="font-mono">
                Tagging @ {formatTimecode(localTime)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Message room..."
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }}
                className="flex-1 text-xs px-3 py-2 rounded border focus:outline-none"
              />
              <button
                type="submit"
                style={{ backgroundColor: theme.accent }}
                className="px-3 py-2 rounded text-white text-xs font-semibold cursor-pointer"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Queue Tab */}
      {activeRightTab === 'queue' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-[11px] font-mono mb-2" style={{ color: theme.textSecondary }}>
            UPVOTED ITEMS AUTO-PLAY ON STREAM END
          </div>
          {(roomData?.playlist || []).map((item, idx) => (
            <div
              key={item.id}
              style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
              className="p-2.5 rounded border flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold truncate">
                  #{idx + 1} {item.title}
                </div>
                <div style={{ color: theme.textSecondary }} className="text-[10px] font-mono">
                  {formatTimecode(item.duration)} • Added by {item.addedBy}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => voteQueueItem(item.id)}
                  style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
                  className="px-2 py-1 rounded border text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <ArrowUp size={12} style={{ color: theme.accent }} />
                  {item.votes}
                </button>
                <button
                  onClick={() => {
                    const found = MEDIA_CATALOG.find(m => m.id === item.id);
                    if (found) {
                      broadcastTransport('QUEUE_PLAY_NOW', {
                        movieId: found.id,
                        customStream: null,
                        baseMediaTime: 0,
                        isPlaying: true
                      });
                    }
                  }}
                  style={{ backgroundColor: theme.accent }}
                  className="p-1.5 rounded text-white cursor-pointer"
                  title="Play Now"
                >
                  <Play size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Polls Tab */}
      {activeRightTab === 'polls' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <form
            onSubmit={handleCreatePoll}
            style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
            className="p-2.5 rounded border space-y-2"
          >
            <div className="text-xs font-semibold">Create Room Poll</div>
            <input
              type="text"
              value={newPollQuestion}
              onChange={e => setNewPollQuestion(e.target.value)}
              placeholder="Poll question..."
              style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }}
              className="w-full text-xs px-2.5 py-1.5 rounded border"
            />
            <div className="grid grid-cols-2 gap-1.5">
              <input
                type="text"
                value={newPollOpt1}
                onChange={e => setNewPollOpt1(e.target.value)}
                placeholder="Option A"
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }}
                className="text-xs px-2.5 py-1 rounded border"
              />
              <input
                type="text"
                value={newPollOpt2}
                onChange={e => setNewPollOpt2(e.target.value)}
                placeholder="Option B"
                style={{ backgroundColor: theme.bgPrimary, borderColor: theme.border, color: theme.textPrimary }}
                className="text-xs px-2.5 py-1 rounded border"
              />
            </div>
            <button
              type="submit"
              style={{ backgroundColor: theme.accent }}
              className="w-full py-1.5 rounded text-white text-xs font-semibold cursor-pointer"
            >
              Publish Poll
            </button>
          </form>

          {(roomData?.polls || []).map(poll => {
            const totalVotes = poll.options.reduce((acc, o) => acc + (o.votes || 0), 0);
            return (
              <div
                key={poll.id}
                style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
                className="p-3 rounded border space-y-2"
              >
                <div className="text-xs font-semibold">{poll.question}</div>
                <div className="space-y-1.5">
                  {poll.options.map((opt, idx) => {
                    const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                    return (
                      <button
                        key={idx}
                        onClick={() => votePoll(poll.id, idx)}
                        style={{ backgroundColor: theme.bgSecondary, borderColor: theme.border }}
                        className="w-full p-2 rounded border text-left relative overflow-hidden cursor-pointer"
                      >
                        <div
                          style={{ width: `${pct}%`, backgroundColor: theme.accentSoft }}
                          className="absolute inset-y-0 left-0 transition-all"
                        />
                        <div className="relative flex items-center justify-between text-xs">
                          <span>{opt.text}</span>
                          <span className="font-mono font-bold">{pct}% ({opt.votes})</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Telemetry Tab */}
      {activeRightTab === 'telemetry' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 font-mono text-xs">
          <div
            style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
            className="p-2.5 rounded border space-y-1.5"
          >
            <div className="text-[10px] uppercase" style={{ color: theme.textSecondary }}>
              SYNCHRONIZATION METRICS
            </div>
            <div className="flex justify-between">
              <span>Control Propagation (p95):</span>
              <span style={{ color: theme.statusOk }} className="font-bold">42 ms (Target ≤250ms)</span>
            </div>
            <div className="flex justify-between">
              <span>Current Clock Drift:</span>
              <span style={{ color: Math.abs(currentDriftMs) <= 250 ? theme.statusOk : theme.statusWarn }} className="font-bold">
                {currentDriftMs} ms (Target ≤500ms)
              </span>
            </div>
            <div className="flex justify-between">
              <span>State Sequence ID:</span>
              <span>#{roomData?.sequenceId || 1}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Media Engine:</span>
              <span className="uppercase">{activeSourceType}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] uppercase" style={{ color: theme.textSecondary }}>
              EVENT LOG
            </div>
            {telemetryLogs.map(log => (
              <div
                key={log.id}
                style={{ backgroundColor: theme.bgElevated, borderColor: theme.border }}
                className="p-2 rounded border text-[11px] flex items-center justify-between"
              >
                <div>
                  <span style={{ color: theme.accent }} className="font-bold mr-1.5">[{log.event}]</span>
                  <span>{log.detail}</span>
                </div>
                {log.latencyMs && (
                  <span style={{ color: theme.statusOk }} className="shrink-0 ml-2">
                    {log.latencyMs}ms
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}