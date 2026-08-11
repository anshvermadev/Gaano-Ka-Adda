import { useState, useEffect } from 'react';

/**
 * Real-time tab presence hook.
 * Counts the actual number of currently open tabs/windows across the browser using BroadcastChannel.
 * Shows '1 online' for a single open tab, and increments when new tabs are opened.
 */
export function useRealtimeListeners(): number {
  const [tabCount, setTabCount] = useState<number>(1);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tabId = 'tab_' + Math.random().toString(36).substring(2, 9);
    const activeTabs = new Map<string, number>();
    activeTabs.set(tabId, Date.now());

    let channel: BroadcastChannel | null = null;

    const updateCount = () => {
      const now = Date.now();
      // Remove stale tabs not seen in the last 6 seconds
      for (const [id, lastSeen] of activeTabs.entries()) {
        if (id !== tabId && now - lastSeen > 6000) {
          activeTabs.delete(id);
        }
      }
      setTabCount(activeTabs.size);
    };

    try {
      if ('BroadcastChannel' in window) {
        channel = new BroadcastChannel('tractorwala_real_presence');

        channel.onmessage = (event: MessageEvent) => {
          const { type, senderId } = event.data || {};
          if (!senderId) return;

          if (type === 'PING') {
            activeTabs.set(senderId, Date.now());
            try { channel?.postMessage({ type: 'PONG', senderId: tabId }); } catch (e) {}
            updateCount();
          } else if (type === 'PONG') {
            activeTabs.set(senderId, Date.now());
            updateCount();
          } else if (type === 'LEAVE') {
            activeTabs.delete(senderId);
            updateCount();
          }
        };

        // Broadcast arrival to existing tabs
        channel.postMessage({ type: 'PING', senderId: tabId });
      }
    } catch (e) {
      console.warn('BroadcastChannel error:', e);
    }

    updateCount();

    // Heartbeat every 2 seconds
    const heartbeat = setInterval(() => {
      try {
        if (channel) {
          channel.postMessage({ type: 'PING', senderId: tabId });
        }
      } catch (e) {
        // Channel may have been closed by cleanup
      }
      updateCount();
    }, 2000);

    const handleUnload = () => {
      try {
        if (channel) {
          channel.postMessage({ type: 'LEAVE', senderId: tabId });
          channel.close();
        }
      } catch (e) {}
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('beforeunload', handleUnload);
      try {
        if (channel) {
          channel.postMessage({ type: 'LEAVE', senderId: tabId });
          channel.close();
          channel = null;
        }
      } catch (e) {}
    };
  }, []);

  return tabCount;
}
