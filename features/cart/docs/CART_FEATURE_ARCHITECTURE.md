# Cart Feature Architecture

## Overview

The cart feature is built with a modern, performant architecture using React Query for data management and optimistic UI updates for instant user feedback. This document provides a comprehensive overview of the architecture, design patterns, and implementation details.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CART FEATURE ARCHITECTURE                        │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                              │
│  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │
│  │   ProductCard     │  │    CartButton    │  │     CartScreen        │ │
│  │   Component       │  │    Component     │  │     Screen            │ │
│  └────────┬─────────┘  └────────┬─────────┘  └───────────┬────────────┘ │
│           │                       │                         │             │
│           │ useDebouncedAddToCart │                         │ useCart     │
│           │ useAddToCart          │                         │             │
│           └───────────────────────┴─────────────────────────┘             │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                           HOOKS LAYER                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     useAddToCart Hook                             │  │
│  │  ┌──────────────┐  ┌────────────────┐  ┌────────────────────────┐  │  │
│  │  │ Optimistic   │  │   Debouncing   │  │    Rollback           │  │  │
│  │  │ Updates      │  │   (500ms)      │  │    Mechanism          │  │  │
│  │  └──────────────┘  └────────────────┘  └────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     useRemoveFromCart Hook                        │  │
│  │  ┌──────────────┐  ┌────────────────┐  ┌────────────────────────┐  │  │
│  │  │ Optimistic   │  │   Success      │  │    Error              │  │  │
│  │  │ Updates      │  │   Feedback     │  │    Handling           │  │  │
│  │  └──────────────┘  └────────────────┘  └────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                       useCart Hook                               │  │
│  │  ┌──────────────┐  ┌────────────────┐  ┌────────────────────────┐  │  │
│  │  │ Query with   │  │   Caching       │  │    Stale Time          │  │  │
│  │  │ Caching      │  │   (10 min)      │  │    (2 min)             │  │  │
│  │  └──────────────┘  └────────────────┘  └────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        UTILITIES LAYER                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    cartCalculations.ts                           │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ calculateTotal │  │ calculateSub-  │  │   calculateGrand-   │  │  │
│  │  │ Items()        │  │ total()        │  │   Total()           │  │  │
│  │  └────────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ removeItemFrom │  │ updateCartItem │  │   mergeCartItems()  │  │  │
│  │  │ Cart()         │  │ Quantity()     │  │                     │  │  │
│  │  └────────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                 requestDeduplicator.ts                            │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ execute()      │  │ isPending()    │  │   clear()           │  │  │
│  │  │ Singleton      │  │ Utility        │  │   Method            │  │  │
│  │  └────────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         SERVICE LAYER                                    │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     cartService.ts                               │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ addToCart()    │  │ getCart()       │  │   deleteCartItem() │  │  │
│  │  │ POST /cart     │  │ GET /cart       │  │   DELETE /cart/:id  │  │  │
│  │  └────────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          API LAYER                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      apiClient.ts                                 │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ Axios Instance │  │ Request        │  │   Response          │  │  │
│  │  │ with Inter-    │  │ Interceptors   │  │   Interceptors     │  │  │
│  │  │ ceptors        │  │ (Auth Token)   │  │   (Error Handling) │  │  │
│  │  └────────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         BACKEND API                                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Server Endpoints                             │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────┐  │  │
│  │  │ POST /cart     │  │ GET /cart       │  │   DELETE /cart/:id │  │  │
│  │  └────────────────┘  └────────────────┘  └─────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Optimistic UI Updates

The cart feature uses optimistic UI updates to provide instant user feedback. Instead of waiting for server confirmation, the UI is updated immediately and then synced with the server.

**Benefits:**
- Reduced perceived latency (from ~500-2000ms to <50ms)
- Smoother user experience
- Instant feedback on all operations

**Trade-offs:**
- Requires rollback mechanism for failed requests
- More complex state management

### 2. React Query Caching

React Query handles all data fetching, caching, and synchronization.

**Configuration:**
- `staleTime`: 2 minutes (data considered fresh)
- `gcTime`: 10 minutes (data kept in cache)
- `refetchOnMount`: false (no unnecessary fetches)
- `refetchOnWindowFocus`: false (no background fetches)

### 3. Debouncing

Rapid user actions (like double-clicking) are debounced to prevent duplicate API calls.

**Implementation:**
- 500ms debounce window
- Only the most recent request is queued
- Previous pending requests are cancelled

### 4. Request Deduplication

The `RequestDeduplicator` class prevents duplicate API calls for the same request.

**Features:**
- Singleton instance for app-wide use
- Configurable maxAge (default: 5 seconds)
- Automatic cleanup after requests complete

## SOLID Principles Compliance

### Single Responsibility
Each module has a clear, focused purpose:
- **Hooks**: Single operation (add/remove/fetch)
- **Utilities**: Single calculation type
- **Service**: Single API interaction

### Open-Closed
Code is extensible without modification:
- Custom optimistic strategies via callback props
- Configurable debounce timing
- Extensible calculation utilities

### Dependency Inversion
Dependencies are abstractions, not concretions:
- Hooks depend on `cartService` abstraction
- Calculations depend on interfaces, not implementations

## File Structure

```
features/cart/
├── types.ts                    # TypeScript type definitions
├── services/
│   └── cartService.ts          # API service layer
├── hooks/
│   ├── useAddToCart.ts        # Add to cart with optimistic updates
│   ├── useDebouncedAddToCart.ts # Debounced add to cart
│   ├── useRemoveFromCart.ts   # Remove from cart with optimistic updates
│   └── useCart.ts             # Fetch cart with caching
├── utils/
│   └── cartCalculations.ts    # Pure functions for cart calculations
└── components/
    ├── CartButton.tsx         # Cart floating action button
    └── CartSummary.tsx         # Cart total summary component
```

## Performance Characteristics

### Before Optimizations
- Add to Cart latency: ~500-2000ms
- Full cart refetch on every change
- No debouncing (duplicate requests)
- React re-renders on every action

### After Optimizations
- Perceived latency: <50ms (optimistic update)
- Reduced API calls (caching + deduplication)
- No duplicate requests (debouncing)
- Minimal re-renders (React.memo)

## Scaling Considerations

### Current Limitations
- Singleton request deduplicator may grow unbounded
- Cart calculations are synchronous (could be offloaded)
- No offline persistence

### Future Improvements
- Add size limit to request deduplicator
- Implement Web Workers for heavy calculations
- Add AsyncStorage persistence for offline support
- Implement request batching for multiple operations
