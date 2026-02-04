# Cart Data Flow Documentation

## Overview

This document provides detailed flow diagrams and explanations for how data moves through the cart feature, from user interaction to API calls and state updates.

## Add to Cart Flow

### Step-by-Step Sequence

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ADD TO CART - COMPLETE FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

   USER ACTION                         OPTIMISTIC UPDATE                    API CALL
       │                                      │                                  │
       │ 1. User taps "Add to Cart"          │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 2. handleAddToCart() called          │                                  │
       │    (with productId & quantity)       │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 3. debouncedMutate() receives data  │                                  │
       │    - Check if 500ms debounce passed  │                                  │
       │    - If yes: proceed immediately     │                                  │
       │    - If no: queue request            │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 4. useAddToCart.onMutate() executes │                                  │
       │    - Cancel outgoing refetches       │                                  │
       │    - Snapshot current cart           │                                  │
       │    - Update cache immediately         │                                  │
       │    - Return context for rollback     │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 5. UI RE-RENDERS instantly           │                                  │
       │    - Cart count increases            │                                  │
       │    - Cart button appears/updates     │                                  │
       │    - No loading spinner              │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │                                      │ 6. cartService.addToCart() called
       │                                      ├─────────────────────────────────►
       │                                      │                                  │
       │                                      │              7. Server processes
       │                                      │                  (POST /cart)
       │                                      │                                  │
       │                                      │◄─────────────────────────────────┤
       │                                      │  8. Response received (success)
       │                                      │                                  │
       │                                      │                                  │
       │ 9. useAddToCart.onSuccess() executes                                  │
       │    - Invalidate cart query           │                                  │
       │    - Trigger background refetch      │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 10. UI re-renders with server data   │                                  │
       │     - Cart confirmed with server data │                                  │
       │     - Cache updated                  │                                  │
       │                                      │                                  │
       ▼                                      ▼                                  ▼
```

### Optimistic Update Logic

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OPTIMISTIC UPDATE DECISION TREE                          │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │ New item received    │
                    │ productId, quantity  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Cart exists in       │
                    │ cache?              │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                   YES                    NO
                    │                     │
                    ▼                     ▼
         ┌──────────────────┐   ┌──────────────────┐
         │ Item with same   │   │ Create new cart  │
         │ productId exists?│   │ with new item   │
         └────────┬─────────┘   └────────┬─────────┘
                  │                      │
         ┌────────┴────────┐             │
        YES                 NO            │
         │                  │             │
         ▼                  ▼             ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Merge quantities│ │ Add new item    │ │ Initial cart    │
│ (existing + new) │ │ to cart items   │ │ structure       │
└────────┬────────┘ └────────┬────────┘ └────────┬─────────┘
         │                    │                  │
         │                    │                  │
         └────────────────────┼──────────────────┘
                              │
                              ▼
                    ┌─────────────────────┐
                    │ Recalculate totals  │
                    │ - totalItems        │
                    │ - subtotal          │
                    │ - grandTotal        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Update cache with   │
                    │ new cart data       │
                    │ (immediate UI)      │
                    └─────────────────────┘
```

### Rollback Flow (Error Scenario)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ROLLBACK FLOW - ERROR SCENARIO                           │
└─────────────────────────────────────────────────────────────────────────────┘

   ERROR OCCURS                        ROLLBACK PROCESS                      UI RECOVERY
       │                                      │                                  │
       │ 1. Server returns error             │                                  │
       │    (network, validation, etc.)      │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 2. useAddToCart.onError() executes  │                                  │
       │    - Check context.previousCart     │                                  │
       │    - Restore cache to previous      │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 3. showError() called               │                                  │
       │    - Display error toast            │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 4. UI re-renders                    │                                  │
       │    - Cart count restored            │                                  │
       │    - Error toast visible            │                                  │
       │    - No item added                  │                                  │
       │                                      │                                  │
       ▼                                      ▼                                  ▼
```

## Remove from Cart Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REMOVE FROM CART - COMPLETE FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

   USER ACTION                         OPTIMISTIC UPDATE                    API CALL
       │                                      │                                  │
       │ 1. User taps "Remove" button         │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 2. mutate(item.id) called           │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 3. onMutate() executes               │                                  │
       │    - Snapshot current cart           │                                  │
       │    - Remove item from cache          │                                  │
       │    - Recalculate totals              │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 4. UI updates immediately            │                                  │
       │    - Item removed from list         │                                  │
       │    - Totals recalculated            │                                  │
       │    - Success toast shown            │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │                                      │ 5. DELETE /cart/:id              │
       │                                      ├─────────────────────────────────►
       │                                      │                                  │
       │                                      │              6. Server processes
       │                                      │                                  │
       │                                      │◄─────────────────────────────────┤
       │                                      │  7. Response received           │
       │                                      │                                  │
       │                                      │                                  │
       │ 8. onSettled() executes              │                                  │
       │    - Final cache invalidation       │                                  │
       │                                      │                                  │
       ▼                                      ▼                                  ▼
```

## Cart Fetch Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CART FETCH - CACHING FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

   COMPONENT MOUNT                   CACHE CHECK                          API CALL
       │                                      │                                  │
       │ 1. useCart() called                 │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 2. Check ['cart'] cache key         │                                  │
       │    - Is data present?               │                                  │
       │    - Is data fresh? (staleTime)     │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │                    ┌─────────────────┴─────────────────┐               │
       │                    │                                   │               │
       │              DATA EXISTS                     NO DATA / STALE         │
       │              & FRESH                          DATA                  │
       │                    │                                   │               │
       │                    ▼                                   ▼               │
       │         ┌──────────────────┐              ┌──────────────────┐     │
       │         │ Return cached    │              │ Call API:        │     │
       │         │ data instantly   │              │ GET /cart        │     │
       │         │ (NO API CALL)   │              │                  │     │
       │         └──────────────────┘              └────────┬─────────┘     │
       │                                                    │               │
       │                                                    ▼               │
       │                                           ┌──────────────────┐      │
       │                                           │ Store response   │      │
       │                                           │ in cache         │      │
       │                                           │ Set stale timer  │      │
       │                                           └────────┬─────────┘      │
       │                                                    │               │
       │                                                    ▼               │
       │                                           ┌──────────────────┐      │
       │                                           │ Return data to    │      │
       │                                           │ component        │      │
       │                                           └──────────────────┘      │
       │                                                    │               │
       │                                                    ▼               │
       │                                      ┌──────────────────────────┐   │
       │                                      │ Data available for       │   │
       │                                      │ - Display in UI          │   │
       │                                      │ - Calculations           │   │
       │                                      │ - Mutations              │   │
       │                                      └──────────────────────────┘   │
       │                                                    │               │
       ▼                                                    ▼               ▼

   TIME ELAPSES (> staleTime)                    BACKGROUND REFETCH
       │                                      │                                  │
       │ 3. staleTime expires (2 min)        │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 4. Component not actively using     │                                  │
       │    cart data                        │                                  │
       │    (refetchOnWindowFocus = false)   │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 5. Next cart mutation occurs        │                                  │
       │    - addToCart, removeFromCart      │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │ 6. onSettled() triggers             │                                  │
       │    - queryClient.invalidateQueries  │                                  │
       ├──────────────────────────────────────┤                                  │
       │                                      │                                  │
       │                                      │ 7. Background refetch          │
       │                                      │    (if component active)       │
       │                                      │                                  │
       ▼                                      ▼                                  ▼
```

## State Management Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CART STATE MANAGEMENT LAYERS                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          UI STATE LAYER                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ React Component State                                                  │   │
│  │ - useState for local UI (modals, loading states)                     │   │
│  │ - useCallback for stable function references                         │   │
│  │ - React.memo for preventing unnecessary re-renders                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ useQuery / useMutation
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     REACT QUERY CACHE LAYER                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Query Cache (['cart'])                                                 │   │
│  │ - CartResponse: Full cart data                                        │   │
│  │ - Query State: loading, error, success                                │   │
│  │ - Optimistic Updates: Applied directly to cache                       │   │
│  │ - Stale Time: 2 minutes                                               │   │
│  │ - GC Time: 10 minutes                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ API Calls
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API SERVICE LAYER                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ cartService                                                            │   │
│  │ - addToCart: POST /cart                                               │   │
│  │ - getCart: GET /cart                                                   │   │
│  │ - deleteCartItem: DELETE /cart/:id                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     │ HTTP Requests
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BACKEND SERVER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Cart API                                                              │   │
│  │ - Database operations                                                 │   │
│  │ - Business logic                                                      │   │
│  │ - Validation                                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Consistency Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATA CONSISTENCY MODEL                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONSISTENCY GUARANTEES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  OPTIMISTIC UPDATE → SERVER CONFIRMATION → FINAL CONSISTENCY                │
│                                                                              │
│  Timeline:                                                                   │
│                                                                              │
│  T0: User Action            ┌──────────────────────────────────┐           │
│  T0+10ms: UI Updated        │ Optimistic update applied         │           │
│                             │ (User sees instant feedback)       │           │
│                             └──────────────────────────────────┘           │
│                                                          │                  │
│                                                          ▼                  │
│  T0+50ms-500ms: API Call     ┌──────────────────────────────────┐           │
│  T0+500-2000ms: Response     │ Server processes request        │           │
│                             │ (Actual time varies by network)   │           │
│                             └──────────────────────────────────┘           │
│                                                          │                  │
│                                                          ▼                  │
│  T0+500-2000ms: Confirmation  ┌──────────────────────────────────┐         │
│                             │ onSuccess: Invalidate queries     │         │
│                             │ Cache synced with server         │         │
│                             └──────────────────────────────────┘         │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                         ROLLBACK SCENARIOS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  If Server Returns Error:                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. onError() called                                                  │   │
│  │ 2. context.previousCart restored                                     │   │
│  │ 3. Error toast shown to user                                         │   │
│  │ 4. UI re-renders with original state                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  If Network Fails:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. Mutation rejects                                                 │   │
│  │ 2. onError() called (same as above)                                 │   │
│  │ 3. User can retry                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                      MULTI-DEVICE CONSIDERATIONS                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  - Cache invalidation ensures other devices see updates                     │
│  - Optimistic updates are local-only (device-specific)                      │
│  - Server is single source of truth                                         │
│  - User may see stale data if another device made changes                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
