# Module 18: Real-Time Tripartite Clarification System

> **Module Path:** `src/features/clarification/`  
> **Type:** Real-Time WebSocket Tripartite Collaboration Engine  
> **Key Technologies:** **Socket.IO Client** (`^4.8.3`), WebSockets, Room Namespacing, Deduplication Algorithms

---

## 1. Module Ka Purpose (Kyu aur Kya Kaam Hai)

Ye module Citizen, State/District Nodal Officer, aur University Faculty ke beech direct real-time communication channel ensure karta hai. Aksar citizen ki problem description me buniyaadi details (jaise exact pipe diameter, water taste abnormality, voltage fluctuation frequency) missing hoti hain. Purane system me letters aur emails se mahino lagte the; is module ke zariye sabhi parties real-time chat room me jud kar turant clarification le aur de sakti hain.

---

## 2. Directory Structure & Files

```
src/features/clarification/
├── components/
│   ├── ClarificationChatModal.jsx             # Master chat window with bubbles & timestamps
│   ├── FloatingChatWidget.jsx                 # Minimized floating chat widget
│   └── chat/                                  # Message bubble & input subcomponents
├── helpers/
│   └── socketEventHandlers.js                 # Event listeners for incoming messages & typing
├── hooks/
│   ├── useChatActions.js                      # Send, delete, and clear message actions hook
│   └── useClarificationChatSocket.js          # Core WebSocket connection & room manager hook
└── services/
    └── clarificationChatService.js            # REST fallback API (history, mark read, unread count)
```

---

## 3. Architecture & Real-Time WebSocket Workflows

### 3.1 Tripartite Actor Architecture
```
    ┌──────────────────────────────────────────────┐
    │     Challenge WebSocket Room (e.g. CHL-042)  │
    └──────┬──────────────────┬──────────────────┬─┘
           │                  │                  │
    ┌──────▼───────┐   ┌──────▼───────┐   ┌──────▼───────┐
    │   Citizen    │   │ Nodal Officer│   │  University  │
    │  (Submitter) │   │ (Evaluator)  │   │  (Researcher)│
    └──────────────┘   └──────────────┘   └──────────────┘
```

### 3.2 WebSocket Room Lifecycle (`useClarificationChatSocket.js`)
- **Connection & Room Join:**
  - Modal open hone par (`isOpen === true`), client socket singleton (`getSocket()`) connect hota hai.
  - User auto-joins the challenge-specific room:
    ```javascript
    joinChallengeRoom(challengeId, { fullName: userName, role: userRole });
    ```
- **Read Receipts:** Automatically marks unread messages as read for this user role (`clarificationChatService.markRead(challengeId, userRole)`).
- **Cleanup & Memory Leak Prevention:** Modal close hone par `leaveChallengeRoom(challengeId)` call hota hai aur active socket event listeners gracefully unsubscribe ho jate hain.

### 3.3 Message Deduplication Algorithm (`deduplicateMessages`)
Network fluctuations ya reconnects ke dauran agar socket server duplicate packets forward karta hai, to ye algorithm unhe filter karta hai:
```javascript
export const deduplicateMessages = (msgList) => {
  if (!Array.isArray(msgList)) return [];
  const seen = new Set();
  return msgList.filter((m) => {
    const id = m._id || m.id || `${m.createdAt}_${m.message}`;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};
```

### 3.4 Live Typing Indicators & Read Status
- Jab koi user input field me type karta hai, `emitTyping(challengeId, senderName, senderRole)` broadcast hota hai.
- Dusre users ke screen par smooth text show hota hai: *"Dr. Arvind (Faculty) is typing..."*.
- Input rukne par 1.5 seconds me `emitStopTyping` send hokar indicator fade out ho jata hai.

### 3.5 Message Management (`useChatActions.js`)
- **Send Message:** Fast optimistic UI update + socket emit with REST fallback.
- **Delete Message:** Options to delete for "Self" or "Everyone" (Admin/Nodal only).
- **Clear History:** Authorized officers can clear obsolete threads.
